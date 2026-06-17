import { IMPACT_CONTENT } from "../../data/content";
import ScrollReveal from "../ui/ScrollReveal";
import AnimatedCounter from "../ui/AnimatedCounter";

const ImpactStats = () => {
  return (
    <section id="impact" className="bg-soil text-white py-24 px-6 relative overflow-hidden">
      {/* Dynamic ambient backgrounds */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-forest/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#203615]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-16 relative z-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <ScrollReveal direction="up" delay={0.1}>
            <span className="font-sans text-xs md:text-sm font-bold tracking-[0.25em] text-sage uppercase">
              {IMPACT_CONTENT.eyebrow}
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
              {IMPACT_CONTENT.title}
            </h2>
          </ScrollReveal>
        </div>

        {/* 4-Column Grid of Animated Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-6xl mx-auto">
          {IMPACT_CONTENT.stats.map((stat, i) => {
            // Determine if prefix is needed (e.g. KES for livestock contribution)
            const isLivestock = stat.label.toLowerCase().includes("livestock");
            const prefix = isLivestock ? "KES " : "";
            // Clean up the label for presentation if needed
            const displayLabel = stat.label;

            return (
              <ScrollReveal
                key={i}
                direction="up"
                delay={0.15 * (i + 1)}
                className="flex flex-col items-center justify-between text-center gap-4 bg-soil-black/40 border border-white/5 hover:border-sage/20 p-8 rounded-2xl transition-all duration-300 group hover:shadow-lg hover:shadow-forest/10"
              >
                <div className="h-24 flex items-center justify-center">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={prefix}
                    duration={2000}
                  />
                </div>
                <p className="font-sans text-white/70 text-sm md:text-md leading-relaxed max-w-[240px]">
                  {displayLabel}
                </p>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
