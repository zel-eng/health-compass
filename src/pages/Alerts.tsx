import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAlerts, useResolveAlert } from "@/hooks/use-data";
import { AlertCard } from "@/components/AlertCard";

export default function Alerts() {
  const { data: allAlerts = [] } = useAlerts();
  const resolveAlert = useResolveAlert();
  const [tab, setTab] = useState("critical");

  const active = allAlerts.filter(a => !a.resolved);
  const critical = active.filter(a => a.type === "critical");
  const warnings = active.filter(a => a.type === "warning");
  const reminders = active.filter(a => a.type === "info");

  const renderList = (items: typeof active) => items.length === 0 ? (
    <div className="rounded-xl border bg-card p-8 text-center">
      <div className="h-10 w-10 mx-auto mb-3 rounded-full bg-success/10 flex items-center justify-center">
        <span className="text-success text-lg">✓</span>
      </div>
      <p className="text-sm font-medium text-foreground">Everything looks good today</p>
      <p className="text-xs text-muted-foreground mt-1">No active items</p>
    </div>
  ) : (
    <div className="space-y-3">
      {items.map(a => <AlertCard key={a.id} alert={a} onResolve={(id) => resolveAlert.mutate(id)} />)}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Alerts & Reminders</h1>
        <p className="text-muted-foreground text-sm mt-1">{active.length} active alerts</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="critical" className="gap-1.5">Critical <span className="text-[10px] bg-destructive/10 text-destructive rounded-full px-1.5">{critical.length}</span></TabsTrigger>
          <TabsTrigger value="warning" className="gap-1.5">Warning <span className="text-[10px] bg-warning/10 text-warning rounded-full px-1.5">{warnings.length}</span></TabsTrigger>
          <TabsTrigger value="reminder" className="gap-1.5">Reminder <span className="text-[10px] bg-info/10 text-info rounded-full px-1.5">{reminders.length}</span></TabsTrigger>
        </TabsList>
        <TabsContent value="critical" className="mt-4">{renderList(critical)}</TabsContent>
        <TabsContent value="warning" className="mt-4">{renderList(warnings)}</TabsContent>
        <TabsContent value="reminder" className="mt-4">{renderList(reminders)}</TabsContent>
      </Tabs>
    </div>
  );
}
