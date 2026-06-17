import { COLLABORATORS_CONTENT } from "../../data/content";
import ScrollReveal from "../ui/ScrollReveal";
import { Handshake } from "lucide-react";

const Collaborators = () => {
  return (
    <section id="collaborate" className="bg-parchment py-24 px-6 relative overflow-hidden">
      {/* Background organic details */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sage/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <ScrollReveal direction="up" delay={0.1}>
            <span className="font-sans text-xs md:text-sm font-bold tracking-[0.25em] text-sage uppercase">
              {COLLABORATORS_CONTENT.eyebrow}
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-soil">
              {COLLABORATORS_CONTENT.title}
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="font-sans text-base md:text-lg text-soil/75">
              {COLLABORATORS_CONTENT.subtitle}
            </p>
          </ScrollReveal>
        </div>

        {/* Logo/Name Grid (4 cols desktop, 2 mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {COLLABORATORS_CONTENT.list.map((partner, i) => (
            <ScrollReveal
              key={partner.name}
              direction="up"
              delay={0.05 * (i + 1)}
              className="flex"
            >
              <div
                className="w-full bg-white border border-gray-150 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-sage/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group min-h-[140px]"
                aria-label={`Potential partner: ${partner.name}`}
              >
                <div className="w-8 h-8 rounded-full bg-parchment flex items-center justify-center text-forest group-hover:bg-sage/20 group-hover:text-forest transition-colors duration-300">
                  <Handshake size={16} />
                </div>
                <h4 className="font-sans text-xs sm:text-sm font-semibold text-soil/95 leading-relaxed group-hover:text-forest transition-colors duration-300">
                  {partner.name}
                </h4>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collaborators;
