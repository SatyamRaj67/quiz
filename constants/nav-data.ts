import {
  TbHome,
  TbPlus,
  TbFileText,
  TbTrophy,
  TbChartBar,
  TbSettings,
  TbHelp,
  TbBrain,
  TbClock,
  TbBookmark,
} from "react-icons/tb";

export const navData = {
  navMain: [
    {
      title: "Home",
      href: "/",
      icon: TbHome,
      description: "Browse all available quizzes",
    },
    {
      title: "Create Quiz",
      href: "/create",
      icon: TbPlus,
      description: "Generate new AI-powered quizzes",
    },
    {
      title: "My Quizzes",
      href: "/my-quizzes",
      icon: TbFileText,
      description: "View and manage your created quizzes",
    },
    {
      title: "Results",
      href: "/results",
      icon: TbTrophy,
      description: "View your quiz results and scores",
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: TbChartBar,
      description: "Performance insights and statistics",
    },
  ],
  navSecondary: [
    {
      title: "Recent",
      href: "/recent",
      icon: TbClock,
      description: "Recently taken quizzes",
    },
    {
      title: "Favorites",
      href: "/favorites",
      icon: TbBookmark,
      description: "Your bookmarked quizzes",
    },
  ],
  navFooter: [
    {
      title: "Settings",
      href: "/settings",
      icon: TbSettings,
    },
    {
      title: "Help",
      href: "/help",
      icon: TbHelp,
    },
  ],
};

export const categories = [
  "General Knowledge",
  "Science",
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

export const difficulties = [
  { value: "easy", label: "Easy", color: "green" },
  { value: "medium", label: "Medium", color: "yellow" },
  { value: "hard", label: "Hard", color: "red" },
];
