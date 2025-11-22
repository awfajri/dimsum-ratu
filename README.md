# 🥟 Dimsum Ratu - E-Commerce Web App

**Dimsum Ratu** adalah aplikasi web e-commerce modern yang dibangun untuk mengotomatisasi proses pemesanan dan manajemen stok toko dimsum. Aplikasi ini mengubah proses manual (WhatsApp) menjadi sistem digital yang terintegrasi, responsif, dan _real-time_.

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![PrimeVue](https://img.shields.io/badge/PrimeVue-Display?style=for-the-badge&logo=prime&logoColor=white&color=10b981)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![Pinia](https://img.shields.io/badge/Pinia-State_Management-yellow?style=for-the-badge)

---

## 🚀 Fitur Utama

### 🛍️ Sisi Pelanggan (Customer)

- **Homepage Interaktif:** Banner promosi, Carousel produk unggulan, Testimoni, dan FAQ (Accordion).
- **Katalog Pintar:** Fitur **Pencarian (Search)** dan **Filter Kategori** (Kukus, Goreng, Frozen) untuk memudahkan pemilihan menu.
- **Keranjang Belanja:** Manajemen jumlah barang (Qty) dengan kalkulasi harga otomatis.
- **Checkout WhatsApp:** Formulir pengiriman yang otomatis memformat pesanan menjadi pesan WhatsApp ke penjual.
- **Pembayaran QRIS:** Popup gambar QRIS yang bisa di-zoom untuk kemudahan pembayaran.
- **Animasi UI:** Transisi halaman yang halus dan _scroll animations_.

### 🔐 Sisi Admin (Dashboard Owner)

- **Otentikasi Aman:** Halaman login khusus admin menggunakan Firebase Auth.
- **Monitoring Pesanan Real-time:** Pesanan masuk muncul otomatis tanpa refresh halaman.
- **Manajemen Status:** Update status pesanan (Pending, Proses, Dikirim, Selesai) dengan indikator warna.
- **Manajemen Menu (CRUD):**
  - Tambah menu baru.
  - Edit harga, deskripsi, dan gambar (via URL).
  - Hapus menu yang tidak tersedia.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** Vue.js 3 (Composition API) + Vite
- **UI Framework:** PrimeVue (Aura Theme) + Custom CSS
- **State Management:** Pinia (Persistent Cart)
- **Database:** Firebase Firestore (NoSQL)
- **Authentication:** Firebase Authentication
- **Deployment:** Firebase Hosting

---

## 📂 Struktur Project

```text
dimsum-ratu-shop/
├── public/              # File statis publik
├── src/
│   ├── assets/          # Gambar statis & CSS global
│   │   ├── main.css
│   │   └── logo.svg
│   ├── components/      # Komponen Vue (Bagian kecil UI)
│   │   ├── icons/       # Ikon SVG
│   │   ├── Navbar.vue   # Menu Navigasi Atas
│   │   └── Footer.vue   # Kaki Website
│   ├── router/          # Konfigurasi Routing (Vue Router)
│   │   └── index.js
│   ├── stores/          # State Management (Pinia)
│   │   └── cart.js      # Logika Keranjang Belanja
│   ├── views/           # Halaman Utama (Pages)
│   │   ├── HomeView.vue     # Halaman Depan
│   │   ├── CatalogView.vue  # Halaman Menu & Search
│   │   ├── CartView.vue     # Halaman Keranjang
│   │   ├── CheckoutView.vue # Halaman Pembayaran
│   │   ├── LoginView.vue    # Login Admin
│   │   └── AdminView.vue    # Dashboard Admin
│   ├── App.vue          # Root Component
│   ├── firebaseConfig.js # Konfigurasi Koneksi Firebase
│   └── main.js          # Entry Point & Konfigurasi Plugin
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
    Pastikan Node.js sudah terinstall.

    ```bash
    npm install
    ```

3.  **Konfigurasi Firebase**
    Pastikan file `src/firebaseConfig.js` sudah berisi kredensial API Firebase Anda. Contoh format:

    ```javascript
    // src/firebaseConfig.js
    const firebaseConfig = {
      apiKey: "API_KEY_ANDA",
      authDomain: "dimsum-ratu-shop.firebaseapp.com",
      projectId: "dimsum-ratu-shop",
      storageBucket: "dimsum-ratu-shop.appspot.com",
      messagingSenderId: "ID_ANDA",
      appId: "ID_APP_ANDA",
    };
    export { db, auth };
    ```

4.  **Jalankan Server Lokal**

    ```bash
    npm run dev
    ```

    Buka browser di `http://localhost:5173`

---

## 🌐 Deployment

Project ini sudah siap di-deploy menggunakan **Firebase Hosting**.

1.  **Build Project** (Membuat folder `dist`)

    ```bash
    npm run build
    ```

2.  **Deploy ke Firebase**

    ```bash
    firebase deploy
    ```

---

## 📝 Catatan Pengembang

Project ini dikembangkan dengan fokus pada **User Experience (UX)** yang bersih dan **Kemudahan Manajemen** bagi pemilik bisnis. Menggunakan pendekatan _Single Page Application (SPA)_ untuk navigasi yang cepat tanpa loading berulang.

---

© 2025 Dimsum Ratu. Dibuat dengan ❤️ menggunakan Vue.js.
````
