import { usePatients, usePatientVitals } from "@/hooks/use-data";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts";

export function TrendsSection() {
  const { data: patients = [] } = usePatients();
  const firstHighRisk = patients.find((p) => p.risk_level === "high");
  const { data: vitals = [] } = usePatientVitals(firstHighRisk?.id);

  if (vitals.length === 0) return null;

  return (
    <section className="px-5 py-4">
      <h2 className="text-lg font-bold text-foreground scroll-fade-in">Health Trends</h2>
      {firstHighRisk && (
        <p className="text-xs text-muted-foreground mt-1 scroll-fade-in">
          Showing trends for {firstHighRisk.name}
        </p>
      )}

      <div className="space-y-4 mt-4">
        <div className="rounded-2xl border bg-card p-4 scroll-scale-in">
          <p className="text-xs font-semibold text-muted-foreground mb-3">Blood Pressure</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={vitals}>
              <XAxis dataKey="recorded_date" tick={{ fontSize: 9 }} stroke="hsl(215 14% 80%)" />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(215 14% 80%)" domain={[100, 180]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              <Line type="monotone" dataKey="systolic" stroke="hsl(0 72% 55%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(0 72% 55%)" }} />
              <Line type="monotone" dataKey="diastolic" stroke="hsl(213 94% 54%)" strokeWidth={2} dot={{ r: 2.5, fill: "hsl(213 94% 54%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-4 scroll-scale-in" style={{ transitionDelay: "100ms" }}>
          <p className="text-xs font-semibold text-muted-foreground mb-3">Sugar Level</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={vitals}>
              <XAxis dataKey="recorded_date" tick={{ fontSize: 9 }} stroke="hsl(215 14% 80%)" />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(215 14% 80%)" domain={[60, 280]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              <Line type="monotone" dataKey="sugar" stroke="hsl(30 95% 55%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(30 95% 55%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border bg-card p-4 scroll-scale-in" style={{ transitionDelay: "200ms" }}>
          <p className="text-xs font-semibold text-muted-foreground mb-3">Medication Adherence</p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={vitals}>
              <XAxis dataKey="recorded_date" tick={{ fontSize: 9 }} stroke="hsl(215 14% 80%)" />
              <YAxis tick={{ fontSize: 9 }} stroke="hsl(215 14% 80%)" domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="adherence" fill="hsl(213 94% 54%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
