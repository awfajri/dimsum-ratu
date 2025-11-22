<script setup>
import { onMounted } from "vue"; // Tambah onMounted
import { RouterView, useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { useUserStore } from "./stores/user";

const route = useRoute();
const userStore = useUserStore();

onMounted(() => {
  userStore.initAuth();
});
</script>

<template>
  <div class="app-wrapper">
    <header v-if="!route.meta.hideNavbar">
      <Navbar />
    </header>

    <main
      :class="[
        !route.meta.hideNavbar
          ? 'container main-content'
          : 'full-screen-layout',
      ]"
    >
      <RouterView />
    </main>

    <Footer v-if="!route.meta.hideNavbar" />
  </div>
</template>

<style scoped>
/* Layout khusus Admin/Login agar full layar tanpa padding atas */
.full-screen-layout {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
}
</style>
