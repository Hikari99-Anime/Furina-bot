# Flow: Bot Ma Sói trên Discord

## 1. Tech stack
- Node.js + `discord.js` v14
- Slash Commands + Buttons/Select Menu cho tương tác (join lobby, hành động đêm, vote)
- State lưu tạm trong memory (`Map<guildId, GameState>`) — không cần DB vì game không cần lưu lịch sử qua các lần restart bot
- 1 voice channel chung (đã có sẵn trong server, không phải bot tạo) dùng để mọi người nói chuyện thật khi thảo luận ban ngày

## 2. Quyền bot cần
- `Manage Channels` — tạo/xoá text channel riêng cho Sói
- `Manage Roles` — set permission overwrite theo member
- `Mute Members` — câm người chết trong voice
- `Send Messages`, `Use Application Commands`, `Manage Messages` (xoá message thừa trong lobby nếu cần)

## 3. Kiến trúc channel
| Channel | Ai thấy | Mục đích |
|---|---|---|
| `#masoi-chung` (text, có sẵn) | Tất cả | Bot thông báo phase, kết quả, kêu gọi vote |
| Voice chung (có sẵn) | Tất cả | Thảo luận thật bằng giọng nói ban ngày |
| `#chat-soi` (text, tạo lúc chia role) | Chỉ member role Sói | Sói bàn bạc bằng chữ lúc đêm |
| `#chat-dan` (text, tạo lúc chia role, optional) | Chỉ member role Dân | Dân bàn riêng nếu cần (có thể bỏ nếu không cần) |

Cả `#chat-soi` và `#chat-dan` được tạo **mới mỗi ván**, set overwrite theo user ID cụ thể (không tạo Discord Role mới), và **xoá khi game kết thúc** để đảm bảo ván sau sạch hoàn toàn, không sót quyền.

## 4. Data model (per guild, trong memory)
```
GameState {
  guildId
  phase: 'LOBBY' | 'NIGHT' | 'DAY' | 'VOTING' | 'ENDED'
  players: Map<userId, {
    role: 'SOI' | 'DAN' | 'TIEN_TRI' | 'BAO_VE' | 'THO_SAN' | ...
    alive: boolean
  }>
  dayCount: number
  nightActions: Map<userId, targetUserId>   // reset mỗi đêm
  votes: Map<voterId, targetUserId>          // reset mỗi ngày
  channels: { soiChannelId, danChannelId }
  timers: { current setTimeout handle để clear khi phase đổi sớm }
}
```

## 5. Danh sách role & hành động đêm (khởi điểm, có thể mở rộng)
- **Sói**: mỗi đêm chọn 1 người để cắn (cả nhóm Sói vote chung trong `#chat-soi`, hoặc bot lấy target được nhiều Sói chọn nhất)
- **Dân**: không có hành động đêm
- **Tiên Tri**: mỗi đêm xem 1 người là Sói hay không (DM riêng, chỉ người đó thấy kết quả)
- **Bảo Vệ**: mỗi đêm chọn 1 người để cứu (nếu đúng người bị Sói cắn đêm đó → sống)
- **Thợ Săn**: khi chết (bị cắn hoặc bị treo), được bắn theo 1 người chết theo luôn

## 6. Luồng chi tiết

### Bước 1 — Lobby
1. `/masoi start` → bot gửi embed lobby + nút "Tham gia" vào `#masoi-chung`, đặt timer (VD 60s).
2. Ai bấm nút → thêm vào `players` (role tạm `null`, `alive: true`).
3. Hết giờ hoặc admin bấm "Bắt đầu ngay" → kiểm tra đủ số lượng tối thiểu (≥5), nếu đủ → qua bước 2. Không đủ → huỷ, thông báo.

### Bước 2 — Chia role
1. Random chia role theo tỉ lệ đã định (VD 8 người: 2 Sói, 1 Tiên Tri, 1 Bảo Vệ, 4 Dân).
2. Bot DM riêng cho từng người: "Bạn là **Sói**" kèm giải thích ngắn hành động của role đó.
3. Tạo `#chat-soi` (và `#chat-dan` nếu dùng), set overwrite: `@everyone` deny View, từng Sói allow View+Send.
4. Chuyển `phase = 'NIGHT'`, `dayCount = 1`.

