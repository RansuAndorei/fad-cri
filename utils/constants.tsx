import {
  IconCalendarCheck,
  IconHome,
  IconIdBadge,
  IconListDetails,
  IconPhoto,
  IconQuestionMark,
  IconSparkles,
} from "@tabler/icons-react";

export const SMALL_SCREEN = "(max-width: 992px)";
export const SKIPPED_ERROR_MESSAGES = ["Email already registered."];
export const TAB_LIST = [
  { label: "home", icon: <IconHome size={16} /> },
  { label: "services", icon: <IconSparkles size={16} /> },
  { label: "gallery", icon: <IconPhoto size={16} /> },
  { label: "about me", icon: <IconIdBadge size={16} /> },
];
export const HELP_TAB_LIST = [
  { label: "faqs", icon: <IconQuestionMark size={16} /> },
  { label: "guidelines", icon: <IconListDetails size={16} /> },
  { label: "reservation", icon: <IconCalendarCheck size={16} /> },
];
export const GENDER_OPTION = [
  {
    label: "Male",
    value: "MALE",
  },
  {
    label: "Female",
    value: "FEMALE",
  },
  {
    label: "Other",
    value: "OTHER",
  },
];
export const FINGER_LABEL = ["Pinky", "Ring", "Middle", "Index", "Thumb"];
export const ROW_PER_PAGE = 10;
export const APPOINTMENT_STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export const DEFAULT_MANTINE_COLOR_LIST = [
  "dark",
  "gray",
  "red",
  "pink",
  "grape",
  "violet",
  "indigo",
  "blue",
  "cyan",
  "green",
  "lime",
  "yellow",
  "orange",
  "teal",
];

export const DEFAULT_MANTINE_COLOR_HEX_LIST = [
  "#25262B",
  "#868E96",
  "#FA5252",
  "#E64980",
  "#BE4BDB",
  "#7950F2",
  "#4C6EF5",
  "#228BE6",
  "#15AABF",
  "#12B886",
  "#40C057",
  "#82C91E",
  "#FAB005",
  "#FD7E14",
];

export const DAYS_OF_THE_WEEK = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
