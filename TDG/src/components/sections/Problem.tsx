import { PROBLEM_CONTENT } from "../../data/content";
import ScrollReveal from "../ui/ScrollReveal";
import StatCard from "../ui/StatCard";
import ProblemImagesCard from "../ui/ProblemImagesCard";
import figure1 from "../../assets/Figure 1- Eroded Stream in Southern Kajiado.jpg";
import figure2 from "../../assets/suswa erosion.jpg";
import figure4 from "../../assets/Fig. 4-httpsafrica.wetlands.orgennewsusing-geo-data-to-improve-water-resource-management-in-kajiado-county.png";
import figure5 from "../../assets/Figure 5-dry Ewaso Ng'iro River-bed in Isiolo.jpg";
import figure6 from "../../assets/Figure 6-Tot in Elgeyo Marakwet.png";
import figure7 from "../../assets/kisiriri.jpg";
import figure8 from "../../assets/narok_town.jpg";
import { caption } from "framer-motion/client";

const PROBLEM_IMAGES = [
  {
    src: figure1,
    alt: "Eroded stream in southern Kajiado",
    tag: "Erosion",
    caption: "Stream erosion in southern Kajiado is stripping fertile topsoil.",
  },
  {
    src: figure2,
    alt: "Gully erosion in Suswa Narok",
    tag: "Gully Erosion",
    caption: "Severe gulley erosion in Suswa Narok threatens grazing land.",
  },
  {
    src: figure4,
    alt: "Water resource management in Kajiado",
    tag: "Water Management",
    caption: "Geo-data improves water resource management strategies.",
  },
  {
    src: figure5,
    alt: "Dry Ewaso Ng'iro river-bed in Isiolo",
    tag: "River Loss",
    caption: "The dry Ewaso Ng'iro river-bed shows how water scarcity impacts communities.",
  },
  {
    src: figure6,
    alt: "Tree planting in Elgeyo Marakwet",
    tag: "Regeneration",
    caption: "Early restoration work in Elgeyo Marakwet demonstrates green recovery potential.",
  },
  {
    src: figure7,
    alt: "Kisiriri dried grazing land",
    tag: "Inadeqaute pasture",
    caption: "Kisiriri Narok Dried grazing land."
  },
  {
    src: figure8,
    alt: "flooded Narok Town",
    tag: "Effects of Erosion",
    caption: "Narok Town dilapidatd."
  }
];

const Problem = () => {
  return (
    <section id="problem" className="bg-parchment py-24 px-6 relative overflow-hidden">
      {/* Decorative earthy organic texture using background gradient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-ochre/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Context Text */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ScrollReveal direction="up" delay={0.1}>
              <span className="font-sans text-xs md:text-sm font-bold tracking-[0.25em] text-sage uppercase">
                {PROBLEM_CONTENT.eyebrow}
              </span>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-soil leading-tight">
                The Crisis Facing Kenya's Drylands
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3} className="flex flex-col gap-4 text-soil/80">
              {PROBLEM_CONTENT.paragraphs.map((p, i) => (
                <p key={i} className="text-base md:text-lg leading-relaxed">
                  {p}
                </p>
              ))}
            </ScrollReveal>
          </div>

          {/* Right Column: Stacked Stat Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {PROBLEM_CONTENT.stats.map((stat, i) => (
              <StatCard
                key={i}
                number={stat.number}
                label={stat.label}
                delay={0.1 * (i + 1)}
              />
            ))}
          </div>
        </div>

        {/* Image Cards Row */}
        <div className="mt-14">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center items-start">
              {PROBLEM_IMAGES.map((image, i) => (
                <ProblemImagesCard
                  key={i}
                  src={image.src}
                  alt={image.alt}
                  tag={image.tag}
                  caption={image.caption}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Problem;
