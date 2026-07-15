import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { HERO_CONTENT } from "../../data/content";
import tdgLogo from "../../assets/new_logo.jpg";

// Import problem images from assets
import figure1 from "../../assets/Figure 1- Eroded Stream in Southern Kajiado.jpg";
import figure2 from "../../assets/suswa erosion.jpg";
import figure4 from "../../assets/Fig. 4-httpsafrica.wetlands.orgennewsusing-geo-data-to-improve-water-resource-management-in-kajiado-county.png";
import figure5 from "../../assets/Figure 5-dry Ewaso Ng'iro River-bed in Isiolo.jpg";
import figure6 from "../../assets/Figure 6-Tot in Elgeyo Marakwet.png";
import figure7 from "../../assets/kisiriri.jpg";
import figure8 from "../../assets/narok_town.jpg";
import figure9 from "../../assets/marigat-Loruk.jpeg";

const PROBLEM_IMAGES = [
  figure1,
  figure2,
  figure4,
  figure5,
  figure6,
  figure7,
  figure8,
  figure9,
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROBLEM_IMAGES.length);
    }, 6000); // Rotate every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-soil overflow-hidden pt-16"
    >
      {/* Background Slideshow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentIndex}
            src={PROBLEM_IMAGES[currentIndex]}
            alt="Dryland degradation problem"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-soil via-soil/60 to-soil/40 pointer-events-none" />


      {/* Decorative Topographic Lines SVG Overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
        <svg
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          fill="none"
          stroke="#8BAF5A"
          strokeWidth="1"
        >
          <path d="M-100,200 Q200,100 400,250 T900,150 T1500,300" />
          <path d="M-100,300 Q150,220 350,320 T850,220 T1500,420" />
          <path d="M-100,400 Q100,340 300,440 T800,340 T1500,540" />
          <path d="M-100,500 Q50,460 250,560 T750,460 T1500,660" />
          <path d="M-100,600 Q0,580 200,680 T700,580 T1500,780" />
          <path d="M-100,700 Q-50,700 150,800 T650,700 T1500,900" />
        </svg>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          {/* Logo badge / tiny label */}
          <div className="flex items-center gap-3 bg-forest/10 border border-sage/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <img
              src={tdgLogo}
              alt="TDG logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="font-sans text-xs md:text-sm font-semibold tracking-[0.25em] text-sage uppercase">
              Turning Drylands Green Initiative
            </span>
          </div>
        </motion.div>

        {/* Large Playfair Display headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-white tracking-tight leading-tight max-w-4xl"
        >
          {HERO_CONTENT.headline}
        </motion.h1>

        {/* Subheading in ochre */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="font-sans text-lg md:text-2xl text-ochre max-w-3xl leading-relaxed tracking-wide"
        >
          {HERO_CONTENT.subheading}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto"
        >
          <button
            onClick={() => handleScrollTo("contact")}
            className="w-full sm:w-auto font-sans font-semibold tracking-wider text-soil bg-sage px-8 py-4 rounded hover:bg-sage/90 shadow-lg shadow-sage/10 transition-all duration-300"
          >
            {HERO_CONTENT.ctaPartner}
          </button>
          <button
            onClick={() => handleScrollTo("problem")}
            className="w-full sm:w-auto font-sans font-semibold tracking-wider text-white border-2 border-white/40 hover:border-white hover:bg-white/5 px-8 py-4 rounded transition-all duration-300"
          >
            {HERO_CONTENT.ctaLearnMore}
          </button>
        </motion.div>
      </div>

      {/* Downward Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        onClick={() => handleScrollTo("problem")}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/50 hover:text-sage transition-colors"
        >
          <span className="text-xs tracking-widest font-sans uppercase">Scroll</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
