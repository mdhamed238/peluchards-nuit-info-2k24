// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QuizView } from "./pages/QuizView";
import { QuizList } from "./pages/QuizList";

// Create a layout component for consistent styling
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow-sm'>
        <div className='container mx-auto px-4 py-3'>
          <h1 className='text-xl font-bold text-gray-900'>Ocean Quiz App</h1>
        </div>
      </nav>
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  );
};

// QuizList page component
const HomePage: React.FC = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>
          Ocean and Human Body Quiz
        </h2>
        <p className='text-gray-600'>
          Test your knowledge about the parallels between oceans and the human
          body
        </p>
      </div>
      <QuizList />
    </div>
  );
};

// Not Found page component
const NotFound: React.FC = () => {
  return (
    <div className='text-center'>
      <h2 className='text-2xl font-bold text-gray-900 mb-4'>Page Not Found</h2>
      <p className='text-gray-600'>
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/quiz/:id' element={<QuizView />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
