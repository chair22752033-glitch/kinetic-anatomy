# QA_RESULTS

## Step 01
| 項目 | 命令／方法 | 結果 |
|---|---|---|
| 版本一致 | `git rev-parse HEAD`；`git hash-object src/worker.js` | `0185899…`；blob `37e3661…`（= 設計包基準） |
| 資料指紋 | `node 06_TOOLS/inspect-worker.cjs --worker src/worker.js --out baseline/inspect-HEAD.json --compare 01_AUDIT/BASELINE.json` | exit 0；`equal:true`；`differences:[]` |
| 載入 | Playwright Chromium，桌機 1440×900／手機 390×844（isMobile、DPR2） | 無 pageerror／console error；`scrollWidth==clientWidth`（無橫向溢出） |
| 截圖 | home／lab（肌肉）／lab（骨骼）× 桌機／手機 | 6 張已存；發現缺陷見 CHECKPOINT「基準期發現的實際缺陷」 |
| 未測 | 線上站、Safari/iOS 實機、無障礙、回歸（尚未改程式） | — |

## Step 02
| 項目 | 方法 | 結果 |
|---|---|---|
| 資料指紋 | inspect-worker --compare BASELINE.json | equal=true，differences=[] |
| 溢出 | 320/375/390/768/1024/1440/1920 × 5 畫面（Playwright） | 全部 ok |
| 導覽路由 | 點四個入口、動作頁→圖譜→首頁 | 皆到達；`on` 狀態正確（動作頁亮「生活動作」） |
| 語言 | setLang('zh') | 生活動作／身體圖譜／輕鬆練習／我的重點 |
| 焦點 | Tab 到導覽 | outline solid 3px |
| 底導覽遮蓋 | 手機動作頁 layerbtn.bottom ≤ tabs.top | clear（320/375/390/768） |
| 骨骼點選 | 開骨骼層、點 humerus-L | 開「肱骨（詳細）」（桌機、320 手機） |
| console | pageerror／console.error | none |
| 體積 | gzip src/worker.js | 0.59 MB |
| 未測 | 真機 Safari/iOS、對比數值逐項、讀屏、reduced-motion 實測、線上站 | — |

## Step 03
命令：`node docs/uiux-handoff/src/test-step03-library.cjs <page.html> <outdir>`、`test-step03-firstvisit.cjs`（頁面以 `render-page.cjs` 產生）。桌機 1440×900、手機 390×844。
| 項目 | 結果 |
|---|---|
| 三張生活卡＋主按鈕 → 原 ID | PASS：squat／overhead_press／step_up，`KAP.view==='lab'` |
| 庫顯示全部 40 個 | PASS |
| 40 個原 ID 都能用英文名與中文名搜到 | PASS（0 缺漏） |
| 搜尋 squat／階梯／舉高／股四頭肌 | PASS：squat+bulgarian_split_squat；step_up+stair_climbing；overhead_press；13 筆 |
| 無結果→顯示規格文案＋清除→回到 40、輸入框清空 | PASS |
| 分類×器材全組合筆數＝手算 | PASS |
| 篩選內導航不超出結果、末端箭頭隱藏、計數文字正常（無 0/0／undefined） | PASS（`2 / 2 · filtered`） |
| 目前動作被篩掉 → 回退完整列表並提示 | PASS（`21 / 40`） |
| 「找動作」按鈕開庫；輸入框內方向鍵與 `?` 不換動作／不開說明；Esc 關庫；焦點回按鈕 | PASS |
| 首訪：不彈強制導覽、顯示就地提示；關閉後 reload 不再出現；導覽可選用、略過寫入 `kap_onboard_v1` | PASS |
| 繼續上次：合法 id 開該動作；無效 id→導覽連結 | PASS |
| 導覽／溢出／骨骼點選回歸（Step 02 套件） | PASS（320–1920 無溢出；肱骨點選正常） |
| 資料指紋 | equal=true |
| gzip | 0.59 MB |
| console／pageerror | none |
| 未測 | iOS Safari 實機、讀屏實測、字級放大 200%、線上站 |

## Step 04b
| 項目 | 結果 |
|---|---|
| 骨骼落在肌肉人形上的比例（≤10 單位）男前／男後／女前／女後 | 99／98／95／97%（未擬合：75／0／60／0%） |
| 覆蓋層方框＝body 方框；縮放 1100×760、1920×1000；收合側欄 | PASS |
| 右半骨骼：fill 為骨骼漸層（不再黑）、右肱骨／股骨／脛骨／鎖骨／肋骨複本可點且名稱正確 | PASS |
| 隱藏狀態下切換性別＋視角，再開骨骼 → 已擬合；背面顯示四肢、隱藏髕骨；回正面髕骨回來 | PASS |
| 換動作保持擬合 | PASS |
| 回歸：導覽／動作庫／首頁／首訪／溢出（Step 02–03 套件） | PASS |
| 資料指紋 | equal=true |
| gzip | 0.59 MB |
| console／pageerror | none |
| 未測 | iOS Safari 實機（含 getTotalLength 於 display 切換時的行為）、極窄寬 320 的肉眼檢視、讀屏 |

