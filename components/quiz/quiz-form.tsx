"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { FileText, Loader2, Settings, Sliders, Sparkles } from "lucide-react";

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

export type QuizCreationForm = z.infer<typeof quizCreationSchema>;

const categories = [
  "General Knowledge",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Technology",
  "Programming",
  "Mathematics",
  "History",
  "Geography",
  "Literature",
  "Arts",
  "Sports",
  "Business",
  "Health",
];

interface QuizFormProps {
  onSubmit: (data: QuizCreationForm) => void;
  isLoading: boolean;
}

export function QuizForm({ onSubmit, isLoading }: QuizFormProps) {
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

  return (
    <Card className="border backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span>Quiz Configuration</span>
        </CardTitle>
        <CardDescription>
          Set up your quiz parameters and let AI generate the questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Section */}
            <BasicInformationSection form={form} />

            <Separator />

            {/* Quiz Settings Section */}
            <QuizSettingsSection form={form} categories={categories} />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full transform py-3 font-semibold transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quiz with AI
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function BasicInformationSection({ form }: { form: any }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <h3 className="font-semibold">Basic Information</h3>
      </div>

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quiz Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter quiz title..."
                {...field}
                className="transition-all focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe what this quiz covers..."
                className="min-h-[80px] transition-all focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="topic"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Topic</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., JavaScript ES6 Features"
                {...field}
                className="transition-all focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </FormControl>
            <FormDescription className="text-gray-500 dark:text-gray-400">
              Be specific about what you want to quiz on
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function QuizSettingsSection({
  form,
  categories,
}: {
  form: any;
  categories: string[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sliders className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <h3 className="font-semibold">Quiz Settings</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                  <SelectItem
                    value="easy"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Easy
                    </Badge>
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    >
                      Medium
                    </Badge>
                  </SelectItem>
                  <SelectItem
                    value="hard"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    >
                      Hard
                    </Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="questionCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Questions</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="3"
                  max="20"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="transition-all focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time (sec)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="60"
                  max="3600"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="transition-all focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passingScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pass %</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="30"
                  max="100"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="transition-all focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
