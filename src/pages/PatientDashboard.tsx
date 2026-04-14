import { useMemo, useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { type DbAlert, type DbMedicalHistory, usePatientByUserId, useAlerts, useMedicalHistory, useHealthEntries } from "@/hooks/use-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { AlertBanner } from "@/components/health/AlertBanner";
import { CalculatorCard } from "@/components/health/CalculatorCard";
import { ChartCard } from "@/components/health/ChartCard";
import { HealthForm } from "@/components/health/HealthForm";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HeartPulse, Users, Bell, LogOut, LayoutDashboard, Calculator, BarChart, Activity, ArrowRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart as RechartsBarChart, Bar } from "recharts";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
  classifyBloodPressure,
  classifyHeartRate,
  getBmiCategory,
} from "@/lib/health";

const riskColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

type PatientFeature = "summary" | "add-data" | "insights" | "calculators";

export default function PatientDashboard() {
  const { profile, user, signOut } = useAuth();
  const userId = user?.id ?? "";
  const { data: patient, isLoading: patientLoading } = usePatientByUserId(userId);
  const patientId = patient?.id ?? "";
  const { data: history = [] } = useMedicalHistory(patientId);
  const { data: alertsData = [] } = useAlerts();
  const { data: healthEntries = [] } = useHealthEntries(patientId);
  const [activeFeature, setActiveFeature] = useState<PatientFeature>("add-data");
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(32);
  const [manualSystolic, setManualSystolic] = useState(120);
  const [manualDiastolic, setManualDiastolic] = useState(78);
  const [manualHeartRate, setManualHeartRate] = useState(74);
  const [showOverlay, setShowOverlay] = useState(false);
  const observe = useScrollAnimation();
  const mainRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Observe scroll animations
  useEffect(() => {
    observe(mainRef.current);
  }, [observe]);

  useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => observe(overlayRef.current), 50);
      return () => clearTimeout(timer);
    }
  }, [showOverlay, observe]);

  const latestEntry = useMemo(() => {
    if (!healthEntries.length) return null;
    return healthEntries[0];
  }, [healthEntries]);

  useMemo(() => {
    if (!latestEntry) return;
    setManualSystolic(latestEntry.systolic);
    setManualDiastolic(latestEntry.diastolic);
    setManualHeartRate(latestEntry.heart_rate);
  }, [latestEntry]);

  const patientAlerts = alertsData.filter((a: DbAlert) => a.patient_id === patientId && !a.resolved);
  const highRisk = patient?.risk_level === "high" ? 1 : 0;

  const insightData = useMemo(() => {
    if (!healthEntries.length) return [];
    return [...healthEntries].reverse().map((entry) => ({
      label: new Date(entry.created_at).toLocaleDateString("sw", { weekday: "short" }),
      systolic: entry.systolic,
      diastolic: entry.diastolic,
      weight: entry.weight,
    }));
  }, [healthEntries]);

  const bmiValue = useMemo(() => {
    const weight = latestEntry?.weight ?? 72;
    const meters = height / 100;
    return Number((weight / (meters * meters)).toFixed(1));
  }, [height, latestEntry]);

  const bmiCategory = useMemo(() => getBmiCategory(bmiValue), [bmiValue]);
  const bpStatus = useMemo(() => classifyBloodPressure(manualSystolic, manualDiastolic), [manualSystolic, manualDiastolic]);
  const heartRateStatus = useMemo(() => classifyHeartRate(age, manualHeartRate), [age, manualHeartRate]);

  const hasAbnormalVitals = latestEntry
    ? classifyBloodPressure(latestEntry.systolic, latestEntry.diastolic) !== "Normal" || classifyHeartRate(age, latestEntry.heart_rate) !== "Normal"
    : false;

  const patientNavItems = [
    { id: "summary", icon: LayoutDashboard, label: "Home" },
    { id: "add-data", icon: Calculator, label: "Add Data" },
    { id: "insights", icon: BarChart, label: "Insights" },
    { id: "calculators", icon: Activity, label: "Tools" },
  ];

  const handlePanelToggle = (panel: PatientFeature) => {
    setActiveFeature(panel);
    setShowOverlay(true);
  };

  const summaryCards = [
    { label: "Rekodi", value: healthEntries.length, icon: Users, color: "text-primary" },
    { label: "High Risk", value: highRisk, icon: Bell, color: "text-destructive" },
    { label: "Alerts", value: patientAlerts.length, icon: Bell, color: "text-warning" },
  ];

  if (patientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center pb-32">
        <div className="max-w-md space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl" />
              <HeartPulse className="h-16 w-16 text-primary relative" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Karibu kwenye MedFlow!</h2>
            <p className="text-sm text-muted-foreground">Hii ni dashboard yako ya afya. Anza kwa kuongeza vipimo vyako vya afya.</p>
          </div>
          
          <div className="bg-card border border-border/50 rounded-2xl p-4 text-left space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Ongeza vipimo</p>
                <p className="text-xs text-muted-foreground">Blood pressure, heart rate, na uzani</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Tazama trends</p>
                <p className="text-xs text-muted-foreground">Kuzama hali yako ya afya kwa muda</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Pata insights</p>
                <p className="text-xs text-muted-foreground">Ujumbe kuhusu hali yako ya afya</p>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full h-11 rounded-xl" 
            onClick={() => window.location.reload()}
          >
            Anza Kuongeza Vipimo
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-11 rounded-xl" 
            onClick={signOut}
          >
            Toka
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Main scrollable dashboard - always rendered */}
      <div ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar pb-24 safe-area-bottom">
        
        {/* Header with glassmorphism and animations */}
        <div className="relative overflow-hidden bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-md border-b border-white/20 px-5 pt-8 pb-3">
          <div className="pointer-events-none absolute inset-0 bg-fixed bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_20%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_25%)] opacity-90" />
          <div className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl animate-float-slow" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <HeartPulse className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Karibu, Mgonjwa</p>
                  <h1 className="text-lg font-bold text-foreground">{profile?.full_name || patient.name}</h1>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={signOut} className="hover-lift">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main content with animations */}
        <div className="px-5 pt-5 pb-5 animate-fade-in space-y-6">
          {healthEntries.length === 0 && (
            <AlertBanner variant="warning" title="Hakuna data ya afya bado" description="Anza kwa kuongeza vipimo vyako vya afya." />
          )}

          {hasAbnormalVitals && latestEntry && (
            <AlertBanner
              variant="danger"
              title="Vipimo visivyo vya kawaida"
              description={`BP: ${latestEntry.systolic}/${latestEntry.diastolic}, Mapigo: ${latestEntry.heart_rate} bpm`}
            />
          )}

          {/* Summary Cards with blue border styling */}
          <div className="grid grid-cols-3 gap-3 scroll-fade-in">
            {summaryCards.map((s, idx) => (
              <div key={s.label} className="scroll-scale-in bg-card/80 frosted-glass rounded-2xl border border-primary/30 backdrop-blur-md p-3 text-center transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-card hover:shadow-elevated hover:border-primary/60 press-zoom" style={{ animationDelay: `${idx * 100}ms` }}>
                <s.icon className={`h-5 w-5 mx-auto ${s.color}`} />
                <p className="text-xl font-bold mt-1">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons with blue border styling */}
          <div className="grid gap-4 sm:grid-cols-2">
            <button type="button" onClick={() => handlePanelToggle("add-data")}
              className="scroll-fade-in rounded-3xl frosted-glass border border-primary/30 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-md p-4 text-left transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-elevated hover:border-primary/60 hover:from-card/80 hover:to-card/50 press-zoom">
              <p className="text-sm font-semibold text-foreground">Ongeza Data ya Afya</p>
              <p className="mt-1 text-xs text-muted-foreground">Ingiza vipimo vipya vya afya.</p>
            </button>
            <button type="button" onClick={() => handlePanelToggle("insights")}
              className="scroll-fade-in rounded-3xl frosted-glass border border-primary/30 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-md p-4 text-left transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-elevated hover:border-primary/60 hover:from-card/80 hover:to-card/50 press-zoom" style={{ animationDelay: "100ms" }}>
              <p className="text-sm font-semibold text-foreground">Mwenendo wa Afya</p>
              <p className="mt-1 text-xs text-muted-foreground">Angalia charts na trends.</p>
            </button>
            <button type="button" onClick={() => handlePanelToggle("calculators")}
              className="scroll-fade-in rounded-3xl frosted-glass border border-primary/30 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-md p-4 text-left transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-elevated hover:border-primary/60 hover:from-card/80 hover:to-card/50 press-zoom" style={{ animationDelay: "200ms" }}>
              <p className="text-sm font-semibold text-foreground">Vipimo</p>
              <p className="mt-1 text-xs text-muted-foreground">BMI, BP status na zaidi.</p>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay section - Modern glassmorphism design matching Index dashboard */}
      {showOverlay && (
        <div className="fixed inset-0 z-40 flex flex-col animate-fade-in">
          {/* Backdrop with glassmorphism */}
          <div
            className="absolute inset-0 backdrop-blur-lg bg-foreground/40 transition-opacity duration-300 animate-fade-in"
            onClick={() => setShowOverlay(false)}
          />

          {/* Overlay panel with modern styling */}
          <div className="relative mt-12 flex-1 bg-gradient-soft rounded-t-3xl overflow-hidden animate-slide-in-bottom flex flex-col shadow-elevated border-t border-white/20">
            {/* Header with glassmorphism */}
            <div className="sticky top-0 z-10 frosted-glass border-b border-white/20 backdrop-blur-md">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mt-3 transition-colors" />
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-lg font-bold text-foreground">
                  {activeFeature === "add-data" ? "Ongeza Data ya Afya" : activeFeature === "insights" ? "Mwenendo wa Afya" : "Vipimo"}
                </h2>
                <button
                  onClick={() => setShowOverlay(false)}
                  className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center press-zoom hover-lift transition-all backdrop-blur-sm border border-white/20"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Overlay content */}
            <div ref={overlayRef} className="flex-1 overflow-y-auto no-scrollbar pb-safe px-5">
              {activeFeature === "add-data" && (
                <div className="py-4">
                  <HealthForm patientId={patientId} userId={userId} onSaved={() => setShowOverlay(false)} />
                </div>
              )}

              {activeFeature === "insights" && (
                <div className="space-y-5 py-4">
                  {insightData.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      <BarChart className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      Hakuna data ya kutosha kwa charts. Ongeza vipimo kwanza.
                    </div>
                  ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                      <ChartCard title="Shinikizo la Damu" description="Systolic na Diastolic kwa muda.">
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
                      <ChartCard title="Uzito" description="Mabadiliko ya uzito kwa muda.">
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
                  )}
                </div>
              )}

              {activeFeature === "calculators" && (
                <div className="space-y-5 py-4">
                  <div className="grid gap-5 lg:grid-cols-3">
                    <CalculatorCard title="BMI" value={`${bmiValue}`} status={bmiCategory}
                      description="Kulingana na urefu na uzito wako." tone={bmiCategory === "Normal" ? "success" : "warning"}>
                      <div className="grid gap-3 w-full">
                        <label className="text-sm text-muted-foreground">Urefu (cm)</label>
                        <Input type="number" value={height} min={100} max={220} onChange={(e) => setHeight(Number(e.target.value))} />
                      </div>
                    </CalculatorCard>
                    <CalculatorCard title="BP Status" value={`${manualSystolic}/${manualDiastolic}`} status={bpStatus}
                      description="Hali ya shinikizo la damu." tone={bpStatus === "Normal" ? "success" : bpStatus === "Elevated" ? "warning" : "danger"}>
                      <div className="grid gap-3 w-full">
                        <label className="text-sm text-muted-foreground">Systolic</label>
                        <Input type="number" value={manualSystolic} min={70} max={250} onChange={(e) => setManualSystolic(Number(e.target.value))} />
                        <label className="text-sm text-muted-foreground">Diastolic</label>
                        <Input type="number" value={manualDiastolic} min={40} max={150} onChange={(e) => setManualDiastolic(Number(e.target.value))} />
                      </div>
                    </CalculatorCard>
                    <CalculatorCard title="Mapigo" value={`${manualHeartRate} bpm`} status={heartRateStatus}
                      description="Hali ya mapigo ya moyo." tone={heartRateStatus === "Normal" ? "success" : "danger"}>
                      <div className="grid gap-3 w-full">
                        <label className="text-sm text-muted-foreground">Umri</label>
                        <Input type="number" value={age} min={10} max={100} onChange={(e) => setAge(Number(e.target.value))} />
                        <label className="text-sm text-muted-foreground">Mapigo</label>
                        <Input type="number" value={manualHeartRate} min={30} max={220} onChange={(e) => setManualHeartRate(Number(e.target.value))} />
                      </div>
                    </CalculatorCard>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav active={activeFeature} onNavigate={(f) => {
        if (f !== "summary") handlePanelToggle(f as PatientFeature);
        else setShowOverlay(false);
      }} items={patientNavItems} />
    </div>
  );
}
