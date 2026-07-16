import NavBar from "@/components/NavBar";
import OverviewChart from "@/components/OverviewChart";
import GradeExplorer from "@/components/GradeExplorer";
import DistributionExplorer from "@/components/DistributionExplorer";
import { getExamData, type Cohort } from "@/lib/data";

// 資料在 InsForge，改資料後最多一小時內全站更新
export const revalidate = 3600;

const GRADE_LEVEL_KEYS = ["g7", "g8", "g9", "g10n"];

function cohortMean(c: Cohort): string {
  if (!c.subjects.length) return "—";
  return (c.subjects.reduce((a, s) => a + s.mean, 0) / c.subjects.length).toFixed(2);
}

export default async function Page() {
  const { cohorts, insights } = await getExamData();

  const byKey = (key: string) => cohorts.find((c) => c.key === key);
  const gradeLevels = GRADE_LEVEL_KEYS.map(byKey).filter((c): c is Cohort =>
    Boolean(c)
  );
  const totalStudents = gradeLevels.reduce((a, c) => a + c.size, 0);
  const maxSubjects = Math.max(...cohorts.map((c) => c.subjects.length));
  const g7 = byKey("g7");
  const g8 = byKey("g8");
  const g9 = byKey("g9");
  const g10n = byKey("g10n");

  return (
    <>
      <NavBar />

      <section className="hero">
        <div className="container">
          <div className="eyebrow">Research · 114-2 第一次段考 · Index by 學姐</div>
          <h1 className="display">
            薇閣國中第一次段考<em>成績分析</em>
          </h1>
          <p className="lead">
            An interactive analysis of 臺北市私立薇閣高級中學 first-midterm results —
            七年級 through 高一 — drawn from six to nine subject sittings per grade,
            totalling {totalStudents.toLocaleString("en-US")} student records across
            four cohorts.
          </p>
          <div className="meta">
            <span>
              <span className="dot" />
              {totalStudents.toLocaleString("en-US")} students
            </span>
            <span>
              <span className="dot" />
              {gradeLevels.length} grade cohorts
            </span>
            <span>
              <span className="dot" />
              {maxSubjects} subjects tracked
            </span>
            <span>
              <span className="dot" />
              114 學年度 · 第二學期
            </span>
          </div>
        </div>
      </section>

      <section id="overview">
        <div className="container">
          <div className="eyebrow">Section 01 · Overview</div>
          <h2>Cohort at a glance</h2>
          <p className="muted">
            Each cohort carries a different subject mix: junior-high (7–8) blends
            language, mathematics, social studies and science; grade 9 adds 生科 and
            微觀; grade 10 splits into 社會組 and 自然組 tracks.
          </p>

          <div className="stats" style={{ marginTop: 48 }}>
            {g7 && (
              <div className="stat">
                <div className="label">Grade 7 · 七年級</div>
                <div className="value">
                  {g7.size}
                  <small>人</small>
                </div>
                <div className="sub">
                  {g7.subjects.length} subjects · mean {cohortMean(g7)}
                </div>
              </div>
            )}
            {g8 && (
              <div className="stat">
                <div className="label">Grade 8 · 八年級</div>
                <div className="value">
                  {g8.size}
                  <small>人</small>
                </div>
                <div className="sub">
                  {g8.subjects.length} subjects · mean {cohortMean(g8)}
                </div>
              </div>
            )}
            {g9 && (
              <div className="stat">
                <div className="label">Grade 9 · 九年級</div>
                <div className="value">
                  {g9.size}
                  <small>人</small>
                </div>
                <div className="sub">
                  {g9.subjects.length} subjects · mean {cohortMean(g9)}
                </div>
              </div>
            )}
            {g10n && (
              <div className="stat">
                <div className="label">Grade 10 · 高一</div>
                <div className="value">
                  {g10n.size}
                  <small>人</small>
                </div>
                <div className="sub">自然組 · {g10n.subjects.length} subjects</div>
              </div>
            )}
          </div>

          <div className="chart-card" style={{ marginTop: 16 }}>
            <h3>Mean score (均標) by grade and subject</h3>
            <div className="cap">
              Lower bars mark the subjects where cohorts struggle most. Hover for
              exact values.
            </div>
            <div className="chart-wrap" style={{ height: 420 }}>
              <OverviewChart cohorts={cohorts} />
            </div>
          </div>
        </div>
      </section>

      <section id="grades">
        <div className="container">
          <div className="eyebrow">Section 02 · By Grade</div>
          <h2>Pick a cohort, read the story</h2>
          <p className="muted">
            Switch between grade cohorts to compare 均標 (mean), 高標 (top-quartile
            mean) and 低標 (bottom-quartile mean) across every subject that cohort
            sat.
          </p>
          <GradeExplorer cohorts={cohorts} />
        </div>
      </section>

      <section id="distribution">
        <div className="container">
          <div className="eyebrow">Section 03 · Distribution</div>
          <h2>Where the students actually land</h2>
          <p className="muted">
            Score-band histograms for junior-high cohorts (7–9). Pick a subject to
            see how students distribute across the 60以下 → 100 buckets.
          </p>
          <DistributionExplorer cohorts={cohorts} />

          <div className="insights">
            {insights.map((i) => (
              <div className="insight" key={i.seq}>
                <div className="eyebrow">
                  Finding · {String(i.seq).padStart(2, "0")}
                </div>
                <p dangerouslySetInnerHTML={{ __html: i.body }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div>
            <div className="brand">
              Wego · <em>Academic Index</em>
            </div>
            <div className="copy" style={{ marginTop: 12 }}>
              Based on 臺北市私立薇閣高級中學 114 學年度第二學期 第一次段考 official
              reports.
            </div>
            <div className="copy" style={{ marginTop: 8 }}>
              本網站由{" "}
              <a
                href="https://lin.ee/6w1to8e"
                target="_blank"
                rel="noopener"
                style={{ color: "#faf9f5", textDecorationColor: "#5a574e" }}
              >
                薇閣學姐補習班
              </a>{" "}
              製作 · Made by Wego Senior Sisters Cram School
            </div>
          </div>
          <div className="copy">
            © 2026 · Built with the Anthropic Economic Index design language.
          </div>
        </div>
      </footer>
    </>
  );
}
