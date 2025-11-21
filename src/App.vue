<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue"; // <--- 1. PENTING: Import Footer di sini
</script>

<template>
  <div class="app-wrapper">
    <header>
      <Navbar />
    </header>

    <main class="container main-content">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Tidak perlu style khusus di sini, kita atur di main.css */
</style>
