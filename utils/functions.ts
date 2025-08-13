import { rem, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import moment from "moment";

export const mobileNumberFormatter = (number: string) => {
  return `+63 (${number.slice(0, 3)}) ${number.slice(3, 6)} ${number.slice(6)}`;
};

export const formatDate = (dateValue: Date) => {
  return moment(dateValue).format("YYYY-MM-DD");
};

export const nailShapeMap: Record<string, { width: number; height: number; radius: number }> = {
  Thumb: { width: 72, height: 90, radius: 38 },
  Index: { width: 62, height: 88, radius: 34 },
  Middle: { width: 64, height: 92, radius: 34 },
  Ring: { width: 60, height: 86, radius: 32 },
  Pinky: { width: 52, height: 76, radius: 28 },
};

export const useNailBoxStyle = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (label: string) => {
    const shape = nailShapeMap[label];

    return {
      width: rem(shape.width),
      height: rem(shape.height),
      borderRadius: rem(shape.radius),
      border: `2px dashed ${isDark ? theme.colors.gray[6] : theme.colors.gray[4]}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      cursor: "pointer",
      backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
    };
  };
};
