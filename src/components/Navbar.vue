<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../stores/cart";
import { useUserStore } from "../stores/user"; // <--- Import Store User

import Badge from "primevue/badge";
import Button from "primevue/button";
import Menu from "primevue/menu"; // <--- Import Menu Dropdown

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore(); // Panggil Store User
const isMobileMenuOpen = ref(false);
const userMenu = ref(); // Referensi untuk menu dropdown

// Menu Navigasi Utama (Semua orang bisa lihat)
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

// Menu Dropdown User
const userMenuItems = computed(() => [
  {
    label: "Riwayat Pesanan",
    icon: "pi pi-list",
    command: () => {
      router.push("/my-orders");
      isMobileMenuOpen.value = false;
    },
  },
  {
    label: "Keluar",
    icon: "pi pi-sign-out",
    command: () => {
      userStore.logout();
      isMobileMenuOpen.value = false;
    },
  },
]);

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const navigateTo = (path) => {
  router.push(path);
  isMobileMenuOpen.value = false;
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

      <div class="user-section ml-3">
        <Button
          v-if="!userStore.user"
          label="Masuk"
          icon="pi pi-user"
          severity="secondary"
          outlined
          rounded
          size="small"
          @click="router.push('/login-member')"
        />

        <div v-else>
          <Button
            :label="userStore.user.displayName || 'User'"
            icon="pi pi-user"
            severity="primary"
            text
            rounded
            @click="toggleUserMenu"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          />
          <Menu
            ref="userMenu"
            id="overlay_menu"
            :model="userMenuItems"
            :popup="true"
          />
        </div>
      </div>
    </div>

    <div class="mobile-toggle">
      <Button
        icon="pi pi-bars"
        text
        rounded
        severity="secondary"
        @click="toggleMobileMenu"
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
            <i :class="item.icon" class="mr-2"></i> {{ item.label }}
          </div>
          <Badge v-if="item.badge" :value="item.badge" severity="danger" />
        </a>

        <div class="mobile-user-actions">
          <div v-if="!userStore.user">
            <Button
              label="Masuk / Daftar"
              icon="pi pi-sign-in"
              class="w-full"
              @click="navigateTo('/login-member')"
            />
          </div>
          <div v-else class="flex flex-column gap-2">
            <div class="mobile-welcome">
              Halo, {{ userStore.user.displayName }}
            </div>
            <Button
              label="Riwayat Pesanan"
              icon="pi pi-list"
              severity="secondary"
              outlined
              class="w-full"
              @click="navigateTo('/my-orders')"
            />
            <Button
              label="Keluar"
              icon="pi pi-sign-out"
              severity="danger"
              text
              class="w-full"
              @click="userStore.logout()"
            />
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* ... (Style Container, Logo, dll SAMA seperti sebelumnya) ... */
/* Copy paste style lama Anda di sini, lalu tambahkan/update bagian bawah ini: */

.custom-navbar {
  position: fixed;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 1200px;
  height: 70px;
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
.brand-text {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--brand-red);
  cursor: pointer;
  white-space: nowrap;
}
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
.ml-3 {
  margin-left: 15px;
  padding-left: 15px;
  border-left: 1px solid #eee;
} /* Pemisah User Section */

/* Mobile */
.mobile-toggle {
  display: none;
}
.mobile-menu-dropdown {
  position: absolute;
  top: 80px;
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

/* Bagian User di HP */
.mobile-user-actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
.mobile-welcome {
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: var(--brand-red);
}
.w-full {
  width: 100%;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.gap-2 {
  gap: 0.5rem;
}

@media (max-width: 960px) {
  .custom-navbar {
    top: 0;
    width: 100%;
    border-radius: 0 0 20px 20px;
    padding: 0 1.5rem;
  }
  .desktop-menu {
    display: none;
  }
  .mobile-toggle {
    display: block;
  }
}
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
