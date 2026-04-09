import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "danger" | "warning" | "info";
}

const variantStyles = {
  default: "bg-card",
  danger: "bg-destructive/5 border-destructive/10",
  warning: "bg-warning/5 border-warning/10",
  info: "bg-info/5 border-info/10",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-5 animate-fade-in ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${iconStyles[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
      {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
    </div>
  );
}
