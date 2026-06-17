import type { GoalCardData } from '../../data/content';

interface GoalCardProps extends GoalCardData {
  delay?: number;
}

const GoalCard = ({ number, title, outcomes }: GoalCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border-t-4 border-t-forest border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-10 h-10 rounded-full bg-forest/10 text-forest font-display font-bold text-sm flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <h3 className="font-display text-forest text-xl font-semibold leading-tight">{title}</h3>
      </div>
      <ul className="space-y-2">
        {outcomes.map((outcome, i) => (
          <li key={i} className="flex items-start gap-2 text-soil/75 text-sm leading-relaxed">
            <span className="text-sage mt-1 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeOpacity="0.4"/>
                <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {outcome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoalCard;
