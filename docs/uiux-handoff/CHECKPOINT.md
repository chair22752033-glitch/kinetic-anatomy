# CHECKPOINT

- 更新：2026-10-31
- 目前步驟：**Step 04 部分完成：04b 骨骼貼合已完成**；04a／04c／04d／04e 尚未做；next_step = **04c 角色色映射＋非焦點肌肉中性色**，其後 04d 放大、04e 筋膜缺圖、04a 單一狀態
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


## Step 03 結果（2026-11-01）
**已做（`src/worker.js`；資料表零改動）**
- 03a 首頁：品牌列（身體動作地圖／Everyday Body Map）、主標、主按鈕「從坐下、站起來開始」、三張生活卡（→ `squat`／`overhead_press`／`step_up`，保留原動作與資料）、「全部 N 個動作」、找身體部位／我的重點兩張次要卡、動作／肌肉／骨骼百科筆數（執行時從資料表計數：40／174／53）。桌機右側為原 `BODY_PATHS` 的前後視圖預覽（只上色，不畫新路徑）。中英文完整。`hub-continue` 與 `refreshHubContinue` 保留。
- 03b 動作庫：新增搜尋（中英、拆詞全符合、可清除、Esc 先清字再關）、結果計數（aria-live）、搜尋無結果顯示規格文案＋「清除篩選」、`libFilteredKeys` 納入搜尋 → `navKeys()`（上一個／下一個／滑動／鍵盤）同源。搜尋範圍：動作代碼、中英名稱、肌肉中英名、分類／器材中英、**檢視用別名表** `KAP_EX_ALIAS`（坐下、舉高、階梯、跑步等；不寫入 EX、不含症狀詞）。動作頁新增常駐「找動作」按鈕（`#ext-find`）；標題點選仍可開庫。標題計數在篩選中顯示「· filtered／· 篩選中」；目前動作不在結果時，庫內顯示提示且上一個／下一個回退完整列表（不會 0/0）。
- 03b 順手修的既有問題：①舊的全域 `ArrowLeft/Right` 以完整列表換動作、與篩選版同時觸發且無輸入框保護 → 移除舊版；②`?` 在輸入框內會開說明 → 加輸入框保護；③庫內卡片列高被壓成 44px 疊字 → `align-content:start; grid-auto-rows:min-content`；④首訪 coach tip（z-index 10015）會蓋住動作庫 → 降 z-index，庫開啟時隱藏；⑤庫關閉後焦點回到觸發按鈕；⑥庫加 `role=dialog aria-modal`。
- 03c：首次訪問不再自動彈出 60 秒導覽，改為首頁就地 coach tip（可「Got it」、關閉後不再出現）；導覽仍可由首頁連結／說明進入，略過／完成仍寫入原 `kap_onboard_v1`。「繼續上次」只讀合法 EX id（無效或首次→顯示導覽連結，不顯示假紀錄）。

**驗證（QA_RESULTS）**：見 QA_RESULTS.md「Step 03」。資料指紋 equal、gzip 0.59MB、無橫向溢出、console 無錯。

**刻意延後／仍待處理**
- 非焦點肌肉仍深灰；骨骼與肌肉不貼合、右半骨骼全黑（Step 04b）。
- 動作頁左欄「現在一起認識」卡與三步驟、右欄白話／專業分層（Step 04–05）。
- 首頁沒有「繼續上次」獨立大卡（沿用 `hub-continue` 列）；設計包 D01 無此元素，保留原功能。
- 未做真機 Safari、線上站。

## 下一個最小任務（Step 04）
04a 單一選取狀態（動作／模型／視角／選取構造／圖層／縮放）· **04b 骨骼層與肌肉人形共用同一 viewBox/縮放，頭不被截；修右半骨骼黑色（鏡像 `<use>` 的 fill）；四視圖驗證** · 04c 角色色映射（主力 coral／幫手 amber／穩定 blue，保留資料 col）· 04d 放大 1–2.5＋重設 · 04e FASCIA 缺圖 fallback。


