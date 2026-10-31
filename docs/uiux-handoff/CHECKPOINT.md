# CHECKPOINT

- 更新：2026-10-31
- 目前步驟：**Step 01 完成（僅建立基準，零程式改動）**；next_step = **02 視覺骨架**
- 分支：`claude/npm-install-fst7qc`（沿用；已 fast-forward 到 master `0185899`，無本機分歧）
- 實際 HEAD：`0185899d5ea3bac8e7e15c17e0bc590e18348d43`（= 設計包基準提交，無較新變更）
- `src/worker.js` git blob：`37e366155bdd344655a8fae76dbfa1b7d2fbd1cb`（= 設計包 BASELINE.json 的 src_git_blob）
- 工作樹：除本資料夾 `docs/uiux-handoff/` 外乾淨；無使用者未提交更動
- 正式入口：`wrangler.toml` main = `src/worker.js`（classic Worker，`addEventListener('fetch')`）；`.github/workflows/deploy.yml` 僅在 push `master` 時發布 → **本專案 UI 改版只推分支，不推 master**

## 已證實
- 資料表指紋與設計包基準 **完全相同**（`inspect-worker.cjs --compare` equal=true，differences=[]）。
  EX 40／MDB 30／WIKI_MUSCLES_DB 174／WIKI_BONES_DB 53／STRETCH_DB 17／MASSAGE_DB 30／MIDX 16／BODY_PATHS 4 視圖。
- 本機以 VM 取得 HTML 並在 Chromium 載入，桌機 1440×900、手機 390×844 皆無 console／pageerror、無橫向溢出。
- 基準截圖：`baseline/screens/B_{desktop,mobile}_{home,lab_muscle,lab_bones}.png`；指紋：`baseline/inspect-HEAD.json`。

## 未證實 / 尚未做
- 線上正式站端到端（本輪不測，也未部署）。
- 筋膜 FASCIA_MAP 與 overlay id 差異（`fo-dfl`／`fo-sbal`）尚未追查（排在 Step 04–05）。
- KAP_ANAT 逐骨匯出實測 120 keys（上輪驗證為 120；Step 04 再跑）。

## 基準期發現的實際缺陷（對照使用者手機截圖，Step 02/04 處理）
1. **骨骼與肌肉人形不貼合**：骨骼層（KAP_ANAT 向量）比肌肉人形大且偏左，頭部被畫布上緣截掉。（B_*_lab_bones.png）
2. **右半邊骨骼全黑**：鏡像（`-R`／`<use transform>`）那一側在肌肉層同時開啟時渲染成黑色，左半正常。桌機與手機皆重現。使用者手機截圖未見此現象，需 Step 04 用 Safari 行為差異查因，不可假設已修好。
3. **介面被截**：桌機底部 `AROM／Fascia／Recovery` pills 被截斷（顯示 `ARO… Fascia …very`）；右欄 PRO 開關左側被截（`E PRO`）；復原分期卡片底部被視窗截斷。手機頭部被截（圖在標題列下方裁掉頭）。
4. **動作切換靠左右滑／前後箭頭**：使用者要求以「搜尋」找動作（對照設計包「動作庫」＋搜尋，Step 03）。

## 下一個最小任務（Step 02）
tokens（`02_SPEC/design-tokens.json`）→ CSS 變數；四個固定主入口骨架（生活動作／身體圖譜／輕鬆練習／我的重點）；桌機三欄／手機單欄框架；順手修上列第 3 點（被截）。**不動資料、不動 path／骨骼 key／肌肉 slug。**
