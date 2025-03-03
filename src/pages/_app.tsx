import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

import { api } from "~/utils/api";

import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "~/styles/globals.css";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <div className={GeistSans.className}>
          <Component {...pageProps} />
        </div>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
