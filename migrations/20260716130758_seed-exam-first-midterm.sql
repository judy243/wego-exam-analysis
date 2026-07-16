-- Seed: 114 學年度第二學期 第一次段考.
-- Data ported 1:1 from the original static index.html DATA object.

insert into public.exams (id, title, school_year, term, seq)
values ('114-2-1', '114 學年度第二學期 第一次段考', '114', 2, 1);

insert into public.cohorts (exam_id, key, label, size, bands, sort_order) values
  ('114-2-1', 'g7',   '七年級 · Grade 7', 454, '["60以下","60-69","70-79","80-89","90-99","100"]'::jsonb, 1),
  ('114-2-1', 'g8',   '八年級 · Grade 8', 598, '["60以下","60-69","70-79","80-89","90-99","100"]'::jsonb, 2),
  ('114-2-1', 'g9',   '九年級 · Grade 9', 313, '["60以下","60-69","70-79","80-89","90-99","100"]'::jsonb, 3),
  ('114-2-1', 'g10s', '高一社會組 · G10 Social', 64,  null, 4),
  ('114-2-1', 'g10n', '高一自然組 · G10 Science', 278, null, 5);

-- 七年級
insert into public.subject_stats (cohort_id, name, mean, high, low, sd, bins, sort_order)
select c.id, v.name, v.mean, v.high, v.low, v.sd, v.bins, v.sort_order
from public.cohorts c
join (values
  ('國文', 76.37, 85.52, 67.21, 12.21, '[43,68,131,166,46,0]'::jsonb, 1),
  ('英語', 84.16, 93.43, 74.89, 13.75, '[34,0,52,141,207,0]'::jsonb, 2),
  ('數學', 65.76, 81.07, 50.44, 19.99, '[149,64,95,125,21,0]'::jsonb, 3),
  ('歷史', 82.52, 93.15, 71.90, 14.90, '[45,24,58,133,181,13]'::jsonb, 4),
  ('地理', 89.74, 96.76, 82.73, 10.58, '[14,9,32,89,270,40]'::jsonb, 5),
  ('生物', 79.28, 90.47, 68.17, 15.33, '[56,32,70,160,133,3]'::jsonb, 6)
) as v(name, mean, high, low, sd, bins, sort_order) on true
where c.exam_id = '114-2-1' and c.key = 'g7';

-- 八年級
insert into public.subject_stats (cohort_id, name, mean, high, low, sd, bins, sort_order)
select c.id, v.name, v.mean, v.high, v.low, v.sd, v.bins, v.sort_order
from public.cohorts c
join (values
  ('國文', 83.06, 91.18, 74.94, 11.40, '[28,34,92,232,209,3]'::jsonb, 1),
  ('英語', 83.17, 92.28, 74.05, 13.13, '[33,46,87,201,231,0]'::jsonb, 2),
  ('數學', 72.97, 82.92, 63.01, 13.95, '[72,101,234,149,40,2]'::jsonb, 3),
  ('歷史', 89.65, 97.34, 81.96, 12.49, '[23,15,44,101,346,69]'::jsonb, 4),
  ('地理', 82.91, 90.60, 75.22, 11.42, '[28,32,86,263,186,3]'::jsonb, 5),
  ('公民', 82.13, 91.63, 72.63, 13.73, '[46,36,93,229,188,6]'::jsonb, 6),
  ('理化', 64.87, 78.53, 51.21, 17.48, '[199,117,169,84,29,0]'::jsonb, 7)
) as v(name, mean, high, low, sd, bins, sort_order) on true
where c.exam_id = '114-2-1' and c.key = 'g8';

-- 九年級
insert into public.subject_stats (cohort_id, name, mean, high, low, sd, bins, sort_order)
select c.id, v.name, v.mean, v.high, v.low, v.sd, v.bins, v.sort_order
from public.cohorts c
join (values
  ('國文', 80.5, 86.9, 74.1, 8.2,  '[2,25,83,158,44,0]'::jsonb, 1),
  ('英語', 82.2, 89.1, 75.3, 9.9,  '[6,21,70,154,62,0]'::jsonb, 2),
  ('數學', 75.8, 87.1, 64.5, 14.6, '[38,53,76,91,55,0]'::jsonb, 3),
  ('歷史', 85.3, 92.3, 78.3, 9.9,  '[5,6,69,124,110,9]'::jsonb, 4),
  ('地理', 73.4, 81.3, 65.6, 9.7,  '[21,92,107,79,14,0]'::jsonb, 5),
  ('公民', 79.8, 86.0, 73.7, 7.9,  '[3,31,103,147,28,1]'::jsonb, 6),
  ('生科', 73.5, 84.8, 62.2, 14.4, '[50,65,75,88,35,0]'::jsonb, 7),
  ('理化', 69.9, 80.2, 59.6, 14.4, '[61,84,89,74,11,0]'::jsonb, 8),
  ('微觀', 77.7, 88.8, 66.7, 14.0, '[37,44,69,90,71,2]'::jsonb, 9)
) as v(name, mean, high, low, sd, bins, sort_order) on true
where c.exam_id = '114-2-1' and c.key = 'g9';

-- 高一社會組（官方報表只有均標/高標）
insert into public.subject_stats (cohort_id, name, mean, high, sort_order)
select c.id, v.name, v.mean, v.high, v.sort_order
from public.cohorts c
join (values
  ('國文', 83.34, 88.69, 1),
  ('英文', 67.58, 79.59, 2),
  ('數學', 59.38, 73.41, 3),
  ('歷史', 70.69, 77.75, 4),
  ('地理', 73.45, 81.31, 5),
  ('公民', 72.67, 79.81, 6)
) as v(name, mean, high, sort_order) on true
where c.exam_id = '114-2-1' and c.key = 'g10s';

-- 高一自然組（官方報表只有均標/高標）
insert into public.subject_stats (cohort_id, name, mean, high, sort_order)
select c.id, v.name, v.mean, v.high, v.sort_order
from public.cohorts c
join (values
  ('國文', 83.86, 89.58, 1),
  ('英文', 76.27, 88.19, 2),
  ('數學', 77.28, 91.40, 3),
  ('科學對話', 65.00, 80.23, 4),
  ('化學', 62.83, 77.17, 5),
  ('生物', 77.73, 85.58, 6)
) as v(name, mean, high, sort_order) on true
where c.exam_id = '114-2-1' and c.key = 'g10n';

insert into public.insights (exam_id, seq, body) values
  ('114-2-1', 1, 'Mathematics drops sharpest from grade 7 to grade 10, but the top-quartile climbs to <em>91.4</em> in G10 自然組 — the strongest single-subject mean in the dataset.'),
  ('114-2-1', 2, 'Grade 7 地理 posts a <em>96.76</em> 高標 and the smallest standard deviation (10.58) — the most consistently high-performing sitting.'),
  ('114-2-1', 3, 'Grade 8 理化 and Grade 9 理化 sit as the structural weak points — both below 70 mean, with almost a third of G8 below the 70 band.');
