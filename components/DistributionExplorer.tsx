"use client";

import { useEffect, useRef, useState } from "react";
import { Chart, COLOR } from "./chartSetup";
import type { Cohort } from "@/lib/data";

export default function DistributionExplorer({ cohorts }: { cohorts: Cohort[] }) {
  const withBins = cohorts.filter(
    (c) => c.bands && c.subjects.some((s) => s.bins)
  );
  const [gradeKey, setGradeKey] = useState(withBins[0]?.key ?? "g7");
  const grade = withBins.find((c) => c.key === gradeKey) ?? withBins[0];
  const [subjectName, setSubjectName] = useState(grade?.subjects[0]?.name ?? "");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const subject =
    grade?.subjects.find((s) => s.name === subjectName) ?? grade?.subjects[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grade || !subject?.bins || !grade.bands) return;

    const colors = grade.bands.map((b) => {
      if (b === "60以下") return COLOR.accent;
      if (b === "60-69") return COLOR.muted;
      if (b === "70-79") return COLOR.soft;
      if (b === "80-89") return COLOR.mid;
      return COLOR.deep;
    });

    const size = grade.size;
    const chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: grade.bands,
        datasets: [
          {
            label: "人數",
            data: subject.bins,
            backgroundColor: colors,
            borderRadius: 4,
            barPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: COLOR.ink,
            padding: 12,
            cornerRadius: 6,
            callbacks: {
              label: (c) => {
                const y = c.parsed.y ?? 0;
                return ` ${y} 人 · ${((y / size) * 100).toFixed(1)}%`;
              },
            },
          },
        },
        scales: {
          x: { grid: { display: false }, border: { color: COLOR.hair } },
          y: {
            grid: { color: COLOR.hair },
            border: { display: false },
            beginAtZero: true,
          },
        },
      },
    });

    return () => chart.destroy();
  }, [grade, subject]);

  if (!grade || !subject) return null;

  return (
    <>
      <div className="subj-row" role="tablist" style={{ marginTop: 32 }}>
        {withBins.map((c) => (
          <button
            key={c.key}
            className="pill"
            aria-pressed={c.key === gradeKey}
            onClick={() => {
              setGradeKey(c.key);
              const next = withBins.find((x) => x.key === c.key);
              setSubjectName(next?.subjects[0]?.name ?? "");
            }}
          >
            {c.label.split(" · ")[0]}
          </button>
        ))}
      </div>
      <div className="subj-row">
        {grade.subjects.map((s) => (
          <button
            key={s.name}
            className="pill"
            aria-pressed={s.name === subject.name}
            onClick={() => setSubjectName(s.name)}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="chart-card">
        <h3>
          {grade.label.split(" · ")[0]} · {subject.name}
        </h3>
        <div className="cap">
          均標 {subject.mean} · 高標 {subject.high} · 低標 {subject.low} · SD{" "}
          {subject.sd} · n={grade.size}
        </div>
        <div className="chart-wrap" style={{ height: 380 }}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </>
  );
}
