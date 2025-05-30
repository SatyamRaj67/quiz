"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  FileQuestion,
  Plus,
  Trophy,
  Users,
  Zap,
  Calendar,
  PlayCircle,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { toast } from "sonner";
import { PageHeader } from "~/components/common/page-header";

const HomePage = () => {
  const router = useRouter();

  const quizzes = useQuery(api.quiz.getAll);
  const isLoading = quizzes === undefined;

  const handleStartQuiz = (quizId: string) => {
    toast.success("Starting quiz...");
    router.push(`/quiz/${quizId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 border-red-200 dark:border-red-800";
      default:
        return " text-gray-800 dark:bg-gray-900/20 dark:text-gray-200  dark:border-gray-800";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          title="Quiz Hub"
          description="Test your knowledge with AI-generated quizzes. Choose from various topics and difficulty levels to challenge yourself."
        />

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={() => router.push("/create")}>
            <Plus className="mr-2 h-5 w-5" />
            Create New Quiz
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg p-3">
                  <FileQuestion className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{quizzes?.length || 0}</p>
                  <p className="text-sm">Available Quizzes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg p-3">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {quizzes?.reduce(
                      (acc, quiz) => acc + quiz.totalQuestions,
                      0,
                    ) || 0}
                  </p>
                  <p className="text-sm">Total Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-lg p-3">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(quizzes?.map((quiz) => quiz.category)).size || 0}
                  </p>
                  <p className="text-sm">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Quizzes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Available Quizzes</h2>
            <div className="flex items-center space-x-2 text-sm">
              <Zap className="h-4 w-4" />
              <span>AI Generated</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse border backdrop-blur-sm">
                  <CardHeader>
                    <div className="h-6 rounded"></div>
                    <div className="h-4 w-3/4 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 rounded"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 w-20 rounded"></div>
                        <div className="h-6 w-16 rounded"></div>
                      </div>
                      <div className="h-10 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !quizzes || quizzes.length === 0 ? (
            <Card className="border backdrop-blur-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <FileQuestion className="mx-auto mb-6 h-16 w-16" />
                <h3 className="mb-2 text-xl font-semibold">No quizzes found</h3>
                <p className="mx-auto mb-6 max-w-md">
                  Get started by creating your first AI-generated quiz. Choose
                  any topic and let our AI create engaging questions for you.
                </p>
                <Button onClick={() => router.push("/create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Quiz
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz._id}
                  className="group border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="line-clamp-2 text-lg font-bold transition-colors group-hover:text-gray-700 dark:group-hover:text-gray-300">
                        {quiz.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`ml-2 flex-shrink-0 ${getDifficultyColor(quiz.difficulty)}`}
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <FileQuestion className="h-4 w-4" />
                        <span>{quiz.totalQuestions} questions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(quiz._creationTime)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {quiz.category}
                      </Badge>
                    </div>

                    <Button onClick={() => handleStartQuiz(quiz._id)}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
