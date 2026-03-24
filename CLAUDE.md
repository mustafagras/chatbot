# GEMINI Proje Belgeleri

Bu dosya, projede yapılan planlama, görev takibi ve tamamlanan özelliklerin özet dökümünü kaybetmemek adına tek bir dosyada birleştirilmiştir.

---

## 1. UYGULAMA PLANI (implementation_plan.md)

# Gerçek Zamanlı Sohbet Uygulaması — Uygulama Planı

Next.js 16 App Router + Socket.IO + MongoDB + Neobrutalism UI.

## User Review Required

> [!IMPORTANT]
> **Neobrutalism tasarım sistemi** tamamen `tailwind.config.ts` içinde tanımlanacak. `globals.css` minimum düzeyde olacak. Tüm UI bileşenleri `src/components/ui/` altında `cn()` yardımcı fonksiyonu ile prop-driven olarak yazılacak.

> [!WARNING]
> Socket.IO, Next.js App Router ile doğrudan çalışmaz. **Özel sunucu** (`server.mts`) dosyası oluşturulacak ve `yarn dev` komutu bu dosyayı çalıştıracak.

---

## Proposed Changes

### 1. Paket Kurulumu

#### [MODIFY] package.json

Eklenecek bağımlılıklar:

| Paket | Amaç |
|---|---|
| `socket.io` | Sunucu taraflı WebSocket |
| `socket.io-client` | İstemci taraflı WebSocket |
| `mongoose` | MongoDB ODM |
| `react-hook-form` | Form yönetimi |
| `@hookform/resolvers` | RHF + Zod entegrasyonu |
| `zod` | Şema doğrulama |
| `clsx` | Koşullu className birleştirme |
| `react-international-phone` | Telefon numarası input + bayraklar |

DevDependencies:

| Paket | Amaç |
|---|---|
| `tsx` | Custom server çalıştırma (ESM) |

`dev` script değişikliği: `"dev": "tsx server.mts"`

---

### 2. Neobrutalism Tasarım Sistemi

#### [MODIFY] tailwind.config.ts

Neobrutalism teması eklenecek:
- **Renkler**: `neo-yellow (#FFE66D)`, `neo-pink (#FF6B9D)`, `neo-blue (#4ECDC4)`, `neo-mint (#A8E6CF)`, `neo-orange (#FF8A5C)`, `neo-purple (#C3A6FF)`, `neo-bg (#FEF9EF)`, `neo-black (#1a1a2e)`
- **Gölgeler**: `neo-sm (2px 2px)`, `neo (4px 4px)`, `neo-lg (6px 6px)`, `neo-xl (8px 8px)` — tümü sert, düz gölge
- **Kenar yarıçapı**: `neo (0px)`, `neo-sm (4px)`
- **Font**: `Inter` (sans), `JetBrains Mono` (mono)
- **Animasyonlar**: `neo-bounce`, `neo-shake`, `neo-pop`

#### [MODIFY] globals.css

Minimale indirilecek — sadece `@import`, `@plugin`, `@config`, `@theme` ve base `html/body` stilleri. Özel sınıflar sadece burada olacak.

---

### 3. UI Bileşenleri (`src/components/ui/`)

Tümü variant + size prop'ları ile, `cn()` kullanarak:

#### [NEW] button.tsx
- Variants: `primary`, `secondary`, `ghost`, `danger`
- Sizes: `sm`, `md`, `lg`
- Neobrutalism: kalın sınır, sert gölge, hover'da gölge kayması

#### [NEW] input.tsx
- Variants: `default`, `error`
- Neobrutalism: kalın sınır, sert gölge, focus efekti

#### [NEW] modal.tsx
- Açık/kapalı kontrollü, overlay, animasyonlu giriş/çıkış
- Neobrutalism: kalın sınır, sert gölge

#### [NEW] badge.tsx
- Variants: `default`, `notification`, `online`
- Bildirim sayısı gösterimi

#### [NEW] avatar.tsx
- Boyutlar: `sm`, `md`, `lg`
- İsim baş harfleri fallback

---

### 4. Veritabanı & Modeller

#### [NEW] mongodb.ts
- Mongoose bağlantı singleton'u (connection caching)

#### [NEW] user.ts
```typescript
{ phone: string, displayName: string, avatarColor: string, isBot: boolean, isOnline: boolean, createdAt: Date }
```

#### [NEW] conversation.ts
```typescript
{ participants: ObjectId[], lastMessage: { content, senderId, createdAt }, unreadCounts: Map<string, number>, updatedAt: Date }
```

#### [NEW] message.ts
```typescript
{ conversationId: ObjectId, senderId: ObjectId, content: string, readBy: ObjectId[], createdAt: Date }
```

