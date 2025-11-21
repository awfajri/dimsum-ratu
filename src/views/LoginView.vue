<script setup>
import { ref } from "vue";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/admin"); // Jika sukses, lempar ke dashboard
  } catch (err) {
    errorMsg.value = "Email atau Password salah!";
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Admin Portal</h2>
      <p>Area terbatas khusus owner.</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="Email Admin"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" class="btn btn-primary w-full">
          Masuk Dashboard
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
  background-color: #f0f2f5;
}
.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
  text-align: center;
}
.form-group {
  margin-bottom: 15px;
}
.error {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 10px;
}
</style>
