import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", patients: 180 }, { month: "Feb", patients: 210 },
  { month: "Mar", patients: 245 }, { month: "Apr", patients: 198 },
];

const riskData = [
  { name: "High Risk", value: 89, color: "hsl(0 72% 55%)" },
  { name: "Medium Risk", value: 340, color: "hsl(30 95% 55%)" },
  { name: "Low Risk", value: 819, color: "hsl(142 60% 45%)" },
];

export default function Reports() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Monthly Visits</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(215 14% 50%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(215 14% 50%)" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="patients" fill="hsl(213 94% 54%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {riskData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
