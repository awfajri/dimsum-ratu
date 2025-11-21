import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: false,
      cssLayer: false,
    },
  },
});

// --- FITUR ANIMASI ANTI-HILANG (CUSTOM DIRECTIVE) ---
const animateOnce = {
  mounted: (el) => {
    // 1. Set kondisi awal: Sembunyi & Turun
    el.classList.add("before-enter");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 2. Jika muncul, tambahkan class 'enter-active' (Muncul)
            el.classList.add("enter-active");
            el.classList.remove("before-enter");

            // 3. STOP memantau elemen ini (KUNCI agar tidak hilang lagi)
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    ); // Muncul 10% saja langsung trigger

    observer.observe(el);
  },
};

app.directive("animate", animateOnce); // Panggil dengan v-animate

app.mount("#app");
