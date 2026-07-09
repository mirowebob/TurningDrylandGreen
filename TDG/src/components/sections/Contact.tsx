import { useState } from "react";
import { CONTACT_CONTENT } from "../../data/content";
import ScrollReveal from "../ui/ScrollReveal";
import DonationModal from "../ui/DonationModal";
import { User, Phone, Mail, MapPin, Send, Heart } from "lucide-react";

const Contact = () => {
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  return (
    <section id="contact" className="bg-soil text-white py-24 px-6 relative overflow-hidden">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-forest/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sage/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column: Call-to-Action & Contact details */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <ScrollReveal direction="up" delay={0.1}>
                <span className="font-sans text-xs md:text-sm font-bold tracking-[0.25em] text-sage uppercase">
                  {CONTACT_CONTENT.eyebrow}
                </span>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2}>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
                  {CONTACT_CONTENT.title}
                </h2>
              </ScrollReveal>
            </div>

            <ScrollReveal direction="up" delay={0.3}>
              <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed">
                {CONTACT_CONTENT.body}
              </p>
              <p className="font-sans text-md font-semibold text-red-300 leading-relaxed">
                {CONTACT_CONTENT.prioritySites}
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.35}>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsDonationOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-300/15 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition-all duration-200 hover:bg-emerald-300/25"
                >
                  <Heart size={16} />
                  Support with a donation
                </button>
                <a
                  href={`mailto:${CONTACT_CONTENT.details.email}`}
                  className="rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15 inline-flex items-center"
                >
                  Send a partnership message
                </a>
              </div>
            </ScrollReveal>

            {/* Priority sites callout */}
            {/*<ScrollReveal direction="up" delay={0.4}>
              <div className="bg-[#243c18]/40 border border-[#8BAF5A]/25 rounded-2xl p-6 shadow-inner flex flex-col gap-2">
                <span className="font-sans text-xs font-bold text-ochre tracking-wider uppercase">
                  Priority Action Sites:
                </span>
                <p className="font-sans text-md font-semibold text-white/95 leading-relaxed">
                  {CONTACT_CONTENT.prioritySites}
                </p>
              </div>
            </ScrollReveal>*/}

            {/* Contact details list */}
            <div className="flex flex-col gap-5 mt-4">
              <ScrollReveal direction="up" delay={0.5} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-forest/80 border border-sage/20 flex items-center justify-center text-sage flex-shrink-0">
                  <User size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-xs text-white/50">Team Leader</span>
                  <span className="font-sans text-md font-semibold text-white/90">{CONTACT_CONTENT.details.teamLeader}</span>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.55} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-forest/80 border border-sage/20 flex items-center justify-center text-sage flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-xs text-white/50">Telephone Contacts</span>
                  <div className="flex flex-col gap-0.5">
                    {CONTACT_CONTENT.details.telephones.map((tel) => (
                      <a key={tel} href={`tel:${tel}`} className="font-sans text-md font-semibold text-white/90 hover:text-sage transition-colors">
                        {tel}
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.6} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-forest/80 border border-sage/20 flex items-center justify-center text-sage flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-xs text-white/50">Email Address</span>
                  <a href={`mailto:${CONTACT_CONTENT.details.email}`} className="font-sans text-md font-semibold text-white/90 hover:text-sage transition-colors">
                    {CONTACT_CONTENT.details.email}
                  </a>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.65} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-forest/80 border border-sage/20 flex items-center justify-center text-sage flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-xs text-white/50">Postal & Physical Address</span>
                  <span className="font-sans text-sm text-white/85 leading-relaxed max-w-sm">
                    {CONTACT_CONTENT.details.address}
                  </span>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Right Column: Contact via mailto */}
          <div className="lg:col-span-6 flex items-center">
            <ScrollReveal direction="left" delay={0.3} className="w-full">
              <div id="contact-form" className="bg-[#1A1208] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative">

                <div className="flex flex-col gap-6">
                  <h3 className="font-display text-2xl font-semibold text-white mb-2">
                    Send a Message
                  </h3>

                  <p className="font-sans text-white/75 text-sm md:text-base">
                    Interested in partnering with TDG Initiative? Reach out directly and our team will get back to you shortly.
                  </p>

                  <a
                    href={`mailto:${CONTACT_CONTENT.details.email}?subject=Partnership%20Inquiry&body=Hi%20TDG%20Initiative%20team%2C%0A%0AI'd%20like%20to%20discuss%20a%20potential%20partnership.%0A%0AOrganisation%3A%20%0AMessage%3A%20`}
                    className="font-sans font-semibold tracking-wider text-soil bg-sage px-6 py-4 rounded-lg hover:bg-sage/90 transition-all duration-300 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-sage/10"
                  >
                    <Send size={16} />
                    Email Us
                  </a>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>

      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
    </section>
  );
};

export default Contact;