# 基準與改版後比對（實際執行結果）

基準：`chair22752033-glitch/kinetic-anatomy` master `0185899`（`src/worker.js` git blob `37e3661…`）。改版後：分支 `claude/npm-install-fst7qc`。

## 資料指紋（設計包工具 `inspect-worker.cjs --compare BASELINE.json`）

結果：**equal = true，differences = []**（原始輸出：`AFTER_INSPECTION.json`、`inspect_stdout.txt`）。

| 資料表 | 基準 | 改版後 | 指紋 |
|---|---|---|---|
| EX（動作） | 40 | 40 | 相同 |
| MDB | 30 | 30 | 相同 |
| WIKI_MUSCLES_DB | 174 | 174 | 相同 |
| WIKI_BONES_DB | 53 | 53 | 相同 |
| STRETCH_DB | 17 | 17 | 相同 |
| MASSAGE_DB | 30 | 30 | 相同 |
| MIDX（常見肌群） | 16 | 16 | 相同 |
| BODY_PATHS | 4 | 4 | 相同 |
| EXTRA_MUSCLE_PATHS／_2／_3 | 24／109／35 | 24／109／35 | 相同 |
| BONE_PATHS／_2 | 44／10 | 44／10 | 相同 |
| ANATOMY_DETAIL_DB／LANDMARK_DB／FASCIA_MAP | 30／34／29 | 30／34／29 | 相同 |
| EX_EQUIP／EX_LEVEL | 40／40 | 40／40 | 相同 |

基準指紋沒涵蓋的兩份擴充資料庫 `WIKI_MUSCLES_DB_2`（28 筆）與 `WIKI_BONES_DB_2`（90 筆），另以原始碼區塊逐字比對 master：**完全相同**（含 STRETCH_DB、MASSAGE_DB、MIDX、WIKI 兩份主庫，共 7 個區塊）。

## 圖譜實際收錄數
- 肌肉 194 筆 = WIKI_MUSCLES_DB 174 + WIKI_MUSCLES_DB_2 的 28 筆（其中 8 筆與主庫同名，以 _2 覆蓋）。
- 骨骼 143 筆 = 53 + 90。
- 設計包寫的 174／53 只是第一份資料庫；舊 Wiki 本來就合併顯示兩份，所以改版後圖譜也全部列出。
- 無互動圖：肌肉 15 筆、骨骼 90 筆（詳情標「此構造暫無互動圖」）。按摩資料 28／194、伸展 15／194（缺的不顯示按摩分頁並說明）。

## 檔案大小
| | master | 改版後 |
|---|---|---|
| `src/worker.js` 原始大小 | 1,661,415 bytes | 2,241,810 bytes |
| gzip -9 | 606,370 bytes | 約 966,700 bytes |
| `wrangler deploy --dry-run` | — | Total Upload 2233.83 KiB／**gzip 943.44 KiB** |

增加的主要是 17 件骨骼插畫（base64 WebP，約 316 KB）與 UI 程式。

## 本機儲存 key
舊 key（`ka_*`、`kap_*`）全部保留、沒有 `localStorage.clear()`；新增 `kap_ui_v2`（schemaVersion 1：favorites／readingDepth／locale）。

## 沒有改動的部署設定
`wrangler.toml`、`package.json`、`package-lock.json`、`.github/workflows/deploy.yml` 與 master 相同（`git diff origin/master --stat` 只有 `src/worker.js` 與 `docs/`）。
