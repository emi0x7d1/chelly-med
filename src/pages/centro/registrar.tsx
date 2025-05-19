import { useForm, type UseFormReturn, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { useSetAtom } from "jotai/react"
import { patientsAtom } from "~/state"
import { useRouter } from "next/router"
import { Dialog, DialogContent } from "~/components/ui/dialog"
import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { ulid } from "ulid"
import Link from "next/link"

const bloodTypes = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
]

const formSchema = z.object({
  firstName: z.string().min(1, { message: "Nombre requerido" }),
  lastName: z.string().min(1, { message: "Apellido requerido" }),
  birthDate: z.string().min(1, { message: "Fecha de nacimiento requerida" }),
  phoneNumber: z.string().min(1, { message: "Teléfono requerido" }),
  bloodType: z.enum([
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
  ], { message: "Tipo de sangre requerido" }),
  alergies: z.array(z.object({
    name: z.string().min(1, { message: "Nombre requerido" }),
    additionalInfo: z.string(),
  })),
  medicalConditions: z.array(z.object({
    name: z.string().min(1, { message: "Nombre requerido" }),
    additionalInfo: z.string(),
  })),
  notes: z.string(),
})

type FormSchema = z.output<typeof formSchema>

type FieldProps = UseFormReturn<FormSchema>

const FirstNameField = (form: FieldProps) => (
  <FormField
    control={form.control}
    name="firstName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Nombre</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItem>
    )}
  />
)

const LastNameField = (form: FieldProps) => (
  <FormField
    control={form.control}
    name="lastName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Apellidos</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItem>
    )}
  />
)

const BirthDateField = (form: FieldProps) => (
  <FormField
    control={form.control}
    name="birthDate"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Fecha de nacimiento</FormLabel>
        <FormControl>
          <Input type="date" {...field} />
        </FormControl>
      </FormItem>
    )}
  />
)

const PhoneNumberField = (form: FieldProps) => (
  <FormField
    control={form.control}
    name="phoneNumber"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Teléfono</FormLabel>
        <FormControl>
          <Input type="tel" {...field} />
        </FormControl>
      </FormItem>
    )}
  />
)

const BloodTypeField = (form: FieldProps) => (
  <FormField
    control={form.control}
    name="bloodType"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Tipo de sangre</FormLabel>
        <FormControl>
          <select
            {...field}
            className="block w-full rounded-md border px-3 py-2"
          >
            {bloodTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormControl>
      </FormItem>
    )}
  />
)

const AlergiesField = (form: FieldProps) =>
{
  const { control } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "alergies",
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <FormLabel>Alergias</FormLabel>
        <Button type="button" onClick={() => append({ name: "", additionalInfo: "" })}>
          Agregar
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {fields.length === 0
          ? (
              <p className="text-gray-500 text-sm">No hay alergias registradas.</p>
            )
          : (
              fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 items-end">
                  <FormField
                    control={control}
                    name={`alergies.${idx}.name` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Alérgeno</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`alergies.${idx}.additionalInfo` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Información adicional</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" onClick={() => remove(idx)}>
                    Quitar
                  </Button>
                </div>
              ))
            )}
      </div>
    </div>
  )
}

const MedicalConditionsField = (form: FieldProps) =>
{
  const { control } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicalConditions",
  })
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <FormLabel>Condiciones médicas</FormLabel>
        <Button type="button" onClick={() => append({ name: "", additionalInfo: "" })}>
          Agregar
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {fields.length === 0
          ? (
              <p className="text-gray-500 text-sm">No hay condiciones médicas registradas.</p>
            )
          : (
              fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 items-end">
                  <FormField
                    control={control}
                    name={`medicalConditions.${idx}.name` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Condición</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`medicalConditions.${idx}.additionalInfo` as const}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Información adicional</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" onClick={() => remove(idx)}>
                    Quitar
                  </Button>
                </div>
              ))
            )}
      </div>
    </div>
  )
}

const NotasField = (form: FieldProps) => (
  <FormField
    control={form.control}
    name="notes"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Notas</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItem>
    )}
  />
)

const defaultValues: FormSchema = {
  firstName: "",
  lastName: "",
  birthDate: "",
  phoneNumber: "",
  bloodType: "A+",
  alergies: [],
  medicalConditions: [],
  notes: "",
}

const Registrar = () =>
{
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const setPatients = useSetAtom(patientsAtom)
  const [uuid, setUuid] = useState<string | null>(null)
  const [inBrowser, setInBrowser] = useState(false)

  const router = useRouter()

  useEffect(() =>
  {
    setInBrowser(typeof window !== "undefined")
  }, [])

  function handleSubmit(data: FormSchema)
  {
    setIsDialogOpen(true)

    const uuid = ulid()
    setUuid(uuid)
    setPatients(prev => [
      ...prev,
      {
        uuid,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        phoneNumber: data.phoneNumber,
        bloodType: data.bloodType,
        alergies: (data.alergies ?? []).map(a => ({
          name: a.name,
          additionalInfo: a.additionalInfo,
        })),
        medicalConditions: (data.medicalConditions ?? []).map(m => ({
          name: m.name,
          additionalInfo: m.additionalInfo,
        })),
        vitalSigns: [],
        notes: data.notes,
      },
    ])
  }

  function handleCloseDialog()
  {
    setIsDialogOpen(false)
    void router.push("/centro")
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <p className="text-xl font-medium mb-4 text-center">Código QR del paciente</p>
          <div className="flex justify-center">
            {inBrowser && <QRCode id="QRCode" value={`${window.location.href.replaceAll("/registrar", "")}/pacientes?uuid=${uuid}`} />}
          </div>
          <Button onClick={() =>
          {
            const svg = document.getElementById("QRCode")!
            const svgData = new XMLSerializer().serializeToString(svg)
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")!
            const img = new Image()
            img.onload = () =>
            {
              canvas.width = img.width
              canvas.height = img.height
              ctx.drawImage(img, 0, 0)
              const pngFile = canvas.toDataURL("image/png")
              const downloadLink = document.createElement("a")
              downloadLink.download = "QRCode"
              downloadLink.href = `${pngFile}`
              downloadLink.click()
            }
            img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
          }}
          >
            Descargar
          </Button>
        </DialogContent>
      </Dialog>
      <div className="max-w-[1000px] w-full mx-auto">
        <Link href="/centro" className="flex items-center gap-x-2 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/chelly-med/logo.png" alt="logo" className="w-[60px]" />
          <p className="text-2xl font-medium">MediQR</p>
        </Link>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mx-auto grid w-full max-w-[460px] gap-y-6"
          >
            <FirstNameField {...form} />
            <LastNameField {...form} />
            <BirthDateField {...form} />
            <PhoneNumberField {...form} />
            <BloodTypeField {...form} />
            <AlergiesField {...form} />
            <MedicalConditionsField {...form} />
            <NotasField {...form} />
            <Button type="submit">Registrar paciente</Button>
          </form>
        </Form>
      </div>
    </>
  )
}

export default Registrar
