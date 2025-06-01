import { useRouter } from "next/router"
import { useAtomValue, useSetAtom } from "jotai/react"
import { patientsAtom } from "~/state"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form"
import { useEffect, useState } from "react"
import { cn } from "~/lib/utils"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import { type Patient } from "~/fixtures"
import Head from "next/head"

const getNow = () =>
{
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

const vitalSignsSchema = z.object({
  time: z.string().min(1, { message: "Fecha y hora requerida" }),
  bloodPressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/, { message: "Presión arterial debe estar en formato P/A, por ejemplo, 120/80" }),
  temperature: z.string().min(1, { message: "Temperatura requerida" }),
  heartRate: z.string().min(1, { message: "Frecuencia cardiaca requerida" }),
  respiratoryRate: z.string().min(1, { message: "Frecuencia respiratoria requerida" }),
  spo2: z.string().min(1, { message: "Saturación de oxígeno requerida" }),
  pain: z.string().min(1, { message: "Dolor requerido" }),
})

type VitalSignsSchema = z.output<typeof vitalSignsSchema>

const VitalSignsFormDialog = (
  { open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }
) =>
{
  const router = useRouter()
  const setPatients = useSetAtom(patientsAtom)
  const [initialNow] = useState(() => getNow())

  const form = useForm<VitalSignsSchema>({
    resolver: zodResolver(vitalSignsSchema),
    defaultValues: {
      time: initialNow,
      bloodPressure: "",
      temperature: "",
      heartRate: "",
      respiratoryRate: "",
      spo2: "",
      pain: "",
    },
  })

  const handleSubmit = (data: VitalSignsSchema) =>
  {
    form.reset({
      time: getNow(),
      bloodPressure: "",
      temperature: "",
      heartRate: "",
      respiratoryRate: "",
      spo2: "",
      pain: "",
    })

    // save new vital signs to patient
    const uuid = router.query.uuid as string
    setPatients((patients) =>
    {
      const patient = patients.find(p => p.uuid === uuid)
      if (!patient) return patients
      patient.vitalSigns.push({
        time: new Date(data.time),
        vitalSign: {
          bloodPressure: data.bloodPressure,
          temperature: data.temperature,
          heartRate: data.heartRate,
          respiratoryRate: data.respiratoryRate,
          spo2: data.spo2,
          pain: data.pain,
        },
      })
      return patients
    })

    onOpenChange(false)
  }

  useEffect(() =>
  {
    form.setValue("time", getNow())
  }, [form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar signos vitales</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha y hora de la toma</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodPressure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presión arterial (P/A)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 120/80" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperatura corporal (°C)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" placeholder="Ej: 36.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="heartRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia cardiaca (FC)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 72" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="respiratoryRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia respiratoria (FR)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 16" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spo2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saturación de oxígeno (SpO2)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 98" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dolor (0-10)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="10" placeholder="Ej: 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Registrar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// Helper functions for vital sign ranges
function isBloodPressureOutOfRange(bp: string | undefined)
{
  if (!bp) return false
  // Format: "120/80"
  const match = /^\d{2,3}\/\d{2,3}$/.exec(bp)
  if (!match) return false
  const [systolic, diastolic] = bp.split("/").map(Number) as [number, number]
  if (systolic < 90 || diastolic < 60) return true // hipotensión
  if (systolic >= 140 || diastolic >= 90) return true // hipertensión
  if (systolic > 139 || diastolic > 89) return true // hipertensión
  return false
}

function isTemperatureOutOfRange(temp: string | undefined)
{
  if (!temp) return false
  const t = parseFloat(temp)
  if (isNaN(t)) return false
  if (t < 35.0 || t > 37.5) return true
  return false
}

function isHeartRateOutOfRange(hr: string | undefined)
{
  if (!hr) return false
  const h = parseInt(hr, 10)
  if (isNaN(h)) return false
  if (h < 60 || h > 100) return true
  return false
}

function isRespiratoryRateOutOfRange(rr: string | undefined)
{
  if (!rr) return false
  const r = parseInt(rr, 10)
  if (isNaN(r)) return false
  if (r < 12 || r > 20) return true
  return false
}

function isSpo2OutOfRange(spo2: string | undefined)
{
  if (!spo2) return false
  const s = parseInt(spo2, 10)
  if (isNaN(s)) return false
  if (s < 95) return true
  return false
}

function getBloodPressureCondition(bp: string | undefined): string
{
  if (!bp) return "-"
  const match = /^\d{2,3}\/\d{2,3}$/.exec(bp)
  if (!match) return "-"
  const [systolic, diastolic] = bp.split("/").map(Number) as [number, number]
  if (systolic < 90 || diastolic < 60) return "Hipotensión"
  if ((systolic >= 140 && systolic <= 159) || (diastolic >= 90 && diastolic <= 99)) return "Hipertensión grado 1"
  if (systolic >= 160 || diastolic >= 100) return "Hipertensión grado 2"
  if ((systolic >= 90 && systolic <= 120) && (diastolic >= 60 && diastolic <= 80)) return "Normal"
  return "-"
}

function getTemperatureCondition(temp: string | undefined): string
{
  if (!temp) return "-"
  const t = parseFloat(temp)
  if (isNaN(t)) return "-"
  if (t < 35.0) return "Hipotermia"
  if (t >= 36.0 && t <= 37.2) return "Normal"
  if (t > 37.5 && t <= 40.0) return "Fiebre"
  if (t > 40.0) return "Hipertermia grave"
  if (t > 37.2 && t <= 37.5) return "Subfebril"
  return "-"
}

function getHeartRateCondition(hr: string | undefined): string
{
  if (!hr) return "-"
  const h = parseInt(hr, 10)
  if (isNaN(h)) return "-"
  if (h < 60) return "Bradicardia"
  if (h >= 60 && h <= 100) return "Normal"
  if (h > 100) return "Taquicardia"
  return "-"
}

function getRespiratoryRateCondition(rr: string | undefined): string
{
  if (!rr) return "-"
  const r = parseInt(rr, 10)
  if (isNaN(r)) return "-"
  if (r < 12) return "Bradipnea"
  if (r >= 12 && r <= 20) return "Normal"
  if (r > 20) return "Taquipnea"
  return "-"
}

function getSpo2Condition(spo2: string | undefined): string
{
  if (!spo2) return "-"
  const s = parseInt(spo2, 10)
  if (isNaN(s)) return "-"
  if (s < 90) return "Hipoxemia"
  if (s >= 90 && s <= 94) return "Levemente baja"
  if (s >= 95 && s <= 100) return "Normal"
  return "-"
}

function getPainCondition(pain: string | undefined): string
{
  if (!pain) return "-"
  const p = parseInt(pain, 10)
  if (isNaN(p)) return "-"
  if (p === 0) return "Sin dolor"
  if (p >= 1 && p <= 3) return "Dolor leve"
  if (p >= 4 && p <= 6) return "Dolor moderado"
  if (p >= 7 && p <= 10) return "Dolor intenso"
  return "-"
}

const VitalSignsCharts = ({ patient }: { patient: Patient }) =>
{
  // Prepare chart data
  const data = patient.vitalSigns.map(vs => ({
    time: new Date(vs.time).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }),
    sistolica: Number(vs.vitalSign.bloodPressure?.split("/")[0]) || null,
    diastolica: Number(vs.vitalSign.bloodPressure?.split("/")[1]) || null,
    temperatura: Number(vs.vitalSign.temperature) || null,
    fc: Number(vs.vitalSign.heartRate) || null,
    fr: Number(vs.vitalSign.respiratoryRate) || null,
    spo2: Number(vs.vitalSign.spo2) || null,
    dolor: Number(vs.vitalSign.pain) || null,
  }))

  return (
    <Card className="my-6">
      <CardHeader>
        <CardTitle>Histórico de signos vitales</CardTitle>
        <CardDescription>Todos los registros del paciente</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="linear" dataKey="sistolica" stroke="#e11d48" strokeWidth={2} dot={false} name="Sistólica" />
            <Line type="linear" dataKey="diastolica" stroke="#be185d" strokeWidth={2} dot={false} name="Diastólica" />
            <Line type="linear" dataKey="temperatura" stroke="#2563eb" strokeWidth={2} dot={false} name="Temperatura" />
            <Line type="linear" dataKey="fc" stroke="#16a34a" strokeWidth={2} dot={false} name="FC" />
            <Line type="linear" dataKey="fr" stroke="#f59e42" strokeWidth={2} dot={false} name="FR" />
            <Line type="linear" dataKey="spo2" stroke="#0ea5e9" strokeWidth={2} dot={false} name="SpO2" />
            <Line type="linear" dataKey="dolor" stroke="#a21caf" strokeWidth={2} dot={false} name="Dolor" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Histórico de signos vitales
          {" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando todos los registros disponibles
        </div>
      </CardFooter>
    </Card>
  )
}

const Paciente = () =>
{
  const router = useRouter()
  const uuid = router.query.uuid as string
  const patients = useAtomValue(patientsAtom)
  const patient = patients.find(p => p.uuid === uuid)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showMore, setShowMore] = useState(false)

  if (!patient)
  {
    return (
      <div className="max-w-[1000px] w-full mx-auto mt-16 text-center">
        <Link href="/centro" className="flex items-center gap-x-2 py-4 justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/chelly-med/logo.png" alt="logo" className="w-[60px]" />
          <p className="text-2xl font-medium">MediQR</p>
        </Link>
        <div className="mt-12 text-lg text-muted-foreground">Paciente no encontrado</div>
      </div>
    )
  }

  const latestVitalSigns = patient.vitalSigns.length > 0 ? patient.vitalSigns[patient.vitalSigns.length - 1] : null

  return (
    <>
      <Head>
        <title>{patient.firstName} {patient.lastName} | MediQR</title>
        <meta name="description" content="MediQR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-[1000px] w-full mx-auto">
        <Link href="/centro" className="flex items-center gap-x-2 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/chelly-med/logo.png" alt="logo" className="w-[60px]" />
          <p className="text-2xl font-medium">MediQR</p>
        </Link>
        <div className="mx-auto w-full max-w-[600px] mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold mb-1">
                {patient.firstName}
                {" "}
                {patient.lastName}
              </CardTitle>
              <div className="text-muted-foreground text-sm">
                <span className="font-medium">ID:</span>
                {" "}
                {patient.uuid}
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <Button onClick={() => setIsDialogOpen(true)} className="mb-4">Registrar signos vitales</Button>
              <VitalSignsFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
              {latestVitalSigns && (
                <div className="mb-6">
                  <div className="font-semibold mb-2">Últimos signos vitales</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Presión arterial:</span>
                      <br />
                      <span className={cn(isBloodPressureOutOfRange(latestVitalSigns.vitalSign.bloodPressure) && "text-red-600 font-bold")}>{latestVitalSigns.vitalSign.bloodPressure}</span>
                      {getBloodPressureCondition(latestVitalSigns.vitalSign.bloodPressure) !== "Normal" && getBloodPressureCondition(latestVitalSigns.vitalSign.bloodPressure) !== "-" && (
                        <span className="ml-2 text-red-600 font-bold">{getBloodPressureCondition(latestVitalSigns.vitalSign.bloodPressure)}</span>
                      )}
                      {getBloodPressureCondition(latestVitalSigns.vitalSign.bloodPressure) === "Normal" && (
                        <span className="ml-2 text-green-600">Normal</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Temperatura:</span>
                      <br />
                      <span className={cn(isTemperatureOutOfRange(latestVitalSigns.vitalSign?.temperature) && "text-red-600 font-bold")}>{latestVitalSigns.vitalSign?.temperature ?? "-"}</span>
                      <span> °C</span>
                      {getTemperatureCondition(latestVitalSigns.vitalSign?.temperature) !== "Normal" && getTemperatureCondition(latestVitalSigns.vitalSign?.temperature) !== "-" && (
                        <span className="ml-2 text-red-600 font-bold">{getTemperatureCondition(latestVitalSigns.vitalSign?.temperature)}</span>
                      )}
                      {getTemperatureCondition(latestVitalSigns.vitalSign?.temperature) === "Normal" && (
                        <span className="ml-2 text-green-600">Normal</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Frecuencia cardiaca:</span>
                      <br />
                      <span className={cn(isHeartRateOutOfRange(latestVitalSigns.vitalSign?.heartRate) && "text-red-600 font-bold")}>{latestVitalSigns.vitalSign?.heartRate ?? "-"}</span>
                      <span> lpm</span>
                      {getHeartRateCondition(latestVitalSigns.vitalSign?.heartRate) !== "Normal" && getHeartRateCondition(latestVitalSigns.vitalSign?.heartRate) !== "-" && (
                        <span className="ml-2 text-red-600 font-bold">{getHeartRateCondition(latestVitalSigns.vitalSign?.heartRate)}</span>
                      )}
                      {getHeartRateCondition(latestVitalSigns.vitalSign?.heartRate) === "Normal" && (
                        <span className="ml-2 text-green-600">Normal</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Frecuencia respiratoria:</span>
                      <br />
                      <span className={cn(isRespiratoryRateOutOfRange(latestVitalSigns.vitalSign?.respiratoryRate) && "text-red-600 font-bold")}>{latestVitalSigns.vitalSign?.respiratoryRate ?? "-"}</span>
                      <span> rpm</span>
                      {getRespiratoryRateCondition(latestVitalSigns.vitalSign?.respiratoryRate) !== "Normal" && getRespiratoryRateCondition(latestVitalSigns.vitalSign?.respiratoryRate) !== "-" && (
                        <span className="ml-2 text-red-600 font-bold">{getRespiratoryRateCondition(latestVitalSigns.vitalSign?.respiratoryRate)}</span>
                      )}
                      {getRespiratoryRateCondition(latestVitalSigns.vitalSign?.respiratoryRate) === "Normal" && (
                        <span className="ml-2 text-green-600">Normal</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Saturación de oxígeno:</span>
                      <br />
                      <span className={cn(isSpo2OutOfRange(latestVitalSigns.vitalSign?.spo2) && "text-red-600 font-bold")}>{latestVitalSigns.vitalSign?.spo2 ?? "-"}</span>
                      <span> %</span>
                      {getSpo2Condition(latestVitalSigns.vitalSign?.spo2) !== "Normal" && getSpo2Condition(latestVitalSigns.vitalSign?.spo2) !== "-" && (
                        <span className="ml-2 text-red-600 font-bold">{getSpo2Condition(latestVitalSigns.vitalSign?.spo2)}</span>
                      )}
                      {getSpo2Condition(latestVitalSigns.vitalSign?.spo2) === "Normal" && (
                        <span className="ml-2 text-green-600">Normal</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Dolor:</span>
                      <br />
                      <span className={cn(getPainCondition(latestVitalSigns.vitalSign?.pain) === "Dolor intenso" && "text-red-600 font-bold")}>{latestVitalSigns.vitalSign?.pain ?? "-"}</span>
                      <span> / 10</span>
                      {getPainCondition(latestVitalSigns.vitalSign?.pain) === "Dolor intenso" && (
                        <span className="ml-2 text-red-600 font-bold">Dolor intenso</span>
                      )}
                      {getPainCondition(latestVitalSigns.vitalSign?.pain) === "Sin dolor" && (
                        <span className="ml-2 text-green-600">Sin dolor</span>
                      )}
                      {getPainCondition(latestVitalSigns.vitalSign?.pain) !== "Dolor intenso" && getPainCondition(latestVitalSigns.vitalSign?.pain) !== "Sin dolor" && getPainCondition(latestVitalSigns.vitalSign?.pain) !== "-" && (
                        <span className="ml-2">{getPainCondition(latestVitalSigns.vitalSign?.pain)}</span>
                      )}
                    </div>
                    <div className="col-span-2 text-xs text-muted-foreground mt-2">
                      Registrado:
                      {" "}
                      {latestVitalSigns?.time
                        ? (
                            <>
                              {new Intl.DateTimeFormat("es-MX", { dateStyle: "short", timeStyle: "short" }).format(new Date(latestVitalSigns.time as string | number | Date))}
                            </>
                          )
                        : "-"}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                      {
                        setShowMore(v => !v)
                      }}
                    >
                      {showMore ? "Ver menos" : "Ver más"}
                    </Button>
                  </div>
                  {showMore && <VitalSignsCharts patient={patient} />}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Fecha de nacimiento</div>
                  <div className="font-medium">
                    {new Date(patient.birthDate).toLocaleDateString("es-MX", { dateStyle: "long" })}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Teléfono</div>
                  <div className="font-medium">{patient.phoneNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Tipo de sangre</div>
                  <span className="inline-block rounded-full border border-primary/50 px-3 py-1 text-primary/80 text-xs font-semibold bg-primary/10">
                    {patient.bloodType}
                  </span>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2">Alergias</div>
                {patient.alergies.length === 0
                  ? (
                      <div className="text-sm text-muted-foreground">Sin alergias registradas</div>
                    )
                  : (
                      <div className="flex flex-wrap gap-2">
                        {patient.alergies.map((a, i) => (
                          <span
                            key={i}
                            className="inline-block rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold border border-red-200"
                          >
                            {a.name}
                            {a.additionalInfo && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                (
                                {a.additionalInfo}
                                )
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
              </div>
              <div>
                <div className="font-semibold mb-2">Condiciones médicas</div>
                {patient.medicalConditions.length === 0
                  ? (
                      <div className="text-sm text-muted-foreground">Sin condiciones médicas registradas</div>
                    )
                  : (
                      <div className="flex flex-wrap gap-2">
                        {patient.medicalConditions.map((m, i) => (
                          <span
                            key={i}
                            className="inline-block rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold border border-blue-200"
                          >
                            {m.name}
                            {m.additionalInfo && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                (
                                {m.additionalInfo}
                                )
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
              </div>
              <div>
                <div className="font-semibold mb-2">Notas</div>
                <div className="text-sm">
                  {patient.notes ? patient.notes : <span className="text-muted-foreground">Sin notas</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Paciente