## Step 04c–e
| 項目 | 結果 |
|---|---|
| 角色色：深蹲股四頭肌 coral、腹直肌（穩定）blue、胸大肌（不參與）neutral；背面腿後肌群（幫手）amber | PASS（桌機＋手機） |
| EX 資料色未被改（squat 股四頭肌 col 仍 #ff6b35） | PASS |
| 圖例含角色文字與「非疼痛」提示 | PASS |
| 放大：125→…→250%，到頂 +鍵停用；viewBox 不超出人形範圍；點 % 重設；雙擊畫布重設 | PASS |
| 放大時骨骼覆蓋層方框與 viewBox 與肌肉層一致 | PASS |
| 筋膜缺圖提示：弓箭步顯示 1 條無圖；深蹲不顯示 | PASS |
| 肌肉層關閉時骨骼擬合（修正的 bug）男前／男後／女前／女後 | 99／98／95／97% |
| 回歸：導覽／動作庫／首頁／首訪／骨骼點選與縮放／溢出 | PASS |
| 資料指紋 | equal=true |
| gzip | 0.60 MB |
| console／pageerror | none |
| 未測 | iOS Safari 實機、讀屏、200% 字級、放大時手指捏合（刻意不做）、筋膜覆蓋層放大時的視覺核對 |

## Step 04f（顱骨試做）
| 項目 | 結果 |
|---|---|
| 檔案檢查：真透明（四角 alpha=0）、骨頭置中留白、半透明邊緣 0.5%、無白色光暈（淺／深／珊瑚底） | PASS |
| `<image>` 進入覆蓋層、向量顱骨／下顎骨隱藏但保留為點擊區 | PASS |
| 四視圖顱骨置中於頭（|Δx|<6px） | PASS |
| 點擊顱骨 → Frontal Bone；指標在圖上仍命中 skull | PASS |
| 全回歸套件（導覽／動作庫／首頁／首訪／骨骼／角色色／放大／筋膜）＋擬合量測 | PASS |
| 資料指紋 | equal=true |
| gzip | 0.625 MB（上限 1MB） |
| 未測 | iOS Safari 實機、圖載入失敗還原路徑的實機行為、其餘 13 塊 |

## Step 05
`node docs/uiux-handoff/src/test-step05-layers-sheet.cjs <page.html> <outdir>`（桌機 1440×900、手機 390×844、320×640）
| 項目 | 結果 |
|---|---|
| 預設白話；白話層無百分比、無 AROM／筋膜／復原；名單含該動作全部肌肉 | PASS |
| 專業層：原百分比與順序不變；百分比／AROM／復原提示存在；伸展／復原分頁回來；`kap_pro` 寫入 | PASS |
| `P` 快捷鍵與按鈕同步；`aria-pressed` | PASS |
| 肌肉詳情：生活用途框在解剖列之前；文字＝原 WIKI daily；順序 主要功能→起點 | PASS |
| 英文模式：中文原文標 Source text (Chinese) | PASS |
| 按摩分頁：注意事項與禁忌在技法之前 | PASS |
| 對話框：role／aria-modal、焦點進入、14 次 Tab 不外逃、Esc 關閉並解除鎖定、焦點回到觸發列 | PASS |
| 收藏：訊息與規格一致、重複不重複寫入、舊 key 不動、儲存被擋時不丟例外且有提示 | PASS |
| 換動作會關閉殘留詳情並重建白話層 | PASS |
| 手機：首屏可見入口（390: 底 676/844；320: 底 472/640）、☰ 消失、sheet 鎖定／遮罩／焦點／20 次 Tab 不外逃 | PASS |
| 手機：sheet 高度不超出螢幕、捲到底最後一顆按鈕可達 | PASS |
| 手機：從 sheet 開肌肉詳情→只剩一個面板；Esc 回 sheet 且焦點回肌肉列；再 Esc 關 sheet、解鎖、焦點回入口鈕；遮罩點擊與 ✕ 都能關 | PASS |
| 對比掃描 14 畫面×2 尺寸 | 僅剩 1 誤報 |
| 全回歸（導覽／動作庫／首頁／首訪／骨骼擬合／角色色／放大／筋膜／顱骨圖／溢出） | PASS |
| 資料指紋 | equal=true |
| gzip | 0.631 MB（免費方案上限 1MB） |
| console／pageerror | none |
| 未測 | iOS Safari 實機（焦點／捲動鎖定）、讀屏、200% 字級、reduced-motion 實測、WCAG 對比的完整人工審查（自動掃描只涵蓋文字節點與實色背景） |

