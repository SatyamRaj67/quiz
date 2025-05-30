"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { PageHeader } from "~/components/common/page-header";
import { QuizForm, type QuizCreationForm } from "~/components/quiz/quiz-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const quizCreationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Please select a difficulty level",
  }),
  questionCount: z
    .number()
    .min(3, "Minimum 3 questions required")
    .max(20, "Maximum 20 questions allowed"),
  timeLimit: z
    .number()
    .min(60, "Minimum 1 minute required")
    .max(3600, "Maximum 1 hour allowed"),
  passingScore: z
    .number()
    .min(30, "Minimum passing score is 30%")
    .max(100, "Maximum passing score is 100%"),
});

interface GeneratedQuiz {
  _id: string;
  title: string;
  description: string;
  totalQuestions: number;
  difficulty: string;
  category: string;
}

const CreateQuizPage = () => {
  const router = useRouter();
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const createQuiz = useMutation(api.quiz.create);

  const form = useForm<QuizCreationForm>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      title: "",
      description: "",
      topic: "",
      category: "",
      difficulty: "medium",
      questionCount: 5,
      timeLimit: 300,
      passingScore: 60,
    },
  });

  const generateQuestions = async (data: QuizCreationForm) => {
    // This would be your AI generation logic
    // For now, we'll create mock questions
    const questions = Array.from({ length: data.questionCount }, (_, i) => ({
      id: `q${i + 1}`,
      type: "multiple-choice" as const,
      question: `Sample question ${i + 1} about ${data.topic}?`,
      options: [
        { id: `opt1_${i}`, text: "Option A", isCorrect: i % 4 === 0 },
        { id: `opt2_${i}`, text: "Option B", isCorrect: i % 4 === 1 },
        { id: `opt3_${i}`, text: "Option C", isCorrect: i % 4 === 2 },
        { id: `opt4_${i}`, text: "Option D", isCorrect: i % 4 === 3 },
      ],
      correctAnswers: [`opt${(i % 4) + 1}_${i}`],
      explanation: `This is the explanation for question ${i + 1}.`,
      points: {
        correct: 10,
        incorrect: -2,
        skipped: 0,
      },
      timeLimit: Math.floor(data.timeLimit / data.questionCount),
    }));

    return questions;
  };

  const onSubmit = async (data: QuizCreationForm) => {
    setIsGenerating(true);

    try {
      toast.info("Generating quiz...", {
        description: "This might take a few moments",
      });

      // Generate questions (replace with actual AI generation)
      const questions = await generateQuestions(data);

      // Save to Convex
      const quizId = await createQuiz({
        title: data.title,
        description: data.description,
        topic: data.topic,
        category: data.category,
        difficulty: data.difficulty,
        totalQuestions: data.questionCount,
        timeLimit: data.timeLimit,
        passingScore: data.passingScore,
        questions: questions,
        author: "Anonymous", // Replace with actual user
      });

      const newQuiz = {
        _id: quizId,
        title: data.title,
        description: data.description,
        totalQuestions: data.questionCount,
        difficulty: data.difficulty,
        category: data.category,
      };

      setGeneratedQuiz(newQuiz);

      toast.success("Quiz generated successfully!", {
        description: `Created "${data.title}" with ${data.questionCount} questions`,
      });
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast.error("Failed to generate quiz", {
        description: "Please try again later",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewQuiz = (quiz: GeneratedQuiz) => {
    router.push(`/quiz/${quiz._id}`);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl space-y-8">
        <PageHeader
          title="Create Quiz"
          description="Generate AI-powered quizzes on any topic with customizable difficulty levels and question types"
        />

        <div>
          <QuizForm onSubmit={onSubmit} isLoading={isGenerating} />
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
