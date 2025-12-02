// lib/cardUtil.tsx
// provides utility for card information

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  StopOutlined,
} from "@ant-design/icons";

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
};

export const getAvailability = (percent: number) => {
  if (percent < 60) return "high";
  if (percent < 80) return "medium";
  if (percent < 100) return "low";
  return "out";
};