## Step 04f 整合（股骨／手／胸廓）
| 項目 | 結果 |
|---|---|
| `test-step04f-pieces.cjs`：四視圖各 6 張圖（顱骨、胸廓、股骨×2、手×2）；左右複本對稱於身體中線；胸廓置中；被取代向量骨隱藏但保留；肋軟骨隱藏；不超出人形方框；背面髕骨仍隱藏 | PASS |
| 指標落在圖上仍通到向量點擊區（股骨→femur、胸廓→sternum、手→metacarpal-2）；點擊股骨開詳情；hover 高亮顯示向量形狀（不透明度 .55） | PASS |
| 圖載入失敗 → 該件回到向量骨並恢復肋軟骨 | PASS |
| 既有回歸：顱骨圖、逐骨、四視圖、擬合分數（98／95／97）、角色色／放大／筋膜、首訪、動作庫、Step05 圖層／sheet | PASS |
| 對比掃描 | 僅剩同一個誤報（語言切換滑塊）|
| 資料指紋 | equal=true |
| gzip | 0.885 MB（免費方案上限 1MB；raw 2.08MB） |
| console／pageerror | none |
| 已知限制 | 背面仍用正面插畫（顱骨有臉、胸廓有胸骨）；胸廓為整塊圖，肋骨高亮是向量形狀、位置與插畫略有差；手與足：足尚未有插畫；胸廓圖含一節 C7 與下方腰椎，與向量頸椎／L1 略重疊；未檢查解剖正確性（AI 圖，須專業人員審）；未測 iOS Safari |

## Step 06（圖譜／練習／我的重點）
| 項目 | 結果 |
|---|---|
| 圖譜：肌肉 194 張卡＝合併資料庫 194；骨骼 143（53＋90）；部位篩選（大腿 20＝資料 20） | PASS |
| 搜尋：中文（股四頭）、英文（Quadriceps 排第一）、生活詞（站起來→臀大肌＋股四頭肌；爬樓梯；拿高處→三角肌） | PASS |
| 無結果：保留搜尋詞、顯示清除與依部位找（焦點移到部位清單且詞保留）；清除還原全部 | PASS |
| 缺 path 的肌肉（前斜角肌）與骨骼（淚骨）→「此構造暫無互動圖」，不顯示錯誤人形、文字仍可讀；無按摩資料的肌肉（額肌）無按摩分頁並說明；有資料的（股四頭肌）有 | PASS |
| 骨骼詳情標題回到圖片上方；詳情收藏鈕只存 ID；鍵盤 Enter 開卡片、Esc 關閉後搜尋詞／捲動位置／焦點保留 | PASS |
| 詳情載入失敗（模擬例外）→可讀文字＋重試，重試後恢復 | PASS |
| 語言切換重繪圖譜 | PASS |
| 練習：首頁 4 個自由模式、進階區預設收合、每日＋原五類題型都在；臨床題在未開專業資料時鎖住；舊 XP 250 可讀 | PASS |
| 自由練習（肌肉點名／動作偵探／功能配對）：無計時、確認鈕要先選、答錯有溫和說明＋解說＋「查看日常用途」開肌肉詳情、答對計入本次、先看解說不計對、跳過；XP 與測驗統計完全不變 | PASS |
| 配對：點肌肉再點動作、鍵盤 Enter／Space、原拖曳都可完成；自由模式不給 XP，結束列出配對解說 | PASS |
| 進階挑戰：10 秒計時回來、答對加 XP 並更新統計；每日 5 題跑完並記錄連續天數 | PASS |
| 我的重點：空狀態不預灌、分母 2／16 與 3／40 分開、進階回顧（等級 2、勳章）預設收合 | PASS |
| 收藏動作＋肌肉、重新載入仍在、「再看一次」回動作；清除先確認並說明範圍；取消保留；清除後只剩收藏被清空，XP／看過清單／其他 key／閱讀深度不動；單筆移除 | PASS |
| 儲存被禁用：頁面照常、顯示「本次暫時無法保存」橫幅、存收藏不丟例外、該筆本分頁內保留、圖譜與練習可開 | PASS |
| 版面：320／390／768／1440 三頁都無橫向溢出、無被截、標題不被導覽列壓住 | PASS |
| 全回歸（首訪／動作庫／骨骼逐骨／角色色放大筋膜／顱骨圖／四件插畫／Step05 圖層與 sheet）＋對比掃描（僅剩原有 1 誤報） | PASS |
| 資料指紋 | equal=true |
| gzip | 0.902 MB（免費方案上限 1MB） |
| 未測 | iOS Safari 實機、讀屏、200% 字級；拖曳配對在觸控裝置上的手感（用點選取代，未實測觸控拖曳）；URL 分享構造 ID（未做） |

