import { useState } from "react";
import { Users, AlertTriangle, CalendarDays, Bell, Search, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AlertCard } from "@/components/AlertCard";
import { patients, alerts as initialAlerts, stats } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const riskBadge = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

export default function Dashboard() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const activeAlerts = alerts.filter(a => !a.resolved);
  const topAlerts = activeAlerts.slice(0, 3);

  const resolveAlert = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const recentPatients = filtered.slice(0, 5);

  // Aggregate chart data
  const chartData = patients[0].vitals;

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Good morning, Dr. Smith</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={stats.totalPatients.toLocaleString()} icon={Users} trend="+12 this month" />
        <StatCard title="High Risk" value={stats.highRisk} icon={AlertTriangle} variant="danger" trend="3 new this week" />
        <StatCard title="Today's Appointments" value={stats.todayAppointments} icon={CalendarDays} variant="info" />
        <StatCard title="Active Alerts" value={activeAlerts.length} icon={Bell} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Recent Patients</h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/patients")}>
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Quick search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm bg-card" />
          </div>
          <div className="space-y-2">
            {recentPatients.map(p => (
              <button key={p.id} onClick={() => navigate(`/patients/${p.id}`)} className="w-full flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors text-left">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                  {p.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.condition}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] shrink-0 ${riskBadge[p.riskLevel]}`}>
                  {p.riskLevel}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Alerts & AI Insights */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Alerts & Insights</h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/alerts")}>
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          {topAlerts.length === 0 ? (
            <div className="flex items-center justify-center rounded-lg border bg-card p-8 text-center">
              <div>
                <div className="h-10 w-10 mx-auto mb-3 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success text-lg">✓</span>
                </div>
                <p className="text-sm font-medium text-foreground">Everything looks good today</p>
                <p className="text-xs text-muted-foreground mt-1">No active alerts</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {topAlerts.map(a => (
                <AlertCard key={a.id} alert={a} onResolve={resolveAlert} compact />
              ))}
            </div>
          )}
        </div>

        {/* Health Trends */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-base font-semibold text-foreground">Health Trends</h2>
          <div className="rounded-lg border bg-card p-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-2">Blood Pressure (Systolic)</p>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(215 14% 50%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 14% 50%)" domain={[110, 170]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="systolic" stroke="hsl(0 72% 55%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-2">Sugar Level</p>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(215 14% 50%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 14% 50%)" domain={[80, 260]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="sugar" stroke="hsl(30 95% 55%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-lg border bg-card p-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground mb-2">Medication Adherence %</p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(215 14% 50%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(215 14% 50%)" domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="adherence" fill="hsl(213 94% 54%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
