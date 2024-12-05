import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { cn } from "../lib/utils";
import type { QuestionCardProps } from "../types/quiz";

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  selectedOption,
  isSubmitted,
  onOptionSelect,
}) => {
  const getOptionColor = (isCorrect: boolean, optionId: number): string => {
    if (!isSubmitted) return "";
    if (isCorrect) return "text-green-600 border-green-600";
    if (selectedOption === optionId && !isCorrect)
      return "text-red-600 border-red-600";
    return "opacity-50";
  };

  return (
    <Card className='mb-6'>
      <CardHeader>
        <CardTitle className='text-lg'>
          Question {index + 1}: {question.question_text}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          disabled={isSubmitted}
          value={selectedOption?.toString()}
          onValueChange={(value) =>
            onOptionSelect(question._id, parseInt(value))
          }
        >
          {question.options.map((option) => (
            <div key={option._id} className='flex items-center space-x-2'>
              <RadioGroupItem
                value={option._id.toString()}
                id={`option-${option._id}`}
                className={cn(getOptionColor(option.is_correct, option._id))}
              />
              <Label
                htmlFor={`option-${option._id}`}
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  getOptionColor(option.is_correct, option._id)
                )}
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
