import { ABOUT_CONTENT } from "../../data/content";
import ScrollReveal from "../ui/ScrollReveal";
import {
  Users,
  Droplet,
  Trees,
  Handshake,
  Sprout,
  Globe,
  Wrench,
  Laptop,
  Map as MapIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Map icon string to actual Lucide component
const iconMap: Record<string, LucideIcon> = {
  Users: Users,
  Droplet: Droplet,
  Trees: Trees,
  Handshake: Handshake,
  Sprout: Sprout,
  Globe: Globe,
  Wrench: Wrench,
  Map: MapIcon,
  DeviceLaptop: Laptop,
};

const About = () => {
  return (
    <section id="about" className="bg-forest text-white py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,175,90,0.15)_0%,rgba(45,74,30,0)_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
        {/* Foundation details & mission quote */}
        <div className="text-center max-w-4xl flex flex-col items-center gap-6">
          <ScrollReveal direction="up" delay={0.1}>
            <span className="font-sans text-xs md:text-sm font-bold tracking-[0.25em] text-sage uppercase">
              {ABOUT_CONTENT.eyebrow}
            </span>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <blockquote className="font-display italic text-3xl md:text-5xl lg:text-[3.25rem] text-white/90 leading-tight my-4">
              "{ABOUT_CONTENT.mission}"
            </blockquote>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3} className="text-white/60 text-xs md:text-sm font-sans flex flex-wrap justify-center gap-x-4 gap-y-1">
            <span>Founded: {ABOUT_CONTENT.history.founded}</span>
            <span>&middot;</span>
            <span>Established: {ABOUT_CONTENT.history.established}</span>
          </ScrollReveal>
        </div>

        {/* Story details */}
        <ScrollReveal direction="up" delay={0.4} className="max-w-3xl text-center">
          <p className="font-sans text-base md:text-lg text-white/85 leading-relaxed bg-[#203615]/40 border border-[#8BAF5A]/10 rounded-2xl p-8 shadow-inner">
            {ABOUT_CONTENT.narrative}
          </p>
        </ScrollReveal>

        {/* Team Grid */}
        <div className="w-full flex flex-col gap-10 mt-6">
          <ScrollReveal direction="up" delay={0.5} className="text-center">
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-white">
              Our Multi-Disciplinary Team
            </h3>
            <p className="text-white/65 text-sm md:text-base font-sans mt-2">
              Combining scientific rigor with community mobilization to heal ecosystems
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {ABOUT_CONTENT.team.map((member, i) => {
              const IconComponent = iconMap[member.iconName] || Users;
              return (
                <ScrollReveal
                  key={i}
                  direction="up"
                  delay={0.05 * (i + 1)}
                  className="bg-[#243c18]/60 hover:bg-[#2c481d]/80 border border-white/5 hover:border-sage/20 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-forest/80 border border-sage/20 flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-soil transition-all duration-300">
                    <IconComponent size={22} strokeWidth={2} />
                  </div>
                  <h4 className="font-sans text-sm md:text-md font-semibold text-white/95 leading-snug group-hover:text-sage transition-colors">
                    {member.role}
                  </h4>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
