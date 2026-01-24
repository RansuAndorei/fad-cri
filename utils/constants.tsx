import {
  IconAward,
  IconBell,
  IconBrush,
  IconCalendar,
  IconCalendarCheck,
  IconCategory2,
  IconClipboard,
  IconClock,
  IconColorSwatch,
  IconCrown,
  IconCurrencyPeso,
  IconDiamond,
  IconHeart,
  IconHome,
  IconIdBadge,
  IconLayoutDashboard,
  IconList,
  IconListDetails,
  IconMapPin,
  IconPalette,
  IconQuestionMark,
  IconSettings,
  IconSparkles,
  IconStar,
} from "@tabler/icons-react";
import { DaysEnum } from "./types";

export const FETCH_OPTION_LIMIT = 1000;
export const SMALL_SCREEN = "(max-width: 992px)";
export const SKIPPED_ERROR_MESSAGES = ["Email already registered."];
export const TAB_LIST = [
  { label: "home", icon: <IconHome size={16} /> },
  { label: "services", icon: <IconSparkles size={16} /> },
  // { label: "gallery", icon: <IconPhoto size={16} /> },
  { label: "about", icon: <IconIdBadge size={16} /> },
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
] as DaysEnum[];

export const LATE_FEES_LABEL = [
  "11-20 minutes",
  "21-39 minutes",
  "40 minutes to 1 hour",
  "more than 1 hour",
];

export const ADMIN_NAVIGATION_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: IconLayoutDashboard,
    path: `/admin/dashboard`,
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: IconClipboard,
    submenu: [
      {
        id: "schedule-calendar",
        label: "Calendar",
        icon: IconCalendar,
        path: `/admin/schedule/calendar`,
      },
      {
        id: "schedule-list",
        label: "List",
        icon: IconList,
        path: `/admin/schedule/list`,
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: IconSettings,
    submenu: [
      {
        id: "service-settings",
        label: "Service Type",
        icon: IconCategory2,
        path: `/admin/settings/service-type`,
      },
      {
        id: "financial-settings",
        label: "Financial",
        icon: IconCurrencyPeso,
        path: `/admin/settings/financial`,
      },
      {
        id: "scheduling",
        label: "Scheduling",
        icon: IconClock,
        path: `/admin/settings/scheduling`,
      },
      {
        id: "location-and-contact",
        label: "Location & Contact",
        icon: IconMapPin,
        path: `/admin/settings/location-and-contact`,
      },
      {
        id: "reminders",
        label: "Reminders",
        icon: IconBell,
        path: `/admin/settings/reminder`,
      },
    ],
  },
];

export const LATE_FEE_LABEL_LIST = [
  "11-20 minutes",
  "21-39 minutes",
  "40 minutes to 1 hour",
  "More than 1 hour",
];

export const FEATURE_BACKGROUND_COLORS = [
  "cyan",
  "orange",
  "violet",
  "lime",
  "blue",
  "pink",
  "teal",
  "yellow",
  "indigo",
  "red",
  "green",
  "grape",
  "gray",
  "dark",
];

export const FEATURE_ICONS = [
  IconSparkles,
  IconDiamond,
  IconCrown,
  IconStar,
  IconAward,
  IconPalette,
  IconBrush,
  IconColorSwatch,
  IconHeart,
];
