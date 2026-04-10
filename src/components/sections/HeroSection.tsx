import { Heart, Users, AlertTriangle, Bell } from "lucide-react";
import { useStats } from "@/hooks/use-data";

export function HeroSection() {
  const { data: stats } = useStats();

  const cards = [
    { label: "Patients", value: stats?.totalPatients ?? "—", icon: Users, color: "bg-primary/10 text-primary" },
    { label: "High Risk", value: stats?.highRisk ?? "—", icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
    { label: "Alerts", value: stats?.activeAlerts ?? "—", icon: Bell, color: "bg-warning/10 text-warning" },
  ];

  return (
    <section className="relative px-5 pt-12 pb-6 overflow-hidden">
      {/* Parallax background blobs */}
      <div className="absolute top-0 -right-16 w-48 h-48 rounded-full bg-primary/8 blur-3xl animate-float" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-info/10 blur-2xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative scroll-fade-in">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center pulse-glow">
            <Heart className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">MedFlow</span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mt-4 leading-tight">
          Good morning 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here's your health overview</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`scroll-scale-in rounded-2xl bg-card border border-border/50 p-3.5 text-center press-zoom`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className={`h-9 w-9 mx-auto rounded-xl flex items-center justify-center mb-2 ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
            <p className="text-xl font-bold text-foreground">{card.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
