import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertBanner } from "@/components/health/AlertBanner";
import { classifyBloodPressure, HealthEntry, saveHealthEntry } from "@/lib/health";

export interface HealthFormValues {
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  weight: number;
}

interface HealthFormProps {
  patientId: string;
  onSaved: (entry: HealthEntry) => void;
}

export function HealthForm({ patientId, onSaved }: HealthFormProps) {
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

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const watchValues = form.watch();

  const bpStatus = useMemo(() => {
    return classifyBloodPressure(watchValues.systolic, watchValues.diastolic);
  }, [watchValues.systolic, watchValues.diastolic]);

  const abnormalSummary = useMemo(() => {
    if (bpStatus === "Hypertension") {
      return "High Blood Pressure detected. Please save this reading so your care team can review it.";
    }

    if (bpStatus === "Elevated") {
      return "Your blood pressure is slightly elevated today.";
    }

    if (watchValues.heartRate > 100 || watchValues.heartRate < 50) {
      return "Your heart rate is outside the normal range for adults.";
    }

    return null;
  }, [bpStatus, watchValues.heartRate]);

  const onSubmit = (values: HealthFormValues) => {
    const entry: HealthEntry = {
      ...values,
      date: new Date().toISOString().slice(0, 10),
      savedAt: new Date().toISOString(),
    };

    saveHealthEntry(patientId, entry);
    setStatusMessage("Health data saved locally. Your doctor will see the latest values on next sync.");
    onSaved(entry);
    form.reset(values);
  };

  return (
    <Card className="rounded-3xl border border-border/50 bg-card shadow-soft">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Patient Health Data</CardTitle>
            <CardDescription>
              Enter your latest vital readings using structured fields only. This keeps data clean for charts and clinical review.
            </CardDescription>
          </div>
          <Badge variant="outline">Structured</Badge>
        </div>
        {abnormalSummary ? (
          <AlertBanner variant={bpStatus === "Hypertension" ? "danger" : "warning"} title="Health alert" description={abnormalSummary} />
        ) : (
          <AlertBanner
            variant="success"
            title="All values look good"
            description="Your current inputs are within a normal range. Save to update your health timeline."
          />
        )}
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="systolic"
                rules={{ required: "Systolic pressure is required", min: { value: 70, message: "Enter a realistic systolic value" }, max: { value: 250, message: "Enter a realistic systolic value" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Systolic (mmHg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value}
                        min={70}
                        max={250}
                        step={1}
                        className="h-12"
                      />
                    </FormControl>
                    <FormDescription>Top number in your blood pressure reading.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diastolic"
                rules={{ required: "Diastolic pressure is required", min: { value: 40, message: "Enter a realistic diastolic value" }, max: { value: 150, message: "Enter a realistic diastolic value" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diastolic (mmHg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value}
                        min={40}
                        max={150}
                        step={1}
                        className="h-12"
                      />
                    </FormControl>
                    <FormDescription>Bottom number in your blood pressure reading.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="heartRate"
                rules={{ required: "Heart rate is required", min: { value: 30, message: "Enter a realistic heart rate" }, max: { value: 220, message: "Enter a realistic heart rate" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heart Rate (bpm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value}
                        min={30}
                        max={220}
                        step={1}
                        className="h-12"
                      />
                    </FormControl>
                    <FormDescription>Beats per minute from your latest reading.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                rules={{ required: "Temperature is required", min: { value: 34, message: "Enter a realistic temperature" }, max: { value: 42, message: "Enter a realistic temperature" } }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value}
                        min={34}
                        max={42}
                        step={0.1}
                        className="h-12"
                      />
                    </FormControl>
                    <FormDescription>Body temperature in Celsius.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="weight"
              rules={{ required: "Weight is required", min: { value: 20, message: "Enter a realistic weight" }, max: { value: 300, message: "Enter a realistic weight" } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value}
                      min={20}
                      max={300}
                      step={0.1}
                      className="h-12"
                    />
                  </FormControl>
                  <FormDescription>Useful for BMI and trend charts.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your latest blood pressure status is <span className="font-semibold">{bpStatus}</span>.</p>
              </div>
              <Button type="submit">Save health data</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>

      {statusMessage ? (
        <div className="px-6 pb-6">
          <AlertBanner variant="success" title="Saved successfully" description={statusMessage} />
        </div>
      ) : null}
    </Card>
  );
}
