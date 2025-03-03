import Head from "next/head";
import { OnResultFunction, QrReader } from "react-qr-reader";

export default function Home() {
  function handleQrResult(result: Parameters<OnResultFunction>[0]) {
    result?.getText();
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
          </div>
        </div>
      </main>
    </>
  );
}
