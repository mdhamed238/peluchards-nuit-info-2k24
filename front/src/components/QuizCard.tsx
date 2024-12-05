import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import type { QuizCardProps } from "../types/quiz";

export const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const navigate = useNavigate();

  return (
    <Card className='hover:shadow-lg transition-all duration-200'>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <p className='text-gray-600'>{quiz.description}</p>
        <p className='text-sm text-gray-500'>
          Created: {new Date(quiz.created_at).toLocaleDateString()}
        </p>
        <Button
          onClick={() => navigate(`/quiz/${quiz._id}`)}
          className='w-full'
        >
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
};
