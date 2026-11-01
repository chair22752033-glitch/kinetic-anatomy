繼續 Kinetic Anatomy Pro UI/UX 重構。先讀 docs/uiux-handoff/CHECKPOINT.md、DECISIONS.md（D7–D11）、QA_RESULTS.md、STEP_PLAN.md、PRESERVE_MAP.md。分支 claude/npm-install-fst7qc；不 push master。
分支條件：
(A) 使用者已提供骨骼 PNG（依 BONE_ART_BRIEF_FOR_GPT_GEMINI.md 的檔名）→ 先做 Step 04f：去背／檢查檔案、以 <image> 套 04b 擬合變換、向量骨骼改隱形點擊區、體積 < 1MB gzip（圖縮到約 600–800px 長邊轉 WebP）、四視圖＋放大驗證、保留逐骨點擊。
(B) 否則 Step 05：讀設計包 STEPS/05_分層說明與手機面板.md、02_SPEC/02（D03／M03／M04）。白話／專業閱讀深度（沿用 kap-simple／kap_pro，不新增同名開關）、daily 提前到肌肉詳情第一段、百分比旁標示「原資料庫的教學示意值，未經個人量測」、專業手法前先顯示 contra、手機只開一個 bottom sheet（背景鎖捲動、焦點進入、Esc 關閉、返回觸發處）、統一詳情；在此建立 04a 單一選取狀態。
工具與注入器：docs/uiux-handoff/src/（render-page.cjs；ka-ui-v2.css＋inject-ka-ui-v2.cjs；step03.js＋inject-step03.cjs；step04b-fit.js＋inject-step04.cjs；step04c.js＋inject-step04c.cjs 皆冪等；test-*.cjs 為回歸）。
完成後更新五份文件並附截圖與驗證。
