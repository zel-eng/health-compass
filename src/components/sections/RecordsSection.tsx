import { useState } from "react";
import { usePatients, useAllVitals } from "@/hooks/use-data";

const tabs = ["Vitals", "Medicines", "Notes"] as const;

export function RecordsSection() {
  const [tab, setTab] = useState<typeof tabs[number]>("Vitals");
  const { data: patients = [] } = usePatients();
  const { data: allVitals = [] } = useAllVitals();

  return (
    <section className="px-5 py-4">
      <h2 className="text-lg font-bold text-foreground scroll-fade-in">Health Records</h2>

      <div className="flex gap-2 mt-3 scroll-slide-left">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all press-zoom ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {tab === "Vitals" && (
          <>
            {allVitals.slice(0, 8).map((v: any, i: number) => (
              <div
                key={v.id || i}
                className="rounded-2xl border bg-card p-3.5 scroll-fade-in press-zoom"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{v.patients?.name ?? "—"}</p>
                  <span className="text-[10px] text-muted-foreground">{v.recorded_date}</span>
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="text-xs">
                    BP: <span className={v.systolic > 140 ? "text-destructive font-semibold" : "text-foreground font-medium"}>
                      {v.systolic}/{v.diastolic}
                    </span>
                  </span>
                  <span className="text-xs">
                    Sugar: <span className={v.sugar > 200 ? "text-warning font-semibold" : "text-foreground font-medium"}>
                      {v.sugar}
                    </span>
                  </span>
                  <span className="text-xs">
                    Adherence: <span className={v.adherence < 70 ? "text-destructive font-semibold" : "text-foreground font-medium"}>
                      {v.adherence}%
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "Medicines" && patients.map((p, i) => (
          <div
            key={p.id}
            className="rounded-2xl border bg-card p-3.5 scroll-fade-in press-zoom"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <p className="text-sm font-semibold text-foreground">{p.name}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(p.medicines ?? []).map((m, j) => (
                <span key={j} className="text-[11px] bg-primary/8 text-primary rounded-lg px-2.5 py-1 font-medium">{m}</span>
              ))}
            </div>
          </div>
        ))}

        {tab === "Notes" && patients.map((p, i) => (
          <div
            key={p.id}
            className="rounded-2xl border bg-card p-3.5 scroll-fade-in press-zoom"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{p.name}</p>
              <span className="text-[10px] text-muted-foreground">{p.last_visit}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{p.notes || "No notes"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
