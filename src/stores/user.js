import { defineStore } from "pinia";
import { ref } from "vue";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const isAdmin = ref(false);
  const loading = ref(true);

  // Cek status login saat aplikasi dibuka
  const initAuth = () => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;

      // Cek sederhana: Admin adalah email tertentu (Ganti dengan email admin Anda nanti)
      if (currentUser && currentUser.email === "admin@ratu.com") {
        isAdmin.value = true;
      } else {
        isAdmin.value = false;
      }

      loading.value = false;
    });
  };

  const logout = async () => {
    await signOut(auth);
    user.value = null;
    isAdmin.value = false;
    window.location.href = "/"; // Refresh halaman ke home
  };

  return { user, isAdmin, loading, initAuth, logout };
});
