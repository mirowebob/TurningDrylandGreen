import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import ProtectedRoute from './services/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Problem from './components/sections/Problem';
import About from './components/sections/About';
import Approach from './components/sections/Approach';
import ImpactStats from './components/sections/ImpactStats';
import ProjectGoals from './components/sections/ProjectGoals';
import Outcomes from './components/sections/Outcomes';
import Collaborators from './components/sections/Collaborators';
import Contact from './components/sections/Contact';
import ProjectsPage from './components/pages/ProjectsPage';
import ProjectDetailPage from './components/pages/ProjectDetailPage';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import AdminProblemImagesPage from './components/pages/AdminProblemImagesPage';
import AdminContentPage from './components/pages/AdminContentPage';
import LoginPage from './components/pages/LoginPage';

function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <About />
        <Approach />
        <ImpactStats />
        <ProjectGoals />
        <Outcomes />
        <Collaborators />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/problem-images"
            element={
              <ProtectedRoute>
                <AdminProblemImagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute>
                <AdminContentPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;