<script setup>
import { ref } from "vue";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Card from "primevue/card";
import Message from "primevue/message";

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = "";
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/admin");
  } catch (err) {
    errorMsg.value = "Email atau Password salah!";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <Card class="login-card">
      <template #title>
        <div class="text-center">
          <div class="logo-emoji">🥟</div>
          <h2 class="mb-1 text-primary">Admin Portal</h2>
          <p class="text-sm text-gray">Masuk untuk mengelola toko</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="form-group">
          <div class="field">
            <label>Email</label>
            <InputText
              v-model="email"
              type="email"
              class="w-full"
              placeholder="admin@dimsum.com"
            />
          </div>
          <div class="field">
            <label>Password</label>
            <InputText
              v-model="password"
              type="password"
              class="w-full"
              placeholder="••••••"
            />
          </div>

          <Message v-if="errorMsg" severity="error" size="small" class="mb-3">{{
            errorMsg
          }}</Message>

          <Button
            label="Masuk Dashboard"
            icon="pi pi-sign-in"
            class="w-full"
            :loading="loading"
            type="submit"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* CSS untuk memusatkan Card secara sempurna */
.login-page {
  background-color: #f8f9fa; /* Background abu muda bersih */
  min-height: 100vh; /* Tinggi full layar */
  width: 100%;
  display: flex;
  align-items: center; /* Tengah Vertikal */
  justify-content: center; /* Tengah Horizontal */
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #eee;
}

.logo-emoji {
  font-size: 3rem;
  margin-bottom: 10px;
}
.text-center {
  text-align: center;
}
.text-primary {
  color: var(--brand-red);
  font-weight: 800;
  margin: 0;
}
.text-gray {
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
}

.field {
  margin-bottom: 1.5rem;
}
.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #444;
}
.w-full {
  width: 100%;
}
.mb-1 {
  margin-bottom: 5px;
}
.mb-3 {
  margin-bottom: 15px;
}
</style>
