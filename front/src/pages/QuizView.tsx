import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { QuestionCard } from "../components/QuestionCard";
import type {
  Quiz,
  QuizState,
  QuizDetailResponse,
  ApiError,
} from "../types/quiz";
import { BASE_URL } from "../constants/api";

export const QuizView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [state, setState] = useState<QuizState>({
    answers: {},
    submitted: false,
    score: null,
  });
  const [error, setError] = useState<ApiError | null>(null);

  // Calculate progress
  const progress = quiz
    ? (Object.keys(state.answers).filter((k) => state.answers[k] !== null)
        .length /
        quiz.questions.length) *
      100
    : 0;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!id) return;
        const response = await fetch(`${BASE_URL}/quizzes/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data: QuizDetailResponse = await response.json();
        setQuiz(data.quiz);
        // Initialize answers
        const initialAnswers: Record<number, number | null> = {};
        data.quiz.questions.forEach((q) => {
          initialAnswers[q._id] = null;
        });
        setState((prev) => ({ ...prev, answers: initialAnswers }));
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : "An error occurred",
          status: 500,
        });
      }
    };

    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (questionId: number, optionId: number): void => {
    if (!state.submitted) {
      setState((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: optionId,
        },
      }));
    }
  };

  const handleSubmit = (): void => {
    if (!quiz) return;

    let correct = 0;
    quiz.questions.forEach((question) => {
      const selectedOption = question.options.find(
        (opt) => opt._id === state.answers[question._id]
      );
      if (selectedOption?.is_correct) {
        correct += 1;
      }
    });

    setState((prev) => ({
      ...prev,
      score: (correct / quiz.questions.length) * 100,
      submitted: true,
    }));
  };

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!quiz) {
    return (
      <div className='container mx-auto p-4'>
        <Card>
          <CardContent className='p-8'>
            <div className='flex items-center justify-center'>
              Loading quiz...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 max-w-3xl'>
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <p className='text-gray-600'>{quiz.description}</p>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className='w-full' />
          <p className='text-sm text-gray-500 mt-2'>
            Progress: {Math.round(progress)}%
          </p>
        </CardContent>
      </Card>

      {quiz.questions.map((question, idx) => (
        <div key={question._id}>
          <QuestionCard
            question={question}
            index={idx}
            selectedOption={state.answers[question._id]}
            isSubmitted={state.submitted}
            onOptionSelect={handleOptionSelect}
          />
          {idx < quiz.questions.length - 1 && <Separator className='my-6' />}
        </div>
      ))}

      {!state.submitted ? (
        <Button
          className='w-full'
          onClick={handleSubmit}
          disabled={Object.values(state.answers).includes(null)}
        >
          Submit Quiz
        </Button>
      ) : (
        <Alert
          className={
            state.score && state.score > 70 ? "bg-green-100" : "bg-red-100"
          }
        >
          <AlertDescription>
            Your score: {state.score?.toFixed(1)}%
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
