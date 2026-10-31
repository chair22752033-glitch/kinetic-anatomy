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
