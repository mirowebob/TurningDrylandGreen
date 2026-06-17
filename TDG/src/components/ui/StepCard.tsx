import type { ApproachStepData } from '../../data/content';

interface StepCardProps extends ApproachStepData {
  isLast?: boolean;
}

const StepCard = ({ number, title, description, isLast = false }: StepCardProps) => {
  return (
    <div className="flex flex-col items-center text-center relative group">
      {/* Connector line (desktop) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-sage/40 to-sage/10 z-0" />
      )}

      {/* Badge */}
      <div className="relative z-10 w-16 h-16 rounded-full bg-sage flex items-center justify-center mb-5 shadow-lg group-hover:shadow-sage/30 group-hover:scale-110 transition-all duration-300">
        <span className="font-display font-bold text-soil text-xl">{number}</span>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-parchment hover:border-sage/30 hover:shadow-md transition-all duration-300 w-full">
        <h3 className="font-display text-forest text-lg font-semibold mb-2">{title}</h3>
        <p className="text-soil/70 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default StepCard;
