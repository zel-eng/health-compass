import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { type DbAlert, type DbMedicalHistory, usePatient, useAlerts, useMedicalHistory } from "@/hooks/use-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { AlertBanner } from "@/components/health/AlertBanner";
import { CalculatorCard } from "@/components/health/CalculatorCard";
import { ChartCard } from "@/components/health/ChartCard";
import { HealthForm } from "@/components/health/HealthForm";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HeartPulse, Users, Bell, LogOut, LayoutDashboard, Calculator, BarChart, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart as RechartsBarChart, Bar } from "recharts";
import {
  buildSampleTrendData,
  classifyBloodPressure,
  classifyHeartRate,
  getBmiCategory,
  getLatestHealthEntry,
  loadHealthEntries,
  type HealthEntry,
  daysSince,
} from "@/lib/health";

const riskColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

type PatientFeature = "summary" | "add-data" | "insights" | "calculators";

export default function PatientDashboard() {
  const { profile, user, signOut } = useAuth();
  const patientId = user?.id ?? "";
  const { data: patient } = usePatient(patientId);
  const { data: history = [] } = useMedicalHistory(patientId);
  const { data: alertsData = [] } = useAlerts();
  const [activeFeature, setActiveFeature] = useState<PatientFeature>("summary");
  const [search, setSearch] = useState("");
  const [healthEntries, setHealthEntries] = useState<HealthEntry[]>([]);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(32);
  const [manualSystolic, setManualSystolic] = useState(120);
  const [manualDiastolic, setManualDiastolic] = useState(78);
  const [manualHeartRate, setManualHeartRate] = useState(74);

  useEffect(() => {
    if (!patientId) return;
    setHealthEntries(loadHealthEntries(patientId));
  }, [patientId]);

  const latestEntry = useMemo(() => getLatestHealthEntry(healthEntries), [healthEntries]);

  useEffect(() => {
    if (!latestEntry) return;
    setManualSystolic(latestEntry.systolic);
    setManualDiastolic(latestEntry.diastolic);
    setManualHeartRate(latestEntry.heartRate);
  }, [latestEntry]);

  const patientAlerts = alertsData.filter((a: DbAlert) => a.patient_id === patientId && !a.resolved);
  const highRisk = patient?.risk_level === "high" ? 1 : 0;

  const filtered = history.filter((h: DbMedicalHistory) =>
    h.condition.toLowerCase().includes(search.toLowerCase()) || h.status?.toLowerCase().includes(search.toLowerCase())
  );

  const insightData = useMemo(() => {
    if (healthEntries.length) {
      return healthEntries.map((entry) => ({
        label: new Date(entry.savedAt).toLocaleDateString("en-US", { weekday: "short" }),
        systolic: entry.systolic,
        diastolic: entry.diastolic,
        weight: entry.weight,
      }));
    }

    return buildSampleTrendData();
  }, [healthEntries]);

  const bmiValue = useMemo(() => {
    const weight = latestEntry?.weight ?? 72;
    const meters = height / 100;
    return Number((weight / (meters * meters)).toFixed(1));
  }, [height, latestEntry]);

  const bmiCategory = useMemo(() => getBmiCategory(bmiValue), [bmiValue]);
  const bpStatus = useMemo(() => classifyBloodPressure(manualSystolic, manualDiastolic), [manualSystolic, manualDiastolic]);
  const heartRateStatus = useMemo(() => classifyHeartRate(age, manualHeartRate), [age, manualHeartRate]);

  const needsReminder = useMemo(() => {
    if (!latestEntry) return true;
    return daysSince(latestEntry.savedAt) >= 3;
  }, [latestEntry]);

  const summaryCards = [
    { label: "Rekodi", value: history.length, icon: Users, color: "text-primary" },
    { label: "High Risk", value: highRisk, icon: Bell, color: "text-destructive" },
    { label: "Alerts", value: patientAlerts.length, icon: Bell, color: "text-warning" },
  ];

  const hasAbnormalVitals = latestEntry
    ? classifyBloodPressure(latestEntry.systolic, latestEntry.diastolic) !== "Normal" || classifyHeartRate(age, latestEntry.heartRate) !== "Normal"
    : false;

  const patientNavItems = [
    { id: "summary", icon: LayoutDashboard, label: "Home" },
    { id: "add-data", icon: Calculator, label: "Add Data" },
    { id: "insights", icon: BarChart, label: "Insights" },
    { id: "calculators", icon: Activity, label: "Tools" },
  ];

  const handlePanelToggle = (panel: PatientFeature) => {
    setActiveFeature((current) => (current === panel ? "summary" : panel));
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="relative overflow-hidden bg-card border-b border-border px-5 pt-12 pb-5">
        <div className="pointer-events-none absolute inset-0 bg-fixed bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_25%)] opacity-90" />
        <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute -bottom-12 left-2 h-40 w-40 rounded-full bg-secondary/20 blur-3xl animate-float-slow" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <HeartPulse className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Karibu, Mgonjwa</p>
                <h1 className="text-lg font-bold text-foreground">{profile?.full_name || "Patient"}</h1>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 pb-5 animate-fade-in space-y-6">
        {needsReminder && (
          <AlertBanner
            variant={latestEntry ? "warning" : "danger"}
            title={latestEntry ? "Add a fresh reading soon" : "No health data saved yet"}
            description={latestEntry ? "Your dashboard is more accurate when you save daily vitals." : "Start with structured vitals for clean tracking."}
          />
        )}

        {hasAbnormalVitals && latestEntry && (
          <AlertBanner
            variant="danger"
            title="Abnormal health values detected"
            description={`Latest BP is ${latestEntry.systolic}/${latestEntry.diastolic}, heart rate ${latestEntry.heartRate} bpm.`}
          />
        )}

        <div className="grid grid-cols-3 gap-3">
          {summaryCards.map((s) => (
            <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-3 text-center transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-floating hover:bg-primary/5">
              <s.icon className={`h-5 w-5 mx-auto ${s.color}`} />
              <p className="text-xl font-bold mt-1">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handlePanelToggle("add-data")}
            className="rounded-3xl border border-border/50 bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <p className="text-sm font-semibold text-foreground">Add Health Data</p>
            <p className="mt-1 text-xs text-muted-foreground">Open a structured vitals sheet from below.</p>
          </button>
          <button
            type="button"
            onClick={() => handlePanelToggle("insights")}
            className="rounded-3xl border border-border/50 bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <p className="text-sm font-semibold text-foreground">Health Insights</p>
            <p className="mt-1 text-xs text-muted-foreground">Open a insights page from the bottom.</p>
          </button>
          <button
            type="button"
            onClick={() => handlePanelToggle("calculators")}
            className="rounded-3xl border border-border/50 bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <p className="text-sm font-semibold text-foreground">Calculators</p>
            <p className="mt-1 text-xs text-muted-foreground">Open calculator tools from below.</p>
          </button>
        </div>
      </div>

      <Sheet open={activeFeature !== "summary"} onOpenChange={(open) => !open && setActiveFeature("summary")}> 
        <SheetContent side="bottom" className="max-h-[85vh] overflow-hidden rounded-t-3xl border border-border/50 shadow-elevated">
          <SheetHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <SheetTitle>
                  {activeFeature === "add-data"
                    ? "Add Health Data"
                    : activeFeature === "insights"
                    ? "Health Insights"
                    : "Health Calculators"}
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {activeFeature === "add-data"
                    ? "Submit blood pressure, heart rate, weight and temperature."
                    : activeFeature === "insights"
                    ? "Review trends from the bottom sheet."
                    : "Use the tools to assess your latest vitals."}
                </p>
              </div>
              <SheetClose className="rounded-full bg-muted/10 p-2 text-muted-foreground transition hover:bg-muted/20">
                <span className="sr-only">Close</span>
                ×
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
            {activeFeature === "add-data" && (
              <HealthForm
                patientId={patientId}
                onSaved={(entry) => {
                  setHealthEntries((current) => [...current, entry]);
                  setActiveFeature("summary");
                }}
              />
            )}

            {activeFeature === "insights" && (
              <div className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-2">
                  <ChartCard title="Blood Pressure Trend" description="Track systolic and diastolic readings over time.">
                    <div className="h-64">
                      <LineChart data={insightData}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                        <XAxis dataKey="label" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Line type="monotone" dataKey="systolic" stroke="#2563eb" strokeWidth={2} dot />
                        <Line type="monotone" dataKey="diastolic" stroke="#f59e0b" strokeWidth={2} dot />
                      </LineChart>
                    </div>
                  </ChartCard>
                  <ChartCard title="Weight Trend" description="Weekly weight changes for quick review.">
                    <div className="h-64">
                      <RechartsBarChart data={insightData}>
                        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                        <XAxis dataKey="label" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip />
                        <Bar dataKey="weight" fill="#22c55e" radius={[8, 8, 0, 0]} />
                      </RechartsBarChart>
                    </div>
                  </ChartCard>
                </div>
              </div>
            )}

            {activeFeature === "calculators" && (
              <div className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-3">
                  <CalculatorCard
                    title="BMI"
                    value={`${bmiValue}`}
                    status={bmiCategory}
                    description="Based on your height and latest weight."
                    tone={bmiCategory === "Normal" ? "success" : "warning"}
                  >
                    <div className="grid gap-3 w-full">
                      <label className="text-sm text-muted-foreground">Height (cm)</label>
                      <Input type="number" value={height} min={100} max={220} onChange={(event) => setHeight(Number(event.target.value))} />
                    </div>
                  </CalculatorCard>
                  <CalculatorCard
                    title="BP Status"
                    value={`${manualSystolic}/${manualDiastolic}`}
                    status={bpStatus}
                    description="Auto-classifies your input values."
                    tone={bpStatus === "Normal" ? "success" : bpStatus === "Elevated" ? "warning" : "danger"}
                  >
                    <div className="grid gap-3 w-full">
                      <label className="text-sm text-muted-foreground">Systolic</label>
                      <Input type="number" value={manualSystolic} min={70} max={250} onChange={(event) => setManualSystolic(Number(event.target.value))} />
                      <label className="text-sm text-muted-foreground">Diastolic</label>
                      <Input type="number" value={manualDiastolic} min={40} max={150} onChange={(event) => setManualDiastolic(Number(event.target.value))} />
                    </div>
                  </CalculatorCard>
                  <CalculatorCard
                    title="Heart Rate"
                    value={`${manualHeartRate} bpm`}
                    status={heartRateStatus}
                    description="Checks your pulse for your age."
                    tone={heartRateStatus === "Normal" ? "success" : "danger"}
                  >
                    <div className="grid gap-3 w-full">
                      <label className="text-sm text-muted-foreground">Age</label>
                      <Input type="number" value={age} min={10} max={100} onChange={(event) => setAge(Number(event.target.value))} />
                      <label className="text-sm text-muted-foreground">Heart rate</label>
                      <Input type="number" value={manualHeartRate} min={30} max={220} onChange={(event) => setManualHeartRate(Number(event.target.value))} />
                    </div>
                  </CalculatorCard>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <BottomNav active={activeFeature} onNavigate={handlePanelToggle} items={patientNavItems} />
    </div>
  );
}