#### [NEW] seed.ts
- Varsayılan AI bot kullanıcısını oluşturma (telefon: `+90000000000`, isim: `Asistan Bot`)

---

### 5. Kimlik Doğrulama (NextAuth.js)

#### [NEW] auth.ts
- `CredentialsProvider`: telefon numarası ile giriş (demo — kayıt/bulma)
- Session'a `userId`, `phone`, `displayName` ekleme

#### [NEW] route.ts
- NextAuth API route handler

#### [MODIFY] next-auth.d.ts
- Session ve JWT tip genişletmeleri

#### [NEW] page.tsx
- Telefon numarası giriş sayfası
- `react-international-phone` ile ülke kodu seçici + bayraklar
- `react-hook-form` + `zod` form doğrulama

#### [MODIFY] layout.tsx
- SessionProvider, ToastContainer ekleme
- Metadata Türkçe güncelleme

#### [NEW] proxy.ts
- Oturum kontrolü: giriş yapılmamışsa `/giris`'e yönlendirme

---

### 6. Socket.IO Sunucusu

#### [NEW] server.mts
- HTTP sunucu + Socket.IO + Next.js request handler
- Socket olayları: `authenticate`, `join-conversation`, `send-message`, `typing`, `mark-read`
- AI bot: mesaj gelince 1-3 sn sonra rastgele Türkçe yanıt

#### [NEW] socket.ts
- Socket.IO istemci instance singleton

#### [NEW] use-socket.ts
- React hook: bağlantı yönetimi, olay dinleyicileri

---

### 7. Sohbet Özellikleri

#### [NEW] chat-store.ts
Zustand store: `conversations[]`, `activeConversationId`, `messages[]`, `unreadTotal`, actions

#### [NEW] route.ts
- `GET` — kullanıcının sohbetlerini listele, `POST` — yeni sohbet başlat

#### [NEW] route.ts
- `GET` — sohbetin mesajlarını getir

#### Chat Components (`src/components/chat/`):

#### [NEW] message-widget.tsx
- Sağ alt FAB butonu + okunmamış mesaj badge'i → tıkla → ChatModal aç

#### [NEW] chat-modal.tsx
- WhatsApp benzeri: sol konuşma listesi ↔ sağ mesaj alanı

#### [NEW] conversation-list.tsx
- Sohbet listesi, son mesaj önizleme, okunmamış sohbet koyu arka plan + badge

#### [NEW] conversation-item.tsx
- Avatar, isim, son mesaj, zaman, okunmamış sayısı

#### [NEW] message-area.tsx
- Mesaj baloncukları, scroll-to-bottom, başlık çubuğu

#### [NEW] message-bubble.tsx
- Gönderen/alan farklı renk, zaman damgası

#### Providers:

#### [NEW] toast-provider.tsx
- React-toastify + yeni mesaj toast'u

#### [NEW] session-provider.tsx
- NextAuth SessionProvider wrapper

#### [MODIFY] home/index.tsx
- Boş sayfa + MessageWidget bileşeni

#### [MODIFY] .env.development
```
MONGODB_URI=mongodb://localhost:27017/chatbot
NEXTAUTH_SECRET=dev-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

---

## Dosya Yapısı

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── sohbetler/
│   │       ├── route.ts
│   │       └── [id]/mesajlar/route.ts
│   ├── giris/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── views/home/index.tsx
├── components/
│   ├── ui/          (button, input, modal, badge, avatar)
│   ├── chat/        (message-widget, chat-modal, conversation-list/item, message-area/bubble)
│   └── providers/   (session-provider, toast-provider)
├── hooks/           (use-socket)
├── lib/             (utils, mongodb, auth, socket)
├── server/models/   (user, conversation, message, seed)
├── store/           (chat-store)
└── types/           (next-auth.d.ts, index.d.ts)
server.mts           (Custom server: Next.js + Socket.IO)
proxy.ts
```

---

## Verification Plan

### Automated Tests
1. **TypeScript derleme kontrolü**: `npx tsc --noEmit`
2. **Build kontrolü**: `yarn build`

### Tarayıcı Testi
1. `yarn dev` → `http://localhost:3000` aç
2. `/giris` yönlendirmesi doğrula
3. Telefon numarası gir (bayrak görünmeli) → giriş yap
4. Ana sayfa: sağ alt mesaj widget'ı görünsün
5. Widget tıkla → sohbet modalı açılsın
6. "Asistan Bot" ile sohbet → mesaj gönder → bot yanıt versin
7. Toast bildirimi görünsün
8. Modal kapat → widget badge'i görünsün

