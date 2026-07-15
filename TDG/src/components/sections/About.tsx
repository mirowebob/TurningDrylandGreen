import { useEffect, useState } from "react";
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
import type { AdminProfileDTO } from "../../services/api";
import { fetchAdminProfiles } from "../../services/api";

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
  const [adminProfiles, setAdminProfiles] = useState<AdminProfileDTO[]>([]);

  useEffect(() => {
    const getProfiles = async () => {
      try {
        const data = await fetchAdminProfiles();

        if (data && data.length > 0) {
          setAdminProfiles(data);
        }

      } catch (err) {
        console.error("Failed to load admin profiles, falling back to static content", err);
        setAdminProfiles(
          ABOUT_CONTENT.admins.map((admin) => ({
            fullName: admin.name,
            title: admin.position,
            message: admin.message,
            profileImageUrl: admin.image,
          }))
        );
      }
    };
    getProfiles();
  }, []);

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

        <ScrollReveal direction="up" delay={0.45} className="w-full max-w-6xl">
          <div className="relative min-h-[360px] overflow-visible py-4">
            <div className="absolute left-[8%] top-6 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute bottom-4 right-[10%] h-32 w-32 rounded-full bg-amber-300/20 blur-3xl" />

            <div className="relative flex flex-wrap justify-center gap-6 md:gap-8">
              {adminProfiles.map((admin, index) => (
                <div
                  key={`${admin.fullName}-${index}`}
                  className={`group relative w-full max-w-[320px] flex-shrink-0 overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-700 hover:-translate-y-3 hover:scale-[1.03] ${index % 2 === 0 ? "md:translate-y-6 md:rotate-[-2deg]" : "md:-translate-y-4 md:rotate-[2deg]"}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? "from-emerald-400/25 via-transparent to-amber-300/20" : "from-sky-400/25 via-transparent to-lime-300/20"}`} />
                  <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative flex flex-col items-center gap-4">
                    <div className="relative">
                      {admin.profileImageUrl ? (
                        <img
                          src={admin.profileImageUrl}
                          alt={admin.fullName}
                          className="h-24 w-24 rounded-full border-4 border-white/20 object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-purple-500/20 text-purple-200 flex items-center justify-center font-bold text-xl uppercase border-4 border-white/20 shadow-lg">
                          {admin.fullName.substring(0, 2)}
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-[#16280e] bg-emerald-300" />
                    </div>
                    <div>
                      <div className="mb-2 inline-flex rounded-full border border-white/15 bg-black/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-100">
                        Admin
                      </div>
                      <h3 className="font-display text-xl text-white">
                        {admin.fullName}
                      </h3>
                      <p className="mt-1 text-sm font-sans text-emerald-100">
                        {admin.title}
                      </p>
                      <p className="mt-3 text-sm font-sans leading-relaxed text-white/80">
                        “{admin.message}”
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
