"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ArrowLeft, Clock, FileQuestion, Trophy, User } from "lucide-react";
import Link from "next/link";
import type { Id } from "~/convex/_generated/dataModel";

export default function QuizPage() {
  const params = useParams();
  const quizId = params.id as Id<"quizzes">;

  const quiz = useQuery(api.quiz.getById, { id: quizId });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "medium":
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "hard":
        return "bg-gray-300  dark:bg-gray-600 ";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200";
    }
  };

  if (quiz === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4"></div>
            <p className="">Loading quiz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quiz === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md border">
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <FileQuestion className="mx-auto h-12 w-12" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Quiz Not Found</h3>
            <p className="mb-4 text-sm">
              The quiz you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button variant="outline" className=" ">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" className=" ">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Quiz Info */}
        <Card className="border backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                <p className="">{quiz.description}</p>
                <p className="dark: text-sm">Topic: {quiz.topic}</p>
              </div>
              <Badge
                variant="outline"
                className={`ml-4 ${getDifficultyColor(quiz.difficulty)}`}
              >
                {quiz.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div className="flex items-center space-x-2">
                <FileQuestion className="h-4 w-4" />
                <span className="">{quiz.totalQuestions} Questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="">
                  {Math.floor(quiz.timeLimit / 60)} Minutes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{quiz.category}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span className="">Pass: {quiz.passingScore}%</span>
              </div>
            </div>

            {quiz.author && (
              <div className="mt-4 flex items-center space-x-2 text-sm">
                <User className="h-4 w-4" />
                <span className="">Created by: {quiz.author}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quiz Preview - Show first few questions */}
        <Card className="border backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Preview Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz.questions.slice(0, 3).map((question, index) => (
              <div key={question.id} className="rounded-lg border p-4">
                <h4 className="mb-2 font-semibold">
                  {index + 1}. {question.question}
                </h4>
                {question.options && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <div className="h-4 w-4 rounded border"></div>
                        <span className=" ">{option.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {quiz.questions.length > 3 && (
              <p className="text-center text-sm">
                ... and {quiz.questions.length - 3} more questions
              </p>
            )}
          </CardContent>
        </Card>

        {/* Start Quiz Button */}
        <Card className="border backdrop-blur-sm">
          <CardContent className="pt-6 text-center">
            <h3 className="mb-4 text-lg font-semibold">Ready to start?</h3>
            <p className="mb-6">
              You'll have {Math.floor(quiz.timeLimit / 60)} minutes to complete{" "}
              {quiz.totalQuestions} questions. You need {quiz.passingScore}% to
              pass.
            </p>
            <Button
              onClick={() => {
                // Implement quiz start logic here
                console.log("Starting quiz:", quiz);
              }}
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
