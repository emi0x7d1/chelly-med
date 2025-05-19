import Head from "next/head"
import { useRouter } from "next/router"
import { type OnResultFunction, QrReader } from "react-qr-reader"
import { notifications } from "@mantine/notifications"
import Link from "next/link"

export default function Home()
{
  const router = useRouter()

  const handleQrResult = (result: Parameters<OnResultFunction>[0]) =>
  {
    const text = result?.getText()
    if (!text) return

    let param = text
    const paramNum = Number(param)

    if (!Number.isFinite(paramNum))
    {
      try
      {
        const url = new URL(text)
        const lastSegment = url.pathname.split("/").pop()
        if (!lastSegment) throw new Error()
        param = lastSegment
      }
      catch (e)
      {
        notifications.show({
          title: "Error",
          message: "El QR no es válido",
          color: "red",
        })
        console.error(e)
        return
      }
    }

    void router.push(`/centro/pacientes/${param}`)
  }

  return (
    <>
      <Head>
        <title>MediQR</title>
        <meta name="description" content="MediQR" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-[600px] mx-auto">
        <Link href="/centro" className="flex items-center gap-x-2 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/chelly-med/logo.png" alt="logo" className="w-[60px]" />
          <p className="text-2xl font-medium">MediQR</p>
        </Link>

        <div className="grid h-[calc(100vh-160px)] w-full place-items-center justify-items-center px-2">
          <div className="w-full">
            <p className="text-center text-xl">
              Escanee el código QR del paciente
            </p>
            <div className="w-full">
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={handleQrResult}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
