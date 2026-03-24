<div align="center">

# 💬 nchat

**Gerçek Zamanlı Sohbet Uygulaması**

Neobrutalism tasarım diliyle geliştirilmiş, yapay zeka botlu, anlık mesajlaşma uygulaması.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=flat-square&logo=socket.io)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ✨ Özellikler

- **🔴 Gerçek Zamanlı Mesajlaşma** — Socket.IO ile anlık mesaj gönderme/alma
- **🤖 Yapay Zeka Botu** — Asistan Bot, mesajlara otomatik olarak Türkçe yanıt verir
- **📱 Telefon Numarasıyla Giriş** — Ülke bayraklı uluslararası telefon giriş arayüzü
- **🔔 Canlı Bildirimler** — Yeni mesaj geldiğinde toast bildirimi ve FAB rozeti
- **💛 Neobrutalism Tasarım** — Sert gölgeler, kalın kenarlıklar ve canlı renklerden oluşan özgün tasarım dili
- **💬 WhatsApp Stili Arayüz** — Sol sohbet listesi + sağ mesaj alanı split-panel düzeni
- **⚡ Sıfır Kayıt Adımı** — Telefon numarası gir, otomatik hesap oluştur ve giriş yap

---

## 🛠 Teknoloji Yığını

| Katman               | Teknoloji                                  |
| -------------------- | ------------------------------------------ |
| **Framework**        | Next.js 16 (App Router, standalone output) |
| **UI Kütüphanesi**   | React 19 + React Compiler                  |
| **Dil**              | TypeScript 5.9                             |
| **Gerçek Zamanlı**   | Socket.IO 4.8                              |
| **Veritabanı**       | MongoDB + Mongoose 9                       |
| **Kimlik Doğrulama** | NextAuth.js 4 (JWT + CredentialsProvider)  |
| **State Yönetimi**   | Zustand 5                                  |
| **Form Yönetimi**    | React Hook Form 7 + Zod 4                  |
| **Stil**             | Tailwind CSS 4                             |
| **Özel Sunucu**      | Node.js HTTP + `tsx` (ESM)                 |
| **Bildirimler**      | React Toastify 11                          |
| **Telefon Girdisi**  | react-international-phone 4                |

---

## 🎨 Neobrutalism Tasarım Sistemi

Тüm renkler, gölgeler ve animasyonlar `tailwind.config.ts` içinde tanımlanmıştır.

### Renk Paleti

| Token        | Renk      | Kullanım                            |
| ------------ | --------- | ----------------------------------- |
| `neo-yellow` | `#FFE66D` | Birincil vurgu, gönderilen mesajlar |
| `neo-pink`   | `#FF6B9D` | İkincil vurgu, aktif durumlar       |
| `neo-blue`   | `#4ECDC4` | Bilgi rengi                         |
| `neo-mint`   | `#A8E6CF` | Başarı rengi                        |
| `neo-orange` | `#FF8A5C` | Uyarı rengi                         |
| `neo-purple` | `#C3A6FF` | Özel durumlar                       |
| `neo-bg`     | `#FEF9EF` | Sayfa arka planı                    |
| `neo-black`  | `#1a1a2e` | Metin ve kenarlık rengi             |

### Gölge Sistemi

```
shadow-neo-sm  →  2px 2px 0px #1a1a2e
shadow-neo     →  4px 4px 0px #1a1a2e
shadow-neo-lg  →  6px 6px 0px #1a1a2e
shadow-neo-xl  →  8px 8px 0px #1a1a2e
```

---

## 🏗 Proje Yapısı

