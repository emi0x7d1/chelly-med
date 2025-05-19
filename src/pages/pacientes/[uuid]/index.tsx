import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import * as M from "@mantine/core"
import {
  IconUser,
  IconCalendar,
  IconDroplet,
  IconGenderMale,
  IconGenderFemale,
  IconPhone,
  IconHome,
  IconNotes,
  IconHeartbeat,
  IconAlertCircle,
} from "@tabler/icons-react"
import Link from "next/link"

// Mock patients data - in a real app, this would come from an API
const mockPatientsData = {
  12345: {
    id: "12345",
    name: "María González López",
    birthDate: "1985-06-15",
    gender: "Femenino",
    bloodType: "O+",
    phone: "+52 555 123 4567",
    address: "Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México",
    allergies: ["Penicilina", "Mariscos"],
    medicalConditions: ["Hipertensión", "Diabetes tipo 2"],
    additionalNotes:
      "Paciente con tratamiento regular para hipertensión. Última visita hace 3 meses.",
  },
  67890: {
    id: "67890",
    name: "Juan Pérez",
    birthDate: "1990-02-20",
    gender: "Masculino",
    bloodType: "A-",
    phone: "+52 555 901 2345",
    address: "Calle 5 de Mayo 123, Col. Centro, Ciudad de México",
    allergies: ["Sulfamidas", "Látex"],
    medicalConditions: ["Asma", "Migraña"],
    additionalNotes:
      "Paciente con tratamiento regular para asma. Última visita hace 2 meses.",
  },
}

type PatientData = typeof mockPatientsData["12345"]

// Add these functions for static generation
export async function getStaticPaths()
{
  // Generate paths for each mock patient
  const paths = Object.keys(mockPatientsData).map(id => ({
    params: { uuid: id },
  }))

  return {
    paths,
    fallback: false, // Show 404 for any paths not returned by getStaticPaths
  }
}

export async function getStaticProps({ params }: { params: { uuid: string } })
{
  // Get the patient data for this ID
  const patientData
    = mockPatientsData[params.uuid as keyof typeof mockPatientsData]

  // Return 404 if patient not found
  if (!patientData)
  {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      patient: patientData,
    },
  }
}

