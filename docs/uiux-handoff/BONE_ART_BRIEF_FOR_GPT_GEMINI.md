# 骨骼美術委託單（給 GPT／Gemini 用）

## 為什麼要做這件事（給你看的，不用貼）

目前 App 的骨頭是手寫的向量圖形：顱骨太扁、肋骨像細線、手指像木棍。位置已經用程式貼合到肌肉人形上（95–99% 落在輪廓內），但「畫得像不像真的骨頭」是美術問題，程式改不了。

做法：請 GPT／Gemini 畫出**一塊一塊獨立的骨頭圖片**（透明背景、直立、正面）。我的程式已經會把「每一段骨頭」依肌肉人形的肩、肘、腕、髖、膝、踝位置，沿軸線拉伸、旋轉、擺好（男女、正背面都會）。所以圖片**不需要**對準人形，只需要每一塊畫得漂亮、風格一致、方向正確。

不要請它畫「整副骨架」再叫我去對位——那是先前 PNG 路線失敗的原因。

> 重要：AI 畫的骨頭常有解剖錯誤（肋骨數目、指節數、關節形狀）。這個 App 是教學工具，圖片拿到後請你（或專業人員）檢查，我無法替醫學正確性背書。

---

## 貼給 GPT／Gemini 的指令（整段複製）

```
You are a medical illustrator. I need a set of SEPARATE human bone illustrations
for an anatomy teaching app. Each piece must be its own image so that software
can stretch, rotate and place it individually. Do NOT draw a whole skeleton.

STYLE (identical for every piece)
- Realistic but clean educational illustration, like a modern anatomy atlas
  (not a photo, not cartoon, not a 3D render with strong reflections).
- Bone colour: warm ivory, base around #E8D5B7, soft darker ivory shading
  (#C9B48F) at the edges and in hollows, subtle highlights. Cartilage (costal
  cartilage, joint caps if shown) pale blue-grey #CBD5DC.
- Thin soft outline in a slightly darker ivory (#8A6F4D), about 1 px at 1000 px.
- Light comes from the upper left, very soft. NO cast shadow, NO ground shadow,
  NO glow, NO labels, NO text, NO arrows, NO lines pointing at parts, NO frame,
  NO watermark, NO background pattern.
- Same line weight, same colours and same level of detail across all pieces.

FORMAT
- PNG with a TRANSPARENT background and clean anti-aliased edges (no white or
  coloured halo around the bone).
- If you cannot output transparency, use a perfectly flat pure magenta
  background (#FF00FF), no gradient, no shadow, and keep bone colours away from
  magenta so I can remove the background automatically.
- Long side at least 1600 px. Crop tightly: the bone touches the image edges
  (leave at most 2% empty margin). One bone (or one bone group) per file.
- Name the files exactly as in the list below.

ORIENTATION
- Anterior (front) view unless the list says posterior.
- Every limb bone is drawn STRAIGHT and VERTICAL: proximal (body-side) end at the
  TOP of the image, distal end at the BOTTOM. Do not tilt or bend them.
- Draw limb bones as they appear on the VIEWER'S LEFT half of a front-facing
  skeleton (that is the skeleton's own right limb). I will mirror them for the
  other side. Palm faces forward (anatomical position).
- Bilateral pieces (ribcage, pelvis) are drawn complete and symmetrical.

PIECES (width : height is approximate, ±10% is fine; keep real proportions)
 1. skull_front.png        Skull with mandible, front view, teeth visible, upright.   1 : 1.2
 2. cervical_spine.png     C1–C7 stacked, front view (atlas, axis and C3–C7 distinguishable).   1 : 1.7
 3. thoracic_ribcage.png   Complete thoracic cage, front view: sternum (manubrium, body,
                           xiphoid), 12 pairs of ribs, costal cartilages of ribs 1–7
                           in pale blue-grey, T1–T12 vertebrae visible between the ribs.   0.70 : 1
 4. lumbar_sacrum.png      L1–L5, sacrum and coccyx, front view, vertical.   0.4 : 1
 5. pelvis_front.png       Both hip bones with sacrum, pubic symphysis, obturator
                           foramina, front view.   1.35 : 1
 6. clavicle.png           One clavicle, front view, HORIZONTAL (medial end on the right,
                           lateral end on the left of the image).   5 : 1
 7. scapula_posterior.png  One scapula, posterior view, vertical.   0.6 : 1
 8. humerus.png            Humerus, anterior view, head at top.   0.27 : 1
 9. forearm.png            Radius and ulna together, anterior view, palm forward, elbow end
                           at top, wrist end at bottom.   0.22 : 1
10. hand.png               Complete hand skeleton: 8 carpal bones, 5 metacarpals, 14
                           phalanges, fingers straight and slightly fanned, palm side,
                           wrist at top.   0.37 : 1
11. femur.png              Femur, anterior view, head at top, condyles at bottom.   0.16 : 1
12. patella.png            Patella, anterior view.   0.9 : 1
13. tibia_fibula.png       Tibia and fibula together, anterior view, knee end at top,
                           ankle end at bottom.   0.14 : 1
14. foot.png               Complete foot skeleton (tarsals, 5 metatarsals, 14 phalanges),
                           dorsal view, ankle at top, toes at bottom, toes pointing straight
                           down, slightly fanned.   0.5 : 1

OPTIONAL (back view of the body)
15. skull_posterior.png    Skull from behind (occipital bone, parietal bones, sutures).   1 : 1.1
16. thoracic_ribcage_posterior.png  Ribs and thoracic vertebrae seen from behind.   0.70 : 1
17. pelvis_posterior.png   Pelvis from behind (sacrum, ilia, PSIS).   1.35 : 1

QUALITY CHECK BEFORE YOU ANSWER
- Count: 12 rib pairs; 7 cervical, 12 thoracic, 5 lumbar vertebrae; 8 carpals,
  5 metacarpals, 14 phalanges per hand; 7 tarsals, 5 metatarsals, 14 phalanges per foot.
- No extra or missing bones, no fused or duplicated fingers.
- Every piece is on a transparent (or flat magenta) background with no text.
- All pieces look like they belong to ONE set (same colours, shading, line).

Please create them one at a time in this order, and after the last one confirm
that every item passes the checks above. Keep exactly the same style as the
previous images.
```

