export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  condition: string;
  riskLevel: "high" | "medium" | "low";
  lastVisit: string;
  phone: string;
  bp: string;
  sugar: number;
  medicines: string[];
  notes: string;
  vitals: { date: string; systolic: number; diastolic: number; sugar: number; adherence: number }[];
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  resolved: boolean;
}

export const patients: Patient[] = [
  {
    id: "P001", name: "Sarah Johnson", age: 67, gender: "Female",
    condition: "Hypertension, Diabetes", riskLevel: "high", lastVisit: "2026-04-08",
    phone: "(555) 123-4567", bp: "158/95", sugar: 245,
    medicines: ["Metformin 500mg", "Lisinopril 10mg", "Aspirin 81mg"],
    notes: "BP elevated for 3 consecutive visits. Adjusting medication.",
    vitals: [
      { date: "Apr 3", systolic: 150, diastolic: 92, sugar: 230, adherence: 85 },
      { date: "Apr 5", systolic: 155, diastolic: 94, sugar: 240, adherence: 80 },
      { date: "Apr 7", systolic: 158, diastolic: 95, sugar: 245, adherence: 75 },
      { date: "Apr 9", systolic: 160, diastolic: 96, sugar: 250, adherence: 70 },
    ],
  },
  {
    id: "P002", name: "James Mitchell", age: 54, gender: "Male",
    condition: "Type 2 Diabetes", riskLevel: "medium", lastVisit: "2026-04-07",
    phone: "(555) 234-5678", bp: "130/85", sugar: 180,
    medicines: ["Metformin 1000mg", "Glipizide 5mg"],
    notes: "Sugar trending upward. Diet review scheduled.",
    vitals: [
      { date: "Apr 3", systolic: 128, diastolic: 82, sugar: 165, adherence: 90 },
      { date: "Apr 5", systolic: 130, diastolic: 84, sugar: 172, adherence: 88 },
      { date: "Apr 7", systolic: 130, diastolic: 85, sugar: 180, adherence: 85 },
      { date: "Apr 9", systolic: 132, diastolic: 85, sugar: 185, adherence: 82 },
    ],
  },
  {
    id: "P003", name: "Emily Chen", age: 42, gender: "Female",
    condition: "Asthma", riskLevel: "low", lastVisit: "2026-04-06",
    phone: "(555) 345-6789", bp: "118/76", sugar: 95,
    medicines: ["Albuterol inhaler", "Fluticasone 250mcg"],
    notes: "Stable condition. Annual review complete.",
    vitals: [
      { date: "Apr 3", systolic: 116, diastolic: 74, sugar: 92, adherence: 95 },
      { date: "Apr 5", systolic: 118, diastolic: 75, sugar: 94, adherence: 96 },
      { date: "Apr 7", systolic: 118, diastolic: 76, sugar: 95, adherence: 95 },
      { date: "Apr 9", systolic: 117, diastolic: 75, sugar: 93, adherence: 97 },
    ],
  },
  {
    id: "P004", name: "Robert Williams", age: 73, gender: "Male",
    condition: "Heart Failure, COPD", riskLevel: "high", lastVisit: "2026-04-09",
    phone: "(555) 456-7890", bp: "145/90", sugar: 110,
    medicines: ["Carvedilol 25mg", "Furosemide 40mg", "Tiotropium inhaler"],
    notes: "Weight gain 3lbs this week. Monitor closely.",
    vitals: [
      { date: "Apr 3", systolic: 140, diastolic: 88, sugar: 108, adherence: 70 },
      { date: "Apr 5", systolic: 142, diastolic: 89, sugar: 110, adherence: 65 },
      { date: "Apr 7", systolic: 144, diastolic: 90, sugar: 112, adherence: 60 },
      { date: "Apr 9", systolic: 145, diastolic: 90, sugar: 110, adherence: 55 },
    ],
  },
  {
    id: "P005", name: "Maria Garcia", age: 35, gender: "Female",
    condition: "Pregnancy (28 weeks)", riskLevel: "medium", lastVisit: "2026-04-08",
    phone: "(555) 567-8901", bp: "125/80", sugar: 105,
    medicines: ["Prenatal vitamins", "Iron supplement"],
    notes: "Routine checkup. All normal.",
    vitals: [
      { date: "Apr 3", systolic: 122, diastolic: 78, sugar: 100, adherence: 98 },
      { date: "Apr 5", systolic: 124, diastolic: 79, sugar: 102, adherence: 97 },
      { date: "Apr 7", systolic: 125, diastolic: 80, sugar: 104, adherence: 98 },
      { date: "Apr 9", systolic: 125, diastolic: 80, sugar: 105, adherence: 99 },
    ],
  },
  {
    id: "P006", name: "David Lee", age: 61, gender: "Male",
    condition: "Chronic Kidney Disease", riskLevel: "high", lastVisit: "2026-04-05",
    phone: "(555) 678-9012", bp: "152/92", sugar: 135,
    medicines: ["Amlodipine 10mg", "Atorvastatin 40mg", "Erythropoietin"],
    notes: "Creatinine elevated. Nephrology referral pending.",
    vitals: [
      { date: "Apr 3", systolic: 148, diastolic: 90, sugar: 130, adherence: 78 },
      { date: "Apr 5", systolic: 150, diastolic: 91, sugar: 132, adherence: 75 },
      { date: "Apr 7", systolic: 152, diastolic: 92, sugar: 134, adherence: 72 },
      { date: "Apr 9", systolic: 153, diastolic: 93, sugar: 135, adherence: 70 },
    ],
  },
];

export const alerts: Alert[] = [
  { id: "A001", patientId: "P001", patientName: "Sarah Johnson", type: "critical", title: "BP critically high for 3 days", message: "Systolic > 155 mmHg consistently", time: "10 min ago", resolved: false },
  { id: "A002", patientId: "P004", patientName: "Robert Williams", type: "critical", title: "Medication adherence dropping", message: "Down to 55% this week from 80%", time: "25 min ago", resolved: false },
  { id: "A003", patientId: "P006", patientName: "David Lee", type: "critical", title: "Creatinine levels elevated", message: "Urgent nephrology referral needed", time: "1 hr ago", resolved: false },
  { id: "A004", patientId: "P002", patientName: "James Mitchell", type: "warning", title: "Sugar trending upward", message: "180 mg/dL, rising over past week", time: "2 hrs ago", resolved: false },
  { id: "A005", patientId: "P001", patientName: "Sarah Johnson", type: "warning", title: "Missed evening Metformin", message: "2 doses missed this week", time: "3 hrs ago", resolved: false },
  { id: "A006", patientId: "P005", patientName: "Maria Garcia", type: "info", title: "Appointment tomorrow at 10 AM", message: "Routine prenatal checkup", time: "5 hrs ago", resolved: false },
  { id: "A007", patientId: "P003", patientName: "Emily Chen", type: "info", title: "Annual review due next week", message: "Schedule follow-up appointment", time: "6 hrs ago", resolved: false },
  { id: "A008", patientId: "P004", patientName: "Robert Williams", type: "warning", title: "Weight gain 3 lbs this week", message: "Possible fluid retention — monitor", time: "4 hrs ago", resolved: false },
];

export const stats = {
  totalPatients: 1248,
  highRisk: 89,
  todayAppointments: 24,
  activeAlerts: alerts.filter(a => !a.resolved).length,
};
