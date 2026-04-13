import { useState, useRef, useCallback, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { PatientsSection } from "@/components/sections/PatientsSection";
import { AlertsSection } from "@/components/sections/AlertsSection";
import { TrendsSection } from "@/components/sections/TrendsSection";
import { RecordsSection } from "@/components/sections/RecordsSection";
import { SettingsSection } from "@/components/sections/SettingsSection";
import { PatientSheet } from "@/components/PatientSheet";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { X } from "lucide-react";

type OverlaySection = "patients" | "records" | "alerts" | "settings" | null;

const overlayTitles: Record<string, string> = {
  patients: "Patients",
  records: "Health Records",
  alerts: "Alerts & Reminders",
  settings: "Settings",
};

export default function Index() {
  const [overlay, setOverlay] = useState<OverlaySection>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const observe = useScrollAnimation();
  const mainRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Observe scroll animations on main content
  useEffect(() => {
    observe(mainRef.current);
  }, [observe]);

  // Observe scroll animations when overlay opens
  useEffect(() => {
    if (overlay) {
      // Small delay to let the DOM render
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

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Main scrollable dashboard - always rendered */}
      <div ref={mainRef} className="flex-1 overflow-y-auto no-scrollbar pb-24 safe-area-bottom">
        <HeroSection />
        <PatientsSection onSelectPatient={handleSelectPatient} />
        <AlertsSection onViewPatient={handleSelectPatient} limit={3} />
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
