# CHECKPOINT

- 更新：2026-10-31
- 目前步驟：**Step 02 完成（tokens、四入口、容器、修被截）**；next_step = **03 生活入口與動作庫（含搜尋）**
- 分支：`claude/npm-install-fst7qc`（沿用；已 fast-forward 到 master `0185899`，無本機分歧）
- 基準 HEAD：`0185899d5ea3bac8e7e15c17e0bc590e18348d43`（= 設計包基準）；Step 02 的改動在其上，見 git log
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


## Step 02 結果（2026-10-31）
**已做（只動 `src/worker.js` 的 CSS／導覽 HTML／導覽 JS；資料表零改動）**
- 色票：`:root` 新增 `--ka-*`（來自 `design-tokens.json`）並把舊變數名（`--bg/--surface/--card/--text/--muted/--primary/--red/--blue…`）重新指向，整站翻成米色紙面＋深綠；英文與資料不動。
- 四入口：單一 `KAP_ROUTES` 產生桌機頂部膠囊導覽與手機 4 格底導覽（生活動作／身體圖譜／輕鬆練習／我的重點，中英都有、含 SVG 圖示、`aria-current`、焦點環 3px）。「生活動作」在首頁與動作頁皆亮。**動作頁現在也顯示導覽**（先前被隱藏）。`goHome/goMain/goView` 以包裝方式保留，外部呼叫不變。
- 容器：動作頁畫布改為白色圓角卡片；男女／前後分左右置頂，不再壓在人體上；右欄 300px（769–1120）／352px（≥1121）；手機底導覽 64px＋safe-area，`body.kap-view-lab .app` 預留底部空間，圖層列不被蓋。
- 修被截：底部 AROM／Fascia／Recovery 膠囊（z-index 被 `#ca>*{z-index:1}` 壓住 → 以同等 specificity 提高）、PRO 開關標籤被旋鈕蓋住（z-index）、手機人體頭部被切（移除 `64vh` 強制高度、以 `meet` 置入）、桌機畫布底部預留膠囊空間、顆粒濾鏡 `rect` 在淺色畫布變灰塊（CSS 隱藏，非資料）。
- 原始碼來源：`docs/uiux-handoff/src/ka-ui-v2.css` ＋ `inject-ka-ui-v2.cjs`（冪等注入器；`render-page.cjs` 在本機取得 HTML）。

**驗證（QA_RESULTS）**
- 資料指紋：`inspect-worker --compare BASELINE.json` equal=true、differences=[]。
- 寬度 320／375／390／768／1024／1440／1920 × 首頁／圖譜／練習／重點／動作頁：全部無水平溢出；手機底導覽不蓋圖層列。
- 導覽路由：四入口都到達對應內容，動作頁→圖譜→首頁可返回；中文標籤正確；鍵盤焦點環 solid 3px；console 無錯。
- 骨骼層點選：桌機／手機點右肱骨→「肱骨（詳細）」開啟（未退步）。
- gzip 0.59 MB（< 1MB）。

**未做／刻意延後**
- 非焦點肌肉仍為深灰（Step 04 改為 anatomy-neutral）；首頁仍是舊 LAB/ATLAS/QUEST 磚（Step 03 重做）；右欄仍是舊「分析／伸展／復原」分頁（Step 05）。
- **骨骼與肌肉不貼合、右半骨骼全黑**：本步未碰（Step 04b）。
- 搜尋找動作（Step 03b）；目前仍可用既有動作標題開庫與左右切換。
- 未做真機 Safari、未測線上站、未部署。

## 下一個最小任務（Step 03）
03a 首頁（主標＋3 生活入口 squat/overhead_press/step_up）· 03b 動作庫＋中英搜尋（取代滑動為主要找動作方式；`navKeys()` 與篩選同源、無 0/0）· 03c 就地提示（保留 kap_onboard_v1）。
