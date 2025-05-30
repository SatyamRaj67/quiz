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

interface QuizGenerationResponse {
  success: boolean;
  quiz?: any;
  filename?: string;
  message?: string;
  error?: string;
  details?: string;
  rawResponse?: string;
}

export class QuizService {
  static async generateQuiz(
    params: QuizGenerationParams,
  ): Promise<QuizGenerationResponse> {
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quiz");
      }

      return data;
    } catch (error) {
      console.error("Quiz generation error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
