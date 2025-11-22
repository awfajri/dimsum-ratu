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
