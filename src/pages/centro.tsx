import { IconEye } from "@tabler/icons-react"
import { useAtomValue } from "jotai"
import Link from "next/link"
import { Button, buttonVariants } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { patientsAtom } from "~/state"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { type Patient } from "~/fixtures"
import React from "react"
import Head from "next/head"
import { CameraIcon } from "lucide-react"

const Centro = () =>
{
  const patients = useAtomValue(patientsAtom)

  return (
    <>
      <Head>
        <title>MediQR</title>
        <meta name="description" content="MediQR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-[1000px] w-full mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/chelly-med/logo.png" alt="logo" className="w-[60px]" />
            <p className="text-2xl font-medium">MediQR</p>
          </div>
          <div className="flex items-center gap-x-4">
            <Link href="/escanear" className={buttonVariants({ variant: "outline" })}>
              <CameraIcon />
              Escanear código QR
            </Link>
            <Link href="/centro/registrar" className={buttonVariants({ variant: "outline" })}>
              Registrar pacientes
            </Link>
          </div>
        </div>
        <div>
          <p className="text-3xl font-medium mt-12">Pacientes</p>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Acciones</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Fecha de nacimiento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map(patient => (
                <TableRow key={patient.uuid}>
                  <TableCell>
                    <PatientInfoDialog patient={patient} />
                  </TableCell>
                  <TableCell>{patient.firstName}</TableCell>
                  <TableCell>{patient.lastName}</TableCell>
                  <TableCell>
                    {Intl.DateTimeFormat("es-MX", {
                      dateStyle: "long",
                    }).format(new Date(patient.birthDate))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

function PatientInfoDialog({ patient }: { patient: Patient })
{
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <IconEye className="text-gray-500" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Información del paciente</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Nombre:</span>
            {" "}
            {patient.firstName}
            {" "}
            {patient.lastName}
          </div>
          <div>
            <span className="font-medium">Fecha de nacimiento:</span>
            {" "}
            {Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date(patient.birthDate))}
          </div>
          <div>
            <span className="font-medium">Teléfono:</span>
            {" "}
            {patient.phoneNumber}
          </div>
          <div>
            <span className="font-medium">Tipo de sangre:</span>
            {" "}
            {patient.bloodType}
          </div>
          <div>
            <span className="font-medium">Alergias:</span>
            {" "}
            {patient.alergies.length === 0 ? "Sin alergias" : patient.alergies.map(a => a.name).join(", ")}
          </div>
          <div>
            <span className="font-medium">Condiciones médicas:</span>
            {" "}
            {patient.medicalConditions.length === 0 ? "Sin condiciones" : patient.medicalConditions.map(m => m.name).join(", ")}
          </div>
          <div>
            <span className="font-medium">Notas:</span>
            {" "}
            {patient.notes || "Sin notas"}
          </div>
          <p className="font-medium mt-6">
            Para acceder al registro completo del paciente,
            <Link href="/escanear" className="underline">
              escanee el código QR
            </Link>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Centro
