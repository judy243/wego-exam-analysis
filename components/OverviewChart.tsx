"use client";

import { useEffect, useRef } from "react";
import { Chart, COLOR } from "./chartSetup";
import type { Cohort } from "@/lib/data";

const OVERVIEW_KEYS = ["g7", "g8", "g9", "g10n"];

export default function OverviewChart({ cohorts }: { cohorts: Cohort[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const grades = OVERVIEW_KEYS.map((k) => cohorts.find((c) => c.key === k)).filter(
      (c): c is Cohort => Boolean(c)
    );
    const allSubs = [...new Set(grades.flatMap((g) => g.subjects.map((s) => s.name)))];
    const palette = [COLOR.deep, COLOR.mid, COLOR.soft, COLOR.pale];
    const datasets = grades.map((g, i) => ({
      label: g.label.split(" · ")[0],
      data: allSubs.map((sn) => {
        const s = g.subjects.find((x) => x.name === sn);
        return s ? s.mean : null;
      }),
      backgroundColor: palette[i],
      borderRadius: 4,
      barPercentage: 0.85,
      categoryPercentage: 0.78,
    }));

    const chart = new Chart(canvas, {
      type: "bar",
      data: { labels: allSubs, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: { usePointStyle: true, pointStyle: "rectRounded", padding: 18 },
          },
          tooltip: {
            backgroundColor: COLOR.ink,
            padding: 12,
            titleFont: { weight: 600 },
            cornerRadius: 6,
            callbacks: { label: (c) => ` ${c.dataset.label}: ${c.parsed.y ?? "—"}` },
          },
        },
        scales: {
          x: { grid: { display: false }, border: { color: COLOR.hair } },
          y: {
            min: 40,
            max: 100,
            grid: { color: COLOR.hair },
            border: { display: false },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [cohorts]);

  return <canvas ref={canvasRef} />;
}
