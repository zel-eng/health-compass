import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { PatientsSection } from "@/components/sections/PatientsSection";
import { AlertsSection } from "@/components/sections/AlertsSection";
import { TrendsSection } from "@/components/sections/TrendsSection";
import { RecordsSection } from "@/components/sections/RecordsSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { PatientSheet } from "@/components/PatientSheet";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useAuth } from "@/hooks/use-auth";
import { usePatients, useAlerts } from "@/hooks/use-data";
import { X, Stethoscope, Shield, Search, ChevronRight, Activity, LogOut } from "lucide-react";

type OverlaySection = "patients" | "records" | "alerts" | "settings" | null;

const overlayTitles: Record<string, string> = {
  patients: "Patients",
  records: "Health Records",
  alerts: "Alerts & Reminders",
  settings: "Settings",
};

const riskColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

export default function Index() {
  const { profile, roles, signOut } = useAuth();
  const { data: patients = [] } = usePatients();
  const { data: alerts = [] } = useAlerts();
  
  const [overlay, setOverlay] = useState<OverlaySection>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const observe = useScrollAnimation();
  const mainRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isDoctor = roles.includes("doctor");
  const isAdmin = roles.includes("admin");

  // Observe scroll animations on main content
  useEffect(() => {
    observe(mainRef.current);
  }, [observe]);

  // Observe scroll animations when overlay opens
  useEffect(() => {
    if (overlay) {
      const timer = setTimeout(() => observe(overlayRef.current), 50);
      return () => clearTimeout(timer);
    }
  }, [overlay, observe]);

  const handleNavigate = useCallback((section: string) => {
    if (section === "dashboard") {
      setOverlay(null);
    } else {
      setOverlay(section as OverlaySection);
    }
  }, []);

  const handleSelectPatient = useCallback((id: string) => {
    setSelectedPatientId(id);
  }, []);

  // Calculate top conditions for admin/doctor view
  const topConditions = useMemo(() => {
    const conditions = patients.reduce((acc, p) => {
      acc[p.condition] = (acc[p.condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(conditions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [patients]);

  const activeAlerts = useMemo(() => alerts.filter(a => !a.resolved), [alerts]);
  const highRisk = useMemo(() => patients.filter(p => p.risk_level === "high"), [patients]);
  
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Main scrollable dashboard - always rendered */}
      <div ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar pb-24 safe-area-bottom">
        
        {/* Header for Doctor/Admin */}
        {(isDoctor || isAdmin) && (
          <div className="bg-card border-b border-border px-5 pt-8 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {isAdmin ? <Shield className="h-5 w-5 text-primary" /> : <Stethoscope className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{isAdmin ? "Admin Panel" : "Karibu, Daktari"}</p>
                  <h1 className="text-lg font-bold text-foreground">{profile?.full_name || (isAdmin ? "Admin" : "Doctor")}</h1>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Stats for Doctor/Admin */}
            <div className={`grid ${isAdmin ? "grid-cols-4" : "grid-cols-3"} gap-3 mt-4`}>
              {[
                { label: "Wagonjwa", value: patients.length, icon: "👥", color: "text-primary" },
                { label: "High Risk", value: highRisk.length, icon: "⚠️", color: "text-destructive" },
                { label: "Alerts", value: activeAlerts.length, icon: "🔔", color: "text-warning" },
                ...(isAdmin ? [{ label: "Madaktari", value: 0, icon: "👨‍⚕️", color: "text-success" }] : [])
              ].map(s => (
                <div key={s.label} className="bg-card rounded-2xl border border-border/50 p-3 text-center">
                  <p className={`text-lg ${s.color}`}>{s.icon}</p>
                  <p className="text-xl font-bold mt-1">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <HeroSection />
        <PatientsSection onSelectPatient={handleSelectPatient} />
        <AlertsSection onViewPatient={handleSelectPatient} limit={3} />
        
        {/* Active Alerts Section */}
        {activeAlerts.length > 0 && (
          <div className="px-5 py-4">
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

        {/* Top Conditions */}
        {topConditions.length > 0 && (
          <div className="px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4" /> Top Conditions
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
        )}

        {/* Search & Patients List */}
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground mb-2">Wagonjwa</h2>
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
                onClick={() => setSelectedPatientId(p.id)}
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

        <TrendsSection />
      </div>

      {/* Overlay sections - slide up from bottom with modern effects */}
      {overlay && (
        <div className="fixed inset-0 z-40 flex flex-col animate-fade-in">
          {/* Backdrop with glassmorphism */}
          <div
            className="absolute inset-0 backdrop-blur-lg bg-foreground/40 transition-opacity duration-300 animate-fade-in"
            onClick={() => setOverlay(null)}
          />

          {/* Overlay panel with modern styling */}
          <div className="relative mt-12 flex-1 bg-gradient-soft rounded-t-3xl overflow-hidden animate-slide-in-bottom flex flex-col shadow-elevated border-t border-white/20">
            {/* Header with glassmorphism */}
            <div className="sticky top-0 z-10 frosted-glass border-b border-white/20 backdrop-blur-md">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mt-3 transition-colors" />
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-lg font-bold text-foreground">
                  {overlayTitles[overlay] || ""}
                </h2>
                <button
                  onClick={() => setOverlay(null)}
                  className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center press-zoom hover-lift transition-all backdrop-blur-sm border border-white/20"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Overlay content */}
            <div ref={overlayRef} className="flex-1 overflow-y-auto no-scrollbar pb-safe">
              {overlay === "patients" && (
                <PatientsSection onSelectPatient={handleSelectPatient} />
              )}
              {overlay === "records" && <RecordsSection />}
              {overlay === "alerts" && (
                <AlertsSection onViewPatient={handleSelectPatient} />
              )}
              {overlay === "settings" && <SettingsSection />}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav
        active={overlay || "dashboard"}
        onNavigate={handleNavigate}
      />

      {/* Patient Detail Sheet */}
      {selectedPatientId && (
        <PatientSheet
          patientId={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
}
