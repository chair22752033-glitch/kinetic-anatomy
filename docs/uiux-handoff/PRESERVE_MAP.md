# 保留映射（不可刪／不可改名；新 UI 只能包裝或轉接）

## 函式（單檔 src/worker.js；計算自 HEAD 0185899）
goHome · goMain(key) · openLibSheet/buildLibSheet · libFilteredKeys · navKeys · loadEx · renderSVG · applyPoseAnim · buildMuscleSVG · setBoneFit · mountSkeleton · syncBoneLayer · showBoneDetail(slug) · showMIDetail(slug) · buildProgress · kapBoneSlug · kapBoneCrop（回傳 null，KAP_BONE_B64 空）· `window.KAP_ANAT`（svg/css/OI/viewBox/raw/defs/dataURI/b64/exportB64/mount/setView/setLayer/highlight/wire）

## 關鍵 DOM id
app · home · kap-tabs · ca（畫布）· bsvg（肌肉人形，viewBox `0 95 727 1280`，背面 x 偏移 718）· bone-overlay（KAP_ANAT 掛載點，`#kap-fit`）· fascia overlay(`fo-*`) · lib-sheet · muscle-overlay（肌肉／骨骼詳情共用 modal）· atlas-search / atlas-grid · quest-home / quest-play · bone-real-img / bone-hotspots（PNG 路線遺留，SKEL_URL 為空，保留相容）

## 資料全域（內容與 key 不可改）
EX(40) MDB(30) WIKI_MUSCLES_DB(174) WIKI_BONES_DB(+_2)(53) STRETCH_DB(17) MASSAGE_DB(30) MIDX(16) BODY_PATHS(4) EXTRA_MUSCLE_PATHS(_2,_3) BONE_PATHS(_2) ANATOMY_DETAIL_DB(30) LANDMARK_DB(34) FASCIA_MAP(29) EX_EQUIP EX_LEVEL

## localStorage（沿用，不 clear）
`ka_seen_muscle` `ka_streak_v1` `ka_viewed_exercises` `ka_viewed_muscles` `kap_last_ex` `kap_last_view` `kap_onboard_v1` `kap_pro` `kap_quest_stats` `kap_streak_v1` `kap_xp` `kap_coach_*`（教學提示）。新增只用 `kap_ui_v2`。

## 路由／發布
單一 Worker 回傳單頁 HTML（無 D1/KV）；`/skeleton.svg` 路由保留；`wrangler.toml` main=`src/worker.js`；deploy.yml 僅 master push。

## 體積守則
目前 `src/worker.js` 1.66MB 原始／0.58MB gzip。新增 UI 須維持 gzip < 1MB（Cloudflare 免費上限）。
