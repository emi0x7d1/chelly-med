import Head from "next/head";
import { useRouter } from "next/router";
import { OnResultFunction, QrReader } from "react-qr-reader";
import * as M from "@mantine/core";
import Link from "next/link";
import { notifications } from "@mantine/notifications";

export default function Home() {
  const router = useRouter();

  function handleQrResult(result: Parameters<OnResultFunction>[0]) {
    const text = result?.getText();
    if (!text) return;

    let param = text;
    const paramNum = Number(param);

    if (!Number.isFinite(paramNum)) {
      try {
        const url = new URL(text);
        const lastSegment = url.pathname.split("/").pop();
        if (!lastSegment) throw new Error();
        param = lastSegment;
      } catch (e) {
        notifications.show({
          title: "Error",
          message: "El QR no es válido",
          color: "red",
        });
        console.error(e);
        return;
      }
    }

    void router.push(`/pacientes/${param}`);
  }

  return (
    <>
      <Head>
        <title>Chelly</title>
        <meta name="description" content="Chelly app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-600px mx-auto">
        <div className="grid h-screen w-full place-items-center justify-items-center px-2">
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

            <M.Paper shadow="sm" p="md" mt="xl" withBorder>
              <M.Title order={4} mb="md">
                Pacientes de prueba
              </M.Title>
              <M.Text mb="md" size="sm" c="dimmed">
                Para fines de demostración, puede acceder directamente a estos
                pacientes:
              </M.Text>
              <M.Group>
                <M.Button
                  component={Link}
                  href="/pacientes/12345"
                  variant="outline"
                >
                  María González
                </M.Button>
                <M.Button
                  component={Link}
                  href="/pacientes/67890"
                  variant="outline"
                >
                  Juan Pérez
                </M.Button>
              </M.Group>
            </M.Paper>
          </div>
        </div>
      </main>
    </>
  );
}
