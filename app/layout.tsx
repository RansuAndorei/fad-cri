import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "mantine-datatable/styles.css";
import "./styles.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { ReactNode, Suspense } from "react";
import HomeLayout from "./components/HomeLayout/HomeLayout";
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay";
import { Providers } from "./providers";

export const metadata = {
  title: "FadCri",
  description: "FadCri' App Home Page",
};

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/images/logo.png" />
      </head>
      <body>
        <Providers>
          <Suspense fallback={<LoadingOverlay />}>
            <LoadingOverlay />
            <HomeLayout>{children}</HomeLayout>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
