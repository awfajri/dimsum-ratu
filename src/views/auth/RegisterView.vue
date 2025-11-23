<script setup>
import { ref } from "vue";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "vue-router";

// Components
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
import Card from "primevue/card";
import Message from "primevue/message";
import Dialog from "primevue/dialog"; // <--- BARU: Import Dialog

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");
const showSuccessDialog = ref(false); // <--- BARU: State Popup
const router = useRouter();

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    errorMsg.value = "Mohon isi semua data.";
    return;
  }

  loading.value = true;
  errorMsg.value = "";

  try {
    // 1. Buat Akun di Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // 2. Simpan Nama Lengkap
    await updateProfile(userCredential.user, {
      displayName: name.value,
    });

    // 3. Munculkan Popup Sukses (Bukan Alert lagi)
    showSuccessDialog.value = true;
  } catch (err) {
    console.error(err);
    if (err.code === "auth/email-already-in-use") {
      errorMsg.value = "Email sudah terdaftar!";
    } else if (err.code === "auth/weak-password") {
      errorMsg.value = "Password minimal 6 karakter.";
    } else {
      errorMsg.value = "Gagal mendaftar. Coba lagi.";
    }
  } finally {
    loading.value = false;
  }
};

// Fungsi pindah halaman saat tombol popup diklik
const goToLogin = () => {
  showSuccessDialog.value = false;
  router.push("/login-member");
};
</script>

<template>
  <div class="auth-page">
    <Card class="auth-card">
      <template #title>
        <div class="text-center mb-4">
          <h2 class="text-brand">Daftar Member</h2>
          <p class="text-sm text-gray">
            Gabung dan nikmati kemudahan tracking order.
          </p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="flex flex-column gap-3">
          <div class="field">
            <label>Nama Lengkap</label>
            <InputText v-model="name" class="w-full" placeholder="Auf fajri" />
          </div>
          <div class="field">
            <label>Email</label>
            <InputText
              v-model="email"
              type="email"
              class="w-full"
              placeholder="auf@email.com"
            />
          </div>
          <div class="field">
            <label>Password</label>
            <Password
              v-model="password"
              class="w-full"
              :feedback="false"
              toggleMask
              placeholder="Minimal 6 karakter"
            />
          </div>

          <Message
            v-if="errorMsg"
            severity="error"
            size="small"
            :closable="false"
            >{{ errorMsg }}</Message
          >

          <Button
            label="Daftar Sekarang"
            class="w-full mt-2"
            :loading="loading"
            type="submit"
          />

          <p class="text-center text-sm mt-3">
            Sudah punya akun?
            <router-link
              to="/login-member"
              class="text-brand font-bold no-underline"
              >Login disini</router-link
            >
          </p>
        </form>
      </template>
    </Card>

    <Dialog
      v-model:visible="showSuccessDialog"
      modal
      :closable="false"
      :style="{ width: '350px' }"
    >
      <template #container>
        <div class="success-dialog-content">
          <div class="success-icon-wrapper">
            <i class="pi pi-check success-icon"></i>
          </div>
          <h3 class="success-title">Pendaftaran Berhasil!</h3>
          <p class="success-message">
            Hore! Akun Anda sudah jadi. Silakan login untuk mulai memesan.
          </p>

          <Button
            label="Login Sekarang"
            class="w-full btn-success-custom"
            @click="goToLogin"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f8f9fa;
  padding: 20px;
}
.auth-card {
  width: 100%;
  max-width: 400px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
.text-brand {
  color: var(--brand-red);
  margin: 0;
}
.text-gray {
  color: #666;
  margin-top: 5px;
  font-size: 0.9rem;
}
.field label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #444;
}
.w-full {
  width: 100%;
}
.mt-2 {
  margin-top: 10px;
}
.mt-3 {
  margin-top: 15px;
}
.no-underline {
  text-decoration: none;
}
:deep(.p-password) {
  width: 100%;
}
:deep(.p-password-input) {
  width: 100%;
}

/* --- STYLE POPUP SUKSES --- */
.success-dialog-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.success-icon-wrapper {
  width: 80px;
  height: 80px;
  background-color: #dcfce7; /* Hijau muda segar */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.success-icon {
  font-size: 2.5rem;
  color: #16a34a;
  font-weight: bold;
}

.success-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #333;
  margin: 0 0 10px 0;
}
.success-message {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 25px;
  line-height: 1.5;
}

.btn-success-custom {
  background: #16a34a;
  border: none;
  font-weight: 700;
}
.btn-success-custom:hover {
  background: #15803d;
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
