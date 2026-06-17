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

function App() {
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

export default App;
