import { AlertTriangle, AlertCircle, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AlertData {
  id: string;
  patient_id: string;
  patient_name: string;
  type: string;
  title: string;
  message: string;
  time: string;
  resolved: boolean;
}

const typeConfig: Record<string, { icon: typeof AlertTriangle; className: string; dot: string }> = {
  critical: { icon: AlertTriangle, className: "status-critical", dot: "bg-destructive" },
  warning: { icon: AlertCircle, className: "status-warning", dot: "bg-warning" },
  info: { icon: Info, className: "status-info", dot: "bg-info" },
};

interface AlertCardProps {
  alert: AlertData;
  onResolve?: (id: string) => void;
  compact?: boolean;
}

export function AlertCard({ alert, onResolve, compact }: AlertCardProps) {
  const navigate = useNavigate();
  const config = typeConfig[alert.type] || typeConfig.info;

  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3.5 animate-fade-in ${config.className}`}>
      <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${config.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug truncate">{alert.title}</p>
            <p className="text-xs opacity-75 mt-0.5 truncate">{alert.message}</p>
          </div>
          <span className="text-[10px] opacity-50 shrink-0 mt-0.5">{alert.time}</span>
        </div>
        {!compact && (
          <div className="flex items-center gap-2 mt-2.5">
            <Button size="sm" variant="ghost" className="h-7 text-xs px-2.5" onClick={() => navigate(`/patients/${alert.patient_id}`)}>
              View Patient
            </Button>
            {onResolve && (
              <Button size="sm" variant="ghost" className="h-7 text-xs px-2.5" onClick={() => onResolve(alert.id)}>
                <Check className="h-3 w-3 mr-1" /> Resolve
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
