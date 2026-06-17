import { OUTCOMES_CONTENT } from "../../data/content";
import ScrollReveal from "../ui/ScrollReveal";
import { Leaf } from "lucide-react";

const Outcomes = () => {
  return (
    <section id="outcomes" className="bg-forest text-white py-24 px-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,175,90,0.1)_0%,rgba(45,74,30,0)_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Title & Intro Narrative */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ScrollReveal direction="up" delay={0.1}>
              <span className="font-sans text-xs md:text-sm font-bold tracking-[0.25em] text-sage uppercase">
                {OUTCOMES_CONTENT.eyebrow}
              </span>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                {OUTCOMES_CONTENT.title}
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed">
                {OUTCOMES_CONTENT.intro}
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column: Interactive List of Outcomes */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {OUTCOMES_CONTENT.list.map((outcome, i) => (
              <ScrollReveal
                key={i}
                direction="left"
                delay={0.05 * (i + 1)}
                className="flex items-start gap-4 bg-[#243c18]/50 hover:bg-[#2c481d]/70 border border-white/5 hover:border-sage/20 p-5 rounded-xl transition-all duration-300 group shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-forest border border-sage/25 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-soil transition-all duration-300 flex-shrink-0">
                  <Leaf size={18} />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <p className="font-sans text-sm md:text-base text-white/90 leading-relaxed group-hover:text-white transition-colors">
                    {outcome.text}
                  </p>
                  <span className="font-sans text-xs font-semibold text-ochre tracking-wider uppercase">
                    {outcome.sdg}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Outcomes;
