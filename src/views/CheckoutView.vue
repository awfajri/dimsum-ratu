<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "../stores/cart";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

// Import PrimeVue Components
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import RadioButton from "primevue/radiobutton";
import Button from "primevue/button";
import Card from "primevue/card";
import Divider from "primevue/divider";
import Message from "primevue/message";
import Dialog from "primevue/dialog"; // <--- BARU: Import Dialog

const cartStore = useCartStore();
const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const showQRPopup = ref(false); // <--- BARU: State untuk Popup QR

// Data Form Pelanggan
const customer = ref({
  name: "",
  phone: "",
  address: "",
  paymentMethod: "QRIS",
});

// Hitung Total
const grandTotal = computed(() => cartStore.totalPrice);
const OWNER_PHONE = "6281317983887";

// Fungsi Submit
const submitOrder = async () => {
  if (
    !customer.value.name ||
    !customer.value.phone ||
    !customer.value.address
  ) {
    alert("Mohon lengkapi data nama, nomor WA, dan alamat.");
    return;
  }

  loading.value = true;

  try {
    const orderData = {
      userId: userStore.user ? userStore.user.uid : null,
      customer: customer.value,
      items: cartStore.items,
      total: grandTotal.value,
      status: "Menunggu Pembayaran",
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);

    let waMessage = `Halo Dimsum Ratu Telagasari, saya mau konfirmasi order baru:%0A`;
    waMessage += `--------------------------------%0A`;
    waMessage += `👤 Nama: *${customer.value.name}*%0A`;
    waMessage += `🆔 Order ID: ${docRef.id.slice(0, 5)}...%0A`;
    waMessage += `📍 Alamat: ${customer.value.address}%0A%0A`;
    waMessage += `📝 *Detail Pesanan:*%0A`;

    cartStore.items.forEach((item) => {
      waMessage += `- ${item.name} (${item.qty}x) : Rp ${(
        item.price * item.qty
      ).toLocaleString("id-ID")}%0A`;
    });

    waMessage += `--------------------------------%0A`;
    waMessage += `💰 *TOTAL: Rp ${grandTotal.value.toLocaleString(
      "id-ID"
    )}*%0A`;
    waMessage += `💳 Metode: ${customer.value.paymentMethod}%0A`;
    waMessage += `--------------------------------%0A`;
    waMessage += `Mohon diproses ya, bukti bayar saya lampirkan setelah ini. Terima kasih!`;

    cartStore.clearCart();
    window.open(`https://wa.me/${OWNER_PHONE}?text=${waMessage}`, "_blank");

    router.push("/");
  } catch (error) {
    console.error("Gagal order:", error);
    alert("Terjadi kesalahan sistem. Coba lagi.");
  } finally {
    loading.value = false;
  }
};

const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
</script>

