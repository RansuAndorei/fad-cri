"use client";

import { Container, Title } from "@mantine/core";
import { capitalize } from "lodash";
import { usePathname } from "next/navigation";

const Page = () => {
  const path = usePathname();

  return (
    <Container>
      <Title order={1}>{capitalize(path)} Page</Title>
    </Container>
  );
};

export default Page;