### Bước 3 — Đêm
1. Bot thông báo trong `#masoi-chung`: "Trời đã tối, mọi người nhắm mắt lại 🌙" — nhắc mọi người tự mute mic (chưa chết) vì nói chuyện thật voice sẽ bị nghe hết.
2. Bot gửi DM/button cho từng role có hành động đêm (Sói vote trong `#chat-soi`, Tiên Tri/Bảo Vệ nhận button riêng qua DM), đặt timer (VD 45s).
3. Sói bàn bạc bằng chữ trong `#chat-soi`, chọn target qua button hoặc reaction.
4. Hết giờ đêm → bot tổng hợp `nightActions`:
   - Tính người bị Sói cắn.
   - Nếu Bảo Vệ cứu đúng người đó → không ai chết.
   - Nếu Tiên Tri đã xem ai đó → gửi kết quả riêng qua DM (không công khai).
5. Áp dụng kết quả: set `alive = false` cho người chết, gọi `member.voice.setMute(true)` ngay nếu họ đang trong voice.
   - Nếu người chết là Thợ Săn → mở thêm 1 bước nhỏ: DM hỏi họ bắn ai trước khi qua ngày.
6. Xoá quyền của người chết trên `#chat-soi`/`#chat-dan` (nếu họ thuộc channel đó) — người chết không cần bàn bạc riêng nữa, chỉ theo dõi `#masoi-chung`.

### Bước 4 — Ngày
1. `phase = 'DAY'`. Bot thông báo trong `#masoi-chung`: "Trời sáng, [tên] đã chết đêm qua 💀" (hoặc "không ai chết" nếu Bảo Vệ cứu thành công).
2. Check điều kiện thắng (bước 7). Nếu chưa ai thắng → tiếp tục.
3. Mọi người **còn sống** unmute, thảo luận bằng giọng nói thật trong voice chung, thời gian tự do hoặc timer (VD 3 phút), bot có thể đếm ngược trong `#masoi-chung`.

### Bước 5 — Vote (treo cổ)
1. `phase = 'VOTING'`. Bot gửi trong `#masoi-chung` danh sách người còn sống kèm Select Menu để vote.
2. Timer (VD 60s), mỗi người còn sống chọn 1 target (hoặc "bỏ phiếu trắng").
3. Hết giờ → tính người bị vote nhiều nhất → chết, mute voice, xử lý Thợ Săn nếu trúng role đó (tương tự bước 3.5).
4. Hoà phiếu → không ai chết (tuỳ luật, có thể chọn xử lý khác).

### Bước 6 — Lặp
`dayCount++` → quay lại **Bước 3 (Đêm)**, lặp cho đến khi thoả điều kiện thắng ở bước 7.

### Bước 7 — Check thắng
Check sau mỗi lần có người chết (cuối bước 3 và bước 5):
- Tất cả Sói chết → **Dân thắng**.
- Số Sói còn sống ≥ số Dân còn sống (không tính role trung lập nếu có) → **Sói thắng**.
- Nếu chưa thoả → tiếp tục vòng lặp.

### Bước 8 — Kết thúc
1. `phase = 'ENDED'`. Bot công bố người thắng + reveal toàn bộ role trong `#masoi-chung`.
2. Xoá `#chat-soi`, `#chat-dan`.
3. Gọi `setMute(false)` cho tất cả người chơi (unmute lại toàn bộ) để không ảnh hưởng voice chung sau game.
4. Xoá `GameState` khỏi memory.

## 7. Việc cần làm rõ thêm trước khi code (tuỳ chỉnh theo ý bạn)
- Số lượng người chơi tối thiểu/tối đa và tỉ lệ role theo số người.
- Có cần `#chat-dan` riêng hay Dân chỉ dùng `#masoi-chung`.
- Có deafen người chết luôn hay chỉ mute (mute thì người chết vẫn nghe được, dễ lộ info nếu phản ứng — deafen thì họ hoàn toàn ra khỏi vòng nghe).
- Thời gian mỗi phase (đêm/ngày/vote) bao nhiêu giây.
