import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type DbPatient = {
  id: string;
  patient_code: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  risk_level: string;
  last_visit: string | null;
  phone: string | null;
  bp: string | null;
  sugar: number | null;
  medicines: string[] | null;
  notes: string | null;
};

export type DbVital = {
  id: string;
  patient_id: string;
  recorded_date: string;
  systolic: number;
  diastolic: number;
  sugar: number;
  adherence: number;
};

export type DbAlert = {
  id: string;
  patient_id: string;
  patient_name: string;
  type: string;
  title: string;
  message: string;
  time: string;
  resolved: boolean;
};

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("patients").select("*").order("name");
      if (error) throw error;
      return data as DbPatient[];
    },
  });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: ["patients", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("patients").select("*").eq("id", id!).single();
      if (error) throw error;
      return data as DbPatient;
    },
  });
}

export function usePatientVitals(patientId: string | undefined) {
  return useQuery({
    queryKey: ["vitals", patientId],
    enabled: !!patientId,
    queryFn: async () => {
      const { data, error } = await supabase.from("vitals").select("*").eq("patient_id", patientId!).order("recorded_date");
      if (error) throw error;
      return data as DbVital[];
    },
  });
}

export function useAllVitals() {
  return useQuery({
    queryKey: ["vitals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vitals").select("*, patients(name)").order("recorded_date");
      if (error) throw error;
      return data;
    },
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alerts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as DbAlert[];
    },
  });
}

export function useResolveAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase.from("alerts").update({ resolved: true }).eq("id", alertId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const [patientsRes, highRiskRes, alertsRes] = await Promise.all([
        supabase.from("patients").select("id", { count: "exact", head: true }),
        supabase.from("patients").select("id", { count: "exact", head: true }).eq("risk_level", "high"),
        supabase.from("alerts").select("id", { count: "exact", head: true }).eq("resolved", false),
      ]);
      return {
        totalPatients: patientsRes.count ?? 0,
        highRisk: highRiskRes.count ?? 0,
        todayAppointments: 24, // placeholder
        activeAlerts: alertsRes.count ?? 0,
      };
    },
  });
}
