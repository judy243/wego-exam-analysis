import { insforge } from "./insforge";

export type SubjectStat = {
  name: string;
  mean: number;
  high: number | null;
  low: number | null;
  sd: number | null;
  bins: number[] | null;
};

export type Cohort = {
  key: string;
  label: string;
  size: number;
  bands: string[] | null;
  subjects: SubjectStat[];
};

export type Insight = { seq: number; body: string };

export type ExamData = {
  title: string;
  cohorts: Cohort[];
  insights: Insight[];
};

const EXAM_ID = "114-2-1";

const num = (v: unknown): number => Number(v);
const numOrNull = (v: unknown): number | null => (v == null ? null : Number(v));

export async function getExamData(): Promise<ExamData> {
  const [examRes, cohortRes, insightRes] = await Promise.all([
    insforge.database.from("exams").select("id, title").eq("id", EXAM_ID),
    insforge.database
      .from("cohorts")
      .select(
        "key, label, size, bands, sort_order, subject_stats(name, mean, high, low, sd, bins, sort_order)"
      )
      .eq("exam_id", EXAM_ID)
      .order("sort_order", { ascending: true }),
    insforge.database
      .from("insights")
      .select("seq, body")
      .eq("exam_id", EXAM_ID)
      .order("seq", { ascending: true }),
  ]);

  const error = examRes.error ?? cohortRes.error ?? insightRes.error;
  if (error) {
    throw new Error(`InsForge fetch failed: ${JSON.stringify(error)}`);
  }

  type RawSubject = {
    name: string;
    mean: unknown;
    high: unknown;
    low: unknown;
    sd: unknown;
    bins: number[] | null;
    sort_order: number;
  };
  type RawCohort = {
    key: string;
    label: string;
    size: number;
    bands: string[] | null;
    sort_order: number;
    subject_stats: RawSubject[];
  };

  const cohorts: Cohort[] = ((cohortRes.data ?? []) as RawCohort[]).map((c) => ({
    key: c.key,
    label: c.label,
    size: num(c.size),
    bands: c.bands,
    subjects: [...(c.subject_stats ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({
        name: s.name,
        mean: num(s.mean),
        high: numOrNull(s.high),
        low: numOrNull(s.low),
        sd: numOrNull(s.sd),
        bins: s.bins,
      })),
  }));

  const exam = (examRes.data ?? [])[0] as { title?: string } | undefined;

  return {
    title: exam?.title ?? "第一次段考",
    cohorts,
    insights: ((insightRes.data ?? []) as Insight[]).map((i) => ({
      seq: num(i.seq),
      body: i.body,
    })),
  };
}
