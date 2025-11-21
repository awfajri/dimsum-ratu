<script setup>
import { ref, onMounted, computed } from "vue";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useCartStore } from "../stores/cart";

// Components PrimeVue
import Button from "primevue/button";
import Tag from "primevue/tag";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Select from "primevue/select"; // Dropdown

const cartStore = useCartStore();
const products = ref([]);
const loading = ref(true);

// State untuk Search & Filter
const searchQuery = ref("");
const selectedCategory = ref(null);

// Pilihan Kategori (Bisa ditambah)
const categories = ref([
  { name: "Semua", code: null },
  { name: "Kukus", code: "Kukus" },
  { name: "Goreng", code: "Goreng" },
  { name: "Frozen", code: "Frozen" },
]);

// Fetch Data
const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    products.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});

// LOGIC FILTERING (Search + Kategori)
const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    // 1. Cek Nama (Search)
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    // 2. Cek Kategori
    const matchesCategory =
      selectedCategory.value && selectedCategory.value.code
        ? product.category === selectedCategory.value.code
        : true; // Kalau kategori null/Semua, tampilkan semua

    return matchesSearch && matchesCategory;
  });
});

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
</script>

<template>
  <div class="page">
    <div class="catalog-banner" v-animate>
      <div class="banner-content">
        <h1>Selamat Datang di Dimsum Ratu!</h1>
        <p>Temukan berbagai macam dimsum lezat untuk dinikmati.</p>
      </div>
      <img src="../assets/banner.jpg" class="banner-bg" alt="Menu Banner" />
    </div>

    <div class="filter-bar" v-animate>
      <div class="search-wrapper">
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="searchQuery"
            placeholder="Cari Dimsum..."
            class="search-input"
          />
        </IconField>
      </div>

      <div class="category-wrapper">
        <Select
          v-model="selectedCategory"
          :options="categories"
          optionLabel="name"
          placeholder="Kategori"
          class="w-full md:w-56"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">Sedang memuat menu...</div>

    <div v-else class="product-grid" v-animate>
      <div v-for="item in filteredProducts" :key="item.id" class="product-item">
        <div class="image-container">
          <img
            :src="item.image || 'https://placehold.co/300x200'"
            :alt="item.name"
          />
          <Tag
            :value="item.category || 'Umum'"
            severity="warning"
            class="status-tag"
          />
        </div>

        <div class="product-details">
          <h3 class="product-name">{{ item.name }}</h3>
          <p class="desc">{{ item.description }}</p>

          <div class="price-action">
            <span class="price">{{ formatRupiah(item.price) }}</span>
            <Button
              label="Tambah"
              icon="pi pi-shopping-cart"
              rounded
              @click="cartStore.addToCart(item)"
            />
          </div>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="no-result">
        <p>Yah, menu yang dicari tidak ditemukan :(</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* BANNER STYLE */
.catalog-banner {
  position: relative;
  height: 250px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  filter: brightness(0.6); /* Gelapkan gambar biar teks terbaca */
}

.banner-content {
  position: relative;
  z-index: 1;
  color: white;
}
.banner-content h1 {
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}
.banner-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-top: 5px;
}

/* FILTER BAR */
.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.search-wrapper {
  flex: 2;
}
.category-wrapper {
  flex: 1;
  min-width: 150px;
}
.search-input {
  width: 100%;
}

/* GRID & CARD (Sama seperti sebelumnya) */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}
.product-item {
  border: 1px solid #eee;
  border-radius: 12px;
  background: white;
  padding: 15px;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}
.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--brand-gold);
}
.image-container {
  position: relative;
  height: 200px;
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.status-tag {
  position: absolute;
  top: 10px;
  left: 10px;
}
.product-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.product-name {
  margin: 0 0 5px;
  font-size: 1.2rem;
  color: var(--text-dark);
}
.desc {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 20px;
  line-height: 1.4;
  flex-grow: 1;
}
.price-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
.price {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--brand-red);
}

.no-result {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #888;
  font-style: italic;
}
</style>
