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

// Import PrimeVue
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";

// --- STATE UMUM ---
const activeTab = ref("0"); // 0: Pesanan, 1: Menu

// --- BAGIAN PESANAN (ORDER) ---
const orders = ref([]);
const loadingOrders = ref(true);
let unsubscribeOrders = null;

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
  } catch (err) {
    alert("Gagal update status");
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
    case "Menunggu Pembayaran":
      return "danger";
    default:
      return null;
  }
};

// --- BAGIAN PRODUK (MENU) ---
const products = ref([]);
const loadingProducts = ref(true);
let unsubscribeProducts = null;

// State Dialog (Form Produk)
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const product = ref({}); // Data produk yang sedang diedit/tambah
const submitted = ref(false);

// Pilihan Kategori
const categories = ref([
  { label: "Kukus", value: "Kukus" },
  { label: "Goreng", value: "Goreng" },
  { label: "Frozen", value: "Frozen" },
]);

// 1. Buka Form Tambah Baru
const openNew = () => {
  product.value = {}; // Kosongkan form
  submitted.value = false;
  productDialog.value = true;
};

// 2. Buka Form Edit
const editProduct = (prod) => {
  product.value = { ...prod }; // Copy data biar gak reaktif langsung
  productDialog.value = true;
};

// 3. Simpan Produk (Tambah / Update)
const saveProduct = async () => {
  submitted.value = true;

  // Validasi sederhana
  if (product.value.name && product.value.price) {
    try {
      if (product.value.id) {
        // UPDATE (Jika ada ID)
        const prodRef = doc(db, "products", product.value.id);
        await updateDoc(prodRef, product.value);
        alert("Menu berhasil diperbarui!");
      } else {
        // CREATE (Jika tidak ada ID)
        // Default image jika kosong
        if (!product.value.image)
          product.value.image = "https://placehold.co/300x200?text=No+Image";

        await addDoc(collection(db, "products"), product.value);
        alert("Menu baru berhasil ditambahkan!");
      }
      productDialog.value = false; // Tutup dialog
      product.value = {}; // Reset
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan menyimpan data.");
    }
  }
};

// 4. Hapus Produk
const confirmDeleteProduct = (prod) => {
  product.value = prod;
  deleteProductDialog.value = true;
};

const deleteProduct = async () => {
  try {
    await deleteDoc(doc(db, "products", product.value.id));
    deleteProductDialog.value = false;
    product.value = {};
    alert("Menu dihapus.");
  } catch (e) {
    alert("Gagal menghapus menu.");
  }
};

// --- FETCH DATA REALTIME ---
onMounted(() => {
  // 1. Fetch Orders
  const qOrder = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  unsubscribeOrders = onSnapshot(qOrder, (snapshot) => {
    orders.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    loadingOrders.value = false;
  });

  // 2. Fetch Products
  const qProduct = query(collection(db, "products")); // Bisa ditambah orderBy
  unsubscribeProducts = onSnapshot(qProduct, (snapshot) => {
    products.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    loadingProducts.value = false;
  });
});

onUnmounted(() => {
  if (unsubscribeOrders) unsubscribeOrders();
  if (unsubscribeProducts) unsubscribeProducts();
});

