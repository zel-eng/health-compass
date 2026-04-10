import { LayoutDashboard, Users, FileText, Bell, Settings } from "lucide-react";
import { useAlerts } from "@/hooks/use-data";

interface BottomNavProps {
  active: string;
  onNavigate: (section: string) => void;
}

const items = [
  { id: "dashboard", icon: LayoutDashboard, label: "Home" },
  { id: "patients", icon: Users, label: "Patients" },
  { id: "records", icon: FileText, label: "Records" },
  { id: "alerts", icon: Bell, label: "Alerts" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const { data: alerts = [] } = useAlerts();
  const alertCount = alerts.filter((a) => !a.resolved).length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-300 press-zoom relative ${
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <item.icon
                  className={`h-5 w-5 transition-all duration-300 ${
                    isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                  }`}
                />
                {item.id === "alerts" && alertCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium transition-all ${isActive ? "text-primary" : ""}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-5 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
