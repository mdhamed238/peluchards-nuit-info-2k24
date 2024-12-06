import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { BASE_URL } from "../constants/api";

interface QuestionForm {
  question_text: string;
  options: {
    option_text: string;
    is_correct: boolean;
  }[];
}

export const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        options: [
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
        ],
      },
    ]);
  };

  const updateQuestion = (index: number, question_text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question_text = question_text;
    setQuestions(newQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    option_text: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].option_text = option_text;
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
      const response = await fetch(`${BASE_URL}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          questions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      navigate("/learn");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className='container mx-auto p-4 max-w-3xl'>
      <Card>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
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
              className='resize-y max-h-[200px]'
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

          <Button onClick={addQuestion} variant='outline' className='w-full'>
            Add Question
          </Button>

          <Button
            onClick={handleSubmit}
            className='w-full'
            disabled={!title || questions.length === 0}
          >
            Create Quiz
          </Button>
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
