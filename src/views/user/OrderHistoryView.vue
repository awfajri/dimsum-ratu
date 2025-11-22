<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useUserStore } from "../../stores/user";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "vue-router";

// PrimeVue
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner"; // Tambahan Loading Icon

const userStore = useUserStore();
const router = useRouter();
const myOrders = ref([]);
const fetching = ref(true); // Status ambil data
let unsubscribe = null;

// Fungsi Ambil Data (Dipisah biar rapi)
const fetchOrders = () => {
  if (!userStore.user) return;

  const q = query(
    collection(db, "orders"),
    where("userId", "==", userStore.user.uid),
    orderBy("createdAt", "desc")
  );

  unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      myOrders.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      fetching.value = false;
    },
    (error) => {
      console.error("Error Fetching:", error);
      // PENTING: Cek Console browser jika data tidak muncul
      // Biasanya karena butuh INDEX Firestore
    }
  );
};

onMounted(() => {
  // 1. Cek apakah Auth masih Loading?
  if (userStore.loading) {
    // Kalau masih loading, kita tunggu (watch) sampai selesai
    const stopWatch = watch(
      () => userStore.loading,
      (newVal) => {
        if (newVal === false) {
          // Loading selesai, cek user
          if (userStore.user) {
            fetchOrders();
          } else {
            router.push("/login-member");
          }
          stopWatch(); // Matikan watcher biar hemat memori
        }
      }
    );
  } else {
    // Kalau tidak loading (sudah login dari halaman lain)
    if (userStore.user) {
      fetchOrders();
    } else {
      router.push("/login-member");
    }
  }
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

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

const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
const formatDate = (t) =>
  t
    ? new Date(t.seconds * 1000).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";
</script>

<template>
  <div class="page history-page">
    <div class="header-section" v-animate>
      <h1>Riwayat Pesanan</h1>
      <p>Lacak status dimsum favoritmu di sini</p>
    </div>

    <div v-if="userStore.loading || fetching" class="text-center mt-5">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      <p class="text-gray-500 mt-2">Memuat data...</p>
    </div>

    <div v-else>
      <div v-if="myOrders.length === 0" class="empty-state" v-animate>
        <i class="pi pi-shopping-bag" style="font-size: 3rem; color: #ccc"></i>
        <p>Belum ada pesanan nih.</p>
        <Button label="Pesan Sekarang" @click="router.push('/katalog')" />
      </div>

      <div v-else class="history-list" v-animate>
        <DataTable :value="myOrders" tableStyle="min-width: 50rem" stripedRows>
          <Column header="Tanggal">
            <template #body="slotProps">{{
              formatDate(slotProps.data.createdAt)
            }}</template>
          </Column>
          <Column header="Menu">
            <template #body="slotProps">
              <div
                v-for="item in slotProps.data.items"
                :key="item.id"
                class="text-sm"
              >
                {{ item.name }} ({{ item.qty }}x)
              </div>
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
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-page {
  max-width: 1000px;
  margin: 0 auto;
}
.header-section {
  text-align: center;
  margin-bottom: 40px;
}
.header-section h1 {
  color: var(--brand-red);
  margin: 0;
}
.empty-state {
  text-align: center;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.text-sm {
  font-size: 0.85rem;
  color: #555;
}
.mt-5 {
  margin-top: 3rem;
}
.text-center {
  text-align: center;
}
.text-gray-500 {
  color: #888;
}
</style>
