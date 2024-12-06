import React from "react";

const Welcome: React.FC = () => {
  return (
    <div className='max-w-4xl mx-auto text-center'>
      <h1 className='text-4xl font-bold text-gray-900 mb-6'>
        Bienvenue sur Ocean Quiz
      </h1>
      <p className='text-xl text-gray-600 mb-8'>
        Découvrez les liens fascinants entre l'océan et le corps humain
      </p>
      <div className='prose lg:prose-xl mx-auto'>
        <p className='text-gray-600'>
          Notre mission est d'explorer et de comprendre les parallèles étonnants
          qui existent entre les océans et le corps humain, démontrant
          l'interconnexion remarquable de tous les systèmes vivants sur Terre.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
