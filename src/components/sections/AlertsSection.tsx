import { AlertTriangle, AlertCircle, Info, Check, ChevronRight } from "lucide-react";
import { useAlerts, useResolveAlert } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";

const typeConfig: Record<string, { icon: typeof AlertTriangle; bg: string; dot: string }> = {
  critical: { icon: AlertTriangle, bg: "bg-destructive/8 border-destructive/15", dot: "bg-destructive" },
  warning: { icon: AlertCircle, bg: "bg-warning/8 border-warning/15", dot: "bg-warning" },
  info: { icon: Info, bg: "bg-info/8 border-info/15", dot: "bg-info" },
};

interface AlertsSectionProps {
  onViewPatient: (id: string) => void;
  limit?: number;
}

export function AlertsSection({ onViewPatient, limit }: AlertsSectionProps) {
  const { data: allAlerts = [] } = useAlerts();
  const resolveAlert = useResolveAlert();

  const active = allAlerts.filter((a) => !a.resolved);
  const shown = limit ? active.slice(0, limit) : active;

  if (active.length === 0) {
    return (
      <section className="px-5 py-4">
        <h2 className="text-lg font-bold text-foreground scroll-fade-in">Alerts</h2>
        <div className="mt-4 rounded-2xl border bg-card p-8 text-center scroll-scale-in">
          <div className="h-12 w-12 mx-auto mb-3 rounded-full bg-success/10 flex items-center justify-center">
            <Check className="h-5 w-5 text-success" />
          </div>
          <p className="text-sm font-semibold text-foreground">Everything looks good today ✨</p>
          <p className="text-xs text-muted-foreground mt-1">No active alerts</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-4">
      <div className="flex items-center justify-between scroll-fade-in">
        <h2 className="text-lg font-bold text-foreground">Alerts</h2>
        <span className="text-xs text-muted-foreground">{active.length} active</span>
      </div>

      <div className="space-y-2.5 mt-4">
        {shown.map((a, i) => {
          const config = typeConfig[a.type] || typeConfig.info;
          return (
            <div
              key={a.id}
              className={`rounded-2xl border p-3.5 scroll-slide-left press-zoom ${config.bg}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${config.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-snug">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{a.message}</p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs px-2.5 rounded-lg"
                      onClick={() => onViewPatient(a.patient_id)}
                    >
                      View <ChevronRight className="h-3 w-3 ml-0.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs px-2.5 rounded-lg"
                      onClick={() => resolveAlert.mutate(a.id)}
                    >
                      <Check className="h-3 w-3 mr-1" /> Resolve
                    </Button>
                    <span className="text-[10px] text-muted-foreground/60 ml-auto">{a.time}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
