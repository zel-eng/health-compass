import { useState } from "react";
import { Search } from "lucide-react";
import { usePatients } from "@/hooks/use-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const riskBadge: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

const filters = ["All", "High Risk", "Recent Visit", "Chronic Disease"] as const;

export default function Patients() {
  const { data: patients = [], isLoading } = usePatients();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<typeof filters[number]>("All");
  const navigate = useNavigate();

  const filtered = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "High Risk") return p.risk_level === "high";
    if (filter === "Chronic Disease") return p.condition.includes("Diabetes") || p.condition.includes("Hypertension") || p.condition.includes("Heart") || p.condition.includes("Kidney");
    if (filter === "Recent Visit") return (p.last_visit ?? "") >= "2026-04-07";
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Patients</h1>
        <p className="text-muted-foreground text-sm mt-1">{patients.length} total patients</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-card" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="text-xs h-9">
              {f}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading patients...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(p => (
            <button key={p.id} onClick={() => navigate(`/patients/${p.id}`)} className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:shadow-md transition-all text-left animate-fade-in">
              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                {p.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${riskBadge[p.risk_level] || ""}`}>{p.risk_level}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{p.age}y • {p.gender} • {p.condition}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Last visit: {p.last_visit} • BP: {p.bp}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No patients found</div>
      )}
    </div>
  );
}