<br/>
<br/>

---

## 2. GÖREV LİSTESİ (task.md)

# Real-Time Chatbot Application

## Phase 1: Setup & Dependencies
- [x] Install missing packages (socket.io, mongoose, react-hook-form, zod, clsx, react-international-phone, etc.)
- [x] Configure environment variables (.env.development)

## Phase 2: Neobrutalism Design System
- [x] Update `tailwind.config.ts` with Neobrutalism theme (colors, shadows, borders, fonts)
- [x] Minimal `globals.css` (theme variables only)
- [x] Create UI components: Button, Input, Modal, Badge, Avatar (`src/components/ui/`)

## Phase 3: Database & Models
- [x] MongoDB connection utility (`src/lib/mongodb.ts`)
- [x] Mongoose models: User, Conversation, Message (`src/server/models/`)
- [x] Seed script for default AI bot user

## Phase 4: Authentication (NextAuth.js)
- [x] NextAuth config with Credentials provider (phone-only demo)
- [x] API route `/api/auth/[...nextauth]`
- [x] Login page `/giris` with phone number + country flags
- [x] Auth middleware/session protection
- [x] next-auth.d.ts type augmentation

## Phase 5: Socket.IO Real-Time Server
- [x] Custom server (`server.mts`) with Socket.IO + Next.js
- [x] Socket event handlers (connect, send-message, join-conversation, typing)
- [x] Client-side socket hook (`src/hooks/use-socket.ts`)

## Phase 6: Chat Features
- [x] Zustand chat store (`src/store/chat-store.ts`)
- [x] API routes: conversations CRUD, messages CRUD
- [x] MessageWidget (FAB with notification badge)
- [x] ChatModal with conversation list (WhatsApp-style)
- [x] Message area with bubbles
- [x] AI auto-reply bot logic
- [x] React-toastify toast notifications for new messages

## Phase 7: Verification
- [x] `yarn format` → `yarn lint:strict` → `yarn tsc -b`
- [x] Browser testing of full flow

<br/>
<br/>

---

## 3. PROJE ÖZETİ (walkthrough.md)

# Real-Time Chatbot Application - Walkthrough

## What Was Accomplished 🚀

The real-time chatbot application has been successfully built with all required features and a striking **Neobrutalism** design system using React 19, Next.js 16, Socket.IO, and MongoDB.

### 1. Neobrutalism Design System
- Configured `tailwind.config.ts` with vibrant colors (`neo-yellow`, `neo-pink`, `neo-blue`, etc.), harsh shadows (`shadow-neo-xl`), thick borders (`border-neo`), and custom animations (`animate-neo-pop`).
- Developed reusable UI components: `Button`, `Input`, `Modal`, `Badge`, and `Avatar` matching the high-contrast aesthetic.
- Global styles kept minimal, deferring entirely to the Tailwind configuration.

### 2. Full-Stack Infrastructure
- **MongoDB**: Setup models for `User`, `Conversation`, and `Message` utilizing robust indexing and aggregation capabilities.
- **Authentication**: Phone-based NextAuth.js login flow that auto-registers users in demo mode. Types augmented for sessions to hold `userId`, `phone`, and `avatarColor`.
- **API Routes**: Endpoints created for fetching/starting conversations (`/api/sohbetler`) and retrieving messages (`/api/sohbetler/[id]/mesajlar`), alongside endpoints to find the default bot and look up users by phone number (`/api/kullanicilar/telefon`).

### 3. Real-Time Chat Engine (Socket.IO)
- Integrated a customized `server.mts` capturing Next.js requests and initializing a unified Socket.IO server.
- Built a smart `useSocket` React hook that automatically joins chat rooms on mount globally, ensuring users receive background toasts and widget unread updates even if the main chat modal is closed.
- **Asistan Bot**: Automatically seeded default user that replies (after 1-3 seconds) to any incoming messages with randomized Turkish greetings.

### 4. Interactive Interfaces
- `MessageWidget` (Bottom Right FAB) to launch the `ChatModal` asynchronously.
- Split-panel `ChatModal` handling responsive breakpoints (WhatsApp-style left list, right chat area).
- `ConversationList` allows starting chats instantly with the Asistan Bot or by searching any registered phone number using `react-international-phone`.
- Complete unread message state management utilizing `zustand`.

## Validation Results ✅
All TypeScript linting paths have been satisfied. The verification pipeline commands execute flawlessly:
- `yarn format`
- `yarn lint:strict` (No `eslint-disable` warnings/errors remain)
- `yarn tsc -b` (Strict typing achieved across Socket.IO handlers and Mongoose queries)

The project is fully ready for testing via `yarn dev`.
