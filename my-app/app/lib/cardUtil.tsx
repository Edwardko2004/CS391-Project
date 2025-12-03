// lib/cardUtil.tsx
// provides utility for card information

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  StopOutlined,
} from "@ant-design/icons";

// a table containing styling and info for availability levels
export const availabilityInfo = {
  high: {
    color: "#10b981",
    label: "Plenty Available",
    icon: CheckCircleOutlined,
  },
  medium: {
    color: "#f59e0b",
    label: "Limited Seats",
    icon: ClockCircleOutlined,
  },
  low: {
    color: "#ef4444",
    label: "Almost Gone!",
    icon: FireOutlined,
  },
  out: {
    color: "#6b7280",
    label: "Fully Reserved",
    icon: StopOutlined,
  },
  over: {
    color: "#6b7280",
    label: "Event Ended",
    icon: StopOutlined,
  }
};

// provides the availability level given a percent level (between 0 and 100)
export const getAvailability = (percent: number, over: boolean) => {
  if (over) return "over";
  if (percent < 60) return "high";
  if (percent < 80) return "medium";
  if (percent < 100) return "low";
  return "out";
};