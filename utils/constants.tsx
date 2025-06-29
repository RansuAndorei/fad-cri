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
