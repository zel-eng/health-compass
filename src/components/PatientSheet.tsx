import { X, Phone, Pill, AlertTriangle, TrendingUp } from "lucide-react";
import { usePatient, usePatientVitals, useAlerts } from "@/hooks/use-data";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const riskColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

interface PatientSheetProps {
  patientId: string;
  onClose: () => void;
}

export function PatientSheet({ patientId, onClose }: PatientSheetProps) {
  const { data: patient, isLoading } = usePatient(patientId);
  const { data: vitals = [] } = usePatientVitals(patientId);
  const { data: allAlerts = [] } = useAlerts();
  const patientAlerts = allAlerts.filter((a) => a.patient_id === patientId && !a.resolved);

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet - slides up from bottom */}
      <div className="relative mt-12 flex-1 bg-background rounded-t-3xl overflow-y-auto animate-in slide-in-from-bottom duration-300 no-scrollbar">
        {/* Handle */}
        <div className="sticky top-0 z-10 glass rounded-t-3xl">
          <div className="flex items-center justify-between p-4">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/20 mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
            <span className="text-xs text-muted-foreground">Patient Details</span>
            <button onClick={onClose} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center press-zoom">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : patient ? (
          <div className="px-5 pb-24 space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                {patient.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{patient.name}</h2>
                  <Badge variant="outline" className={`text-[10px] ${riskColor[patient.risk_level]}`}>
                    {patient.risk_level}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {patient.age}y • {patient.gender} • {patient.condition}
                </p>
                {patient.phone && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Phone className="h-3 w-3" /> {patient.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Vitals Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-card border p-3.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Blood Pressure</p>
                <p className="text-xl font-bold text-foreground mt-1">{patient.bp || "—"}</p>
              </div>
              <div className="rounded-2xl bg-card border p-3.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Blood Sugar</p>
                <p className="text-xl font-bold text-foreground mt-1">{patient.sugar ?? "—"} <span className="text-xs font-normal">mg/dL</span></p>
              </div>
            </div>

            {/* Medicines */}
            {(patient.medicines ?? []).length > 0 && (
              <div className="rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Medicines</h3>
                </div>
                <div className="space-y-1.5">
                  {(patient.medicines ?? []).map((m, i) => (
                    <div key={i} className="text-sm bg-muted rounded-xl px-3 py-2 text-foreground">{m}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts */}
            {patientAlerts.length > 0 && (
              <div className="rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
                </div>
                <div className="space-y-2">
                  {patientAlerts.map((a) => (
                    <div key={a.id} className="text-xs bg-destructive/5 border border-destructive/10 rounded-xl p-2.5">
                      <p className="font-semibold">{a.title}</p>
                      <p className="text-muted-foreground mt-0.5">{a.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chart */}
            {vitals.length > 0 && (
              <div className="rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Trends</h3>
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={vitals}>
                    <XAxis dataKey="recorded_date" tick={{ fontSize: 9 }} stroke="hsl(215 14% 80%)" />
                    <YAxis tick={{ fontSize: 9 }} stroke="hsl(215 14% 80%)" />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    <Line type="monotone" dataKey="systolic" stroke="hsl(0 72% 55%)" strokeWidth={2} dot={{ r: 2.5 }} name="Systolic" />
                    <Line type="monotone" dataKey="sugar" stroke="hsl(30 95% 55%)" strokeWidth={2} dot={{ r: 2.5 }} name="Sugar" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Notes */}
            {patient.notes && (
              <div className="rounded-2xl border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Notes</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{patient.notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground text-sm">Patient not found</div>
        )}
      </div>
    </div>
  );
}
