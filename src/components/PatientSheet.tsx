import { useState } from "react";
import { X, Phone, Pill, AlertTriangle, TrendingUp, History, ShieldAlert, Calendar, Plus } from "lucide-react";
import { usePatient, usePatientVitals, useAlerts, useMedicalHistory, useAllergies, useAppointments, useAddMedicalHistory, useAddAllergy, useDeleteAllergy, useCreateAppointment } from "@/hooks/use-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import { toast } from "sonner";
import { format } from "date-fns";

const riskColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

const severityColor: Record<string, string> = {
  severe: "bg-destructive/10 text-destructive",
  moderate: "bg-warning/10 text-warning",
  mild: "bg-success/10 text-success",
};

type Tab = "overview" | "history" | "allergies" | "appointments";

interface PatientSheetProps {
  patientId: string;
  onClose: () => void;
}

export function PatientSheet({ patientId, onClose }: PatientSheetProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const { data: patient, isLoading } = usePatient(patientId);
  const { data: vitals = [] } = usePatientVitals(patientId);
  const { data: allAlerts = [] } = useAlerts();
  const { data: history = [] } = useMedicalHistory(patientId);
  const { data: allergies = [] } = useAllergies(patientId);
  const { data: appointments = [] } = useAppointments(patientId);
  const patientAlerts = allAlerts.filter((a) => a.patient_id === patientId && !a.resolved);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Muhtasari", icon: TrendingUp },
    { id: "history", label: "Historia", icon: History },
    { id: "allergies", label: "Mzio", icon: ShieldAlert },
    { id: "appointments", label: "Miadi", icon: Calendar },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mt-10 flex-1 bg-background rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 glass rounded-t-3xl">
          <div className="flex items-center justify-between p-4">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/20 mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
            <span className="text-xs text-muted-foreground">Patient Details</span>
            <button onClick={onClose} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center press-zoom">
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 px-4 pb-3 overflow-x-auto no-scrollbar">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tab === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <t.icon className="h-3 w-3" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />)}
            </div>
          ) : patient ? (
            <div className="px-5 space-y-4 pt-2">
              {/* Patient Header - always visible */}
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                  {patient.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">{patient.name}</h2>
                    <Badge variant="outline" className={`text-[10px] ${riskColor[patient.risk_level]}`}>
                      {patient.risk_level}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{patient.age}y • {patient.gender} • {patient.condition}</p>
                  {patient.phone && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Phone className="h-3 w-3" /> {patient.phone}
                    </div>
                  )}
                </div>
              </div>

              {tab === "overview" && <OverviewTab patient={patient} vitals={vitals} patientAlerts={patientAlerts} />}
              {tab === "history" && <HistoryTab patientId={patientId} history={history} />}
              {tab === "allergies" && <AllergiesTab patientId={patientId} allergies={allergies} />}
              {tab === "appointments" && <AppointmentsTab patientId={patientId} appointments={appointments} />}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">Patient not found</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== OVERVIEW TAB =====
function OverviewTab({ patient, vitals, patientAlerts }: any) {
  return (
    <>
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
            <h3 className="text-sm font-semibold text-foreground">Dawa</h3>
          </div>
          <div className="space-y-1.5">
            {(patient.medicines ?? []).map((m: string, i: number) => (
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
            <h3 className="text-sm font-semibold text-foreground">Arifa</h3>
          </div>
          <div className="space-y-2">
            {patientAlerts.map((a: any) => (
              <div key={a.id} className="text-xs bg-destructive/5 border border-destructive/10 rounded-xl p-2.5">
                <p className="font-semibold">{a.title}</p>
                <p className="text-muted-foreground mt-0.5">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vitals Chart */}
      {vitals.length > 0 && (
        <div className="rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Mwenendo wa Afya</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={vitals}>
              <defs>
                <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0 72% 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0 72% 55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sugarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(30 95% 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(30 95% 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="recorded_date" tick={{ fontSize: 9 }} stroke="hsl(215 14% 80%)" />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(215 14% 80%)" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              <Area type="monotone" dataKey="systolic" stroke="hsl(0 72% 55%)" fill="url(#bpGrad)" strokeWidth={2} name="Systolic" />
              <Area type="monotone" dataKey="sugar" stroke="hsl(30 95% 55%)" fill="url(#sugarGrad)" strokeWidth={2} name="Sugar" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Notes */}
      {patient.notes && (
        <div className="rounded-2xl border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Maelezo</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{patient.notes}</p>
        </div>
      )}
    </>
  );
}

// ===== HISTORY TAB =====
function HistoryTab({ patientId, history }: { patientId: string; history: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [condition, setCondition] = useState("");
  const [diagDate, setDiagDate] = useState("");
  const [notes, setNotes] = useState("");
  const addHistory = useAddMedicalHistory();

  const handleAdd = async () => {
    if (!condition.trim()) return;
    try {
      await addHistory.mutateAsync({
        patient_id: patientId,
        condition: condition.trim(),
        diagnosis_date: diagDate || undefined,
        notes: notes || undefined,
      });
      setCondition(""); setDiagDate(""); setNotes(""); setShowForm(false);
      toast.success("Historia imeongezwa");
    } catch { toast.error("Imeshindwa kuongeza"); }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Historia ya Matibabu</h3>
        <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3 w-3 mr-1" /> Ongeza
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border bg-card p-4 space-y-3">
          <Input placeholder="Hali/Ugonjwa" value={condition} onChange={e => setCondition(e.target.value)} className="h-9 rounded-xl text-sm" />
          <Input type="date" value={diagDate} onChange={e => setDiagDate(e.target.value)} className="h-9 rounded-xl text-sm" />
          <Input placeholder="Maelezo..." value={notes} onChange={e => setNotes(e.target.value)} className="h-9 rounded-xl text-sm" />
          <div className="flex gap-2">
            <Button size="sm" className="rounded-xl text-xs flex-1" onClick={handleAdd} disabled={addHistory.isPending}>Hifadhi</Button>
            <Button size="sm" variant="ghost" className="rounded-xl text-xs" onClick={() => setShowForm(false)}>Ghairi</Button>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Hakuna historia ya matibabu</p>
      ) : (
        <div className="space-y-2">
          {history.map(h => (
            <div key={h.id} className="rounded-2xl border bg-card p-3.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{h.condition}</p>
                <Badge variant="outline" className={`text-[10px] ${h.status === "active" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                  {h.status}
                </Badge>
              </div>
              {h.diagnosis_date && <p className="text-[10px] text-muted-foreground mt-1">Imetambuliwa: {h.diagnosis_date}</p>}
              {h.notes && <p className="text-xs text-muted-foreground mt-1">{h.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ===== ALLERGIES TAB =====
function AllergiesTab({ patientId, allergies }: { patientId: string; allergies: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [allergen, setAllergen] = useState("");
  const [severity, setSeverity] = useState("mild");
  const [reaction, setReaction] = useState("");
  const addAllergy = useAddAllergy();
  const deleteAllergy = useDeleteAllergy();

  const handleAdd = async () => {
    if (!allergen.trim()) return;
    try {
      await addAllergy.mutateAsync({ patient_id: patientId, allergen: allergen.trim(), severity, reaction: reaction || undefined });
      setAllergen(""); setReaction(""); setShowForm(false);
      toast.success("Mzio umeongezwa");
    } catch { toast.error("Imeshindwa kuongeza"); }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Mzio</h3>
        <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3 w-3 mr-1" /> Ongeza
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border bg-card p-4 space-y-3">
          <Input placeholder="Kitu kinachosababisha mzio" value={allergen} onChange={e => setAllergen(e.target.value)} className="h-9 rounded-xl text-sm" />
          <div className="flex gap-2">
            {["mild", "moderate", "severe"].map(s => (
              <button key={s} onClick={() => setSeverity(s)}
                className={`flex-1 px-2 py-1.5 rounded-xl text-xs font-medium transition-all ${severity === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >{s}</button>
            ))}
          </div>
          <Input placeholder="Athari (reaction)" value={reaction} onChange={e => setReaction(e.target.value)} className="h-9 rounded-xl text-sm" />
          <div className="flex gap-2">
            <Button size="sm" className="rounded-xl text-xs flex-1" onClick={handleAdd} disabled={addAllergy.isPending}>Hifadhi</Button>
            <Button size="sm" variant="ghost" className="rounded-xl text-xs" onClick={() => setShowForm(false)}>Ghairi</Button>
          </div>
        </div>
      )}

      {allergies.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Hakuna mzio uliorekodishwa</p>
      ) : (
        <div className="space-y-2">
          {allergies.map(a => (
            <div key={a.id} className="rounded-2xl border bg-card p-3.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{a.allergen}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${severityColor[a.severity] || ""}`}>{a.severity}</span>
                </div>
                {a.reaction && <p className="text-xs text-muted-foreground mt-0.5">{a.reaction}</p>}
              </div>
              <button
                onClick={() => deleteAllergy.mutate({ id: a.id, patientId })}
                className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ===== APPOINTMENTS TAB =====
function AppointmentsTab({ patientId, appointments }: { patientId: string; appointments: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [reason, setReason] = useState("");
  const createAppt = useCreateAppointment();

  const handleCreate = async () => {
    if (!date) return;
    try {
      await createAppt.mutateAsync({
        patient_id: patientId,
        doctor_name: doctorName || "TBD",
        appointment_date: date,
        appointment_time: time,
        reason: reason || undefined,
      });
      setDoctorName(""); setDate(""); setReason(""); setShowForm(false);
      toast.success("Miadi imetengenezwa");
    } catch { toast.error("Imeshindwa kutengeneza miadi"); }
  };

  const statusColor: Record<string, string> = {
    scheduled: "bg-primary/10 text-primary",
    completed: "bg-success/10 text-success",
    cancelled: "bg-muted text-muted-foreground",
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Miadi</h3>
        <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-3 w-3 mr-1" /> Omba Miadi
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border bg-card p-4 space-y-3">
          <Input placeholder="Jina la daktari" value={doctorName} onChange={e => setDoctorName(e.target.value)} className="h-9 rounded-xl text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-9 rounded-xl text-sm" />
            <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="h-9 rounded-xl text-sm" />
          </div>
          <Input placeholder="Sababu ya miadi" value={reason} onChange={e => setReason(e.target.value)} className="h-9 rounded-xl text-sm" />
          <div className="flex gap-2">
            <Button size="sm" className="rounded-xl text-xs flex-1" onClick={handleCreate} disabled={createAppt.isPending}>Hifadhi</Button>
            <Button size="sm" variant="ghost" className="rounded-xl text-xs" onClick={() => setShowForm(false)}>Ghairi</Button>
          </div>
        </div>
      )}

      {appointments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Hakuna miadi iliyopangwa</p>
      ) : (
        <div className="space-y-2">
          {appointments.map(a => (
            <div key={a.id} className="rounded-2xl border bg-card p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{a.doctor_name || "Daktari"}</p>
                  <p className="text-xs text-muted-foreground">{a.appointment_date} • {a.appointment_time}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[a.status] || ""}`}>{a.status}</span>
              </div>
              {a.reason && <p className="text-xs text-muted-foreground mt-1.5">{a.reason}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
