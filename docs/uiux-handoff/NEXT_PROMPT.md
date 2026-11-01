繼續 Kinetic Anatomy Pro UI/UX 重構。先讀 docs/uiux-handoff/CHECKPOINT.md（含 Step 04b 骨骼貼合結果與限制）、DECISIONS.md（D7、D8）、QA_RESULTS.md、STEP_PLAN.md、PRESERVE_MAP.md，再讀設計包 STEPS/04_人體與互動.md、02_SPEC/03_視覺規格.md，看 D02/D03/M02。
核對 git HEAD 與 CHECKPOINT；分支 claude/npm-install-fst7qc；不 push master。
本輪 Step 04 剩餘：04c 角色色映射（主力 coral #B7523B／幫手 amber #906A25／穩定 blue #416D91，只在 UI 層映射，不改 EX 的 col）＋非焦點肌肉改 anatomy-neutral #C9D1C5（renderSVG 目前用 SC[slug]||'#3a3a3a' 深灰，可用 CSS 或視圖層覆蓋，不改資料）、圖例要有文字；04d 放大 1–2.5＋重設（+/−/重設按鈕，保留雙擊重置，先不做自由平移；放大時覆蓋層必須與 bsvg 同步，kapSyncOverlay 以 bsvg 方框為準）；04e FASCIA_MAP 引用 fo-dfl／fo-sbal 但 overlay 只有 fo-sbl／fo-sfl／fo-ll／fo-fal／fo-fl，先查動態注入來源，缺圖用文字 fallback（不自畫）；04a 單一選取狀態。
注意：骨骼擬合在 docs/uiux-handoff/src/step04b-fit.js（注入器 inject-step04.cjs 冪等）；樣式 ka-ui-v2.css、step03.js 同理。測試：test-step04-*.cjs。頁面以 render-page.cjs 產生。
完成後更新五份文件並附截圖與驗證。
