# 🥟 Dimsum Ratu - E-Commerce Web App

**Dimsum Ratu** adalah aplikasi web e-commerce modern dan responsif yang dibangun untuk mendigitalkan operasional toko dimsum. Aplikasi ini memfasilitasi pemesanan online yang terintegrasi dengan WhatsApp, manajemen stok menu, pelacakan pesanan (_order tracking_), serta panel admin yang _powerful_ bagi pemilik bisnis.

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![PrimeVue](https://img.shields.io/badge/PrimeVue-Aura-10b981?style=for-the-badge&logo=prime&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![Pinia](https://img.shields.io/badge/Pinia-State_Management-yellow?style=for-the-badge)

---

## 🚀 Fitur Utama

### 🛍️ Sisi Pelanggan (Customer Area)

- **Homepage Modern:** Hero banner ilustrasi, Carousel menu favorit, Testimoni pelanggan, dan FAQ (Accordion).
- **Katalog Pintar:** Fitur **Pencarian (Search)** real-time dan **Filter Kategori** (Kukus, Goreng, Frozen).
- **Keranjang Belanja:** Manajemen item (Tambah/Kurang Qty) dengan kalkulasi harga otomatis.
- **Sistem Keanggotaan (Membership):**
  - Registrasi & Login Member.
  - **Lupa Password** (Reset via Email Link).
  - **Riwayat Pesanan (Order History):** Pelacakan status pesanan (Pending/Proses/Dikirim/Selesai).
- **Checkout WhatsApp:** Formulir pengiriman yang otomatis memformat pesanan menjadi pesan WhatsApp ke penjual.
- **Pembayaran QRIS:** Popup gambar QRIS dengan fitur _zoom-in_ untuk kemudahan scan pembayaran.
- **UI Responsif:** Tampilan optimal di Desktop (Navbar) dan Mobile (Hamburger Menu & Sidebar).

### 🔐 Sisi Admin (Owner Dashboard)

- **Panel Admin Terpisah:** Layout khusus dengan Sidebar Navigasi yang elegan.
- **Otentikasi Aman:** Login khusus admin dengan proteksi route (`Navigation Guard`).
- **Manajemen Pesanan (Order Management):**
  - Monitoring pesanan masuk secara _real-time_.
  - Update status pesanan dengan indikator warna (Tag).
  - Hapus riwayat pesanan dengan konfirmasi dialog.
- **Manajemen Produk (Menu CRUD):**
  - Tambah menu baru dengan link gambar eksternal.
  - Edit harga, deskripsi, dan kategori produk.
  - Hapus menu yang tidak dijual lagi.
- **UX Premium:** Menggunakan komponen Dialog Konfirmasi, Toast, dan Tabel dengan Pagination.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework:** Vue.js 3 (Composition API)
- **Build Tool:** Vite
- **UI Component Library:** PrimeVue (Theme: Aura) + Custom CSS
- **State Management:** Pinia (Persistent Cart & User Session)
- **Backend-as-a-Service:** Firebase
  - **Authentication:** Email/Password Login
  - **Firestore:** NoSQL Database (Realtime Updates)
  - **Hosting:** Firebase Hosting Deployment

---

## 📂 Struktur Project

```text
dimsum-ratu-shop/
├── public/              # File statis publik
├── src/
│   ├── assets/          # Gambar statis & CSS global (main.css)
│   ├── components/      # Komponen Vue reusable
│   │   ├── AdminSidebar.vue  # Sidebar khusus Admin
│   │   ├── Navbar.vue        # Menu Navigasi User
│   │   └── Footer.vue        # Kaki Website
│   ├── router/          # Konfigurasi Routing & Navigation Guards
│   │   └── index.js
│   ├── stores/          # State Management (Pinia)
│   │   ├── cart.js      # Logika Keranjang Belanja
│   │   └── user.js      # Logika Auth User & Admin
│   ├── views/           # Halaman Utama (Pages)
│   │   ├── auth/        # Halaman Otentikasi
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   ├── ForgotPasswordView.vue
│   │   │   └── UserLoginView.vue
│   │   ├── user/        # Halaman Fitur User
│   │   │   └── OrderHistoryView.vue
│   │   ├── HomeView.vue     # Beranda
│   │   ├── CatalogView.vue  # Menu & Filter
│   │   ├── CartView.vue     # Keranjang
│   │   ├── CheckoutView.vue # Pembayaran
│   │   └── AdminView.vue    # Dashboard Admin Utama
│   ├── App.vue          # Root Component
│   ├── firebaseConfig.js # Konfigurasi Firebase SDK
│   └── main.js          # Entry Point & Plugins (PrimeVue, Router, Pinia)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

````

---

## 💻 Cara Menjalankan (Local Development)

Ikuti langkah ini untuk menjalankan project di komputer Anda:

1.  **Clone Repository**

    ```bash
    git clone [https://github.com/username-anda/dimsum-ratu-shop.git](https://github.com/username-anda/dimsum-ratu-shop.git)
    cd dimsum-ratu-shop
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Konfigurasi Firebase**
    Pastikan file `src/firebaseConfig.js` sudah diisi dengan kredensial API Firebase project Anda.

4.  **Jalankan Server Lokal**

    ```bash
    npm run dev
    ```

    Akses aplikasi di browser: `http://localhost:5173`

---

## 🌐 Deployment

Aplikasi ini siap di-deploy menggunakan **Firebase Hosting**.

1.  **Build Project** (Membuat folder produksi `dist`)

    ```bash
    npm run build
    ```

2.  **Deploy ke Firebase**

    ```bash
    firebase deploy
    ```

---

## 📝 Catatan Pengembang

Project ini dikembangkan dengan fokus pada **User Experience (UX)** yang bersih dan **Kemudahan Manajemen** bagi pemilik bisnis. Menggunakan pendekatan _Single Page Application (SPA)_ untuk navigasi instan tanpa loading berulang.

---

© 2025 Dimsum Ratu. Dibuat dengan ❤️ menggunakan Vue.js & PrimeVue oleh awfajri.

````
