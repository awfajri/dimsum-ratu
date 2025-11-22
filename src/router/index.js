import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import Auth

// Import Views
import HomeView from "../views/HomeView.vue";
import CatalogView from "../views/CatalogView.vue";
import CartView from "../views/CartView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import AdminView from "../views/AdminView.vue";
import LoginView from "../views/LoginView.vue"; // Import Login

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: HomeView },
    { path: "/katalog", component: CatalogView },
    { path: "/keranjang", component: CartView },
    { path: "/checkout", component: CheckoutView },
    {
      path: "/login",
      component: LoginView,
      meta: { hideNavbar: true },
    },
    {
      path: "/admin",
      component: AdminView,
      meta: { requiresAuth: true, hideNavbar: true }, // Tanda: Halaman ini butuh login
    },
  ],
});

// SATPAM ROUTER (Navigation Guard)
// Cek setiap kali halaman mau ganti
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  // Jika halaman tujuan butuh auth (requiresAuth: true)
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = await getCurrentUser();
    if (user) {
      next(); // Boleh lewat
    } else {
      next("/login"); // Gak ada izin? Ke login dulu
    }
  } else {
    next(); // Halaman umum (Home, Katalog) bebas lewat
  }
});

export default router;
