# CHANGELOG

## Step 01（2026-10-31）
- 新增 `docs/uiux-handoff/`：CHECKPOINT／DECISIONS／CHANGELOG／QA_RESULTS／NEXT_PROMPT／`STEP_PLAN.md`／`PRESERVE_MAP.md`
- 新增 `docs/uiux-handoff/baseline/`：`inspect-HEAD.json`、`screens/B_*.png`（6 張）
- **未修改** `src/worker.js` 或任何發布設定

## Step 02（2026-10-31）
- `src/worker.js`：新增 `KA-UI-V2` CSS 區塊（tokens＋導覽＋動作頁容器＋被截修正）；靜態 `<nav>` 改為空容器，由 `KAP_ROUTES` 在載入時產生；加入 `kapBuildNav/kapSyncNav` 並包裝 `goHome/goMain/goView`。無資料表、path、key、slug 改動。
- 新增 `docs/uiux-handoff/src/`（CSS 原始碼、注入器、渲染工具）與 `step02/screens/`（S02_* 10 張）。

## Step 03（2026-11-01）
- `src/worker.js`：首頁改版（brand bar、主標、3 生活卡、次要卡、計數頁尾、預覽）；動作庫搜尋（`KAP.libQuery`、`kapExMatch`、`KAP_EX_ALIAS`）；`#ext-find` 按鈕；庫空狀態／計數／目前動作提示；鍵盤與焦點修正；首訪 coach tip 取代強制導覽。無資料表改動。
- `docs/uiux-handoff/src/`：新增 `step03.js`、`inject-step03.cjs`（冪等注入）、`test-step03-library.cjs`、`test-step03-firstvisit.cjs`；`ka-ui-v2.css` 更新（含 Step 03 區段）。`step03/screens/` 8 張截圖。

## Step 04b（2026-11-01）
- `src/worker.js`：新增骨骼擬合模組（`kapFitBones`、`kapSyncOverlay`、`kapCloneMirrors` 等）；`setBoneFit` 改轉呼叫；`mountSkeleton` 在 wire 前複製鏡像；`syncBoneLayer.vec()` 顯示後呼叫擬合。無資料表改動。
- `docs/uiux-handoff/src/`：`step04b-fit.js`、`inject-step04.cjs`、`test-step04-*.cjs`；`step04/screens/` 3 張。

## Step 04c–e（2026-11-01）
- `src/worker.js`：角色色 CSS、`mp-idle`／`mp-stab` class（renderSVG 一行）、圖例、放大控制（`kapApplyZoom` 包裝 `renderSVG`）、筋膜缺圖提示（包裝 `updateFasciaOverlay`）；骨骼擬合改以離屏 svg 從 `BODY_PATHS` 量測。無資料表改動。
- `docs/uiux-handoff/`：`BONE_ART_BRIEF_FOR_GPT_GEMINI.md`、`src/step04c.js`、`inject-step04c.cjs`、`test-step04c-roles-zoom-fascia.cjs`、`step04/screens/` 新增 4 張。

## Step 04f（試做：顱骨）（2026-11-01）
- `src/worker.js`：`KAP_ART_DATA`（skull_front，WebP base64）、`kapApplyArt`；擬合模組記錄來源方框並在擬合後呼叫 `kapApplyArt`；放大控制移到畫布右側。
- `docs/uiux-handoff/`：`art/`（原圖＋壓縮圖）、`src/prep-art.cjs`、`step04f-art.js`、`inject-step04f.cjs`、`test-step04f-art.cjs`、截圖 `S4f_skull_art_4views.png`。
