<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

// Import Komponen
import AdminSidebar from "../components/AdminSidebar.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import ConfirmDialog from "primevue/confirmdialog"; // Import Dialog Konfirmasi
import { useConfirm } from "primevue/useconfirm"; // Import Hook Confirm

// --- SETUP ---
const activeTab = ref("0");
const confirm = useConfirm(); // Inisialisasi Confirm Service

// --- LOGIKA PESANAN ---
const orders = ref([]);
const loadingOrders = ref(true);
let unsubscribeOrders = null;

// Pilihan Status (Untuk Dropdown PrimeVue)
const statusOptions = ref([
  { label: "Pending", value: "Menunggu Pembayaran" },
  { label: "Proses", value: "Lunas / Proses" },
  { label: "Dikirim", value: "Dikirim" },
  { label: "Selesai", value: "Selesai" },
]);

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
  } catch (err) {
    alert("Gagal update");
  }
};

// Hapus Pesanan (Pakai Dialog Cantik)
const confirmDeleteOrder = (orderId) => {
  confirm.require({
    group: "delete-dialog",
    header: "Hapus Pesanan?",
    message:
      "Data pesanan ini akan dihapus permanen dan tidak bisa dikembalikan.",
    icon: "pi pi-trash",
    rejectProps: {
      label: "Batal",
      icon: "pi pi-times",
      outlined: true,
      severity: "secondary",
      size: "small",
    },
    acceptProps: {
      label: "Hapus",
      icon: "pi pi-check",
      severity: "danger",
      size: "small",
    },
    accept: async () => {
      try {
        await deleteDoc(doc(db, "orders", orderId));
      } catch (err) {
        alert("Gagal hapus");
      }
    },
  });
};

const getSeverity = (status) => {
  switch (status) {
    case "Selesai":
      return "success";
    case "Dikirim":
      return "info";
    case "Lunas / Proses":
      return "warn";
    default:
      return "danger";
  }
};

// --- LOGIKA PRODUK ---
const products = ref([]);
const loadingProducts = ref(true);
let unsubscribeProducts = null;
const productDialog = ref(false);
const product = ref({});
const submitted = ref(false);
const categories = ref([
  { label: "Kukus", value: "Kukus" },
  { label: "Goreng", value: "Goreng" },
  { label: "Frozen", value: "Frozen" },
]);

const openNew = () => {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
};
const editProduct = (prod) => {
  product.value = { ...prod };
  productDialog.value = true;
};

const saveProduct = async () => {
  submitted.value = true;
  if (product.value.name && product.value.price) {
    try {
      if (product.value.id) {
        await updateDoc(doc(db, "products", product.value.id), product.value);
      } else {
        if (!product.value.image)
          product.value.image = "https://placehold.co/300x200";
        await addDoc(collection(db, "products"), product.value);
      }
      productDialog.value = false;
      product.value = {};
    } catch (e) {
      alert("Gagal simpan.");
    }
  }
};

// Hapus Produk (Pakai Dialog Cantik)
const confirmDeleteProduct = (prod) => {
  confirm.require({
    group: "delete-dialog", // Pakai grup yang sama biar desainnya konsisten
    header: "Hapus Menu?",
    message: `Yakin ingin menghapus menu "${prod.name}" dari daftar?`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Batal",
      icon: "pi pi-times",
      outlined: true,
      severity: "secondary",
      size: "small",
    },
    acceptProps: {
      label: "Hapus",
      icon: "pi pi-check",
      severity: "danger",
      size: "small",
    },
    accept: async () => {
      try {
        await deleteDoc(doc(db, "products", prod.id));
      } catch (e) {
        alert("Gagal hapus");
      }
    },
  });
};

// --- FETCH DATA ---
onMounted(() => {
  const qOrder = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  unsubscribeOrders = onSnapshot(qOrder, (s) => {
    orders.value = s.docs.map((d) => ({ id: d.id, ...d.data() }));
    loadingOrders.value = false;
  });

  const qProduct = query(collection(db, "products"));
  unsubscribeProducts = onSnapshot(qProduct, (s) => {
    products.value = s.docs.map((d) => ({ id: d.id, ...d.data() }));
    loadingProducts.value = false;
  });
});

onUnmounted(() => {
  if (unsubscribeOrders) unsubscribeOrders();
  if (unsubscribeProducts) unsubscribeProducts();
});

const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
const formatDate = (t) =>
  t ? new Date(t.seconds * 1000).toLocaleString("id-ID") : "-";
</script>