<template>
  <div class="page checkout-page">
    <div class="header-section" v-animate>
      <h1>Finalisasi Pesanan</h1>
      <p>Lengkapi data pengirimanmu di bawah ini</p>
    </div>

    <div class="checkout-grid" v-animate>
      <div class="form-section">
        <Card>
          <template #title>Data Pengiriman</template>
          <template #content>
            <div class="form-layout">
              <div class="field">
                <label for="name">Nama Penerima</label>
                <InputText
                  id="name"
                  v-model="customer.name"
                  placeholder="Contoh: Auf Fajri"
                  class="w-full"
                />
              </div>

              <div class="field">
                <label for="phone">Nomor WhatsApp</label>
                <InputText
                  id="phone"
                  v-model="customer.phone"
                  placeholder="0812xxxxx"
                  class="w-full"
                  keyfilter="int"
                />
                <small>Penting untuk konfirmasi pengiriman.</small>
              </div>

              <div class="field">
                <label for="address">Alamat Lengkap</label>
                <Textarea
                  id="address"
                  v-model="customer.address"
                  rows="3"
                  placeholder="Jalan, Nomor Rumah, Patokan..."
                  class="w-full"
                  autoResize
                />
              </div>
            </div>
          </template>
        </Card>

        <Card class="mt-4">
          <template #title>Metode Pembayaran</template>
          <template #content>
            <div class="payment-options">
              <div class="radio-option">
                <RadioButton
                  v-model="customer.paymentMethod"
                  inputId="qris"
                  name="payment"
                  value="QRIS"
                />
                <label for="qris" class="radio-label"
                  >Scan QRIS (DANA/Gopay/ShopeePay/BCA)</label
                >
              </div>

              <transition name="fade">
                <div v-if="customer.paymentMethod === 'QRIS'" class="qris-box">
                  <div class="qris-content">
                    <div
                      class="qris-img-wrapper"
                      @click="showQRPopup = true"
                      title="Klik untuk memperbesar"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                        alt="QRIS Toko"
                        class="qris-img"
                      />
                      <div class="zoom-hint">
                        <i class="pi pi-search-plus"></i> Perbesar
                      </div>
                    </div>

                    <div class="qris-info">
                      <p class="font-bold">Dimsum Ratu Official</p>
                      <p class="text-sm">NMID: ID123456789</p>
                      <Message severity="info" :closable="false"
                        >Silakan scan, lalu kirim bukti bayar ke WA Admin
                        setelah checkout.</Message
                      >
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </template>
        </Card>
      </div>

      <div class="summary-section">
        <Card class="sticky-card">
          <template #title>Ringkasan Order</template>
          <template #content>
            <div class="order-items">
              <div
                v-for="item in cartStore.items"
                :key="item.id"
                class="item-row"
              >
                <div class="item-name">
                  <span class="font-bold">{{ item.name }}</span>
                  <span class="text-sm text-gray-500">x{{ item.qty }}</span>
                </div>
                <span class="item-price">{{
                  formatRupiah(item.price * item.qty)
                }}</span>
              </div>
            </div>

            <Divider />

            <div class="total-row">
              <span>Total Tagihan</span>
              <span class="grand-total">{{ formatRupiah(grandTotal) }}</span>
            </div>

            <div class="action-area">
              <Button
                label="Konfirmasi Pesanan via WA"
                icon="pi pi-whatsapp"
                class="w-full p-button-lg"
                :loading="loading"
                :disabled="cartStore.items.length === 0"
                @click="submitOrder"
              />
              <p class="secure-text">
                <i class="pi pi-lock text-xs"></i> Data Anda aman & terenkripsi
              </p>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Dialog
      v-model:visible="showQRPopup"
      modal
      header="Scan QRIS"
      :style="{ width: '400px' }"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div
        class="flex justify-center align-items-center flex-column text-center"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
          alt="QRIS Besar"
          style="width: 100%; border-radius: 10px"
        />
        <p class="mt-3 font-bold">Dimsum Ratu Official</p>
        <p class="text-sm text-gray-500">
          Scan menggunakan aplikasi DANA, OVO, Gopay, atau Mobile Banking.
        </p>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.header-section {
  text-align: center;
  margin-bottom: 30px;
}
.header-section h1 {
  color: var(--brand-red);
  margin-bottom: 5px;
}
.header-section p {
  color: #666;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
  align-items: start;
}

/* FORM STYLING */
.field {
  margin-bottom: 20px;
}
.field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #444;
}
.w-full {
  width: 100%;
}
.mt-4 {
  margin-top: 20px;
}

/* PAYMENT STYLING */
.radio-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.radio-option:hover {
  background: #f9f9f9;
  border-color: #ccc;
}
.radio-label {
  cursor: pointer;
  font-weight: 500;
  width: 100%;
}

.qris-box {
  margin-top: 15px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px dashed #ccc;
}
.qris-content {
  display: flex;
  gap: 20px;
  align-items: center;
}

/* Style Gambar QR Kecil (Agar terlihat bisa diklik) */
.qris-img-wrapper {
  position: relative;
  cursor: zoom-in; /* Ubah kursor jadi kaca pembesar */
  transition: transform 0.2s;
}
.qris-img-wrapper:hover {
  transform: scale(1.05);
}
.qris-img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  display: block;
}

/* Hint text saat hover */
.zoom-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 0.7rem;
  text-align: center;
  padding: 2px;
  border-radius: 0 0 8px 8px;
  opacity: 0;
  transition: opacity 0.2s;
}
.qris-img-wrapper:hover .zoom-hint {
  opacity: 1;
}

.qris-info {
  flex: 1;
}
.text-sm {
  font-size: 0.85rem;
  color: #666;
}
.font-bold {
  font-weight: 700;
}

/* SUMMARY STYLING */
.sticky-card {
  position: sticky;
  top: 120px;
}
.item-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.item-name {
  display: flex;
  flex-direction: column;
}
.text-gray-500 {
  color: #888;
}
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  font-size: 1.1rem;
}
.grand-total {
  color: var(--brand-red);
  font-weight: 800;
  font-size: 1.4rem;
}
.action-area {
  margin-top: 10px;
}
.secure-text {
  text-align: center;
  font-size: 0.8rem;
  color: #888;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

/* Utility Helper untuk Dialog */
.flex-column {
  flex-direction: column;
}
.text-center {
  text-align: center;
}
.mt-3 {
  margin-top: 15px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
  .qris-content {
    flex-direction: column;
    text-align: center;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
