# QA_RESULTS

## Step 01
| 項目 | 命令／方法 | 結果 |
|---|---|---|
| 版本一致 | `git rev-parse HEAD`；`git hash-object src/worker.js` | `0185899…`；blob `37e3661…`（= 設計包基準） |
| 資料指紋 | `node 06_TOOLS/inspect-worker.cjs --worker src/worker.js --out baseline/inspect-HEAD.json --compare 01_AUDIT/BASELINE.json` | exit 0；`equal:true`；`differences:[]` |
| 載入 | Playwright Chromium，桌機 1440×900／手機 390×844（isMobile、DPR2） | 無 pageerror／console error；`scrollWidth==clientWidth`（無橫向溢出） |
| 截圖 | home／lab（肌肉）／lab（骨骼）× 桌機／手機 | 6 張已存；發現缺陷見 CHECKPOINT「基準期發現的實際缺陷」 |
| 未測 | 線上站、Safari/iOS 實機、無障礙、回歸（尚未改程式） | — |

## Step 02
| 項目 | 方法 | 結果 |
|---|---|---|
| 資料指紋 | inspect-worker --compare BASELINE.json | equal=true，differences=[] |
| 溢出 | 320/375/390/768/1024/1440/1920 × 5 畫面（Playwright） | 全部 ok |
| 導覽路由 | 點四個入口、動作頁→圖譜→首頁 | 皆到達；`on` 狀態正確（動作頁亮「生活動作」） |
| 語言 | setLang('zh') | 生活動作／身體圖譜／輕鬆練習／我的重點 |
| 焦點 | Tab 到導覽 | outline solid 3px |
| 底導覽遮蓋 | 手機動作頁 layerbtn.bottom ≤ tabs.top | clear（320/375/390/768） |
| 骨骼點選 | 開骨骼層、點 humerus-L | 開「肱骨（詳細）」（桌機、320 手機） |
| console | pageerror／console.error | none |
| 體積 | gzip src/worker.js | 0.59 MB |
| 未測 | 真機 Safari/iOS、對比數值逐項、讀屏、reduced-motion 實測、線上站 | — |

## Step 03
命令：`node docs/uiux-handoff/src/test-step03-library.cjs <page.html> <outdir>`、`test-step03-firstvisit.cjs`（頁面以 `render-page.cjs` 產生）。桌機 1440×900、手機 390×844。
| 項目 | 結果 |
|---|---|
| 三張生活卡＋主按鈕 → 原 ID | PASS：squat／overhead_press／step_up，`KAP.view==='lab'` |
| 庫顯示全部 40 個 | PASS |
| 40 個原 ID 都能用英文名與中文名搜到 | PASS（0 缺漏） |
| 搜尋 squat／階梯／舉高／股四頭肌 | PASS：squat+bulgarian_split_squat；step_up+stair_climbing；overhead_press；13 筆 |
| 無結果→顯示規格文案＋清除→回到 40、輸入框清空 | PASS |
| 分類×器材全組合筆數＝手算 | PASS |
| 篩選內導航不超出結果、末端箭頭隱藏、計數文字正常（無 0/0／undefined） | PASS（`2 / 2 · filtered`） |
| 目前動作被篩掉 → 回退完整列表並提示 | PASS（`21 / 40`） |
| 「找動作」按鈕開庫；輸入框內方向鍵與 `?` 不換動作／不開說明；Esc 關庫；焦點回按鈕 | PASS |
| 首訪：不彈強制導覽、顯示就地提示；關閉後 reload 不再出現；導覽可選用、略過寫入 `kap_onboard_v1` | PASS |
| 繼續上次：合法 id 開該動作；無效 id→導覽連結 | PASS |
| 導覽／溢出／骨骼點選回歸（Step 02 套件） | PASS（320–1920 無溢出；肱骨點選正常） |
| 資料指紋 | equal=true |
| gzip | 0.59 MB |
| console／pageerror | none |
| 未測 | iOS Safari 實機、讀屏實測、字級放大 200%、線上站 |
