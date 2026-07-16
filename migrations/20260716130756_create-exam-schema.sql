-- Exam analytics schema for wego-exam-analysis.
-- Public read-only dataset: the site reads via the anon role; writes happen
-- only through project_admin (CLI migrations / dashboard).

create table public.exams (
  id text primary key,
  title text not null,
  school_year text not null,
  term smallint not null,
  seq smallint not null,
  created_at timestamptz not null default now()
);

create table public.cohorts (
  id bigint generated always as identity primary key,
  exam_id text not null references public.exams(id) on delete cascade,
  key text not null,
  label text not null,
  size integer not null,
  bands jsonb,
  sort_order integer not null default 0,
  unique (exam_id, key)
);

create table public.subject_stats (
  id bigint generated always as identity primary key,
  cohort_id bigint not null references public.cohorts(id) on delete cascade,
  name text not null,
  mean numeric(5,2) not null,
  high numeric(5,2),
  low numeric(5,2),
  sd numeric(5,2),
  bins jsonb,
  sort_order integer not null default 0,
  unique (cohort_id, name)
);

create table public.insights (
  id bigint generated always as identity primary key,
  exam_id text not null references public.exams(id) on delete cascade,
  seq smallint not null,
  body text not null,
  unique (exam_id, seq)
);

create index cohorts_exam_idx on public.cohorts (exam_id);
create index subject_stats_cohort_idx on public.subject_stats (cohort_id);
create index insights_exam_idx on public.insights (exam_id);

alter table public.exams enable row level security;
alter table public.cohorts enable row level security;
alter table public.subject_stats enable row level security;
alter table public.insights enable row level security;

create policy "public read exams" on public.exams
  for select to anon, authenticated using (true);
create policy "public read cohorts" on public.cohorts
  for select to anon, authenticated using (true);
create policy "public read subject_stats" on public.subject_stats
  for select to anon, authenticated using (true);
create policy "public read insights" on public.insights
  for select to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant select on public.exams, public.cohorts, public.subject_stats, public.insights
  to anon, authenticated;
revoke insert, update, delete
  on public.exams, public.cohorts, public.subject_stats, public.insights
  from anon, authenticated;
