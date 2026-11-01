繼續 Kinetic Anatomy Pro UI/UX 改版的後續工作。先讀 docs/uiux-handoff/CHECKPOINT.md（最新狀態）、QA_RESULTS.md、DECISIONS.md（D1–D30）、delivery/README.md。分支 claude/npm-install-fst7qc；**不 push master、不 deploy（master 一收到 push 就自動發布）**，除非使用者明確要求上線。免費方案：src/worker.js gzip 目標 < 1,000,000 bytes（目前約 966,700；wrangler dry-run 943.44 KiB）。介面只用中文，英文只當肌肉／骨骼／動作名稱的第二行。

Step 01–08 都已完成；deployed = false。剩下的真實工作（依優先序，使用者決定做哪個）：
1. 【最重要】專業人員核對 17 件 AI 骨骼插畫（肋骨對數、指節、椎骨、薦骨孔數、左右方向）；有錯的請使用者請 GPT 重畫，放進 docs/uiux-handoff/art/originals/ → `node src/reprep-all.cjs`（調整 PLAN）→ `node src/inject-step04f.cjs src/worker.js src/step04f-art.js src/art-manifest.json` → 跑 test-step04f-pieces。
2. 背面視圖的頸椎、腰椎目前用前面圖；若使用者提供後視圖，在 art-manifest.json 加 `only:'back'` 版本並把原本的設為 `only:'front'`（做法同顱骨／胸廓／骨盆）。
3. 使用者若要上線：先讀最新 HEAD 與 QA_RESULTS，再請使用者明確授權；上線方式是把分支合進 master（會自動發布），之後在線上實測並記錄。
4. 實機補測：iPhone／Android Safari/Chrome、VoiceOver／TalkBack、只放大文字的 200%、高對比模式、觸控拖曳配對。把結果寫進 QA_RESULTS。
5. 選用的設計補完：圖譜卡片肌肉縮圖（D23）、專業層「關節活動／筋膜關聯／專業手法」三鍵切換（D14）、04a 共用「目前選取」狀態、分享連結帶構造 ID。
6. 注意：D03 等專業內容、clinical／fun 字句沒有改，若發現疑點請另列內容議題，不要自行改資料（資料指紋須維持 equal=true）。

工具與注入器都在 docs/uiux-handoff/src/（冪等）：ka-ui-v2.css＋inject-ka-ui-v2.cjs、step03、step04b/c、step04f-art＋art-manifest.json＋inject-step04f.cjs＋prep-art.cjs＋reprep-all.cjs、step05、step06＋inject-step06.cjs、step07-lang＋inject-step07-lang.cjs；測試 test-*.cjs（含 test-step07-regression.cjs）；render-page.cjs 把 Worker 產成靜態 HTML 供測試；shots08-delivery.cjs 拍交付截圖。每輪結束更新五份交接文件並附真實證據。
