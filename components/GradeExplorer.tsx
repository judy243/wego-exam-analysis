"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Chart, COLOR } from "./chartSetup";
import type { Cohort } from "@/lib/data";

export default function GradeExplorer({ cohorts }: { cohorts: Cohort[] }) {
  const [activeKey, setActiveKey] = useState(cohorts[0]?.key ?? "g7");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const grade = cohorts.find((c) => c.key === activeKey) ?? cohorts[0];

  const subs = useMemo(
    () => (grade ? [...grade.subjects].sort((a, b) => b.mean - a.mean) : []),
    [grade]
  );

  const avgMean = subs.length
    ? subs.reduce((a, s) => a + s.mean, 0) / subs.length
    : 0;
  const top = subs[0];
  const bot = subs[subs.length - 1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !subs.length) return;

    const labels = subs.map((s) => s.name);
    const hasLow = subs.every((s) => s.low != null);
    const datasets: object[] = [
      {
        label: hasLow ? "低標 → 高標" : "均標 → 高標",
        type: "bar",
        data: subs.map((s) => [hasLow ? s.low : s.mean, s.high]),
        backgroundColor: COLOR.wash,
        borderColor: COLOR.soft,
        borderWidth: 1,
        borderSkipped: false,
        borderRadius: 4,
        barPercentage: 0.55,
      },
      {
        label: "均標",
        type: "scatter",
        data: subs.map((s, i) => ({ x: s.mean, y: i })),
        backgroundColor: COLOR.deep,
        borderColor: COLOR.deep,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ];

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const chart = new Chart(canvas, {
      type: "bar",
      data: { labels, datasets: datasets as any },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: { usePointStyle: true, padding: 14 },
          },
          tooltip: {
            backgroundColor: COLOR.ink,
            padding: 12,
            cornerRadius: 6,
            callbacks: {
              label: (c: any) => {
                if (c.dataset.type === "scatter") return ` 均標 ${c.parsed.x}`;
                const v = c.raw as [number, number];
                return ` ${c.dataset.label}: ${v[0]} → ${v[1]}`;
              },
            },
          },
        },
        scales: {
          x: {
            min: 40,
            max: 100,
            grid: { color: COLOR.hair },
            border: { display: false },
          },
          y: { grid: { display: false }, border: { color: COLOR.hair } },
        },
      },
    } as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return () => chart.destroy();
  }, [subs]);

  if (!grade) return null;

  return (
    <>
      <div className="tabs" role="tablist">
        {cohorts.map((c) => (
          <button
            key={c.key}
            className="tab"
            role="tab"
            aria-selected={c.key === activeKey}
            onClick={() => setActiveKey(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="stats">
        <div className="stat">
          <div className="label">Cohort size</div>
          <div className="value">
            {grade.size}
            <small>人</small>
          </div>
        </div>
        <div className="stat">
          <div className="label">Average 均標</div>
          <div className="value">{avgMean.toFixed(1)}</div>
          <div className="sub">across {subs.length} subjects</div>
        </div>
        <div className="stat">
          <div className="label">最高均標 · Highest mean</div>
          <div className="value" style={{ fontSize: 28 }}>
            {top?.name ?? "—"}
          </div>
          <div className="sub">均標 {top?.mean}</div>
        </div>
        <div className="stat">
          <div className="label">最低均標 · Lowest mean</div>
          <div className="value" style={{ fontSize: 28 }}>
            {bot?.name ?? "—"}
          </div>
          <div className="sub">均標 {bot?.mean}</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Range: 低標 → 均標 → 高標</h3>
          <div className="cap">
            The gap between low and high markers shows internal variance within the cohort.
          </div>
          <div className="chart-wrap">
            <canvas ref={canvasRef} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Subject scoreboard</h3>
          <div className="cap">
            Sorted by 均標 (mean). Green bar length encodes the mean on a 0–100 scale.
          </div>
          <div style={{ maxHeight: 340, overflow: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>科目</th>
                  <th>均標</th>
                  <th>高標</th>
                  <th>低標</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.name}>
                    <td>{s.name}</td>
                    <td className="cell-bar">
                      <span
                        className="fill"
                        style={{ width: `${Math.max(2, s.mean)}%` }}
                      />
                      <span className="num">{s.mean.toFixed(2)}</span>
                    </td>
                    <td>{s.high?.toFixed(2) ?? "—"}</td>
                    <td>{s.low != null ? s.low.toFixed(2) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
