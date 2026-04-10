import { useState, useRef, useCallback } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { PatientsSection } from "@/components/sections/PatientsSection";
import { AlertsSection } from "@/components/sections/AlertsSection";
import { TrendsSection } from "@/components/sections/TrendsSection";
import { RecordsSection } from "@/components/sections/RecordsSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { PatientSheet } from "@/components/PatientSheet";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

type ActiveSection = "dashboard" | "patients" | "records" | "alerts" | "settings";

export default function Index() {
  const [activeNav, setActiveNav] = useState<ActiveSection>("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const scrollRef = useScrollAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback((section: string) => {
    setActiveNav(section as ActiveSection);
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectPatient = useCallback((id: string) => {
    setSelectedPatientId(id);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar pb-safe">
        <div ref={scrollRef}>
          {activeNav === "dashboard" && (
            <>
              <HeroSection />
              <PatientsSection onSelectPatient={handleSelectPatient} />
              <AlertsSection onViewPatient={handleSelectPatient} limit={3} />
              <TrendsSection />
            </>
          )}

          {activeNav === "patients" && (
            <div className="pt-6">
              <PatientsSection onSelectPatient={handleSelectPatient} />
            </div>
          )}

          {activeNav === "records" && (
            <div className="pt-6">
              <RecordsSection />
            </div>
          )}

          {activeNav === "alerts" && (
            <div className="pt-6">
              <AlertsSection onViewPatient={handleSelectPatient} />
            </div>
          )}

          {activeNav === "settings" && (
            <div className="pt-6">
              <SettingsSection />
            </div>
          )}
        </div>
      </div>

      <BottomNav active={activeNav} onNavigate={handleNavigate} />

      {selectedPatientId && (
        <PatientSheet
          patientId={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
}
