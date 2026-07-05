import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface MetricCardProps {
  id: string;
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  isDarkMode?: boolean;
}

export default function MetricCard({
  id,
  title,
  value,
  subtext,
  icon: Icon,
  iconBgColor,
  iconColor,
  isDarkMode = false
}: MetricCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 flex items-start justify-between ${
        isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-100 text-slate-800"
      }`}
    >
      <div className="space-y-2">
        <span className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>{title}</span>
        <h3 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{value}</h3>
        <p className={`text-xs font-medium ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>{subtext}</p>
      </div>
      <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
    </motion.div>
  );
}
