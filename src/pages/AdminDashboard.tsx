import { useAuth } from "@/hooks/use-auth";
import { usePatients, useAlerts, useStats } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { Shield, Users, Bell, Activity, LogOut, UserCheck, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const { data: patients = [] } = usePatients();
  const { data: alerts = [] } = useAlerts();
  const { data: stats } = useStats();

  const activeAlerts = alerts.filter(a => !a.resolved);
  const conditions = patients.reduce((acc, p) => {
    acc[p.condition] = (acc[p.condition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topConditions = Object.entries(conditions).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admin Panel</p>
              <h1 className="text-lg font-bold text-foreground">{profile?.full_name || "Admin"}</h1>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 px-5 mt-4">
        {[
          { label: "Wagonjwa Wote", value: stats?.totalPatients ?? 0, icon: Users, color: "text-primary" },
          { label: "High Risk", value: stats?.highRisk ?? 0, icon: AlertTriangle, color: "text-destructive" },
          { label: "Active Alerts", value: stats?.activeAlerts ?? 0, icon: Bell, color: "text-warning" },
          { label: "Madaktari", value: 0, icon: UserCheck, color: "text-success" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center gap-2">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Alerts Summary */}
      {activeAlerts.length > 0 && (
        <div className="px-5 mt-5">
          <h2 className="text-sm font-semibold mb-2">Arifa Zinazoendelea</h2>
          <div className="space-y-2">
            {activeAlerts.slice(0, 5).map(a => (
              <div key={a.id} className="bg-destructive/5 border border-destructive/20 rounded-xl p-3">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.patient_name} • {a.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditions */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Activity className="h-4 w-4" /> Hali za Kawaida
        </h2>
        <div className="space-y-2">
          {topConditions.map(([name, count]) => (
            <div key={name} className="flex items-center justify-between bg-card border border-border/50 rounded-xl p-3">
              <span className="text-sm">{name}</span>
              <span className="text-sm font-bold text-primary">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Patients */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold mb-2">Wagonjwa wa Hivi Karibuni</h2>
        <div className="space-y-2">
          {patients.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center gap-3 bg-card border border-border/50 rounded-xl p-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {p.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.condition}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{p.risk_level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