// Helper
const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
const formatDate = (timestamp) => {
  if (!timestamp) return "-";
  return new Date(timestamp.seconds * 1000).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="page admin-page">
    <div class="header-admin mb-4">
      <h1>Dashboard Admin</h1>
    </div>

    <Tabs value="0">
      <TabList>
        <Tab value="0">📦 Kelola Pesanan</Tab>
        <Tab value="1">🥟 Kelola Menu (Produk)</Tab>
      </TabList>

      <TabPanels>
        <TabPanel value="0">
          <div class="card-wrapper">
            <DataTable
              :value="orders"
              paginator
              :rows="5"
              :loading="loadingOrders"
              tableStyle="min-width: 60rem"
            >
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="m-0">Daftar Pesanan Masuk</h3>
                  <Button
                    icon="pi pi-refresh"
                    text
                    rounded
                    @click="loadingOrders = true"
                  />
                </div>
              </template>

              <Column header="Tanggal" sortable field="createdAt">
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
              <Column header="Total" field="total">
                <template #body="slotProps">{{
                  formatRupiah(slotProps.data.total)
                }}</template>
              </Column>
              <Column header="Status">
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
                        updateOrderStatus(
                          slotProps.data.id,
                          $event.target.value
                        )
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
        </TabPanel>

        <TabPanel value="1">
          <div class="card-wrapper">
            <DataTable
              :value="products"
              paginator
              :rows="5"
              :loading="loadingProducts"
              tableStyle="min-width: 60rem"
            >
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="m-0">Daftar Menu Dimsum</h3>
                  <Button
                    label="Tambah Menu Baru"
                    icon="pi pi-plus"
                    severity="success"
                    @click="openNew"
                  />
                </div>
              </template>

              <Column field="name" header="Nama Menu" sortable></Column>
              <Column header="Gambar">
                <template #body="slotProps">
                  <img
                    :src="slotProps.data.image"
                    :alt="slotProps.data.name"
                    class="w-16 h-12 object-cover rounded shadow-sm"
                  />
                </template>
              </Column>
              <Column field="price" header="Harga" sortable>
                <template #body="slotProps">{{
                  formatRupiah(slotProps.data.price)
                }}</template>
              </Column>
              <Column field="category" header="Kategori" sortable>
                <template #body="slotProps"
                  ><Tag
                    :value="slotProps.data.category || 'Umum'"
                    severity="warning"
                /></template>
              </Column>
              <Column header="Aksi" style="min-width: 8rem">
                <template #body="slotProps">
                  <Button
                    icon="pi pi-pencil"
                    severity="info"
                    text
                    rounded
                    class="mr-2"
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
        </TabPanel>
      </TabPanels>
    </Tabs>

    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Detail Menu"
      :modal="true"
      class="p-fluid"
    >
      <div class="field">
        <label for="name">Nama Menu</label>
        <InputText
          id="name"
          v-model.trim="product.name"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !product.name }"
        />
        <small class="p-error" v-if="submitted && !product.name"
          >Nama wajib diisi.</small
        >
      </div>

      <div class="field mt-3">
        <label for="description">Deskripsi</label>
        <Textarea
          id="description"
          v-model="product.description"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field mt-3">
        <label for="category" class="mb-3">Kategori</label>
        <Select
          id="category"
          v-model="product.category"
          :options="categories"
          optionLabel="label"
          optionValue="value"
          placeholder="Pilih Kategori"
        />
      </div>

      <div class="formgrid grid mt-3">
        <div class="field col">
          <label for="price">Harga</label>
          <InputNumber
            id="price"
            v-model="product.price"
            mode="currency"
            currency="IDR"
            locale="id-ID"
          />
        </div>
      </div>

      <div class="field mt-3">
        <label for="image">Link Gambar (URL)</label>
        <InputText
          id="image"
          v-model="product.image"
          placeholder="https://..."
        />
        <small class="text-gray-500"
          >Copy link gambar dari Google/Unsplash lalu paste di sini.</small
        >
      </div>

      <template #footer>
        <Button
          label="Batal"
          icon="pi pi-times"
          text
          @click="productDialog = false"
        />
        <Button label="Simpan" icon="pi pi-check" text @click="saveProduct" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteProductDialog"
      :style="{ width: '450px' }"
      header="Konfirmasi"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product"
          >Yakin ingin menghapus <b>{{ product.name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="Tidak"
          icon="pi pi-times"
          text
          @click="deleteProductDialog = false"
        />
        <Button
          label="Ya, Hapus"
          icon="pi pi-check"
          severity="danger"
          text
          @click="deleteProduct"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
/* UTILITY */
.mb-4 {
  margin-bottom: 1.5rem;
}
.mt-3 {
  margin-top: 1rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.w-16 {
  width: 4rem;
}
.h-12 {
  height: 3rem;
}
.object-cover {
  object-fit: cover;
}
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.gap-2 {
  gap: 0.5rem;
}

/* CARD & TABEL */
.card-wrapper {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

.status-select {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* FORM STYLE */
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
}
.field label {
  font-weight: 600;
  color: #444;
}
.p-error {
  color: red;
  font-size: 0.8rem;
}
</style>
