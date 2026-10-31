# CHANGELOG

## Step 01（2026-10-31）
- 新增 `docs/uiux-handoff/`：CHECKPOINT／DECISIONS／CHANGELOG／QA_RESULTS／NEXT_PROMPT／`STEP_PLAN.md`／`PRESERVE_MAP.md`
- 新增 `docs/uiux-handoff/baseline/`：`inspect-HEAD.json`、`screens/B_*.png`（6 張）
- **未修改** `src/worker.js` 或任何發布設定

## Step 02（2026-10-31）
- `src/worker.js`：新增 `KA-UI-V2` CSS 區塊（tokens＋導覽＋動作頁容器＋被截修正）；靜態 `<nav>` 改為空容器，由 `KAP_ROUTES` 在載入時產生；加入 `kapBuildNav/kapSyncNav` 並包裝 `goHome/goMain/goView`。無資料表、path、key、slug 改動。
- 新增 `docs/uiux-handoff/src/`（CSS 原始碼、注入器、渲染工具）與 `step02/screens/`（S02_* 10 張）。
