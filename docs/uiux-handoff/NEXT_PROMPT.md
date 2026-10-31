繼續 Kinetic Anatomy Pro UI/UX 重構。先讀 docs/uiux-handoff/CHECKPOINT.md、DECISIONS.md、QA_RESULTS.md、STEP_PLAN.md、PRESERVE_MAP.md，再讀設計包 STEPS/03_生活入口與動作庫.md、02_SPEC/02、04，看 D01/D02/M01/M02。
核對 git HEAD 與 CHECKPOINT；分支 claude/npm-install-fst7qc；不 push master。
本輪 Step 03：03a 首頁（3 個生活入口 squat/overhead_press/step_up，保留原動作資料）；03b 動作庫＋中英搜尋（使用者明確要求以搜尋找動作、不要靠滑動；navKeys 與篩選同源，不得出現 0/0；無結果有「清除篩選」）；03c 就地提示（保留 kap_onboard_v1）。
工具：docs/uiux-handoff/src/render-page.cjs（node render-page.cjs src/worker.js out.html 取得頁面）；樣式原始碼 src/ka-ui-v2.css，以 inject-ka-ui-v2.cjs 注入（冪等）。
完成後更新五份文件並附截圖與驗證。
