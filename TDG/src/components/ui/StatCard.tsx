import type { StatCardData } from '../../data/content';
import ScrollReveal from './ScrollReveal';

interface StatCardProps extends StatCardData {
  delay?: number;
}

const StatCard = ({ number, label, delay = 0 }: StatCardProps) => {
  return (
    <ScrollReveal delay={delay} direction="left">
      <div className="bg-soil rounded-xl p-6 border border-white/10 hover:border-sage/40 transition-colors duration-300 group">
        <div className="text-sage font-display text-4xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300 origin-left">
          {number}
        </div>
        <div className="text-white/80 text-sm font-medium leading-snug">{label}</div>
      </div>
    </ScrollReveal>
  );
};

export default StatCard;
