import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePatients, useAllVitals } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HealthRecords() {
  const [tab, setTab] = useState("vitals");
  const { data: patients = [] } = usePatients();
  const { data: allVitals = [] } = useAllVitals();

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Health Records</h1>
          <p className="text-muted-foreground text-sm mt-1">Vitals, medicines, labs, and notes</p>
        </div>
        <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add Record</Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="mt-4">
          <div className="rounded-xl border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Systolic</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Diastolic</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Sugar</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Adherence</th>
                </tr>
              </thead>
              <tbody>
                {allVitals.slice(0, 12).map((v: any, i: number) => (
                  <tr key={v.id || i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">{v.patients?.name ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">{v.recorded_date}</td>
                    <td className="p-3"><span className={v.systolic > 140 ? "text-destructive font-medium" : "text-foreground"}>{v.systolic}</span></td>
                    <td className="p-3 text-foreground">{v.diastolic}</td>
                    <td className="p-3"><span className={v.sugar > 200 ? "text-warning font-medium" : "text-foreground"}>{v.sugar}</span></td>
                    <td className="p-3"><span className={v.adherence < 70 ? "text-destructive font-medium" : "text-foreground"}>{v.adherence}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="medicines" className="mt-4">
          <div className="space-y-3">
            {patients.map(p => (
              <div key={p.id} className="rounded-xl border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(p.medicines ?? []).map((m, i) => (
                    <span key={i} className="text-xs bg-muted rounded-lg px-2.5 py-1 text-foreground">{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="labs" className="mt-4">
          <div className="rounded-xl border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Lab results will appear here when available</p>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <div className="space-y-3">
            {patients.map(p => (
              <div key={p.id} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <span className="text-xs text-muted-foreground">{p.last_visit}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5">{p.notes}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
