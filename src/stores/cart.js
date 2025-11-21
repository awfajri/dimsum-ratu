import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: JSON.parse(localStorage.getItem("myCart")) || [],
  }),

  getters: {
    totalQty: (state) =>
      state.items.reduce((total, item) => total + item.qty, 0),

    totalPrice: (state) =>
      state.items.reduce((total, item) => total + item.price * item.qty, 0),
  },

  actions: {
    // Fungsi Tambah (dipakai tombol Plus)
    addToCart(product) {
      const existingItem = this.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.qty++;
      } else {
        this.items.push({ ...product, qty: 1 });
      }

      this.saveCart();
    },

    // --- PASTIKAN FUNGSI INI ADA (Untuk Tombol Minus) ---
    decreaseQty(productId) {
      const existingItem = this.items.find((item) => item.id === productId);

      // Cek jika barang ada dan jumlahnya lebih dari 1
      if (existingItem && existingItem.qty > 1) {
        existingItem.qty--; // Kurangi 1
        this.saveCart(); // Simpan perubahan
      }
    },

    removeFromCart(productId) {
      this.items = this.items.filter((item) => item.id !== productId);
      this.saveCart();
    },

    clearCart() {
      this.items = [];
      this.saveCart();
    },

    saveCart() {
      localStorage.setItem("myCart", JSON.stringify(this.items));
    },
  },
});
