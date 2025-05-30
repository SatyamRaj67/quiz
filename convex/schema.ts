import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quizzes: defineTable({
    title: v.string(),
    description: v.string(),
    topic: v.string(),
    category: v.string(),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard"),
    ),
    totalQuestions: v.number(),
    timeLimit: v.number(), // in seconds
    passingScore: v.number(), // percentage
    author: v.optional(v.string()),
    questions: v.array(
      v.object({
        id: v.string(),
        type: v.union(
          v.literal("multiple-choice"),
          v.literal("true-false"),
          v.literal("multiple-select"),
          v.literal("fill-in-the-blank"),
          v.literal("ordering"),
        ),
        question: v.string(),
        options: v.optional(
          v.array(
            v.object({
              id: v.string(),
              text: v.string(),
              isCorrect: v.optional(v.boolean()),
              correctOrder: v.optional(v.number()),
            }),
          ),
        ),
        correctAnswers: v.optional(v.array(v.string())),
        explanation: v.string(),
        points: v.object({
          correct: v.number(),
          incorrect: v.number(),
          skipped: v.number(),
        }),
        timeLimit: v.number(),
      }),
    ),
    settings: v.object({
      shuffleQuestions: v.boolean(),
      shuffleOptions: v.boolean(),
      showExplanations: v.boolean(),
      allowRetake: v.boolean(),
      showScoreImmediately: v.boolean(),
      allowNegativeScoring: v.boolean(),
      noTimeLimit: v.boolean(),
    }),
    scoring: v.object({
      totalPoints: v.number(),
      gradeScale: v.array(
        v.object({
          min: v.number(),
          max: v.number(),
          grade: v.string(),
          description: v.string(),
        }),
      ),
    }),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived"),
    ),
    tags: v.optional(v.array(v.string())),
  }),

  quizResults: defineTable({
    quizId: v.id("quizzes"),
    userId: v.optional(v.string()),
    userName: v.optional(v.string()),
    score: v.number(),
    totalPoints: v.number(),
    correctAnswers: v.number(),
    totalQuestions: v.number(),
    timeSpent: v.number(), // in seconds
    completedAt: v.number(),
    answers: v.array(
      v.object({
        questionId: v.string(),
        selectedOptions: v.array(v.string()),
        isCorrect: v.boolean(),
        pointsEarned: v.number(),
        timeSpent: v.number(),
      }),
    ),
    grade: v.string(),
    passed: v.boolean(),
  }),
});
