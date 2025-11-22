<script setup>
import { useRouter } from "vue-router";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useConfirm } from "primevue/useconfirm";

// Import Komponen Dialog
import ConfirmDialog from "primevue/confirmdialog";

const props = defineProps(["activeTab"]);
const emit = defineEmits(["update:activeTab"]);
const router = useRouter();
const confirm = useConfirm();

const menuItems = [
  { label: "Kelola Pesanan", icon: "pi pi-box", value: "0" },
  { label: "Kelola Produk", icon: "pi pi-tags", value: "1" },
];

// Fungsi Logout dengan Dialog Keren
const handleLogout = () => {
  confirm.require({
    group: "logout-dialog", // Group khusus styling
    header: "Konfirmasi Keluar",
    message: "Apakah Anda yakin ingin keluar dari panel admin?",
    icon: "pi pi-power-off", // Icon besar nanti
    rejectProps: {
      label: "Batal",
      icon: "pi pi-times",
      outlined: true,
      severity: "secondary",
      size: "small",
    },
    acceptProps: {
      label: "Ya, Keluar",
      icon: "pi pi-check",
      severity: "danger",
      size: "small",
    },
    accept: async () => {
      await signOut(auth);
      router.push("/login");
    },
  });
};
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo-icon">🥟</div>
      <div class="brand-info">
        <h3>Dimsum Ratu</h3>
        <span>Admin Panel</span>
      </div>
    </div>

    <nav class="sidebar-menu">
      <p class="menu-label">Admin Menu</p>
      <button
        v-for="item in menuItems"
        :key="item.value"
        @click="emit('update:activeTab', item.value)"
        :class="['menu-item', { active: activeTab === item.value }]"
      >
        <i :class="item.icon"></i>
        {{ item.label }}
      </button>
    </nav>

    <div class="sidebar-footer">
      <button class="menu-item logout" @click="handleLogout">
        <i class="pi pi-sign-out"></i>
        Keluar
      </button>
    </div>

    <ConfirmDialog group="logout-dialog">
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="custom-dialog">
          <div class="dialog-icon-wrapper">
            <i :class="message.icon" class="dialog-icon"></i>
          </div>
          <span class="dialog-title">{{ message.header }}</span>
          <p class="dialog-message">{{ message.message }}</p>

          <div class="dialog-actions">
            <button class="btn-cancel" @click="rejectCallback">Batal</button>
            <button class="btn-confirm" @click="acceptCallback">Keluar</button>
          </div>
        </div>
      </template>
    </ConfirmDialog>
  </aside>
</template>

<style scoped>
/* --- CSS SIDEBAR (Warna Baru Anda) --- */
.sidebar {
  width: 260px;
  background-color: #fff4f4;
  color: #5757ff; /* Warna teks dari kode Anda */
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  border-right: 1px solid #ffd4d4;
}

/* Header */
.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #ffd4d4;
}
.logo-icon {
  font-size: 1.5rem;
  background-color: #ffe3e3;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.brand-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #ff2f2f;
}
.brand-info span {
  font-size: 0.8rem;
  color: #540000;
}

/* Menu */
.sidebar-menu {
  flex: 1;
  padding: 20px 10px;
}
.menu-label {
  font-size: 0.75rem;
  color: #540000;
  font-weight: 600;
  margin-bottom: 10px;
  padding-left: 10px;
  letter-spacing: 0.5px;
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  border: none;
  background-color: transparent;
  color: #540000;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
  text-align: left;
  margin-bottom: 5px;
}

.menu-item:hover {
  background-color: #ffe8e8;
  color: #b71c1c;
}
.menu-item.active {
  background-color: #b71c1c;
  color: white;
  font-weight: 500;
}
.menu-item i {
  font-size: 1.1rem;
}

/* Footer */
.sidebar-footer {
  padding: 15px;
  border-top: 1px solid #ffd4d4;
}
.logout:hover {
  background-color: #ffe8e8;
  color: #b71c1c;
}

/* --- CSS CUSTOM DIALOG (Pop-up Tengah) --- */
.custom-dialog {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.dialog-icon-wrapper {
  width: 80px;
  height: 80px;
  background-color: #ffe3e3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.dialog-icon {
  font-size: 2.5rem;
  color: #b71c1c;
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
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  border: none;
  transition: 0.2s;
}

.btn-cancel {
  background: white;
  border: 1px solid #ddd !important;
  color: #555;
}
.btn-cancel:hover {
  background: #f9f9f9;
}

.btn-confirm {
  background: #b71c1c;
  color: white;
}
.btn-confirm:hover {
  background: #a51919;
}
</style>