## Step 04b 結果（2026-11-01）：骨骼與肌肉貼合（純程式、不用 PNG）
**根因（實測）**
1. 骨骼包的巢狀 `<svg class="kap-anat">` 用 `width/height:100%` 放在 `#bone-overlay` 內，座標原點與共用 viewBox（`0 95 727 1280`）差 95 單位 → 骨骼整體偏高約 95、頭被切。背面／女性 viewBox 起點是 718／823／(650×1450)，骨骼包永遠畫在 0..727，所以背面根本看不到。
2. 畫布為了放控制鈕加了 padding（Step 02），`#bone-overlay` 仍是 `inset:0`，與 `#bsvg` 的方框不同 → 縮放比例不同。
3. 右半骨骼全黑：鏡像用 `<use>`，Chrome 在 shadow tree 內不套用 `.kap-anat .b{…}` 這類有祖先條件的樣式 → fill 變預設黑。
4. 骨骼包是正面直立姿勢，肌肉圖是 A-pose（手臂外展），手臂與手永遠對不上；女性比例也不同。

**做法（`src/worker.js`，來源 `docs/uiux-handoff/src/step04b-fit.js`）**
- `kapSyncOverlay()`：覆蓋層方框＝`#bsvg` 方框（含 padding 位移）、巢狀 svg 採用與肌肉完全相同的 viewBox → 四視圖同一座標系；視窗縮放／側欄收合／方向改變由 `ResizeObserver` 重同步。
- `kapCloneMirrors()`：在 `KAP_ANAT.wire` 之前把 `<use>` 換成真 DOM 複本（保留 id、`data-key`），右半骨骼上色正常且可點。
- `kapFitBones()`：從**目前視圖的肌肉路徑**量出地標（頭／頸、肩、肘、腕、指尖、髖、膝、踝、足底；左右各自量），對每一段骨骼做「沿軸線縮放＋旋轉＋平移」（骨骼粗細不變）：顱骨（依頸與軀幹比例定大小）、軸骨（脊椎／肋骨／胸骨／骨盆／鎖骨／肩胛）、上臂、前臂、手、大腿＋髕骨、小腿、足。左右分開擬合。背面視圖顯示四肢骨（正面骨骼包把四肢放在 `kbf`，背面原本被隱藏）、隱藏髕骨。
- `setBoneFit()` 改為呼叫 `kapSyncOverlay()`（舊版找不存在的 `#kap-fit`，等於空函式）。

**量測（`test-step04-score.cjs`；骨骼取樣點距肌肉圖 ≤10 單位的比例）**
| 視圖 | 擬合後 | 只做座標對齊、未擬合 |
|---|---|---|
| 男・正 | 99% | 75%（前臂 15%、手 24%） |
| 男・背 | 98% | 0%（不在畫面內） |
| 女・正 | 95% | 60% |
| 女・背 | 97% | 0%（不在畫面內） |
測的是「骨頭有沒有落在肌肉人形上」，不是醫學精度。

**誠實限制**
- 背面的顱骨仍是正面造型（骨骼包沒有背面顱骨）；背面四肢骨使用正面形狀（長骨左右前後差異小）。
- 擬合以地標為準的近似，並非逐骨解剖校正；肌肉人形本身是風格化 A-pose，骨骼是「合理地放在裡面」。
- 手指末端、足趾偶有 3–10 單位超出肌肉輪廓。
- 沒用 GPT／PNG：點陣圖同樣要解決「對位」問題，且無法同時支援四視圖與逐骨點選，已證實以程式擬合可行。

**驗證**：`test-step04-bones.cjs` 全 PASS（覆蓋層=body 方框、右側骨骼複本可點且名稱正確、縮放／收合側欄後仍貼合、隱藏時換視圖再開仍擬合、背面顯示四肢且隱藏髕骨、換動作保持擬合）；`func02/func03/first03/verify02` 回歸 PASS；資料指紋 equal；gzip 0.59MB；console 無錯。

## 下一個最小任務
04c 角色色（主力 coral／幫手 amber／穩定 blue，保留資料 col）＋非焦點肌肉改 `anatomy-neutral #C9D1C5`（目前深灰）· 04d 放大 1–2.5＋重設 · 04e FASCIA 缺圖 fallback · 04a 單一選取狀態。
