import { ColorSchemeScript, Loader, mantineHtmlProps } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import { ReactNode, Suspense } from "react";
import HomeLayout from "./components/HomeLayout/HomeLayout";
import { Providers } from "./providers";

export const metadata = {
  title: "Barbers",
  description: "Barbers' App Home Page",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/logo.png" />
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
