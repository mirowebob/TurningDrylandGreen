// src/components/ui/ProblemImageCard.jsx
const ProblemImageCard = ({ src, alt, tag, caption }) => {
  return (
    <article className="relative flex-none w-72 sm:w-80 cursor-pointer rounded-sm overflow-hidden
      bg-parchment border border-soil/10 group focus-visible:outline-2
      focus-visible:outline-sage focus-visible:outline-offset-2"
      tabIndex={0}
    >
      {/* Image */}
      <div className="overflow-hidden h-52 sm:h-56">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover
            grayscale-[60%] brightness-95
            group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105
            transition-all duration-500 ease-in-out"
        />
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-soil/50 via-transparent to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Meta */}
      <div className="p-3 flex flex-col gap-1">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-soil/40">
          {tag}
        </span>
        <p className="text-[13px] leading-snug text-soil">
          {caption}
        </p>
    
      </div>
    </article>
  );
};

export default ProblemImageCard;