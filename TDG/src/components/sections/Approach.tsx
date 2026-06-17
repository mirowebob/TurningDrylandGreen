import { APPROACH_CONTENT } from "../../data/content";
import ScrollReveal from "../ui/ScrollReveal";
import StepCard from "../ui/StepCard";

const Approach = () => {
  return (
    <section id="approach" className="bg-parchment py-24 px-6 relative overflow-hidden">
      {/* Decorative earthy backdrop */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-forest/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <ScrollReveal direction="up" delay={0.1}>
            <span className="font-sans text-xs md:text-sm font-bold tracking-[0.25em] text-sage uppercase">
              {APPROACH_CONTENT.eyebrow}
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-soil">
              {APPROACH_CONTENT.title}
            </h2>
          </ScrollReveal>
        </div>

        {/* Process Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative">
          {APPROACH_CONTENT.steps.map((step, i) => (
            <ScrollReveal
              key={step.number}
              direction="up"
              delay={0.1 * step.number}
              className="h-full"
            >
              <StepCard
                number={step.number}
                title={step.title}
                description={step.description}
                isLast={i === APPROACH_CONTENT.steps.length - 1}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Multi-sectorial Callout Box */}
        <ScrollReveal direction="up" delay={0.6}>
          <div className="bg-soil text-white border-l-4 border-l-sage rounded-r-xl p-8 shadow-xl mt-6">
            <p className="font-sans text-base md:text-lg leading-relaxed italic text-white/95">
              "{APPROACH_CONTENT.callout}"
            </p>
          </div>
        </ScrollReveal>

        {/* Target Counties List */}
        <div className="flex flex-col gap-6 mt-8">
          <ScrollReveal direction="up" delay={0.7} className="text-center">
            <h4 className="font-display text-lg font-semibold text-soil/90">
              Active & Target Catchment Counties
            </h4>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.8} className="flex flex-wrap justify-center gap-3">
            {APPROACH_CONTENT.counties.map((county) => (
              <span
                key={county}
                className="font-sans text-xs md:text-sm font-medium text-forest bg-forest/10 border border-forest/15 rounded-full px-5 py-2 hover:bg-forest hover:text-white transition-all duration-300 shadow-sm"
              >
                {county}
              </span>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Approach;
