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
import AdminSidebar from "../components/AdminSidebar.vue"; // <--- Sidebar Baru
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";

// --- STATE ---
const activeTab = ref("0"); // Dikontrol oleh Sidebar

// --- LOGIKA PESANAN (Sama seperti sebelumnya) ---
const orders = ref([]);
const loadingOrders = ref(true);
let unsubscribeOrders = null;

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
  } catch (err) {
    alert("Gagal update");
  }
};
const deleteOrder = async (orderId) => {
  if (confirm("Hapus pesanan ini?")) {
    try {
      await deleteDoc(doc(db, "orders", orderId));
    } catch (err) {
      alert("Gagal hapus");
    }
  }
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

// --- LOGIKA PRODUK (Sama seperti sebelumnya) ---
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
      alert("Berhasil disimpan!");
    } catch (e) {
      alert("Gagal simpan.");
    }
  }
};
const deleteProduct = async (prod) => {
  if (confirm("Hapus menu ini?")) {
    try {
      await deleteDoc(doc(db, "products", prod.id));
    } catch (e) {
      alert("Gagal hapus");
    }
  }
};

// --- FETCH ---
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
              <div class="flex gap-2">
                <select
                  :value="slotProps.data.status"
                  @change="
                    updateOrderStatus(slotProps.data.id, $event.target.value)
                  "
                  class="status-select"
                >
                  <option value="Menunggu Pembayaran">Pending</option>
                  <option value="Lunas / Proses">Proses</option>
                  <option value="Dikirim">Dikirim</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  @click="deleteOrder(slotProps.data.id)"
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
                @click="deleteProduct(slotProps.data)"
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
  </div>
</template>

<style scoped>
/* LAYOUT UTAMA */
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
.status-select {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
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
</style>