export default function PatientPage({ patient }: { patient: PatientData })
{
  const router = useRouter()

  if (!patient)
  {
    return (
      <M.Container size="md" py="xl">
        <M.Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error"
          color="red"
        >
          No se encontró información del paciente
        </M.Alert>
        <M.Button mt="md" onClick={() => router.push("/")}>
          Volver al inicio
        </M.Button>
      </M.Container>
    )
  }

  return (
    <>
      <Head>
        <title>Información del Paciente | Chelly</title>
        <meta name="description" content="Información detallada del paciente" />
      </Head>

      <M.Container size="md" py="xl">
        <M.Group justify="space-between" mb="xl">
          <M.Title order={2}>Información del Paciente</M.Title>
          <M.Button variant="outline" onClick={() => router.push("/")}>
            Volver al inicio
          </M.Button>
        </M.Group>

        <M.Paper shadow="sm" p="md" withBorder mb="md">
          <M.Group justify="space-between" mb="md">
            <M.Group>
              <M.Avatar size="xl" color="blue" radius="xl">
                {patient.name
                  .split(" ")
                  .map(name => name[0])
                  .join("")
                  .substring(0, 2)}
              </M.Avatar>
              <div>
                <M.Title order={3}>{patient.name}</M.Title>
                <M.Text color="dimmed">
                  ID:
                  {patient.id}
                </M.Text>
              </div>
            </M.Group>
            <M.Badge
              size="lg"
              color={patient.gender === "Masculino" ? "blue" : "pink"}
              leftSection={
                patient.gender === "Masculino"
                  ? (
                      <IconGenderMale size={16} />
                    )
                  : (
                      <IconGenderFemale size={16} />
                    )
              }
            >
              {patient.gender}
            </M.Badge>
          </M.Group>
        </M.Paper>

        <M.SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
          <M.Paper shadow="sm" p="md" withBorder>
            <M.Stack>
              <M.Text fw={500} size="lg">
                Información Personal
              </M.Text>

              <M.Group>
                <IconCalendar size={20} />
                <div>
                  <M.Text fw={500}>Fecha de Nacimiento</M.Text>
                  <M.Text>
                    {new Date(patient.birthDate).toLocaleDateString("es-ES")}
                  </M.Text>
                </div>
              </M.Group>

              <M.Group>
                <IconDroplet size={20} color="red" />
                <div>
                  <M.Text fw={500}>Tipo de Sangre</M.Text>
                  <M.Text>{patient.bloodType}</M.Text>
                </div>
              </M.Group>

              <M.Group>
                <IconPhone size={20} />
                <div>
                  <M.Text fw={500}>Teléfono</M.Text>
                  <M.Text>{patient.phone}</M.Text>
                </div>
              </M.Group>

              <M.Group wrap="nowrap">
                <IconHome size={20} className="flex-shrink-0" />
                <div>
                  <M.Text fw={500}>Dirección</M.Text>
                  <M.Text>{patient.address}</M.Text>
                </div>
              </M.Group>
            </M.Stack>
          </M.Paper>

          <M.Paper shadow="sm" p="md" withBorder>
            <M.Stack>
              <M.Text fw={500} size="lg">
                Información Médica
              </M.Text>

              <div>
                <M.Text fw={500} mb="xs">
                  Alergias
                </M.Text>
                <M.Group gap="xs">
                  {patient.allergies.map((allergy, index) => (
                    <M.Badge key={index} color="red">
                      {allergy}
                    </M.Badge>
                  ))}
                </M.Group>
              </div>

              <div>
                <M.Text fw={500} mb="xs">
                  Condiciones Médicas
                </M.Text>
                <M.Group gap="xs">
                  {patient.medicalConditions.map((condition, index) => (
                    <M.Badge key={index} color="blue">
                      {condition}
                    </M.Badge>
                  ))}
                </M.Group>
              </div>

              <div>
                <M.Text fw={500} mb="xs">
                  Signos Vitales Recientes
                </M.Text>
                <M.Group grow>
                  <M.Paper withBorder p="xs">
                    <M.Text ta="center" size="sm" c="dimmed">
                      Presión Arterial
                    </M.Text>
                    <M.Text ta="center" fw={700}>
                      120/80
                    </M.Text>
                  </M.Paper>
                  <M.Paper withBorder p="xs">
                    <M.Text ta="center" size="sm" c="dimmed">
                      Pulso
                    </M.Text>
                    <M.Text ta="center" fw={700}>
                      72 bpm
                    </M.Text>
                  </M.Paper>
                  <M.Paper withBorder p="xs">
                    <M.Text ta="center" size="sm" c="dimmed">
                      Temperatura
                    </M.Text>
                    <M.Text ta="center" fw={700}>
                      36.5°C
                    </M.Text>
                  </M.Paper>
                </M.Group>
                <M.Button
                  component={Link}
                  href={`/pacientes/${patient.id}/historial`}
                  w="100%"
                  mt="md"
                >
                  Ver historial
                </M.Button>
              </div>
            </M.Stack>
          </M.Paper>
        </M.SimpleGrid>

        <M.Paper shadow="sm" p="md" withBorder>
          <M.Text fw={500} size="lg" mb="md">
            Notas Adicionales
          </M.Text>
          <M.Group>
            <IconNotes size={20} />
            <M.Text>{patient.additionalNotes}</M.Text>
          </M.Group>
        </M.Paper>

        <M.Group justify="end" mt="xl">
          <M.Button
            variant="outline"
            color="green"
            leftSection={<IconHeartbeat size={18} />}
          >
            Registrar Consulta
          </M.Button>
          <M.Button color="blue">Editar Información</M.Button>
        </M.Group>
      </M.Container>
    </>
  )
}
