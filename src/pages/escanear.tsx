import Head from "next/head"
import { type NextRouter, useRouter } from "next/router"
import { notifications } from "@mantine/notifications"
import Link from "next/link"
import QrScanner from "qr-scanner"
import { useEffect, useState } from "react"

export default function Home()
{
  const router = useRouter()
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)

  useEffect(() =>
  {
    if (videoElement == null)
    {
      return
    }

    const qrScanner = new QrScanner(
      videoElement,
      result => handleQrResult({ text: result.data, router }),
      { highlightScanRegion: true, highlightCodeOutline: true, onDecodeError: console.error }
    )

    void qrScanner.start()
  }, [router, videoElement])

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
            <div className="w-full min-h-[200px]">
              <video ref={setVideoElement} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function handleQrResult({ text, router }: { text: string, router: NextRouter })
{
  let param = text
  const paramNum = Number(param)

  if (!Number.isFinite(paramNum))
  {
    try
    {
      const url = new URL(text)
      // extract uuid from url
      const uuid = url.searchParams.get("uuid")
      if (!uuid) throw new Error()
      param = uuid
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

  void router.push(`/centro/pacientes?uuid=${param}`)
}
