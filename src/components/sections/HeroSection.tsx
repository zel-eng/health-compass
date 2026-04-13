import { Heart, Users, AlertTriangle, Bell, Calendar } from "lucide-react";
import { useStats, useAppointments } from "@/hooks/use-data";
import { useAuth } from "@/hooks/use-auth";

export function HeroSection() {
  const { profile } = useAuth();
  const { data: stats } = useStats();
  const { data: appointments = [] } = useAppointments();

  const upcoming = appointments.filter(a => a.status === "scheduled").slice(0, 2);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Habari za asubuhi" : hour < 17 ? "Habari za mchana" : "Habari za jioni";

  const cards = [
    { label: "Wagonjwa", value: stats?.totalPatients ?? "—", icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Hatari", value: stats?.highRisk ?? "—", icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
    { label: "Arifa", value: stats?.activeAlerts ?? "—", icon: Bell, color: "bg-warning/10 text-warning" },
  ];

  return (
    <section className="relative px-5 pt-12 pb-4 overflow-hidden">
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
          {greeting} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {profile?.full_name ? `${profile.full_name}, hii` : "Hii"} ni muhtasari wako wa afya
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="scroll-scale-in rounded-2xl bg-card border border-border/50 p-3.5 text-center press-zoom"
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

      {/* Upcoming Appointments */}
      {upcoming.length > 0 && (
        <div className="mt-5 space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> Miadi Inayokuja
          </h3>
          {upcoming.map(a => (
            <div key={a.id} className="rounded-xl bg-card border border-border/50 p-3 flex items-center gap-3 press-zoom scroll-fade-in">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary shrink-0">
                <span className="text-xs font-bold leading-none">{a.appointment_date.split("-")[2]}</span>
                <span className="text-[8px] uppercase">
                  {new Date(a.appointment_date + "T00:00:00").toLocaleDateString("sw", { month: "short" })}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{a.doctor_name || "Daktari"}</p>
                <p className="text-[11px] text-muted-foreground">{a.appointment_time} • {a.reason || "Uchunguzi"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
