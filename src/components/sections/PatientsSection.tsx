import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { usePatients } from "@/hooks/use-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const riskColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-success/10 text-success border-success/20",
};

interface PatientsSectionProps {
  onSelectPatient: (id: string) => void;
}

export function PatientsSection({ onSelectPatient }: PatientsSectionProps) {
  const { data: patients = [], isLoading } = usePatients();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "High Risk", "Chronic"];

  const filtered = patients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeFilter === "High Risk") return p.risk_level === "high";
    if (activeFilter === "Chronic")
      return ["Diabetes", "Hypertension", "Heart", "Kidney"].some((c) =>
        p.condition.includes(c)
      );
    return true;
  });

  return (
    <section className="px-5 py-4">
      <h2 className="text-lg font-bold text-foreground scroll-fade-in">Patients</h2>

      <div className="relative mt-3 scroll-fade-in">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 rounded-xl bg-card border-border/50 text-sm"
        />
      </div>

      <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar scroll-slide-left">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all press-zoom ${
              activeFilter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shrink-0 w-56 h-28 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar pb-2">
          {filtered.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onSelectPatient(p.id)}
              className="shrink-0 w-60 rounded-2xl border border-border/50 bg-card p-4 text-left press-zoom scroll-scale-in hover:shadow-lg transition-shadow"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{p.condition}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className={`text-[10px] ${riskColor[p.risk_level] || ""}`}>
                  {p.risk_level}
                </Badge>
                <span className="text-[10px] text-muted-foreground">BP: {p.bp || "—"}</span>
                <span className="text-[10px] text-muted-foreground">Sugar: {p.sugar ?? "—"}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No patients found</p>
      )}
    </section>
  );
}
