# QA_RESULTS

## Step 01
| 項目 | 命令／方法 | 結果 |
|---|---|---|
| 版本一致 | `git rev-parse HEAD`；`git hash-object src/worker.js` | `0185899…`；blob `37e3661…`（= 設計包基準） |
| 資料指紋 | `node 06_TOOLS/inspect-worker.cjs --worker src/worker.js --out baseline/inspect-HEAD.json --compare 01_AUDIT/BASELINE.json` | exit 0；`equal:true`；`differences:[]` |
| 載入 | Playwright Chromium，桌機 1440×900／手機 390×844（isMobile、DPR2） | 無 pageerror／console error；`scrollWidth==clientWidth`（無橫向溢出） |
| 截圖 | home／lab（肌肉）／lab（骨骼）× 桌機／手機 | 6 張已存；發現缺陷見 CHECKPOINT「基準期發現的實際缺陷」 |
| 未測 | 線上站、Safari/iOS 實機、無障礙、回歸（尚未改程式） | — |
