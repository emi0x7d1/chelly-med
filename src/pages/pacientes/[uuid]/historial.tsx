import React from "react";
import { useRouter } from "next/router";
import { Container, Title } from "@mantine/core";
import { LineChart } from "@mantine/charts";

// Mock data for different patients
const patientData = {
  "12345": {
    name: "María González López",
    bloodPressureData: [
      { date: "2025-02-01", systolic: 120, diastolic: 80 },
      { date: "2025-02-02", systolic: 125, diastolic: 82 },
      { date: "2025-02-03", systolic: 118, diastolic: 79 },
    ],
    bpmData: [
      { date: "2025-02-01", bpm: 72 },
      { date: "2025-02-02", bpm: 75 },
      { date: "2025-02-03", bpm: 70 },
    ],
    temperatureData: [
      { date: "2025-02-01", temperature: 36.5 },
      { date: "2025-02-02", temperature: 36.7 },
      { date: "2025-02-03", temperature: 36.6 },
    ],
  },
  "67890": {
    name: "Juan Pérez",
    bloodPressureData: [
      { date: "2025-02-01", systolic: 135, diastolic: 85 },
      { date: "2025-02-02", systolic: 130, diastolic: 82 },
      { date: "2025-02-03", systolic: 128, diastolic: 80 },
    ],
    bpmData: [
      { date: "2025-02-01", bpm: 78 },
      { date: "2025-02-02", bpm: 76 },
      { date: "2025-02-03", bpm: 74 },
    ],
    temperatureData: [
      { date: "2025-02-01", temperature: 36.8 },
      { date: "2025-02-02", temperature: 36.6 },
      { date: "2025-02-03", temperature: 36.7 },
    ],
  }
};

export default function HistoryPage() {
  const router = useRouter();
  const { uuid } = router.query;
  
  // Get patient-specific data or use default if not found
  const currentPatient = uuid && typeof uuid === 'string' && patientData[uuid as keyof typeof patientData]
    ? patientData[uuid as keyof typeof patientData]
    : patientData["12345"]; // Default to first patient
  
  return (
    <Container size="md" py="xl">
      <Title order={2} mb="xl">
        Historial de Signos Vitales - {currentPatient.name}
      </Title>

      <Title order={3} mt="xl" className="mb-4">
        Presión Arterial
      </Title>
      <LineChart
        data={currentPatient.bloodPressureData}
        dataKey="date"
        series={[
          { name: "systolic", color: "red.6", label: "Sistólica" },
          { name: "diastolic", color: "blue.6", label: "Diastólica" },
        ]}
        className="h-[300px] mb-8"
        withLegend
      />

      <Title order={3} mt="xl" className="mb-4">
        Frecuencia Cardíaca (BPM)
      </Title>
      <LineChart
        data={currentPatient.bpmData}
        dataKey="date"
        series={[{ name: "bpm", color: "green.6", label: "Pulso" }]}
        className="h-[300px] mb-8"
      />

      <Title order={3} mt="xl" className="mb-4">
        Temperatura Corporal
      </Title>
      <LineChart
        data={currentPatient.temperatureData}
        dataKey="date"
        series={[
          { name: "temperature", color: "orange.6", label: "Temperatura" },
        ]}
        className="h-[300px] mb-8"
        valueFormatter={(value) => `${value}°C`}
      />
    </Container>
  );
}