<template>
  <div class="admin-layout">
    <AdminSidebar v-model:activeTab="activeTab" />

    <div class="admin-content">
      <div class="content-header">
        <h1>
          {{ activeTab === "0" ? "📦 Kelola Pesanan" : "🥟 Kelola Produk" }}
        </h1>
        <p class="text-gray">
          {{
            activeTab === "0"
              ? "Pantau pesanan masuk real-time"
              : "Tambah atau ubah menu dimsum"
          }}
        </p>
      </div>

      <div v-if="activeTab === '0'" class="card-wrapper">
        <DataTable :value="orders" paginator :rows="8" :loading="loadingOrders">
          <Column header="Tanggal" field="createdAt" sortable>
            <template #body="slotProps">{{
              formatDate(slotProps.data.createdAt)
            }}</template>
          </Column>
          <Column header="Pelanggan" field="customer.name">
            <template #body="slotProps">
              <strong>{{ slotProps.data.customer.name }}</strong
              ><br />
              <small>{{ slotProps.data.customer.phone }}</small>
            </template>
          </Column>
          <Column header="Total" field="total" sortable>
            <template #body="slotProps">{{
              formatRupiah(slotProps.data.total)
            }}</template>
          </Column>
          <Column header="Status" field="status">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.status"
                :severity="getSeverity(slotProps.data.status)"
              />
            </template>
          </Column>
          <Column header="Aksi">
            <template #body="slotProps">
              <div class="flex align-items-center gap-2">
                <Select
                  :modelValue="slotProps.data.status"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Ubah Status"
                  class="w-full md:w-10rem status-dropdown"
                  @update:modelValue="
                    (val) => updateOrderStatus(slotProps.data.id, val)
                  "
                />

                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  @click="confirmDeleteOrder(slotProps.data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <div v-if="activeTab === '1'" class="card-wrapper">
        <div class="flex justify-end mb-3">
          <Button label="Tambah Menu Baru" icon="pi pi-plus" @click="openNew" />
        </div>
        <DataTable
          :value="products"
          paginator
          :rows="8"
          :loading="loadingProducts"
        >
          <Column field="name" header="Nama" sortable></Column>
          <Column header="Gambar">
            <template #body="slotProps">
              <img
                :src="slotProps.data.image"
                class="w-12 h-12 object-cover rounded"
              />
            </template>
          </Column>
          <Column field="price" header="Harga" sortable>
            <template #body="slotProps">{{
              formatRupiah(slotProps.data.price)
            }}</template>
          </Column>
          <Column header="Aksi">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                rounded
                @click="editProduct(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="confirmDeleteProduct(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Detail Menu"
      :modal="true"
    >
      <div class="flex flex-column gap-3">
        <div>
          <label>Nama</label><InputText v-model="product.name" class="w-full" />
        </div>
        <div>
          <label>Deskripsi</label
          ><Textarea v-model="product.description" rows="2" class="w-full" />
        </div>
        <div>
          <label>Kategori</label
          ><Select
            v-model="product.category"
            :options="categories"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>
        <div>
          <label>Harga</label
          ><InputNumber
            v-model="product.price"
            mode="currency"
            currency="IDR"
            locale="id-ID"
            class="w-full"
          />
        </div>
        <div>
          <label>Link Gambar</label
          ><InputText v-model="product.image" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Batal" text @click="productDialog = false" />
        <Button label="Simpan" @click="saveProduct" />
      </template>
    </Dialog>

    <ConfirmDialog group="delete-dialog">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="custom-dialog-delete">
          <div class="dialog-icon-wrapper-delete">
            <i :class="message.icon" class="dialog-icon-delete"></i>
          </div>
          <span class="dialog-title">{{ message.header }}</span>
          <p class="dialog-message">{{ message.message }}</p>

          <div class="dialog-actions">
            <button class="btn-cancel" @click="rejectCallback">Batal</button>
            <button class="btn-confirm-delete" @click="acceptCallback">
              Ya, Hapus
            </button>
          </div>
        </div>
      </template>
    </ConfirmDialog>
  </div>
</template>

<style scoped>
/* LAYOUT */
.admin-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: #f4f6f8;
}
.admin-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}
.content-header {
  margin-bottom: 30px;
}
.content-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}
.text-gray {
  color: #666;
  margin-top: 5px;
}
.card-wrapper {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* UTILITY */
.status-dropdown {
  border-radius: 8px;
  min-width: 150px;
} /* Style Dropdown baru */
.w-12 {
  width: 3rem;
}
.h-12 {
  height: 3rem;
}
.object-cover {
  object-fit: cover;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 1rem;
}
.flex {
  display: flex;
}
.flex-column {
  flex-direction: column;
}
.justify-end {
  justify-content: flex-end;
}
.mb-3 {
  margin-bottom: 1rem;
}
.w-full {
  width: 100%;
}
.align-items-center {
  align-items: center;
}

/* --- CSS CUSTOM DIALOG DELETE (Style mirip logout tapi nuansa Merah Peringatan) --- */
.custom-dialog-delete {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.dialog-icon-wrapper-delete {
  width: 70px;
  height: 70px;
  background-color: #fee2e2; /* Merah muda banget */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.dialog-icon-delete {
  font-size: 2rem;
  color: #dc2626;
}

.dialog-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 5px;
}
.dialog-message {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 25px;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  gap: 10px;
  width: 100%;
}
.dialog-actions button {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  border: none;
  transition: 0.2s;
}

.btn-cancel {
  background: white;
  border: 1px solid #e5e7eb !important;
  color: #374151;
}
.btn-cancel:hover {
  background: #f9fafb;
}

.btn-confirm-delete {
  background: #dc2626;
  color: white;
  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.2);
}
.btn-confirm-delete:hover {
  background: #b91c1c;
  transform: translateY(-2px);
}
</style>
