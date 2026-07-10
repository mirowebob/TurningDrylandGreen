import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import ProjectDetailPage from './components/pages/ProjectDetailPage'; // Import the new component
import AdminDashboardPage from './components/pages/AdminDashboardPage';
import AdminProblemImagesPage from './components/pages/AdminProblemImagesPage';
import AdminContentPage from './components/pages/AdminContentPage';

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} /> {/* New route */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/problem-images" element={<AdminProblemImagesPage />} />
        <Route path="/admin/content" element={<AdminContentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;