## 第二批插畫＋純中文介面
| 項目 | 結果 |
|---|---|
| 四視圖各 14 張插畫（顱骨、胸廓、肱骨×2、前臂×2、股骨×2、脛腓×2、手×2、足×2）、左右鏡像、隱藏向量腳趾線、點擊區與失敗回退 | PASS |
| 英文掃描（桌機 30 多個畫面狀態＋手機）：剩餘英文只有品牌 KAP／KINETIC ANATOMY PRO，以及資料庫文字中的英文術語；aria-label／title／placeholder 轉中文 | PASS |
| 首次進入（含導覽、說明、提示）無英文介面句子 | PASS |
| 全回歸（首訪／動作庫／骨骼逐骨／角色色放大筋膜／顱骨圖／14 張插畫／Step05／Step06）；對比掃描 0 項 | PASS |
| 資料指紋 equal=true；gzip 0.880 MB | PASS |
| 未測 | iOS Safari 實機、讀屏、200% 字級 |

## 第三批插畫
| 項目 | 結果 |
|---|---|
| 四視圖各 21 張圖（5 件中線＋8 件成對）；左右對稱；點擊區、失敗回退、原有回歸、Step05／06 | PASS |
| 資料指紋 | equal=true |
| gzip | 932159 bytes（免費方案上限 1,048,576） |
| 限制 | 髕骨圖尚未收到（使用者傳圖時未存檔）；背面的顱骨／胸廓／骨盆是正面圖；肩胛骨的點擊高亮是向量形狀 |

## Step 07 回歸與無障礙（自動化＋Chromium）
| 項目 | 結果 |
|---|---|
| 7 種寬度（320／375／390／768／1024／1440／1920）× 首頁／動作頁／骨骼層／圖譜／練習／我的重點／動作庫／詳情／手機 sheet：無整頁水平捲動；四個主入口都完整顯示不截字 | PASS（96 項） |
| 手機（320×640、375×667、390×844）：主要 sheet 入口可捲到完整露出在底部導覽之上；圖譜／練習／我的重點捲到底，最後一列不被導覽擋住 | PASS |
| 鍵盤：圖譜頁連續 12 個 Tab 停靠點都有可見焦點；詳情開啟後 25 次 Tab 不逃出；Esc 關閉並回到原卡片；動作庫 Esc 關閉 | PASS |
| 在圖譜搜尋框與動作庫搜尋框打 p／l／m 等字母，不觸發全局快捷鍵、不切換閱讀深度 | PASS |
| prefers-reduced-motion：首頁／動作頁／圖譜／練習沒有無限循環動畫 | PASS |
| 200% 縮放等效（640×360）與 390×400 短螢幕：圖譜／練習／我的重點無水平捲動，動作頁可開 | PASS |
| 損壞或被禁用的儲存（kap_ui_v2、ka_viewed_*、kap_xp、kap_quest_stats、kap_streak_v1 內容為壞 JSON）：各頁照常打開，仍可新增收藏 | PASS |
| 內嵌 script 語法、worker 可被評估、console／pageerror | PASS／none |
| 對比掃描（文字節點＋實色背景） | 0 項 |
| 資料指紋 | equal=true |
| gzip | 939019 bytes（免費方案上限 1,048,576） |
| wrangler.toml、.github、package.json | 與 master 相同（未改） |
| **未測** | iPhone／Android 實機與 Safari；VoiceOver／TalkBack 讀屏；只放大文字（不縮放頁面）的 200% 文字縮放；高對比模式；圖片／漸層上的文字對比；觸控拖曳配對的手感 |

## 後視版插畫
| 項目 | 結果 |
|---|---|
| 正面視圖只顯示 skull_front／thoracic_ribcage／pelvis_front；背面視圖只顯示 skull_back／thoracic_ribcage_back／pelvis_back | PASS |
| 四視圖 26 張圖、左右對稱、點擊區、失敗回退、顱骨置中於頭 | PASS |
| 全回歸（Step 03–07 測試、對比掃描 0 項）、資料指紋 equal=true | PASS |
| gzip | 966589 bytes（目標 < 1,000,000） |
| 限制 | 背面的頸椎、腰椎仍是前面圖（沒有後視版）；背面肩胛骨使用背面圖；AI 圖須由專業人員核對解剖正確性 |
