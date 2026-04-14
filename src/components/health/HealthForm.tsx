import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertBanner } from "@/components/health/AlertBanner";
import { classifyBloodPressure } from "@/lib/health";
import { useAddHealthEntry } from "@/hooks/use-data";
import { toast } from "sonner";

export interface HealthFormValues {
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  weight: number;
}

interface HealthFormProps {
  patientId: string;
  userId: string;
  onSaved: () => void;
}

export function HealthForm({ patientId, userId, onSaved }: HealthFormProps) {
  const form = useForm<HealthFormValues>({
    defaultValues: {
      systolic: 118,
      diastolic: 76,
      heartRate: 72,
      temperature: 36.7,
      weight: 72,
    },
    mode: "onChange",
  });

  const addEntry = useAddHealthEntry();
  const watchValues = form.watch();

  const bpStatus = useMemo(() => {
    return classifyBloodPressure(watchValues.systolic, watchValues.diastolic);
  }, [watchValues.systolic, watchValues.diastolic]);

  const abnormalSummary = useMemo(() => {
    if (bpStatus === "Hypertension") return "Shinikizo la damu limepanda sana. Hifadhi ili daktari wako apate kuona.";
    if (bpStatus === "Elevated") return "Shinikizo la damu limepanda kidogo leo.";
    if (watchValues.heartRate > 100 || watchValues.heartRate < 50) return "Mapigo ya moyo yako yapo nje ya kiwango cha kawaida.";
    return null;
  }, [bpStatus, watchValues.heartRate]);

  const onSubmit = async (values: HealthFormValues) => {
    try {
      await addEntry.mutateAsync({
        patient_id: patientId,
        user_id: userId,
        systolic: values.systolic,
        diastolic: values.diastolic,
        heart_rate: values.heartRate,
        temperature: values.temperature,
        weight: values.weight,
      });
      toast.success("Data ya afya imehifadhiwa!");
      onSaved();
    } catch {
      toast.error("Imeshindwa kuhifadhi data");
    }
  };

  return (
    <div className="group scroll-scale-in">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/10 blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700 -z-10" />
      <Card className="group relative z-10 rounded-2xl frosted-glass border border-primary/25 md:border-primary/20 bg-gradient-to-br from-card/95 via-card/90 to-card/85 shadow-soft backdrop-blur-md overflow-hidden transition-all duration-500 md:hover:border-primary/40 press-zoom hover-lift md:shadow-sm">
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none z-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-foreground drop-shadow-sm">Data ya Afya</CardTitle>
              <CardDescription className="text-muted-foreground/90 drop-shadow-sm">Ingiza vipimo vyako vya hivi karibuni.</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary shadow-sm">Structured</Badge>
          </div>
          {abnormalSummary ? (
            <AlertBanner variant={bpStatus === "Hypertension" ? "danger" : "warning"} title="Tahadhari ya afya" description={abnormalSummary} />
          ) : (
            <AlertBanner variant="success" title="Vipimo vyote ni sawa" description="Vipimo vyako viko ndani ya kiwango cha kawaida." />
          )}
        </CardHeader>

        <CardContent className="space-y-6 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 grid-cols-2">
                <FormField control={form.control} name="systolic"
                  rules={{ required: true, min: 70, max: 250 }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold drop-shadow-sm">Systolic (mmHg)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={70} max={250} className="h-12 bg-muted/30 border-primary/20 shadow-sm hover:bg-muted/40 focus-visible:ring-primary/50 focus-visible:border-primary/40 focus-visible:bg-card transition-all duration-200 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="diastolic"
                  rules={{ required: true, min: 40, max: 150 }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold drop-shadow-sm">Diastolic (mmHg)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={40} max={150} className="h-12 bg-muted/30 border-primary/20 shadow-sm hover:bg-muted/40 focus-visible:ring-primary/50 focus-visible:border-primary/40 focus-visible:bg-card transition-all duration-200 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <FormField control={form.control} name="heartRate"
                  rules={{ required: true, min: 30, max: 220 }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold drop-shadow-sm">Mapigo (bpm)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={30} max={220} className="h-12 bg-muted/30 border-primary/20 shadow-sm hover:bg-muted/40 focus-visible:ring-primary/50 focus-visible:border-primary/40 focus-visible:bg-card transition-all duration-200 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="temperature"
                  rules={{ required: true, min: 34, max: 42 }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold drop-shadow-sm">Joto (°C)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min={34} max={42} step={0.1} className="h-12 bg-muted/30 border-primary/20 shadow-sm hover:bg-muted/40 focus-visible:ring-primary/50 focus-visible:border-primary/40 focus-visible:bg-card transition-all duration-200 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField control={form.control} name="weight"
                rules={{ required: true, min: 20, max: 300 }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold drop-shadow-sm">Uzito (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={20} max={300} step={0.1} className="h-12 bg-muted/30 border-primary/20 shadow-sm hover:bg-muted/40 focus-visible:ring-primary/50 focus-visible:border-primary/40 focus-visible:bg-card transition-all duration-200 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-0">
                <p className="text-sm text-muted-foreground font-medium drop-shadow-sm">BP: <span className="font-semibold text-foreground drop-shadow-sm">{bpStatus}</span></p>
                <Button type="submit" disabled={addEntry.isPending}>
                  {addEntry.isPending ? "Inahifadhi..." : "Hifadhi data"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

