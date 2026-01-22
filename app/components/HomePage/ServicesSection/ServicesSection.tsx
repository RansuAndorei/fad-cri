import { Button, Grid, GridCol, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

type Props = {
  serviceList: string[];
};

const ServicesSection = ({ serviceList }: Props) => {
  return (
    <Grid justify="center" align="center" py={80} px="xs">
      <GridCol span={{ base: 12, md: 4 }}>
        <Image
          src="/images/service-1.jpg"
          alt="services"
          width={400}
          height={400}
          style={{ borderRadius: 8, objectFit: "cover", width: "100%", height: "auto" }}
        />
      </GridCol>
      <GridCol span={{ base: 12, md: 6 }}>
        <Stack gap="xl" align="center">
          <Stack gap={0} align="center">
            <Text>OUR PREMIUM SERVICES</Text>
            <Title>Professional Care for Your Needs</Title>
          </Stack>
          <Text>{serviceList.join(" | ")}</Text>
          <Button variant="outline" component={Link} href="/services">
            See More
          </Button>
        </Stack>
      </GridCol>
    </Grid>
  );
};

export default ServicesSection;
