import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { env } from "~/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

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

interface QuizGenerationParams {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  category: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
}

async function saveQuizToFile(quiz: any, params: QuizGenerationParams) {
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

export async function POST(request: NextRequest) {
  try {
    const params: QuizGenerationParams = await request.json();

    const prompt = QUIZ_GENERATION_PROMPT.replace("{topic}", params.topic)
      .replace("{difficulty}", params.difficulty)
      .replace("{questionCount}", params.questionCount.toString())
      .replace("{category}", params.category);

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

    try {
      const parsedQuiz = JSON.parse(cleanedJSON);

      // Override with user-provided values
      parsedQuiz.title = params.title;
      parsedQuiz.description = params.description;
      parsedQuiz.timeLimit = params.timeLimit;
      parsedQuiz.passingScore = params.passingScore;
      parsedQuiz.created = new Date().toISOString();

      // Save to file
      const { filename } = await saveQuizToFile(parsedQuiz, params);

      return NextResponse.json({
        success: true,
        quiz: parsedQuiz,
        filename,
        message: "Quiz generated successfully",
      });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Raw response:", quizJSON);

      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON generated by AI",
          rawResponse: quizJSON,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error generating quiz:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate quiz",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
