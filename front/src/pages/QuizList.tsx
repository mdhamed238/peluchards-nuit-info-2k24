import { useState, useEffect } from "react";
import { QuizCard } from "../components/QuizCard";
import { Alert, AlertDescription } from "../components/ui/alert";
import type { QuizListResponse, ApiError } from "../types/quiz";
import { BASE_URL } from "../constants/api";

export const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizListResponse["quizzes"]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/quizzes`);
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data: QuizListResponse = await response.json();
        setQuizzes(data.quizzes);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : "An error occurred",
          status: 500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = (deletedQuizId: number) => {
    setQuizzes((currentQuizzes) =>
      currentQuizzes.filter((quiz) => quiz._id !== deletedQuizId)
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[200px]'>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-gray-600'>No quizzes available.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz._id}
          quiz={quiz}
          onDelete={() => handleDelete(quiz._id)}
        />
      ))}
    </div>
  );
};
