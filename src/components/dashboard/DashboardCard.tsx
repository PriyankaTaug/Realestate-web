interface DashboardCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  description?: string;
}

export default function DashboardCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  description 
}: DashboardCardProps) {
  const changeColorClass = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-neutral-600'
  }[changeType];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeColorClass}`}>
              {changeType === 'positive' && '↗'} 
              {changeType === 'negative' && '↘'} 
              {change}
            </p>
          )}
          {description && (
            <p className="text-xs text-neutral-500 mt-1">{description}</p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
