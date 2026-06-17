import React, { useState, useEffect } from "react";
import { NAVBAR_CONTENT } from "../../data/content";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const scrollPosition = useScrollPosition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const isScrolled = scrollPosition > 50;

  // Track active section for highlights
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAVBAR_CONTENT.links.map((link) => link.href.replace("#", ""));
      const currentScroll = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (currentScroll >= top && currentScroll < top + height) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-soil shadow-lg border-b border-forest/20 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => handleLinkClick(e, "#")}
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="Turning Drylands Green Home"
        >
          <span className="font-display font-bold text-2xl text-sage bg-forest/30 border border-sage/20 rounded px-2.5 py-1 tracking-wider transition-all group-hover:bg-forest/50">
            {NAVBAR_CONTENT.logo.monogram}
          </span>
          <span className="font-display text-lg text-white font-medium tracking-wide hidden sm:inline-block transition-colors group-hover:text-sage">
            {NAVBAR_CONTENT.logo.fullName}
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAVBAR_CONTENT.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`font-sans text-sm tracking-wide transition-all duration-200 hover:text-sage ${
                activeSection === link.href ? "text-sage font-medium" : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Button */}
        <div className="hidden lg:block">
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="font-sans text-sm font-semibold tracking-wider text-soil bg-sage px-6 py-2.5 rounded hover:bg-sage/90 transition-all duration-200"
          >
            {NAVBAR_CONTENT.cta}
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white/90 hover:text-sage focus:outline-none focus:ring-2 focus:ring-sage rounded p-1"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Full Screen Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[72px] bg-soil/95 backdrop-blur-md z-40 lg:hidden flex flex-col items-center justify-center gap-8 transition-opacity duration-300 animate-fade-in">
          {NAVBAR_CONTENT.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`font-sans text-2xl tracking-wide transition-all ${
                activeSection === link.href ? "text-sage font-semibold" : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="font-sans text-lg font-semibold tracking-wider text-soil bg-sage px-8 py-3 rounded hover:bg-sage/90 transition-all mt-4"
          >
            {NAVBAR_CONTENT.cta}
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
