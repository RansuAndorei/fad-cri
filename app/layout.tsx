import "@mantine/carousel/styles.css";
import { ColorSchemeScript, Loader, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import { ReactNode, Suspense } from "react";
import HomeLayout from "./components/HomeLayout/HomeLayout";
import { Providers } from "./providers";
import "./styles.css";

export const metadata = {
  title: "FadCri",
  description: "FadCri' App Home Page",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/images/logo.png" />
      </head>
      <body>
        <Providers>
          <Suspense fallback={<Loader />}>
            <HomeLayout>{children}</HomeLayout>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;
