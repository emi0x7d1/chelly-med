import React from "react";
import { Container, Title } from "@mantine/core";
import { LineChart } from "@mantine/charts";

// Mock data for demonstration
const bloodPressureData = [
  { date: "2025-02-01", systolic: 120, diastolic: 80 },
  { date: "2025-02-02", systolic: 125, diastolic: 82 },
  { date: "2025-02-03", systolic: 118, diastolic: 79 },
];

const bpmData = [
  { date: "2025-02-01", bpm: 72 },
  { date: "2025-02-02", bpm: 75 },
  { date: "2025-02-03", bpm: 70 },
];

const temperatureData = [
  { date: "2025-02-01", temperature: 36.5 },
  { date: "2025-02-02", temperature: 36.7 },
  { date: "2025-02-03", temperature: 36.6 },
];

export default function HistoryPage() {
  return (
    <Container size="md" py="xl">
      <Title order={2} mb="xl">
        Historial de Signos Vitales
      </Title>

      <Title order={3} mt="xl" className="mb-4">
        Presión Arterial
      </Title>
      <LineChart
        data={bloodPressureData}
        dataKey="date"
        series={[
          { name: "systolic", color: "red.6", label: "Sistólica" },
          { name: "diastolic", color: "blue.6", label: "Diastólica" },
        ]}
        className="mb-8 h-[300px]"
        withLegend
      />

      <Title order={3} mt="xl" className="mb-4">
        Frecuencia Cardíaca (BPM)
      </Title>
      <LineChart
        data={bpmData}
        dataKey="date"
        series={[{ name: "bpm", color: "green.6", label: "Pulso" }]}
        className="mb-8 h-[300px]"
      />

      <Title order={3} mt="xl" className="mb-4">
        Temperatura Corporal
      </Title>
      <LineChart
        data={temperatureData}
        dataKey="date"
        series={[
          { name: "temperature", color: "orange.6", label: "Temperatura" },
        ]}
        className="mb-8 h-[300px]"
        valueFormatter={(value) => `${value}°C`}
      />
    </Container>
  );
}
