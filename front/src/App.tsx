// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { QuizView } from "./pages/QuizView";
import { CreateQuiz } from "./pages/CreateQuiz";
import { EditQuiz } from "./pages/EditQuiz";
import Welcome from "./components/Welcome";
import Learn from "./components/Learn";
import Share from "./components/Share";
import Act from "./components/Act";

// Navigation component
const Navigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className='flex items-center space-x-6'>
      {[
        { path: "/", label: "Accueil" },
        { path: "/learn", label: "Apprendre" },
        { path: "/share", label: "Partager" },
        { path: "/act", label: "Agir" },
      ].map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={`text-base font-medium transition-colors ${
            isActive(path)
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

// Layout component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow-sm'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='text-xl font-bold text-gray-900'>
              Ocean Quiz App
            </Link>
            <Navigation />
          </div>
        </div>
      </nav>
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  );
};

// Not Found component
const NotFound: React.FC = () => {
  return (
    <div className='text-center py-16'>
      <h2 className='text-2xl font-bold text-gray-900 mb-4'>
        Page Non Trouvée
      </h2>
      <p className='text-gray-600'>La page que vous recherchez n'existe pas.</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Welcome />} />
          <Route path='/learn' element={<Learn />} />
          <Route path='/share' element={<Share />} />
          <Route path='/act' element={<Act />} />
          <Route path='/quiz/:id' element={<QuizView />} />
          <Route path='/create' element={<CreateQuiz />} />
          <Route path='/edit/:id' element={<EditQuiz />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