```
chatbot/
├── server.mts                    # Özel Next.js + Socket.IO sunucusu
├── proxy.ts                      # Auth koruması
├── tailwind.config.ts            # Neobrutalism tasarım sistemi
│
└── src/
    ├── app/
    │   ├── giris/page.tsx        # Telefon numarasıyla giriş sayfası
    │   ├── layout.tsx            # Root layout (providers)
    │   └── api/
    │       ├── auth/[...nextauth]/   # NextAuth handler
    │       ├── sohbetler/            # Sohbet CRUD API
    │       └── kullanicilar/         # Kullanıcı arama API
    │
    ├── components/
    │   ├── ui/                   # Button, Input, Modal, Badge, Avatar
    │   ├── chat/                 # MessageWidget, ChatModal, vb.
    │   └── providers/            # SessionProvider, ToastProvider
    │
    ├── hooks/
    │   └── use-socket.ts         # Socket.IO React hook'u
    │
    ├── lib/
    │   ├── auth.ts               # NextAuth yapılandırması
    │   ├── mongodb.ts            # Mongoose bağlantı singleton'u
    │   └── socket.ts             # İstemci taraflı socket
    │
    ├── server/
    │   ├── models/               # User, Conversation, Message şemaları
    │   └── seed.ts               # Varsayılan bot kullanıcı oluşturma
    │
    ├── store/
    │   └── chat-store.ts         # Zustand global state
    │
    └── types/                    # TypeScript tip genişletmeleri
```

---

## 🚀 Kurulum

### Gereksinimler

- **Node.js** >= 20
- **MongoDB** (yerel veya Atlas)
- **Yarn** paket yöneticisi

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

`.env.development` dosyasını oluştur:

```env
MONGODB_URI=mongodb://localhost:27017/chatbot
NEXTAUTH_SECRET=gizli-anahtar-uretim-ortaminda-degistir
NEXTAUTH_URL=http://localhost:3000
```

### 4. Geliştirme Sunucusunu Başlat

```bash
yarn dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

---

## 📜 Komutlar

| Komut              | Açıklama                                                        |
| ------------------ | --------------------------------------------------------------- |
| `yarn dev`         | Geliştirme sunucusunu başlatır (Socket.IO destekli özel sunucu) |
| `yarn build`       | TypeScript kontrolü + production build alır                     |
| `yarn start`       | Production sunucusunu başlatır                                  |
| `yarn lint`        | ESLint ile kod kalitesi kontrolü                                |
| `yarn lint:strict` | Sıfır uyarı toleransıyla ESLint                                 |
| `yarn lint:fix`    | ESLint hatalarını otomatik düzeltir                             |
| `yarn format`      | Prettier ile kod biçimlendirme                                  |

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

| Olay                       | Yön              | Açıklama                                 |
| -------------------------- | ---------------- | ---------------------------------------- |
| `authenticate`             | İstemci → Sunucu | Kullanıcıyı kişisel odaya alır           |
| `join-conversation`        | İstemci → Sunucu | Sohbet odasına katılır                   |
| `send-message`             | İstemci → Sunucu | Mesajı DB'ye kaydeder, herkese yayar     |
| `typing`                   | İstemci → Sunucu | Yazıyor... göstergesini yayar            |
| `mark-read`                | İstemci → Sunucu | Okunmamış sayacı sıfırlar                |
| `new-message`              | Sunucu → İstemci | Yeni mesaj bildirimi                     |
| `new-message-notification` | Sunucu → İstemci | Kişisel bildirim (modal kapalıysa toast) |

### Asistan Bot

`+90000000000` numaralı özel kullanıcı, uygulama başladığında otomatik olarak oluşturulur. Herhangi bir mesaj aldığında 1–3 saniye bekler ve havuzdaki 10 adet Türkçe yanıttan birini rastgele seçerek gönderir.

---

## 🗃 Veri Modelleri

```typescript
// Kullanıcı
User { phone, displayName, avatarColor, isBot, isOnline, createdAt }

// Sohbet
Conversation {
  participants: ObjectId[],
  lastMessage: { content, senderId, createdAt },
  unreadCounts: Map<string, number>,
  updatedAt
}

// Mesaj
Message { conversationId, senderId, content, readBy: ObjectId[], createdAt }
```

---

## 🔒 Kimlik Doğrulama Akışı

```
Kullanıcı → Telefon numarası girer
     ↓
Numara DB'de var mı?
  Evet → Giriş yap
  Hayır → Yeni hesap oluştur (demo mod), giriş yap
     ↓
JWT oturumu (userId, phone, avatarColor)
     ↓
Socket.IO authenticate olayı → Kişisel odaya katıl
```

---

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---

<div align="center">

**Mustafa Ağraş** — [mustafaagras@trakya.edu.tr](mailto:mustafaagras@trakya.edu.tr)

</div>
