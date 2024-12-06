import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Clock, Edit2 } from "lucide-react";
import type { Quiz } from "../types/quiz";
import { BASE_URL } from "../constants/api";

interface QuizCardProps {
  quiz: Omit<Quiz, "questions">;
  onDelete: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${BASE_URL}/api/quizzes/${quiz._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }

      onDelete();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card
        className='
          w-full 
          h-[400px] 
          flex 
          flex-col 
          border-2 
          border-gray-200 
          shadow-[0_2px_10px_rgba(0,0,0,0.08)]
          transition-all 
          duration-300 
          ease-in-out
          hover:border-slate-800
          hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          hover:-translate-y-1
        '
      >
        <CardHeader className='flex-none'>
          <CardTitle className='text-xl line-clamp-2'>{quiz.title}</CardTitle>
        </CardHeader>

        <CardContent className='flex-grow overflow-hidden'>
          <p className='text-gray-600 line-clamp-4 mb-4'>{quiz.description}</p>
          <div className='flex items-center text-sm text-gray-500'>
            <Clock className='w-4 h-4 mr-2' />
            <span>
              Created: {new Date(quiz.created_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>

        <CardFooter className='border-t bg-gray-50/50 p-4'>
          <div className='flex w-full gap-3'>
            <Button
              variant='outline'
              className='flex-1 hover:bg-blue-50'
              onClick={() => navigate(`/quiz/${quiz._id}`)}
            >
              Start Quiz
            </Button>
            <Button
              variant='outline'
              className='flex-1 hover:bg-sky-50 border-sky-200 text-sky-600 hover:text-sky-700 hover:border-sky-300 gap-2'
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit/${quiz._id}`);
              }}
            >
              <Edit2 className='w-4 h-4' />
              Edit
            </Button>
            <Button
              variant='destructive'
              className='flex-1'
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              quiz "{quiz.title}" and all its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-500 hover:bg-red-600'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
