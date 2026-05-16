<div align="center">

# 💬 nchat

**Gerçek Zamanlı Yapay Zeka Destekli Sohbet Uygulaması**

Neobrutalism tasarım diliyle geliştirilmiş, Ollama LLM entegrasyonlu, RAG destekli anlık mesajlaşma uygulaması.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Ollama](https://img.shields.io/badge/Ollama-llama3.2-FF6B35?style=flat-square)](https://ollama.com/)

</div>

---

## ✨ Özellikler

### 💬 Gerçek Zamanlı Mesajlaşma
- **Socket.IO** ile anlık mesaj gönderme/alma
- **Yazıyor...** göstergesi (canlı)
- **✓ / ✓✓ Okundu bildirimleri** — mesaj iletildi ve okundu ikonları
- **🟢 Online göstergesi** — gerçek zamanlı kullanıcı presence durumu
- **🔔 Toast bildirimleri** — modal kapalıyken yeni mesaj uyarısı

### 🤖 Yapay Zeka Asistan (Ollama + RAG)
- **llama3.2** modeli ile yerel LLM entegrasyonu (localhost:11434)
- **SSE Streaming** — bot yanıtları token token akar
- **RAG (Retrieval-Augmented Generation)** — `nomic-embed-text` ile vektör gömme, kosinüs benzerliği tabanlı context arama
- **Otomatik fallback** — Ollama çevrimdışıysa rastgele Türkçe yanıt

### 🔐 Kimlik Doğrulama
- **📱 Telefon numarasıyla giriş** — ülke bayraklı uluslararası format, otomatik hesap oluşturma
- **✉️ Email / Şifre ile kayıt & giriş** — `bcryptjs` ile güvenli hash (Windows uyumlu)
- **Tab geçişli giriş sayfası** — telefon ve email modları tek sayfada

### 💛 Neobrutalism Tasarım
- Sert gölgeler, kalın kenarlıklar ve canlı renklerden oluşan özgün tasarım dili
- **WhatsApp stili split-panel** — sol sohbet listesi + sağ mesaj alanı
- Özel animasyonlar: `neo-pop`, `neo-slide-up`, `neo-shake`

---

## 🛠 Teknoloji Yığını

| Katman | Teknoloji |
| --- | --- |
| **Framework** | Next.js 16 (App Router) |
| **UI Kütüphanesi** | React 19 + React Compiler |
| **Dil** | TypeScript 5.9 |
| **Gerçek Zamanlı** | Socket.IO 4.8 |
| **Veritabanı** | MongoDB + Mongoose 9 |
| **Kimlik Doğrulama** | NextAuth.js 4 (JWT + 2× CredentialsProvider) |
| **Şifre Hash** | bcryptjs 3 (Windows uyumlu) |
| **LLM** | Ollama — llama3.2 (yerel) |
| **Embedding** | Ollama — nomic-embed-text (768 dim) |
| **RAG** | Saf kosinüs benzerliği (Atlas vektör DB yok) |
| **State Yönetimi** | Zustand 5 |
| **Form Yönetimi** | React Hook Form 7 + Zod 4 |
| **Stil** | Tailwind CSS 4 |
| **Özel Sunucu** | Node.js HTTP + `tsx` (ESM) |
| **Bildirimler** | React Toastify 11 |
| **Telefon Girdisi** | react-international-phone 4 |

---

## 🏗 Proje Yapısı

```
chatbot/
├── server.mts                        # Özel Next.js + Socket.IO + Ollama sunucusu
├── proxy.ts                          # Auth koruması
├── tailwind.config.ts                # Neobrutalism tasarım sistemi
├── .env.development                  # Ortam değişkenleri
│
└── src/
    ├── app/
    │   ├── giris/page.tsx            # Telefon + Email tab giriş sayfası
    │   ├── kayit/page.tsx            # Email/şifre kayıt sayfası
    │   ├── layout.tsx                # Root layout (providers)
    │   └── api/
    │       ├── auth/
    │       │   ├── [...nextauth]/    # NextAuth handler
    │       │   └── kayit/            # POST — yeni kullanıcı kaydı
    │       ├── chat/                 # POST — SSE streaming Ollama endpoint
    │       ├── sohbetler/            # Sohbet CRUD API
    │       └── kullanicilar/         # Kullanıcı arama API
    │
    ├── components/
    │   ├── ui/                       # Button, Input, Modal, Badge, Avatar
    │   ├── chat/
    │   │   ├── message-bubble.tsx    # ✓/✓✓ okundu göstergeli mesaj balonu
    │   │   ├── conversation-list.tsx # 🟢 online noktalı sohbet listesi
    │   │   ├── message-area.tsx      # Mesaj alanı + yazıyor göstergesi
    │   │   ├── chat-modal.tsx        # Split-panel modal
    │   │   └── message-widget.tsx    # FAB butonu + unread rozet
    │   └── providers/                # SessionProvider, ToastProvider
    │
    ├── hooks/
    │   ├── use-socket.ts             # Socket.IO React hook'u
    │   ├── use-presence.ts           # user-status dinleyicisi (online/offline)
    │   └── use-read-receipts.ts      # messages-read dinleyicisi (✓✓)
    │
    ├── lib/
    │   ├── auth.ts                   # NextAuth (telefon + email provider)
    │   ├── mongodb.ts                # Mongoose bağlantı singleton'u
    │   ├── socket.ts                 # İstemci taraflı socket
    │   ├── ollama.ts                 # Streaming wrapper, embedText, isOllamaAvailable
    │   └── rag.ts                    # cosineSimilarity, findRelevantContext, saveEmbedding
    │
    ├── server/
    │   ├── models/
    │   │   ├── user.ts               # email, passwordHash, comparePassword()
    │   │   ├── conversation.ts       # participants, lastMessage, unreadCounts
    │   │   ├── message.ts            # content, senderId, readBy[]
    │   │   └── embedding.ts          # vector[768], conversationId, messageId
    │   └── seed.ts                   # Varsayılan bot kullanıcı oluşturma
    │
    ├── store/
    │   └── chat-store.ts             # Zustand: conversations, onlineUsers, typingUsers
    │
    └── types/                        # TypeScript tip genişletmeleri
```

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** >= 20
- **MongoDB** (yerel veya Atlas)
- **Yarn** paket yöneticisi
- **Ollama** (opsiyonel — AI bot için) → [ollama.com](https://ollama.com/)

### 1. Repoyu Klonla

```bash
git clone https://github.com/kullanici-adi/nchat.git
cd nchat
```

### 2. Bağımlılıkları Yükle

```bash
yarn install
```

### 3. Ortam Değişkenlerini Ayarla

`.env.development` dosyasını düzenle:

```env
MONGODB_URI=mongodb://localhost:27017/chatbot
NEXTAUTH_SECRET=gizli-anahtar-uretim-ortaminda-degistir
NEXTAUTH_URL=http://localhost:3000

# Ollama (opsiyonel — yoksa fallback yanıtlar kullanılır)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
OLLAMA_EMBED_MODEL=nomic-embed-text
```

### 4. Ollama Modellerini İndir (opsiyonel)

```bash
ollama pull llama3.2
ollama pull nomic-embed-text
```

### 5. Geliştirme Sunucusunu Başlat

```bash
yarn dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

---

## 📜 Komutlar

| Komut | Açıklama |
| --- | --- |
| `yarn dev` | Geliştirme sunucusunu başlatır (Socket.IO destekli özel sunucu) |
| `yarn build` | TypeScript kontrolü + production build alır |
| `yarn start` | Production sunucusunu başlatır |
| `yarn lint` | ESLint ile kod kalitesi kontrolü |
| `yarn lint:strict` | Sıfır uyarı toleransıyla ESLint |
| `yarn lint:fix` | ESLint hatalarını otomatik düzeltir |
| `yarn format` | Prettier ile kod biçimlendirme |

---

## 🔌 Mimari Notlar

### Özel Sunucu (`server.mts`)

Socket.IO, Next.js App Router ile aynı portu doğrudan paylaşamaz. Bu nedenle `server.mts` dosyası:

1. Ham bir Node.js HTTP sunucusu başlatır
2. Socket.IO'yu bu sunucuya bağlar
3. Tüm diğer istekleri Next.js `requestHandler`'a iletir

```bash
# yarn dev aslında şunu çalıştırır:
tsx server.mts
```

### Socket.IO Olayları

| Olay | Yön | Açıklama |
| --- | --- | --- |
| `authenticate` | İstemci → Sunucu | Kullanıcıyı kişisel odaya alır, isOnline günceller |
| `join-conversation` | İstemci → Sunucu | Sohbet odasına katılır |
| `send-message` | İstemci → Sunucu | Mesajı DB'ye kaydeder, herkese yayar, embedding tetikler |
| `typing` | İstemci → Sunucu | Yazıyor... göstergesini yayar |
| `stop-typing` | İstemci → Sunucu | Yazıyor göstergesini kaldırır |
| `mark-read` | İstemci → Sunucu | Okunmamış sayacı sıfırlar |
| `new-message` | Sunucu → İstemci | Yeni mesaj bildirimi |
| `conversation-updated` | Sunucu → İstemci | Sohbet listesi güncellemesi |
| `user-status` | Sunucu → İstemci | Online/offline durum değişikliği |
| `messages-read` | Sunucu → İstemci | Mesajlar okundu bildirimi (✓✓) |

### AI Bot Akışı

```
Kullanıcı mesaj gönderir
       ↓
[Arka plan] Mesaj metni → nomic-embed-text → 768-dim vektör → MongoDB'ye kaydet
       ↓
Ollama çalışıyor mu? (2 sn timeout)
  Evet →
    findRelevantContext(): son 100 embedding'den kosinüs benzerliğiyle top-5 seç
    Sistem prompt + context + kullanıcı mesajı → llama3.2
    Yanıt arka planda embedding olarak da kaydedilir
  Hayır →
    Rastgele Türkçe fallback yanıt
       ↓
Bot yanıtı Socket.IO ile sohbete yayınlanır
```

### RAG Sistemi

```typescript
// Kosinüs benzerliği ile ilgili mesajları bul
findRelevantContext(conversationId, queryText, topK=5, threshold=0.5)

// Mesajı vektörleştir ve kaydet (arka plan, hata toleranslı)
saveEmbedding(conversationId, messageId, content)
```

---

## 🗃 Veri Modelleri

```typescript
// Kullanıcı
User {
  phone: string          // benzersiz, zorunlu
  email?: string         // opsiyonel, benzersiz
  passwordHash?: string  // bcryptjs hash
  displayName: string
  avatarColor: string
  isBot: boolean
  isOnline: boolean
  comparePassword(password): Promise<boolean>
}

// Sohbet
Conversation {
  participants: ObjectId[]
  lastMessage: { content, senderId, createdAt } | null
  unreadCounts: Map<userId, number>
  updatedAt: Date
}

// Mesaj
Message {
  conversationId: ObjectId
  senderId: ObjectId
  content: string
  readBy: ObjectId[]     // ✓✓ okundu takibi
  createdAt: Date
}

// Embedding (RAG)
Embedding {
  conversationId: ObjectId
  messageId: ObjectId
  content: string
  vector: number[]       // 768 dim (nomic-embed-text)
  createdAt: Date
}
```

---

## 🔒 Kimlik Doğrulama Akışı

```
Telefon ile Giriş:
  Numara gir → DB'de var mı?
    Evet → JWT oturumu aç
    Hayır → Otomatik hesap oluştur (demo mod) → JWT

Email ile Giriş:
  Email + Şifre → DB'de kayıtlı mı? → bcrypt.compare()
    Doğru → JWT oturumu aç
    Hatalı → 401

Email ile Kayıt:
  POST /api/auth/kayit → bcrypt.hash(12 round) → User oluştur
  → Otomatik signIn('credentials-email') → Ana sayfaya yönlendir

Ortak:
  JWT { userId, phone, avatarColor }
  → Socket.IO authenticate → user:${userId} odasına katıl
  → isOnline: true → tüm istemcilere yayın
```

---

## 🎨 Neobrutalism Tasarım Sistemi

Tüm renkler, gölgeler ve animasyonlar `tailwind.config.ts` içinde tanımlanmıştır.

### Renk Paleti

| Token | Renk | Kullanım |
| --- | --- | --- |
| `neo-yellow` | `#FFE66D` | Birincil vurgu, gönderilen mesajlar, aktif tab |
| `neo-pink` | `#FF6B9D` | İkincil vurgu, yeni sohbet |
| `neo-blue` | `#4ECDC4` | Bilgi, okundu ✓✓ rengi |
| `neo-mint` | `#A8E6CF` | Başarı, bot sohbet |
| `neo-orange` | `#FF8A5C` | Uyarı |
| `neo-purple` | `#C3A6FF` | Kayıt sayfası, bot ismi |
| `neo-bg` | `#FEF9EF` | Sayfa arka planı |
| `neo-black` | `#1a1a2e` | Metin ve kenarlık |

### Gölge Sistemi

```
shadow-neo-sm  →  2px 2px 0px #1a1a2e
shadow-neo     →  4px 4px 0px #1a1a2e
shadow-neo-lg  →  6px 6px 0px #1a1a2e
shadow-neo-xl  →  8px 8px 0px #1a1a2e
```

---

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---

<div align="center">

**Mustafa Ağraş** — [mustafaagras@trakya.edu.tr](mailto:mustafaagras@trakya.edu.tr)

</div>
