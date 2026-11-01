# 交付包說明（Step 08）

**狀態：未部署（deployed = false）。** 沒有 push master、沒有執行 `wrangler deploy`。改版在分支 `claude/npm-install-fst7qc`；master 上的線上站仍是舊版。master 一旦收到 push 會自動發布（`.github/workflows/deploy.yml`），所以要上線前請先審閱。

## 內容
| 路徑 | 說明 |
|---|---|
| `src/worker.js` | 改版後的完整程式（部署入口不變：`wrangler.toml` 的 `main`） |
| `wrangler.toml`、`package.json`、`package-lock.json`、`.github/workflows/deploy.yml`、`public/` | 與 master 相同，原樣附上 |
| `docs/uiux-handoff/` | 五份交接文件（CHECKPOINT／DECISIONS／CHANGELOG／QA_RESULTS／NEXT_PROMPT）、STEP_PLAN、PRESERVE_MAP、各步驟截圖、基準截圖、骨骼插畫原圖與壓縮圖、全部注入器與測試腳本（`src/`） |
| `docs/uiux-handoff/delivery/` | 本資料夾：比對、diff、dry-run 記錄、改版後截圖、授權 |

## 怎麼在本機看
```
npm install
npx wrangler dev --local --port 8799     # 開 http://127.0.0.1:8799/
npx wrangler deploy --dry-run --outdir /tmp/out   # 只打包不上傳，會印出大小
```
實測（2026-11-01，wrangler 4.156.0）：`wrangler dev --local` 回 HTTP 200；`deploy --dry-run` 成功，Total Upload 2233.83 KiB／gzip 943.44 KiB（見 `wrangler_dry_run.txt`、`wrangler_dev_check.txt`）。下面的截圖就是從這個本機伺服器拍的。

## 測試（在 `docs/uiux-handoff/src/`）
測試用 Playwright 和 Chromium；`render-page.cjs` 會把 Worker 的 HTML 產成靜態檔（`node render-page.cjs src/worker.js page.html`），測試腳本以 `node test-xxx.cjs page.html outdir` 執行。最後一輪全部通過：Step 03 首訪／動作庫、Step 04 骨骼逐骨／四視圖／擬合分數／角色色縮放筋膜、Step 04f 插畫（26 張）、Step 05 圖層與 sheet、Step 06 圖譜／練習／我的重點、Step 07 回歸（96 項）、對比掃描 0 項。詳細在 `QA_RESULTS.md`。

## 截圖對照（`after_screens/`，桌機 1440×900、手機 390×844@2x）
| 設計包畫面 | 改版後截圖 |
|---|---|
| D01 桌機首頁 | `D01_home.png` |
| D02 桌機動作頁 | `D02_explore.png`（肌肉層）、`D02b_explore_bones.png`（骨骼層）、`D02c_explore_bones_back.png`（背面骨骼） |
| D03 專業層 | `D03_professional.png` |
| D04 桌機圖譜 | `D04_atlas.png`、`D04b_atlas_search.png`（搜尋「站起來」）、`D04c_atlas_no_result.png` |
| D05 桌機練習 | `D05a_practice_home.png`、`D05_quiz.png`（答完的說明） |
| D06 我的重點 | `D06_takeaways.png` |
| M01 手機首頁 | `M01_home.png` |
| M02 手機動作頁 | `M02_explore.png`、`M02b_explore_bones.png` |
| M03 說明 sheet | `M03_detail_sheet.png` |
| M04 肌肉面板 | `M04_muscle_sheet.png` |
| M05 手機圖譜 | `M05_atlas.png` |
| M06 手機練習 | `M06_quiz.png` |
| M07 手機空收藏 | `M07_empty.png` |
| M08 圖形失敗 | `M08_error.png`（用模擬例外觸發，非真實載入失敗） |

**與設計稿的有意差異**：
- 圖譜卡片沒有肌肉縮圖（194 張要逐一算裁切，風險高）。
- 介面只有中文（使用者要求）；設計稿的中英切換沒做。
- 專業層沒有「關節活動／筋膜關聯／專業手法」三鍵切換，沿用原本區塊式排列。
- 骨骼用 AI 插畫取代設計包的簡化人形；圖譜的詳情仍用原資料的高亮人形。
- 分享連結帶構造 ID 沒做。

## 已完成／未完成／未測
**已完成**：Step 01–08 的主流程（生活入口、動作庫搜尋、人體與骨骼對位與插畫、白話／專業分層、單一手機 sheet、圖譜 194／143、自由練習＋原挑戰、我的重點、純中文）；資料指紋不變。
**未完成（最小下一步見 `NEXT_PROMPT.md`）**：專業人員核對 AI 骨骼插畫的解剖正確性；背面視圖的頸椎、腰椎仍用前面圖；圖譜卡片縮圖；專業層三鍵切換；04a 共用選取狀態；分享連結。
**未測**：iPhone／Android 實機與 Safari、VoiceOver／TalkBack、只放大文字的 200% 字級、高對比模式、觸控拖曳配對手感、圖片或漸層上的文字對比。

## 授權與來源
- `licenses/LICENSE-muscle-paths.txt`、`licenses/OFL.txt`：設計包附的原型素材授權。正式程式沒有使用設計包的字型檔；肌肉路徑資料是原 repo 的。
- 骨骼插畫由使用者以 ChatGPT 生成後提供。請在商用前確認所用方案條款允許；AI 圖可能有解剖錯誤，需專業人員核對。
