<script setup>
import { ref } from "vue";
import { auth } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "vue-router";

// PrimeVue Components
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Card from "primevue/card";
import Message from "primevue/message";

const email = ref("");
const loading = ref(false);
const statusMsg = ref({ type: "", text: "" }); // Untuk pesan sukses/gagal
const router = useRouter();

const handleReset = async () => {
  if (!email.value) {
    statusMsg.value = { type: "error", text: "Mohon isi email Anda." };
    return;
  }

  loading.value = true;
  statusMsg.value = { type: "", text: "" };

  try {
    await sendPasswordResetEmail(auth, email.value);
    statusMsg.value = {
      type: "success",
      text: "Link reset password telah dikirim ke email Anda. Silakan cek Inbox/Spam.",
    };
  } catch (err) {
    console.error(err);
    if (err.code === "auth/user-not-found") {
      statusMsg.value = { type: "error", text: "Email tidak terdaftar." };
    } else if (err.code === "auth/invalid-email") {
      statusMsg.value = { type: "error", text: "Format email salah." };
    } else {
      statusMsg.value = {
        type: "error",
        text: "Gagal mengirim email. Coba lagi nanti.",
      };
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
          <h2 class="text-brand">Lupa Password?</h2>
          <p class="text-sm text-gray">
            Masukkan email, kami akan kirim link reset.
          </p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleReset" class="flex flex-column gap-3">
          <Message
            v-if="statusMsg.text"
            :severity="statusMsg.type"
            size="small"
            :closable="false"
          >
            {{ statusMsg.text }}
          </Message>

          <div class="field" v-if="statusMsg.type !== 'success'">
            <label>Email Terdaftar</label>
            <InputText
              v-model="email"
              type="email"
              class="w-full"
              placeholder="contoh@email.com"
            />
          </div>

          <Button
            v-if="statusMsg.type !== 'success'"
            label="Kirim Link Reset"
            icon="pi pi-send"
            class="w-full mt-2"
            :loading="loading"
            type="submit"
          />

          <div class="text-center mt-3">
            <router-link
              to="/login-member"
              class="text-sm no-underline text-gray-600"
            >
              <i class="pi pi-arrow-left"></i> Kembali ke Login
            </router-link>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* Gunakan style yang konsisten dengan Login/Register sebelumnya */
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
.text-gray-600 {
  color: #666;
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
.no-underline:hover {
  color: var(--brand-red);
}
</style>
