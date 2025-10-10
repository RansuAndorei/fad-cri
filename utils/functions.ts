import { rem, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { toNumber } from "lodash";
import moment from "moment";

export const mobileNumberFormatter = (number: string) => {
  return `+63 (${number.slice(0, 3)}) ${number.slice(3, 6)} ${number.slice(6)}`;
};

export const formatDate = (dateValue: Date) => {
  return moment(dateValue).format("YYYY-MM-DD");
};

export const formatTime = (dateValue: Date) => {
  return moment(dateValue).format("hh:mm A");
};

export const formatWordDate = (dateValue: Date) => {
  return moment(dateValue).format("MMMM D, YYYY");
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

export const formatDecimal = (value: number | string, places = 2): string => {
  return toNumber(value).toFixed(places);
};

export const combineDateTime = (date: Date, time: string) => {
  return moment(date)
    .set({
      hour: parseInt(time.split(":")[0], 10),
      minute: parseInt(time.split(":")[1], 10),
      second: 0,
    })
    .toDate();
};

export const statusToColor = (status: string) => {
  switch (status) {
    case "PAID":
    case "COMPLETED":
      return "green";
    case "FAILED":
      return "red";
    case "CANCELLED":
      return "gray";
    case "PENDING":
      return "blue";
    case "SCHEDULED":
      return "lime";
  }
};
