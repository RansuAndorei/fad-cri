import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/tiptap/styles.css";
import "mantine-datatable/styles.css";
import "./styles.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { ReactNode } from "react";
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
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="shortcut icon" href="/images/logo.png" />
      </head>
      <body>
        <Providers>
          <LoadingOverlay />
          <HomeLayout>{children}</HomeLayout>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
