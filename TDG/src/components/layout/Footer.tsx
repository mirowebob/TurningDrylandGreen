import React from "react";
import { NAVBAR_CONTENT, ABOUT_CONTENT } from "../../data/content";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-[#0F0A05] border-t-2 border-t-sage text-white/60 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left: Logo + Tagline */}
        <div className="flex flex-col gap-4">
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "#")}
            className="flex items-center gap-3 group focus:outline-none w-fit"
            aria-label="Turning Drylands Green Home"
          >
            <span className="font-display font-bold text-2xl text-sage bg-forest/30 border border-sage/20 rounded px-2.5 py-1 tracking-wider">
              {NAVBAR_CONTENT.logo.monogram}
            </span>
            <span className="font-display text-lg text-white font-medium tracking-wide">
              {NAVBAR_CONTENT.logo.fullName}
            </span>
          </a>
          <p className="font-sans text-sm text-white/50 leading-relaxed max-w-sm">
            Rehabilitating Kenya's ASAL catchments, restoring denuded landscapes, and securing sustainable pastoralist livelihoods.
          </p>
        </div>

        {/* Center: Nav links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display text-white text-md font-semibold tracking-wider">
            Quick Links
          </h4>
          <div className="grid grid-cols-2 gap-2 max-w-xs">
            {NAVBAR_CONTENT.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-sans text-sm text-white/60 hover:text-sage hover:translate-x-1 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: Registration & Legal Info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-display text-white text-md font-semibold tracking-wider">
            Organization Status
          </h4>
          <p className="font-sans text-sm text-white/50 leading-relaxed">
            Turning Drylands Green was registered in 2024 in Kenya with the Attorney General's Office (Registrar of societies)<br />
            {/*<span className="text-ochre">Certificate No: {ABOUT_CONTENT.history.certificateNo}</span>*/}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-white/40">
        <div>
          &copy; {currentYear} {NAVBAR_CONTENT.logo.fullName} Foundation. All Rights Reserved.
        </div>
        <div className="flex gap-4">
          <span>Registered in Kenya</span>
          <span>&middot;</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
