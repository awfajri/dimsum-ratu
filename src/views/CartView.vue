<script setup>
import { useCartStore } from "../stores/cart";
import { useRouter } from "vue-router";

// Import PrimeVue
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const cartStore = useCartStore();
const router = useRouter();

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
</script>

<template>
  <div class="page">
    <h1 class="page-title">Keranjang Belanja</h1>

    <div v-if="cartStore.items.length === 0" class="empty-state">
      <i
        class="pi pi-shopping-cart"
        style="font-size: 4rem; color: #ccc; margin-bottom: 20px"
      ></i>
      <p>Wah, keranjang masih kosong nih.</p>
      <Button
        label="Belanja Dulu Yuk"
        icon="pi pi-arrow-left"
        @click="router.push('/katalog')"
        severity="primary"
        rounded
        class="mt-3"
      />
    </div>

    <div v-else class="cart-wrapper">
      <DataTable :value="cartStore.items" tableStyle="min-width: 50rem">
        <Column header="Menu">
          <template #body="slotProps">
            <div class="product-col">
              <img
                :src="slotProps.data.image || 'https://placehold.co/100'"
                class="thumb"
                alt="Menu"
              />
              <span class="product-name">{{ slotProps.data.name }}</span>
            </div>
          </template>
        </Column>

        <Column header="Harga">
          <template #body="slotProps">
            {{ formatRupiah(slotProps.data.price) }}
          </template>
        </Column>

        <Column header="Qty">
          <template #body="slotProps">
            <div class="qty-control">
              <Button
                icon="pi pi-minus"
                size="small"
                severity="secondary"
                text
                rounded
                @click="cartStore.decreaseQty(slotProps.data.id)"
                :disabled="slotProps.data.qty <= 1"
              />

              <span class="qty-display">{{ slotProps.data.qty }}</span>

              <Button
                icon="pi pi-plus"
                size="small"
                severity="secondary"
                text
                rounded
                @click="cartStore.addToCart(slotProps.data)"
              />
            </div>
          </template>
        </Column>

        <Column header="Total">
          <template #body="slotProps">
            <span class="fw-bold">{{
              formatRupiah(slotProps.data.price * slotProps.data.qty)
            }}</span>
          </template>
        </Column>

        <Column header="Aksi">
          <template #body="slotProps">
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="cartStore.removeFromCart(slotProps.data.id)"
            />
          </template>
        </Column>

        <template #footer>
          <div class="table-footer">
            <span>Total Pembayaran:</span>
            <span class="grand-total">{{
              formatRupiah(cartStore.totalPrice)
            }}</span>
          </div>
        </template>
      </DataTable>

      <div class="cart-actions">
        <Button
          label="Tambah Menu Lain"
          icon="pi pi-plus"
          severity="secondary"
          outlined
          @click="router.push('/katalog')"
        />

        <Button
          label="Lanjut Pembayaran"
          icon="pi pi-arrow-right"
          iconPos="right"
          severity="primary"
          @click="router.push('/checkout')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  text-align: center;
  color: var(--brand-red);
  margin-bottom: 30px;
  font-weight: 700;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.mt-3 {
  margin-top: 15px;
}

/* Tabel Style */
.cart-wrapper {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.product-col {
  display: flex;
  align-items: center;
  gap: 15px;
}

.thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  background: #eee;
}

.product-name {
  font-weight: 600;
  color: #333;
}

/* Qty Control */
.qty-control {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f8f9fa;
  border-radius: 20px;
  padding: 2px;
  width: fit-content;
  border: 1px solid #eee;
}

.qty-display {
  width: 30px;
  text-align: center;
  font-weight: 600;
}

.fw-bold {
  font-weight: 700;
  color: var(--brand-red);
}

/* Footer & Actions */
.table-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  font-size: 1.1rem;
}

.grand-total {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--brand-red);
}

.cart-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

@media (max-width: 600px) {
  .cart-actions {
    flex-direction: column-reverse;
  }
  .cart-actions button {
    width: 100%;
  }
}
</style>
