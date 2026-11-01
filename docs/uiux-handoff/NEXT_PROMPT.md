繼續 Kinetic Anatomy Pro UI/UX 重構。先讀 docs/uiux-handoff/CHECKPOINT.md、DECISIONS.md、QA_RESULTS.md、STEP_PLAN.md、PRESERVE_MAP.md，再讀設計包 STEPS/04_人體與互動.md、02_SPEC/02（圖層、放大）、03，看 D02/D03/M02。
核對 git HEAD 與 CHECKPOINT；分支 claude/npm-install-fst7qc；不 push master。
本輪 Step 04（使用者明確要求：骨頭至少要緊貼肌肉）：04b 骨骼層(KAP_ANAT, #bone-overlay)與肌肉人形(#bsvg)共用同一 viewBox／縮放，四視圖（男女×前後）對位，頭部不被截；修「肌肉層同時開啟時右半骨骼全黑」（鏡像 -R 的 fill，Step 01 baseline 已重現）；04c 角色色映射（主力 coral／幫手 amber／穩定 blue，不改資料 col）、非焦點肌肉改 anatomy-neutral；04d 放大 1–2.5＋重設；04e FASCIA 缺圖 fallback。不改 path、viewBox 資料、骨骼 key、肌肉 slug。
工具：docs/uiux-handoff/src/（render-page.cjs 產生頁面；ka-ui-v2.css＋inject-ka-ui-v2.cjs、step03.js＋inject-step03.cjs 為冪等注入器；注意注入器假設起點是 Step 01 後的 worker，若已注入過會跳過）。
完成後更新五份文件並附截圖與驗證。
