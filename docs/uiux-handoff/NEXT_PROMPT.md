繼續 Kinetic Anatomy Pro UI/UX 重構。先讀 docs/uiux-handoff/CHECKPOINT.md、DECISIONS.md（D7–D14）、QA_RESULTS.md、STEP_PLAN.md、PRESERVE_MAP.md。分支 claude/npm-install-fst7qc；不 push master。**免費方案：gzip ≤ 1MB 是硬限制（目前 0.631MB）。**
分支條件：
(A) 使用者已提供骨骼 PNG（依 BONE_ART_BRIEF_FOR_GPT_GEMINI.md 的檔名；skull_front、femur、hand、thoracic_ribcage 已整合；其餘件加進 art-manifest.json 並跑 inject-step04f.cjs；gzip 已 0.885MB，新增要先縮圖）→ 先做 Step 04f：每塊以 prep-art.cjs 壓縮（目標總計 ≤ 0.3MB gzip，必要時降張數／尺寸／畫質並回報），inject-step04f.cjs 加入；長骨需左右複本與背面（kbf 群組）顯示邏輯、軸骨（胸廓、骨盆、脊椎）需新增 part 與鏡像處理；向量骨留作隱形點擊區。
(B) Step 06 已完成；下一步 Step 07（回歸與無障礙）。（舊文：Step 06：讀設計包 STEPS/06_圖譜練習與回顧.md、02_SPEC/02（D04–D06、M05–M08）。完整身體圖譜（分組＋搜尋＋明列生活別名＋詳情，接回 WIKI_MUSCLES_DB 174／WIKI_BONES_DB 53；缺 path 顯示「此構造暫無互動圖」；無結果保留搜尋詞）、輕鬆練習（保留原題型 name／detective／function／clinical／match、每日挑戰、計時與 XP；新增不計分自由練習與「查看日常用途」；桌機拖曳配對保留並提供點選配對；不叫健康分數）、我的重點（讀 kap_ui_v2 收藏清單＋原 XP／等級／成就；清除只刪 kap_ui_v2 並先確認；空狀態「還沒有收藏，從一個動作開始就好」；進度分母分開標示 常見肌群 /16、動作 /40）。
工具與注入器皆在 docs/uiux-handoff/src/（冪等）：ka-ui-v2.css＋inject-ka-ui-v2.cjs、step03.js＋inject-step03.cjs、step04b-fit.js＋inject-step04.cjs、step04c.js＋inject-step04c.cjs、step04f-art.js＋inject-step04f.cjs、step05.js＋inject-step05.cjs；render-page.cjs 產生頁面；test-*.cjs 為回歸，test-contrast-scan.cjs 為自動對比掃描。
完成後更新五份文件並附截圖與驗證。

新增檔案：step06.js＋inject-step06.cjs（接在 Step 05 模組之後插入）、test-step06.cjs。骨骼插畫第二批待使用者重傳（足 foot、脛腓 tibia_fibula、前臂 forearm、肱骨 humerus）；整合方式見 art-manifest.json。
