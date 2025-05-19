import { useForm, type UseFormReturn } from "react-hook-form"
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
import { useRouter } from "next/router"

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Número de usuario inválido",
  }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
})

type FormSchema = z.output<typeof formSchema>

export default function Home()
{
  const router = useRouter()
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  function handleSubmit(data: FormSchema)
  {
    void router.push("/centro")
  }

  return (
    <div className="mx-auto grid h-screen max-w-[1000px] place-items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mx-auto grid w-full max-w-[460px] gap-y-6"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/chelly-med/logo.png"
            alt="logo"
            className="mx-auto w-[120px]"
          />
          <p className="mb-8 text-center text-2xl font-medium">MediQR</p>
          <UsernameField {...form} />
          <PasswordField {...form} />
          <Button type="submit">Iniciar sesión</Button>
        </form>
      </Form>
    </div>
  )
}

const UsernameField = (form: UseFormReturn<FormSchema>) =>
{
  return (
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Número de usuario</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

const PasswordField = (props: UseFormReturn<FormSchema>) => (
  <FormField
    control={props.control}
    name="password"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Contraseña</FormLabel>
        <FormControl>
          <Input type="password" {...field} />
        </FormControl>
      </FormItem>
    )}
  />
)
