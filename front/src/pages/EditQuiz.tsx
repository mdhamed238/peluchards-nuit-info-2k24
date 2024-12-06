// src/pages/EditQuiz.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import type { Quiz } from "../types/quiz";
import { BASE_URL } from "../constants/api";

interface QuestionForm {
  question_text: string;
  options: {
    option_text: string;
    is_correct: boolean;
  }[];
}

export const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${BASE_URL}/quizzes/${id}`);
        if (!response.ok) throw new Error("Failed to fetch quiz");

        const data = await response.json();
        const quiz: Quiz = data.quiz;

        setTitle(quiz.title);
        setDescription(quiz.description);
        setQuestions(
          quiz.questions.map((q) => ({
            question_text: q.question_text,
            options: q.options.map((o) => ({
              option_text: o.option_text,
              is_correct: o.is_correct,
            })),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const updateQuestion = (index: number, question_text: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      question_text,
    };
    setQuestions(newQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    option_text: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = {
      ...newQuestions[questionIndex].options[optionIndex],
      option_text,
    };
    setQuestions(newQuestions);
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.forEach((opt, idx) => {
      opt.is_correct = idx === optionIndex;
    });
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${BASE_URL}/quizzes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          questions,
        }),
      });

      if (!response.ok) throw new Error("Failed to update quiz");

      navigate("/learn");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 max-w-3xl'>
      <Card>
        <CardHeader>
          <CardTitle>Edit Quiz</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Quiz title'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Quiz description'
              rows={4}
              className='resize-y min-h-[100px] max-h-[200px]'
            />
          </div>

          {questions.map((question, qIndex) => (
            <Card key={qIndex} className='p-4'>
              <div className='space-y-4'>
                <Input
                  value={question.question_text}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                  placeholder={`Question ${qIndex + 1}`}
                />

                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className='flex items-center space-x-2'>
                    <Input
                      value={option.option_text}
                      onChange={(e) =>
                        updateOption(qIndex, oIndex, e.target.value)
                      }
                      placeholder={`Option ${oIndex + 1}`}
                    />
                    <Button
                      type='button'
                      variant={option.is_correct ? "default" : "outline"}
                      onClick={() => setCorrectOption(qIndex, oIndex)}
                      className='w-24'
                    >
                      {option.is_correct ? "Correct" : "Set"}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <div className='flex justify-end gap-4'>
            <Button
              variant='outline'
              onClick={() => navigate("/")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !title || questions.length === 0}
            >
              {saving ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!error} onOpenChange={() => setError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
