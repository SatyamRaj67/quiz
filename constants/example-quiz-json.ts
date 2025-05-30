export const exampleQuiz = {
  id: "quiz-001",
  title: "General Knowledge Quiz",
  description: "Test your knowledge across various topics",
  category: "General Knowledge",
  difficulty: "medium",
  timeLimit: 300, // in seconds (5 minutes)
  totalQuestions: 5,
  passingScore: 60, // percentage
  created: "2025-05-30T00:00:00Z",
  author: "Quiz Master",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "What is the capital of France?",
      options: [
        { id: "a", text: "London", isCorrect: false },
        { id: "b", text: "Berlin", isCorrect: false },
        { id: "c", text: "Paris", isCorrect: true },
        { id: "d", text: "Madrid", isCorrect: false },
      ],
      explanation: "Paris is the capital and largest city of France.",
      points: {
        correct: 10,
        incorrect: -2,
        skipped: 0,
      },
      timeLimit: 30, // seconds per question
    },
    {
      id: "q2",
      type: "true-false",
      question: "The Earth is flat.",
      options: [
        { id: "true", text: "True", isCorrect: false },
        { id: "false", text: "False", isCorrect: true },
      ],
      explanation: "The Earth is approximately spherical in shape.",
      points: {
        correct: 5,
        incorrect: -1,
        skipped: 0,
      },
      timeLimit: 15,
    },
    {
      id: "q3",
      type: "multiple-select",
      question: "Which of the following are programming languages?",
      options: [
        { id: "a", text: "JavaScript", isCorrect: true },
        { id: "b", text: "HTML", isCorrect: false },
        { id: "c", text: "Python", isCorrect: true },
        { id: "d", text: "CSS", isCorrect: false },
      ],
      explanation:
        "JavaScript and Python are programming languages, while HTML and CSS are markup and styling languages respectively.",
      points: {
        correct: 15,
        incorrect: -3,
        skipped: 0,
      },
      timeLimit: 45,
    },
    {
      id: "q4",
      type: "fill-in-the-blank",
      question: "The largest planet in our solar system is ______.",
      correctAnswers: ["Jupiter", "jupiter"],
      explanation: "Jupiter is the largest planet in our solar system.",
      points: {
        correct: 10,
        incorrect: -2,
        skipped: 0,
      },
      timeLimit: 30,
    },
    {
      id: "q5",
      type: "ordering",
      question: "Arrange these planets in order from the Sun:",
      options: [
        { id: "a", text: "Mars", correctOrder: 4 },
        { id: "b", text: "Venus", correctOrder: 2 },
        { id: "c", text: "Mercury", correctOrder: 1 },
        { id: "d", text: "Earth", correctOrder: 3 },
      ],
      explanation:
        "The correct order from the Sun is: Mercury, Venus, Earth, Mars.",
      points: {
        correct: 20,
        incorrect: -4,
        skipped: 0,
      },
      timeLimit: 60,
    },
  ],
  settings: {
    shuffleQuestions: true,
    shuffleOptions: true,
    showExplanations: true,
    allowRetake: true,
    showScoreImmediately: false,
    allowNegativeScoring: true,
    noTimeLimit: false,
  },
  scoring: {
    totalPoints: 60,
    gradeScale: [
      { min: 90, max: 100, grade: "A", description: "Excellent" },
      { min: 80, max: 89, grade: "B", description: "Good" },
      { min: 70, max: 79, grade: "C", description: "Average" },
      { min: 60, max: 69, grade: "D", description: "Below Average" },
      { min: 0, max: 59, grade: "F", description: "Fail" },
    ],
  },
};
