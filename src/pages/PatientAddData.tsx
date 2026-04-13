import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AlertBanner } from "@/components/health/AlertBanner";
import { HealthForm } from "@/components/health/HealthForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadHealthEntries, getLatestHealthEntry, daysSince } from "@/lib/health";

export default function PatientAddData() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const patientId = user?.id ?? "";
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!patientId) return;
    setEntries(loadHealthEntries(patientId));
  }, [patientId]);

  const latestEntry = useMemo(() => getLatestHealthEntry(entries), [entries]);
  const needsReminder = useMemo(() => {
    if (!latestEntry) return true;
    return daysSince(latestEntry.savedAt) >= 3;
  }, [latestEntry]);

  return (
    <DashboardLayout
      title="Add Health Data"
      subtitle="Submit structured vitals without free text."
      activeItem="add-data"
      navItems={[
        { id: "overview", label: "Overview" },
        { id: "add-data", label: "Add Data" },
        { id: "insights", label: "Insights" },
      ]}
      onNavigate={(id) => {
        if (id === "overview") navigate("/patient");
        if (id === "add-data") navigate("/patient/add-data");
        if (id === "insights") navigate("/patient/insights");
      }}
    >
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-5">
          {needsReminder && (
            <AlertBanner
              variant={latestEntry ? "warning" : "danger"}
              title={latestEntry ? "It has been a few days since your last entry" : "No health data saved yet"}
              description={latestEntry ? "Add your latest vitals so the system can keep your charts accurate." : "Start with structured vitals to build your trend history."}
            />
          )}

          <HealthForm
            patientId={patientId}
            onSaved={(entry) => setEntries((current) => [...current, entry])}
          />
        </div>

        <Card className="rounded-3xl border border-border/50 bg-card shadow-soft">
          <CardHeader className="space-y-3">
            <CardTitle>Quick guidance</CardTitle>
            <p className="text-sm text-muted-foreground">
              Use controlled input fields only. This keeps your data clean for charts and helps doctors trust the numbers.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-border/70 bg-secondary/70 p-4">
              <p className="text-sm font-semibold text-foreground">How this works</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your latest vitals once per day. The app validates values so only realistic readings are saved.
              </p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-secondary/70 p-4">
              <p className="text-sm font-semibold text-foreground">Latest saved values</p>
              {latestEntry ? (
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p>Systolic: {latestEntry.systolic} mmHg</p>
                  <p>Diastolic: {latestEntry.diastolic} mmHg</p>
                  <p>Heart rate: {latestEntry.heartRate} bpm</p>
                  <p>Weight: {latestEntry.weight} kg</p>
                  <p>Saved: {new Date(latestEntry.savedAt).toLocaleDateString()}</p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No saved entry yet.</p>
              )}
            </div>
            <Button variant="secondary" onClick={() => navigate("/patient/insights")}>View latest insights</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