---

## 拿到圖片後怎麼交給我

1. 把 14 張（或 17 張）PNG 放進一個 ZIP，檔名**不要改**。
2. 在這個對話上傳 ZIP，並說「骨骼美術已完成」。
3. 我會：
   - 自動去背（若是洋紅底）、檢查邊緣／尺寸／檔名，回報有問題的檔案；
   - 用現有的擬合程式把每一塊放到肌肉人形上（男女、正背面）；
   - 原本的向量骨骼留作**看不見的點擊區**（逐骨點擊、起止點、百科連結不變），圖片只負責外觀；
   - 檢查檔案大小（Cloudflare 免費方案壓縮後須 < 1 MB；每張圖會縮到適合螢幕的尺寸並轉 WebP，必要時請你縮減張數）。

## 先講清楚的限制

- 肋骨、椎骨、手、足是「一整塊」圖片，所以點擊區仍是舊向量形狀，和新圖的肋骨位置會有些許對不齊；點到的骨頭名稱仍正確，但高亮外框會是向量形狀。
- 圖片只有正面，背面視圖的四肢骨沿用正面圖（長骨前後差異小）；背面顱骨／肋骨／骨盆需要第 15–17 張，沒有就沿用正面。
- AI 圖的授權：請確認你使用的 GPT／Gemini 方案條款允許在你的 App 商用。
- 如果結果不理想，備案是我花時間重畫向量（顱骨、肋骨、手、足），但寫實度上限仍低於 AI 圖。
