<script setup>
import { ref } from "vue";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "vue-router";

import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
import Card from "primevue/card";
import Message from "primevue/message";

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");
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

    // 2. Simpan Nama Lengkap (Update Profile)
    await updateProfile(userCredential.user, {
      displayName: name.value,
    });

    alert("Hore! Akun berhasil dibuat. Silakan login.");
    router.push("/login-member"); // Ke halaman login member
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
            <InputText v-model="name" class="w-full" placeholder="Auf Fajri" />
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
/* Fix lebar Password PrimeVue */
:deep(.p-password) {
  width: 100%;
}
:deep(.p-password-input) {
  width: 100%;
}
</style>
