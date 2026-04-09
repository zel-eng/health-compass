import { useParams, useNavigate } from "react-router-dom";
import { usePatient, usePatientVitals, useAlerts } from "@/hooks/use-data";
import { ArrowLeft, Phone, Pill, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCard } from "@/components/AlertCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const riskBadge: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: patient, isLoading } = usePatient(id);
  const { data: vitals = [] } = usePatientVitals(id);
  const { data: allAlerts = [] } = useAlerts();
  const patientAlerts = allAlerts.filter(a => a.patient_id === id && !a.resolved);

  if (isLoading) return <div className="text-center py-20 text-muted-foreground">Loading...</div>;

  if (!patient) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Patient not found</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/patients")}>Back to patients</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={() => navigate("/patients")} className="text-muted-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <div className="flex items-start gap-4 rounded-xl border bg-card p-5">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
          {patient.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
            <Badge variant="outline" className={riskBadge[patient.risk_level] || ""}>{patient.risk_level} risk</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{patient.age}y • {patient.gender} • {patient.condition}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Phone className="h-3 w-3" /> {patient.phone}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Last Vitals</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Blood Pressure</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{patient.bp}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Blood Sugar</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{patient.sugar} mg/dL</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Pill className="h-4 w-4 text-primary" /> Medicines
          </h2>
          <div className="space-y-1.5">
            {(patient.medicines ?? []).map((m, i) => (
              <div key={i} className="text-sm text-foreground bg-muted rounded-lg px-3 py-2">{m}</div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Recent Alerts
          </h2>
          {patientAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active alerts</p>
          ) : (
            <div className="space-y-2">
              {patientAlerts.map(a => <AlertCard key={a.id} alert={a} compact />)}
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Notes</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{patient.notes}</p>
        </div>
      </div>

      {vitals.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">BP & Sugar Trends</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={vitals}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
              <XAxis dataKey="recorded_date" tick={{ fontSize: 11 }} stroke="hsl(215 14% 50%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(215 14% 50%)" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="systolic" stroke="hsl(0 72% 55%)" strokeWidth={2} dot={{ r: 3 }} name="Systolic" />
              <Line type="monotone" dataKey="sugar" stroke="hsl(30 95% 55%)" strokeWidth={2} dot={{ r: 3 }} name="Sugar" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
