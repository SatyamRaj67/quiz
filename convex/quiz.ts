import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all published quizzes
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const quizzes = await ctx.db
      .query("quizzes")
      .filter((q) => q.eq(q.field("status"), "published"))
      .order("desc")
      .collect();

    return quizzes;
  },
});

// Get quiz by ID
export const getById = query({
  args: { id: v.id("quizzes") },
  handler: async (ctx, { id }) => {
    const quiz = await ctx.db.get(id);
    return quiz;
  },
});

// Get quizzes by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, { category }) => {
    const quizzes = await ctx.db
      .query("quizzes")
      .filter((q) =>
        q.and(
          q.eq(q.field("category"), category),
          q.eq(q.field("status"), "published"),
        ),
      )
      .order("desc")
      .collect();

    return quizzes;
  },
});

// Get quizzes by difficulty
export const getByDifficulty = query({
  args: {
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard"),
    ),
  },
  handler: async (ctx, { difficulty }) => {
    const quizzes = await ctx.db
      .query("quizzes")
      .filter((q) =>
        q.and(
          q.eq(q.field("difficulty"), difficulty),
          q.eq(q.field("status"), "published"),
        ),
      )
      .order("desc")
      .collect();

    return quizzes;
  },
});

// Create a new quiz
export const create = mutation({
  args: {
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
    timeLimit: v.number(),
    passingScore: v.number(),
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
    settings: v.optional(
      v.object({
        shuffleQuestions: v.boolean(),
        shuffleOptions: v.boolean(),
        showExplanations: v.boolean(),
        allowRetake: v.boolean(),
        showScoreImmediately: v.boolean(),
        allowNegativeScoring: v.boolean(),
        noTimeLimit: v.boolean(),
      }),
    ),
    scoring: v.optional(
      v.object({
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
    ),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("archived"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const defaultSettings = {
      shuffleQuestions: false,
      shuffleOptions: true,
      showExplanations: true,
      allowRetake: true,
      showScoreImmediately: true,
      allowNegativeScoring: false,
      noTimeLimit: false,
    };

    const defaultScoring = {
      totalPoints: args.questions.reduce((acc, q) => acc + q.points.correct, 0),
      gradeScale: [
        { min: 90, max: 100, grade: "A", description: "Excellent" },
        { min: 80, max: 89, grade: "B", description: "Good" },
        { min: 70, max: 79, grade: "C", description: "Average" },
        { min: 60, max: 69, grade: "D", description: "Below Average" },
        { min: 0, max: 59, grade: "F", description: "Fail" },
      ],
    };

    const quizId = await ctx.db.insert("quizzes", {
      ...args,
      settings: args.settings || defaultSettings,
      scoring: args.scoring || defaultScoring,
      status: args.status || "published",
    });

    return quizId;
  },
});

// Update quiz
export const update = mutation({
  args: {
    id: v.id("quizzes"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    difficulty: v.optional(
      v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    ),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("published"),
        v.literal("archived"),
      ),
    ),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete quiz
export const remove = mutation({
  args: { id: v.id("quizzes") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return { success: true };
  },
});

// Search quizzes
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, { searchTerm }) => {
    const quizzes = await ctx.db
      .query("quizzes")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();

    // Simple text search across title, description, and topic
    const filteredQuizzes = quizzes.filter((quiz) => {
      const searchableText =
        `${quiz.title} ${quiz.description} ${quiz.topic} ${quiz.category}`.toLowerCase();
      return searchableText.includes(searchTerm.toLowerCase());
    });

    return filteredQuizzes;
  },
});
