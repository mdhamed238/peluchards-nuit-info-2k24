import React from "react";
import { QuizList } from "./QuizList";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";

const Learn: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div className='text-center flex-1'>
          {" "}
          {/* Using flex-1 to center the text */}
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Quiz Océan et Corps Humain
          </h2>
          <p className='text-gray-600'>
            Testez vos connaissances sur les parallèles entre les océans et le
            corps humain
          </p>
        </div>
        <div className='flex-shrink-0'>
          {" "}
          {/* This prevents the button from shrinking */}
          <Button
            onClick={() => navigate("/create")}
            className='flex items-center gap-2'
          >
            <Plus className='w-4 h-4' />
            Créer un Quiz
          </Button>
        </div>
      </div>
      <QuizList />
    </div>
  );
};

export default Learn;
