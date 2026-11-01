# 8 步切分（可驗收小單位）

| 步 | 最小驗收單位 | 對照圖 | 狀態 |
|---|---|---|---|
| 01 | 版本／指紋／截圖／缺陷清單／五份文件 | B_*.png | ✅ |
| 02 | 02a tokens→CSS 變數 · 02b 四主入口＋共用路由表（相容 goMain/goHome/openLibSheet）· 02c 桌機三欄／手機單欄容器＋safe-area · 02d 修「底部 pills／PRO 被截」 | D01 M01 M02 | ✅ |
| 03 | 03a 首頁（主標＋3 生活入口 squat/overhead_press/step_up）· 03b 動作庫＋中英搜尋（**取代左右滑為主要找動作方式**；`navKeys()` 與 `filteredExerciseIds` 同源，無 0/0）· 03c 就地提示（保留 kap_onboard_v1） | D01 D02 M01 M02 | ✅ |
| 04 | 04a 單一選取狀態 · 04b **骨骼對位：骨骼層與肌肉人形同一 viewBox／同一縮放，頭不被截，右半黑色鏡像修復** · 04c 四視圖 overlay 驗證 · 04d 放大 1–2.5＋重設 · 04e FASCIA 缺圖 fallback | D02 D03 M02 | ✅（04a→05） |
| 05 | 白話／專業分層、daily 提前、百分比標示「教學示意值、未經個人量測」、bottom sheet | D03 M03 M04 | ⬜ next |
| 06 | 完整圖譜、原題型、`kap_ui_v2` 收藏與「我的重點」 | D04 D05 D06 M05 M06 | ⬜ |
| 07 | 資料指紋回歸、320–1920 寬度、中英、四視圖、鍵盤／焦點、對比 | 全部 | ⬜ |
| 08 | 交付包、after 截圖、最終狀態；deployed=false | — | ⬜ |

## 使用者在 Step 01 後新增的優先要求（對應步驟）
1. 用**搜尋**找動作，不靠滑動 → Step 03b
2. 介面不可被截 → Step 02d / 07
3. 骨頭要緊貼肌肉 → Step 04b
