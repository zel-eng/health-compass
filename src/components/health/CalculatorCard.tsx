import { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CalculatorCardProps {
  title: string;
  value: string;
  status: string;
  description: string;
  tone?: "success" | "warning" | "danger" | "default";
  children?: React.ReactNode;
}

const toneClasses: Record<string, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  default: "bg-muted/10 text-muted-foreground border-border",
};

export function CalculatorCard({ title, value, status, description, tone = "default", children }: CalculatorCardProps) {
  return (
    <Card className="rounded-3xl border border-border/60 bg-card shadow-soft transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-floating">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge className={cn("rounded-full px-2 py-1 text-[11px] font-semibold", toneClasses[tone])}>{status}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-3xl font-semibold text-foreground">{value}</p>
      </CardContent>
      {children ? <CardFooter className="gap-3 flex-wrap">{children}</CardFooter> : null}
    </Card>
  );
}
