# 薇閣國中段考成績分析網站

線上網址：https://wego-exam-analysis.vercel.app

## 架構（2026-07 改版後）

```
瀏覽器
  │
  ▼
Vercel（前端，Next.js）─── 頁面每小時自動更新一次快取
  │
  ▼
InsForge 雲端資料庫（新加坡機房）─── 所有成績資料都存這裡
```

- **前端**：Next.js 16（App Router），部署在 Vercel（sin1 新加坡）。
- **後端／資料庫**：全部在 InsForge（專案名 `wego-exam-analysis`，同樣在新加坡）。
  **沒有用 Neon，也沒有資料寫死在程式裡** — 改資料不用改程式。
- 網頁是預先做好的靜態頁（很快），每小時自動跟資料庫同步一次。

## 資料放在哪裡

InsForge 控制台：https://insforge.dev/dashboard/project/6467460f-c591-4fb0-bc75-6b935d4ad3c4

資料庫裡有 4 張表，白話說明：

| 表 | 內容 | 目前資料 |
|---|---|---|
| `exams` | 一場考試一列 | 114 學年度第二學期 第一次段考（編號 `114-2-1`） |
| `cohorts` | 年級組：名稱、人數、分數級距 | 七年級 454 人、八年級 598 人、九年級 313 人、高一社會組 64 人、高一自然組 278 人 |
| `subject_stats` | 每個年級組每科的均標／高標／低標／標準差／各分數段人數 | 34 筆（例：七年級地理 均標 89.74） |
| `insights` | 頁面最下方的三則「觀察重點」文字 | 3 筆 |

權限：**任何人只能讀**（網站公開），寫入只能透過管理端（InsForge 控制台或 CLI）。

## 怎麼改資料（例如下次段考）

改完後**最多 1 小時**網站自動更新；想立刻生效就重新部署一次。

1. 小修改：直接在 InsForge 控制台的 Database 頁面改儲存格。
2. 新增一次段考：新增 `exams` 一列 → `cohorts` 各年級 → `subject_stats` 各科。
   參考 `migrations/20260716130758_seed-exam-first-midterm.sql` 的寫法。
   （目前首頁固定顯示 `114-2-1`，寫在 `lib/data.ts` 的 `EXAM_ID`，之後要做多場切換再改。）

## 本地開發

```bash
npm install
npm run dev        # http://localhost:3000
```

`.env.local` 需要兩個值（已設定，不進 git）：

```
NEXT_PUBLIC_INSFORGE_URL=https://39tccg6z.ap-southeast.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=（用 npx @insforge/cli secrets get ANON_KEY 取得）
```

anon key 只有「讀」的權限，外洩也改不了資料；真正的管理金鑰在 `.insforge/project.json`（已被 .gitignore 擋住，不會進 git）。

## 部署

```bash
vercel deploy --prod
```

Vercel 專案 `wego-exam-analysis` 的三個環境（Production／Preview／Development）都已設好上面兩個環境變數。

## 程式結構

```
app/page.tsx                  首頁（伺服器端向 InsForge 抓資料）
app/layout.tsx                字型與全站設定
lib/insforge.ts               InsForge SDK 連線
lib/data.ts                   抓資料 + 整理形狀（EXAM_ID 在這）
components/OverviewChart.tsx  總覽長條圖
components/GradeExplorer.tsx  年級切換 + 高低標圖 + 排行榜
components/DistributionExplorer.tsx  分數分布直方圖
migrations/                   資料庫結構與資料的正式紀錄（可重建整個 DB）
```
