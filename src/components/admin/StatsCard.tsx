interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  icon: React.ReactNode;
}

export function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-md hover:shadow-stone-900/5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-stone-900 mt-1">
            {value}
          </p>
          {change && (
            <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${
              trend === "up" ? "text-green-600" : "text-red-500"
            }`}>
              {trend === "up" ? "↑" : "↓"} {change}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-500">
          {icon}
        </div>
      </div>
    </div>
  );
}