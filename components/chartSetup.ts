"use client";

import {
  Chart,
  BarController,
  ScatterController,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  BarController,
  ScatterController,
  BarElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

if (typeof window !== "undefined") {
  try {
    Chart.defaults.font.family =
      getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
  } catch {
    Chart.defaults.font.family = "system-ui, sans-serif";
  }
  Chart.defaults.font.size = 12;
  Chart.defaults.color = "#5a574e";
}

export const COLOR = {
  deep: "#2c6e54",
  mid: "#439e80",
  soft: "#57a78e",
  pale: "#a9ecd3",
  wash: "#e2f4eb",
  ink: "#141413",
  muted: "#5a574e",
  hair: "#e6e4da",
  cream: "#faf9f5",
  accent: "#c15f3c",
};

export { Chart };
