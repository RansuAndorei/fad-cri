import { capitalize, toNumber } from "lodash";
import moment from "moment-timezone";
import { DATE_AND_TIME_FORMAT, DEFAULT_MANTINE_COLOR_LIST } from "./constants";

export const mobileNumberFormatter = (number: string) => {
  return `+63 (${number.slice(0, 3)}) ${number.slice(3, 6)} ${number.slice(6)}`;
};

export const formatDate = (dateValue: Date) => {
  return moment(dateValue).format("MM-DD-YYYY");
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

export const formatDecimal = (value: number | string, places = 2): string => {
  return toNumber(value).toFixed(places);
};

export const combineDateTime = (date: string, time: string) => {
  const [timePart, meridiem] = time.split(" ");
  const [hourStr, minuteStr] = timePart.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (meridiem === "PM" && hour !== 12) {
    hour += 12;
  }
  if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }
  return moment(date)
    .set({
      hour,
      minute,
      second: 0,
    })
    .format(DATE_AND_TIME_FORMAT);
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

export const statusToColorHex = (status: string) => {
  switch (status) {
    case "PAID":
    case "COMPLETED":
      return "#40C057";
    case "FAILED":
      return "#FA5252";
    case "CANCELLED":
      return "#868E96";
    case "PENDING":
      return "#228BE6";
    case "SCHEDULED":
      return "#82C91E";
  }
};

export const getAvatarColor = (number: number) => {
  const randomColor = DEFAULT_MANTINE_COLOR_LIST[number % DEFAULT_MANTINE_COLOR_LIST.length];
  return randomColor;
};

export const formatPeso = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDaysInOperatingHours = (days: string[]) => {
  if (days.length === 1) return capitalize(days[0]);

  return `${capitalize(days[0])} — ${capitalize(days[days.length - 1])}`;
};

export const formatTimeInOperatingHours = (time: string) => {
  if (!time) return "";
  const [rawTime] = time.split("+");
  const [hour, minute] = rawTime.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
};

export const isAppError = (e: unknown): e is { message: string } =>
  typeof e === "object" && e !== null && "message" in e;
