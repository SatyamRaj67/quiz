import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { GoogleGenAI } from "@google/genai";
import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
} from "fs";
import { join } from "path";
import { env } from "~/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const quizGenerationSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  questionCount: z.number().min(3).max(20),
  category: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  timeLimit: z.number().min(60).max(3600),
  passingScore: z.number().min(30).max(100),
});

const QUIZ_GENERATION_PROMPT = `
You are a quiz generator AI. Generate a complete quiz in JSON format based on the given topic and parameters.

REQUIREMENTS:
1. Generate a quiz with the exact structure provided in the example
2. Include {questionCount} questions of mixed types: multiple-choice, true-false, multiple-select, fill-in-the-blank, ordering
3. Ensure all questions are accurate and educational
4. Provide clear explanations for each answer
5. Set appropriate difficulty levels and time limits
6. Include realistic point values and scoring system

JSON STRUCTURE TO FOLLOW:
{
  "id": "unique-quiz-id",
  "title": "Quiz Title",
  "description": "Brief description",
  "category": "Subject Category",
  "difficulty": "easy|medium|hard",
  "timeLimit": 300,
  "totalQuestions": 5,
  "passingScore": 60,
  "created": "ISO date string",
  "author": "AI Generated",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice|true-false|multiple-select|fill-in-the-blank|ordering",
      "question": "Question text",
      "options": [
        { "id": "a", "text": "Option text", "isCorrect": false }
      ],
      "correctAnswers": ["answer1", "answer2"],
      "explanation": "Detailed explanation",
      "points": {
        "correct": 10,
        "incorrect": -2,
        "skipped": 0
      },
      "timeLimit": 30
    }
  ],
  "settings": {
    "shuffleQuestions": true,
    "shuffleOptions": true,
    "showExplanations": true,
    "allowRetake": true,
    "showScoreImmediately": false,
    "allowNegativeScoring": true,
    "noTimeLimit": false
  },
  "scoring": {
    "totalPoints": 60,
    "gradeScale": [
      { "min": 90, "max": 100, "grade": "A", "description": "Excellent" },
      { "min": 80, "max": 89, "grade": "B", "description": "Good" },
      { "min": 70, "max": 79, "grade": "C", "description": "Average" },
      { "min": 60, "max": 69, "grade": "D", "description": "Below Average" },
      { "min": 0, "max": 59, "grade": "F", "description": "Fail" }
    ]
  }
}

QUESTION TYPE GUIDELINES:
- multiple-choice: 4 options, 1 correct
- true-false: 2 options (True/False)
- multiple-select: 4+ options, multiple correct answers
- fill-in-the-blank: Include common variations in correctAnswers array
- ordering: 4+ items with correctOrder property

Generate ONLY valid JSON. No additional text or explanations outside the JSON.

TOPIC: {topic}
DIFFICULTY: {difficulty}
NUMBER OF QUESTIONS: {questionCount}
CATEGORY: {category}
`;

async function saveQuizToFile(
  quiz: any,
  params: z.infer<typeof quizGenerationSchema>,
) {
  try {
    const quizzesDir = join(process.cwd(), "generated-quizzes");
    if (!existsSync(quizzesDir)) {
      mkdirSync(quizzesDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sanitizedTopic = params.topic
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    const filename = `${sanitizedTopic}_${params.difficulty}_${timestamp}.json`;
    const filepath = join(quizzesDir, filename);

    writeFileSync(filepath, JSON.stringify(quiz, null, 2), "utf8");

    return { filepath, filename };
  } catch (error) {
    console.error("Error saving quiz to file:", error);
    throw error;
  }
}

export const quizRouter = createTRPCRouter({
  generate: publicProcedure
    .input(quizGenerationSchema)
    .mutation(async ({ input }) => {
      try {
        const prompt = QUIZ_GENERATION_PROMPT.replace("{topic}", input.topic)
          .replace("{difficulty}", input.difficulty)
          .replace("{questionCount}", input.questionCount.toString())
          .replace("{category}", input.category);

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });

        const quizJSON = response.text;

        if (!quizJSON) {
          throw new Error("No response from AI");
        }

        // Clean the response to ensure it's valid JSON
        const cleanedJSON = quizJSON.replace(/```json\n?|\n?```/g, "").trim();

        const parsedQuiz = JSON.parse(cleanedJSON);

        // Override with user-provided values
        parsedQuiz.title = input.title;
        parsedQuiz.description = input.description;
        parsedQuiz.timeLimit = input.timeLimit;
        parsedQuiz.passingScore = input.passingScore;
        parsedQuiz.created = new Date().toISOString();

        // Save to file
        const { filename } = await saveQuizToFile(parsedQuiz, input);

        return {
          success: true,
          quiz: parsedQuiz,
          filename,
          message: "Quiz generated successfully",
        };
      } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to generate quiz",
        );
      }
    }),

  getAll: publicProcedure.query(async () => {
    try {
      const quizzesDir = join(process.cwd(), "generated-quizzes");

      if (!existsSync(quizzesDir)) {
        return { quizzes: [] };
      }

      const files = readdirSync(quizzesDir)
        .filter((file) => file.endsWith(".json"))
        .map((filename) => {
          const filepath = join(quizzesDir, filename);
          const content = readFileSync(filepath, "utf8");
          const quiz = JSON.parse(content);

          return {
            filename,
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            category: quiz.category,
            difficulty: quiz.difficulty,
            totalQuestions: quiz.totalQuestions,
            created: quiz.created,
          };
        })
        .sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime(),
        );

      return { quizzes: files };
    } catch (error) {
      console.error("Error loading quizzes:", error);
      throw new Error("Failed to load quizzes");
    }
  }),

  getById: publicProcedure
    .input(z.object({ filename: z.string() }))
    .query(async ({ input }) => {
      try {
        const quizzesDir = join(process.cwd(), "generated-quizzes");
        const filepath = join(quizzesDir, input.filename);
        const content = readFileSync(filepath, "utf8");
        const quiz = JSON.parse(content);

        return { quiz };
      } catch (error) {
        console.error("Error loading quiz:", error);
        throw new Error("Quiz not found");
      }
    }),

  delete: publicProcedure
    .input(z.object({ filename: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const quizzesDir = join(process.cwd(), "generated-quizzes");
        const filepath = join(quizzesDir, input.filename);

        const fs = await import("fs");
        fs.unlinkSync(filepath);

        return { success: true, message: "Quiz deleted successfully" };
      } catch (error) {
        console.error("Error deleting quiz:", error);
        throw new Error("Failed to delete quiz");
      }
    }),
});
