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

## Step 05（2026-11-01）
- `src/worker.js`：閱讀深度按鈕、`#ka-plain` 白話層、專業層提示、肌肉／骨骼詳情改版與紙面配色、手機 `#ka-glance` 與單一 bottom sheet、對話框焦點管理、`kap_ui_v2` 收藏、停用首次閱讀彩帶、舊 Wiki／選擇器入口轉向；對比修正 CSS。無資料表改動。
- `docs/uiux-handoff/`：`src/step05.js`、`inject-step05.cjs`、`test-step05-layers-sheet.cjs`、`test-contrast-scan.cjs`；`step05/screens/` 5 張。

## Step 04f（整合：股骨、手、胸廓）（2026-11-01）
- `src/worker.js`：`KAP_ART_DATA` 擴為 4 件（skull_front、femur、hand、thoracic_ribcage）；`kapApplyArt` 改為通用放置（`pair` 鏡像右側、`box`／`sym`／`ref`／`xmode`／`xs` 對位、`under` 插在被取代的向量骨之下、`hideBc` 隱藏向量肋軟骨、失敗回退）；被取代的向量骨留作看不見的點擊區，hover／選取時以 55% 不透明度淡淡顯示。
- `docs/uiux-handoff/`：`art/{femur,hand,thoracic_ribcage}.webp`＋`art/originals/`、`src/art-manifest.json`（各件的對位設定）、`inject-step04f.cjs` 支援 manifest、`test-step04f-pieces.cjs`、`step04f/screens/` 5 張。

## Step 06（2026-11-01）
- `src/worker.js`：圖譜（194 肌肉＋143 骨骼，分組／部位篩選／中英＋生活別名搜尋／缺圖與缺按摩標示／無結果保留搜尋詞）、詳情補強（標題在圖上方、缺 path 以「此構造暫無互動圖」取代錯誤人形、載入失敗可重試、構造收藏鈕）、輕鬆練習（自由練習：不計分不計時、確認→解說→查看日常用途、先看解說不計對、跳過；進階挑戰收進摺疊區並保留每日／五類題型／10 秒計時／XP；配對加點選與鍵盤）、我的重點（動作＋肌肉＋骨骼收藏、空狀態、清除有確認且只清收藏、舊 XP／勳章移進階回顧、分母分開）、儲存被禁用時的記憶體備援。
- 題目人形圖由深藍改為紙面配色。
- `docs/uiux-handoff/`：`src/step06.js`、`inject-step06.cjs`、`test-step06.cjs`、`ka-ui-v2.css` 新增 Step 06 區段、`step06/screens/` 8 張。

## Step 04f 第二批＋純中文介面（2026-11-01）
- 骨骼插畫新增：肱骨、前臂（橈＋尺）、脛腓、足（共 8 件、14 張圖含左右）；全部重新壓成網頁觀看品質（長邊 320–520px、WebP q0.6，總計約 226KB）；`art-manifest.json` 新增 `hideIds`（隱藏未命名的向量腳趾線）。
- 介面改為純中文：預設 `lang='zh'`、移除「中／EN」切換與首頁語言列、英文標題／標籤／英文重複文字（復原期 ACUTE 等、`#rc`）隱藏、所有 aria-label／title／placeholder 轉中文、伸展步驟補中文（顯示層 `KAP_STEP_ZH`，資料不動）、動作標題「深蹲 SQUAT」、收藏清單動作副標為英文名。英文只留在肌肉、骨骼、動作名稱旁。
- 新檔：`src/step07-lang.js`、`inject-step07-lang.cjs`、`test-step04f-pieces.cjs` 更新為 14 張。

## Step 04f 第三批（2026-11-01）
- 插畫新增：頸椎（C1–C7）、腰椎（L1–L5，由腰薦圖裁掉薦骨部分）、骨盆（前面，含薦骨尾骨）、鎖骨（左右）、肩胛骨（背面，左右，左側鏡射）。共 13 件、21 張圖；全部再壓小（q0.5–0.55，長邊 300–480px）。
- `step04f-art.js` 新增 `pairMid`（骨盆／鎖骨／肩胛這類中線群組的左右成對）與 `flip`（圖是畫給另一側時先在自身框內鏡射）；`prep-art.cjs` 新增第 5 參數「只保留上方比例」。
