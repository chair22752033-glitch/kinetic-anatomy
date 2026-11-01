# DECISIONS

| # | 決定 | 原因 |
|---|---|---|
| D1 | 沿用分支 `claude/npm-install-fst7qc` 做 UI 改版，不另開 | 已 ff 到 master HEAD，無分歧；使用者既有慣例 |
| D2 | **不 push master、不部署**；僅推分支與預覽截圖 | 設計包契約＋deploy.yml 僅在 master push 觸發 |
| D3 | 骨骼視覺維持 `KAP_ANAT` 向量（上輪定案），不重啟 PNG 路線 | 設計包亦註明歷史 PNG 路線被替代；0.58MB gzip |
| D4 | 設計包 BASELINE 與 HEAD 一致，不建立新基準，僅加註 HEAD 實測指紋 | inspect 比對 equal=true |
| D5 | 骨骼對位缺陷（偏移／右側黑）列為 UI 改版的一部分，Step 04 處理；不為此改 BONE_PATHS／骨骼 key | 使用者截圖明示要求「骨頭至少要緊貼肌肉」；契約禁止改解剖 path |
| D6 | 動作切換改為「動作庫＋搜尋」為主，保留 `navKeys()`／上一個下一個的相容（不刪函式） | 使用者明示不要一直滑；契約要求保留篩選內導航 |

## 已鎖定設計來源
`02_SPEC/*`、`03_DEMO/screens/*`。如需偏離，先記錄在此欄。

| D7 | 骨骼貼合以「沿軸線擬合骨骼向量」實作，**不向 GPT 要 PNG** | 實測 95–99% 骨骼點落在肌肉圖上；PNG 仍要解決同一個對位問題，且無法同時支援四視圖、逐骨點選、男女與縮放（先前 clean3–6 路線已驗證不足） |
| D8 | 覆蓋層採「方框＝bsvg 方框＋相同 viewBox」，不再假設 inset:0 | 畫布有 padding 後比例會不同；女性／背面 viewBox 起點不同 |
