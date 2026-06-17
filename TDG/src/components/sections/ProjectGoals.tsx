import { GOALS_CONTENT } from "../../data/content";
import ScrollReveal from "../ui/ScrollReveal";
import GoalCard from "../ui/GoalCard";

const ProjectGoals = () => {
  return (
    <section id="goals" className="bg-parchment py-24 px-6 relative overflow-hidden">
      {/* Target anchor section id for links */}
      <div id="problem-goals" className="absolute -top-20" />
      <div id="collaborators-goals" className="absolute -bottom-20" />
      
      {/* Custom absolute id spacer to support anchor scroll offset */}
      <span id="goals" className="absolute top-0" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <ScrollReveal direction="up" delay={0.1}>
            <span className="font-sans text-xs md:text-sm font-bold tracking-[0.25em] text-sage uppercase">
              {GOALS_CONTENT.eyebrow}
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-soil">
              {GOALS_CONTENT.title}
            </h2>
          </ScrollReveal>
        </div>

        {/* 2-3 Column Responsive Grid of Objective Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GOALS_CONTENT.cards.map((card, i) => (
            <ScrollReveal
              key={card.number}
              direction="up"
              delay={0.1 * (i + 1)}
              className="flex"
            >
              <GoalCard
                number={card.number}
                title={card.title}
                outcomes={card.outcomes}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGoals;
