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
import { Button } from "@/components/ui/button";
import { useAuth } from "./store/AuthContext";
import Welcome from "./pages/Welcome";
import Learn from "./pages/Learn";
import Share from "./pages/Share";
import Act from "./pages/Act";
import { AuthProvider } from "./store/AuthContext";
import { LoginForm } from "./pages/auth/LoginForm";
import { RegisterForm } from "./pages/auth/RegisterForm";
import { UserManagement } from "./components/UserManagement";

// Navigation component
const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const mainLinks = [
    { path: "/", label: "Accueil" },
    { path: "/learn", label: "Apprendre" },
    { path: "/share", label: "Partager" },
    { path: "/act", label: "Agir" },
  ];

  return (
    <div className='flex items-center space-x-6'>
      <div className='flex items-center space-x-6'>
        {mainLinks.map(({ path, label }) => (
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

      {user?.editor && (
        <Link
          to='/users'
          className={`text-base font-medium transition-colors ${
            isActive("/users")
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Users
        </Link>
      )}

      <div className='flex items-center space-x-4 ml-6 border-l pl-6'>
        {user ? (
          <>
            <span className='text-gray-600'>
              {user.username}
              {user.editor && " (Editor)"}
            </span>
            <Button
              variant='ghost'
              onClick={logout}
              className='text-red-600 hover:text-red-700'
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              to='/login'
              className='text-gray-600 hover:text-gray-900 transition-colors'
            >
              Login
            </Link>
            <Button asChild>
              <Link to='/register'>Register</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

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

// Layout component remains the same but add padding to container
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow-sm'>
        <div className='container mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <Link to='/' className='text-xl font-bold text-gray-900'>
              Ocean Quiz App
            </Link>
            <Navigation />
          </div>
        </div>
      </nav>
      <main className='container mx-auto px-6 py-8'>{children}</main>
    </div>
  );
};

// Rest of the App.tsx remains the same
// Don't forget to add the login and register routes:
function App() {
  return (
    <AuthProvider>
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
            <Route path='/login' element={<LoginForm />} />
            <Route path='/register' element={<RegisterForm />} />
            <Route path='/users' element={<UserManagement />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
