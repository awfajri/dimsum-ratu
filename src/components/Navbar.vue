<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";

// Gunakan Button & Badge dari PrimeVue
import Badge from "primevue/badge";
import Button from "primevue/button";

const router = useRouter();
const cartStore = useCartStore();
const isMobileMenuOpen = ref(false); // Status menu di HP

const items = computed(() => [
  { label: "Home", icon: "pi pi-home", path: "/" },
  { label: "Menu", icon: "pi pi-th-large", path: "/katalog" },
  {
    label: "Keranjang",
    icon: "pi pi-shopping-cart",
    path: "/keranjang",
    badge: cartStore.totalQty,
  },
]);

const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const navigateTo = (path) => {
  router.push(path);
  isMobileMenuOpen.value = false; // Tutup menu setelah klik (khusus HP)
};
</script>

<template>
  <nav class="custom-navbar">
    <div class="logo-container" @click="router.push('/')">
      <span class="brand-text">🥟 Dimsum Ratu</span>
    </div>

    <div class="desktop-menu">
      <a
        v-for="item in items"
        :key="item.label"
        class="nav-item"
        @click="navigateTo(item.path)"
      >
        <i :class="item.icon" class="nav-icon"></i>
        <span>{{ item.label }}</span>
        <Badge
          v-if="item.badge"
          :value="item.badge"
          severity="danger"
          class="ml-2"
        />
      </a>
    </div>

    <div class="mobile-toggle">
      <Button
        icon="pi pi-bars"
        text
        rounded
        severity="secondary"
        @click="toggleMenu"
        aria-label="Menu"
      />
    </div>

    <transition name="slide-fade">
      <div v-if="isMobileMenuOpen" class="mobile-menu-dropdown">
        <a
          v-for="item in items"
          :key="item.label"
          class="mobile-nav-item"
          @click="navigateTo(item.path)"
        >
          <div class="flex-center">
            <i :class="item.icon" class="mr-2"></i>
            {{ item.label }}
          </div>
          <Badge v-if="item.badge" :value="item.badge" severity="danger" />
        </a>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* --- CONTAINER UTAMA --- */
.custom-navbar {
  position: fixed;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1200px;
  height: 70px; /* Tinggi tetap biar rapi */

  /* Glass Effect Style */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border-radius: 50px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  z-index: 1000;
}

/* --- LOGO --- */
.brand-text {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--brand-red);
  cursor: pointer;
  white-space: nowrap;
}

/* --- DESKTOP MENU --- */
.desktop-menu {
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  color: #555;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border-radius: 30px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.nav-icon {
  margin-right: 8px;
  font-size: 1.1rem;
}

.nav-item:hover {
  background-color: #fff5f5;
  color: var(--brand-red);
  transform: translateY(-2px);
}

.ml-2 {
  margin-left: 8px;
}

/* --- MOBILE TOGGLE --- */
.mobile-toggle {
  display: none; /* Default sembunyi di desktop */
}

/* --- MOBILE MENU DROPDOWN --- */
.mobile-menu-dropdown {
  position: absolute;
  top: 80px; /* Muncul di bawah navbar */
  left: 0;
  width: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 1px solid #eee;
}

.mobile-nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  color: #333;
  text-decoration: none;
  font-weight: 600;
  border-radius: 12px;
  transition: 0.2s;
}

.mobile-nav-item:active {
  background-color: #f5f5f5;
}

.flex-center {
  display: flex;
  align-items: center;
}

.mr-2 {
  margin-right: 10px;
  color: var(--brand-red);
}

/* --- RESPONSIF (HP / TABLET) --- */
@media (max-width: 960px) {
  .custom-navbar {
    top: 0;
    width: 100%;
    border-radius: 0 0 20px 20px;
    padding: 0 1.5rem;
  }

  .desktop-menu {
    display: none; /* Sembunyikan menu desktop */
  }

  .mobile-toggle {
    display: block; /* Munculkan tombol hamburger */
  }
}

/* Animasi Dropdown */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
