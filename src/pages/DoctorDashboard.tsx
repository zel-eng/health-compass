import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePatients, useAlerts } from "@/hooks/use-data";
import { PatientSheet } from "@/components/PatientSheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stethoscope, Users, Bell, LogOut, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const riskColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

export default function DoctorDashboard() {
  const { profile, signOut } = useAuth();
  const { data: patients = [] } = usePatients();
  const { data: alerts = [] } = useAlerts();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const activeAlerts = alerts.filter(a => !a.resolved);
  const highRisk = patients.filter(p => p.risk_level === "high");

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Karibu, Daktari</p>
              <h1 className="text-lg font-bold text-foreground">{profile?.full_name || "Doctor"}</h1>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-5 mt-4">
        {[
          { label: "Wagonjwa", value: patients.length, icon: Users, color: "text-primary" },
          { label: "High Risk", value: highRisk.length, icon: Bell, color: "text-destructive" },
          { label: "Alerts", value: activeAlerts.length, icon: Bell, color: "text-warning" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-3 text-center">
            <s.icon className={`h-5 w-5 mx-auto ${s.color}`} />
            <p className="text-xl font-bold mt-1">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {activeAlerts.length > 0 && (
        <div className="px-5 mt-5">
          <h2 className="text-sm font-semibold text-foreground mb-2">Active Alerts</h2>
          <div className="space-y-2">
            {activeAlerts.slice(0, 3).map(a => (
              <div key={a.id} className="bg-destructive/5 border border-destructive/20 rounded-xl p-3">
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.patient_name} • {a.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Patients */}
      <div className="px-5 mt-5">
        <h2 className="text-sm font-semibold text-foreground mb-2">Wagonjwa Wako</h2>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tafuta mgonjwa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          {filtered.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPatient(p.id)}
              className="w-full flex items-center gap-3 bg-card border border-border/50 rounded-xl p-3 text-left press-zoom"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {p.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.condition}</p>
              </div>
              <Badge variant="outline" className={`text-[10px] ${riskColor[p.risk_level] || ""}`}>
                {p.risk_level}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {selectedPatient && (
        <PatientSheet patientId={selectedPatient} onClose={() => setSelectedPatient(null)} />
      )}
    </div>
  );
}
