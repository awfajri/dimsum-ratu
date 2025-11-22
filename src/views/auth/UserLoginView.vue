<script setup>
import { ref } from "vue";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
import Card from "primevue/card";
import Message from "primevue/message";

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/"); // Masuk ke Home setelah login
  } catch (err) {
    errorMsg.value = "Email atau Password salah.";
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
          <h2 class="text-brand">Masuk</h2>
          <p class="text-sm text-gray">Selamat datang kembali di Dimsum Ratu</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="flex flex-column gap-3">
          <div class="field">
            <label>Email</label>
            <InputText v-model="email" type="email" class="w-full" />
          </div>
          <div class="field">
            <label>Password</label>
            <Password
              v-model="password"
              class="w-full"
              :feedback="false"
              toggleMask
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
            label="Masuk"
            class="w-full mt-2"
            :loading="loading"
            type="submit"
          />

          <p class="text-center text-sm mt-3">
            Belum punya akun?
            <router-link
              to="/register"
              class="text-brand font-bold no-underline"
              >Daftar dulu</router-link
            >
          </p>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* Gunakan style yang sama persis dengan RegisterView di atas */
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
</style>
