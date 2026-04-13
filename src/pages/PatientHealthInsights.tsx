import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { AlertBanner } from "@/components/health/AlertBanner";
import { CalculatorCard } from "@/components/health/CalculatorCard";
import { ChartCard } from "@/components/health/ChartCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import {
  buildSampleTrendData,
  classifyBloodPressure,
  classifyHeartRate,
  getBmiCategory,
  getLatestHealthEntry,
  loadHealthEntries,
  daysSince,
} from "@/lib/health";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function PatientHealthInsights() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const patientId = user?.id ?? "";
  const [entries, setEntries] = useState([]);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(32);
  const [manualSystolic, setManualSystolic] = useState(120);
  const [manualDiastolic, setManualDiastolic] = useState(78);
  const [manualHeartRate, setManualHeartRate] = useState(74);

  useEffect(() => {
    if (!patientId) return;
    setEntries(loadHealthEntries(patientId));
  }, [patientId]);

  const latestEntry = useMemo(() => getLatestHealthEntry(entries), [entries]);
  const data = useMemo(() => {
    if (entries.length) {
      return entries.map((entry) => ({
        label: new Date(entry.savedAt).toLocaleDateString("en-US", { weekday: "short" }),
        systolic: entry.systolic,
        diastolic: entry.diastolic,
        weight: entry.weight,
      }));
    }

    return buildSampleTrendData();
  }, [entries]);

  const bpStatus = useMemo(() => classifyBloodPressure(manualSystolic, manualDiastolic), [manualSystolic, manualDiastolic]);
  const heartRateStatus = useMemo(() => classifyHeartRate(age, manualHeartRate), [age, manualHeartRate]);
  const bmiValue = useMemo(() => {
    const weight = latestEntry?.weight ?? 72;
    const meters = height / 100;
    return Number((weight / (meters * meters)).toFixed(1));
  }, [height, latestEntry]);
  const bmiCategory = useMemo(() => getBmiCategory(bmiValue), [bmiValue]);
  const needsReminder = useMemo(() => {
    if (!latestEntry) return true;
    return daysSince(latestEntry.savedAt) >= 3;
  }, [latestEntry]);

  return (
    <DashboardLayout
      title="Health Insights"
      subtitle="Charts, trends and smart calculators for your latest vitals."
      activeItem="insights"
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
      <div className="space-y-5">
        {needsReminder && (
          <AlertBanner
            variant={latestEntry ? "warning" : "danger"}
            title={latestEntry ? "No recent health updates" : "No recorded health data"}
            description={latestEntry ? "Add a new reading soon to keep your insights accurate." : "Your charts can start improving once you save your first entry."}
          />
        )}

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <CalculatorCard
                title="BMI Calculator"
                value={`${bmiValue}`}
                status={bmiCategory}
                description="Based on your latest weight and entered height."
                tone={bmiCategory === "Normal" ? "success" : "warning"}
              >
                <div className="grid gap-3 w-full">
                  <label className="text-sm text-muted-foreground">Height (cm)</label>
                  <Input type="number" value={height} min={100} max={220} onChange={(event) => setHeight(Number(event.target.value))} />
                </div>
              </CalculatorCard>
              <CalculatorCard
                title="Blood Pressure Status"
                value={`${manualSystolic}/${manualDiastolic}`}
                status={bpStatus}
                description="Enter systolic and diastolic values for automatic classification."
                tone={bpStatus === "Normal" ? "success" : bpStatus === "Elevated" ? "warning" : "danger"}
              >
                <div className="grid gap-3 w-full">
                  <label className="text-sm text-muted-foreground">Systolic</label>
                  <Input type="number" value={manualSystolic} min={70} max={250} onChange={(event) => setManualSystolic(Number(event.target.value))} />
                  <label className="text-sm text-muted-foreground">Diastolic</label>
                  <Input type="number" value={manualDiastolic} min={40} max={150} onChange={(event) => setManualDiastolic(Number(event.target.value))} />
                </div>
              </CalculatorCard>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <CalculatorCard
                title="Heart Rate Checker"
                value={`${manualHeartRate} bpm`}
                status={heartRateStatus}
                description="Age and heart rate determine if your current reading is within range."
                tone={heartRateStatus === "Normal" ? "success" : "danger"}
              >
                <div className="grid gap-3 w-full">
                  <label className="text-sm text-muted-foreground">Age</label>
                  <Input type="number" value={age} min={12} max={100} onChange={(event) => setAge(Number(event.target.value))} />
                  <label className="text-sm text-muted-foreground">Heart rate</label>
                  <Input type="number" value={manualHeartRate} min={30} max={220} onChange={(event) => setManualHeartRate(Number(event.target.value))} />
                </div>
              </CalculatorCard>
            </div>

            <div className="grid gap-5">
              <ChartCard title="Blood Pressure Trend" description="Recent systolic and diastolic readings over time.">
                <ChartContainer
                  config={{ systolic: { label: "Systolic" }, diastolic: { label: "Diastolic" } }}
                  className="h-64"
                >
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="label" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Line type="monotone" dataKey="systolic" stroke="#2563eb" strokeWidth={2} dot />
                    <Line type="monotone" dataKey="diastolic" stroke="#f59e0b" strokeWidth={2} dot />
                  </LineChart>
                </ChartContainer>
              </ChartCard>

              <ChartCard title="Weight Trend" description="Weekly weight trend to monitor changes.">
                <ChartContainer config={{ weight: { label: "Weight" } }} className="h-64">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    <XAxis dataKey="label" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="weight" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </ChartCard>
            </div>
          </div>

          <div className="space-y-5">
            <Card className="rounded-3xl border border-border/50 bg-card shadow-soft">
              <CardHeader>
                <CardTitle>Latest snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {latestEntry ? (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      Latest BP: <span className="font-semibold text-foreground">{latestEntry.systolic}/{latestEntry.diastolic}</span>
                    </p>
                    <p>
                      Heart Rate: <span className="font-semibold text-foreground">{latestEntry.heartRate} bpm</span>
                    </p>
                    <p>
                      Weight: <span className="font-semibold text-foreground">{latestEntry.weight} kg</span>
                    </p>
                    <p>
                      Updated: <span className="font-semibold text-foreground">{new Date(latestEntry.savedAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Your latest health data will appear here after you save it from the Add Data page.</p>
                )}
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-border/50 bg-card shadow-soft">
              <CardHeader>
                <CardTitle>Insight summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground">
                <p>Your health dashboard includes smart calculators and trend charts. Use the data page to keep values fresh.</p>
                <p>Try saving updated vitals if your BP is elevated or your heart rate is abnormal.</p>
                <Button variant="secondary" onClick={() => navigate("/patient/add-data")}>Add new vitals</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
