<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { db } from "../firebaseConfig";
import { collection, getDocs, limit, query } from "firebase/firestore";

// Components
import Button from "primevue/button";
import Carousel from "primevue/carousel";
import Timeline from "primevue/timeline";
import Card from "primevue/card";
import Tag from "primevue/tag";
import Fieldset from "primevue/fieldset";
import Avatar from "primevue/avatar";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";

const router = useRouter();
const products = ref([]);
const loading = ref(true);

// Fetch Data Produk
onMounted(async () => {
  try {
    const q = query(collection(db, "products"), limit(6));
    const querySnapshot = await getDocs(q);
    products.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
});

const responsiveOptions = ref([
  { breakpoint: "1024px", numVisible: 3, numScroll: 1 },
  { breakpoint: "768px", numVisible: 2, numScroll: 1 },
  { breakpoint: "560px", numVisible: 1, numScroll: 1 },
]);

// Data Timeline
const events = ref([
  {
    status: "Awal Berdiri",
    date: "2020",
    icon: "pi pi-home",
    color: "#9C27B0",
    description: "Dimulai dari garasi rumah.",
  },
  {
    status: "Varian Goreng",
    date: "2021",
    icon: "pi pi-fire",
    color: "#FF9800",
    description: "Meluncurkan menu goreng best-seller.",
  },
  {
    status: "Outlet Pertama",
    date: "2022",
    icon: "pi pi-building",
    color: "#673AB7",
    description: "Membuka outlet fisik di Telagasari.",
  },
  {
    status: "Go Digital",
    date: "2025",
    icon: "pi pi-globe",
    color: "#B71C1C",
    description: "Website Resmi Dimsum Ratu.",
  },
]);

// Data Testimoni
const testimonials = ref([
  {
    name: "Yan Faunas",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKPgEMIcGlLpyaZtnw3VSc2KMAKC8i0OYpN9QoffdGyjrbMMdaXc3uzJgv55r1izfNA_I&usqp=CAU",
    text: "Dimsumnya padat banget isinya, sausnya juga juara! josss gandossss!!.",
  },
  {
    name: "Zayid Hasani",
    image: "https://cache.lahelu.com/image-PB14xXTS1-41441",
    text: "Udah langganan dari jaman masih jomblo sampe sekarang punya anak 11. Rasanya konsisten enak.",
  },
  {
    name: "Asep yamalube",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5zWVa1L3HWY-o_McFTwYgadizYulhj__CJQ&s",
    text: "Pengiriman cepat, sampe rumah masih anget. Cocok banget buat cemilan sore sambil maen wuwa.",
  },
]);

// Data FAQ (Pertanyaan Umum)
const faqTabs = ref([
  {
    title: "Apakah Dimsum Ratu Halal?",
    content:
      "Ya, 100% Halal. Kami hanya menggunakan daging ayam dan udang segar pilihan tanpa bahan non-halal (No Pork, No Lard, No Alcohol).",
    value: "0",
  },
  {
    title: "Berapa lama dimsum tahan disimpan?",
    content:
      "Di dalam freezer (beku) tahan hingga 1 bulan. Jika ditaruh di kulkas bawah (chiller) sebaiknya dikonsumsi dalam 2 hari.",
    value: "1",
  },
  {
    title: "Bagaimana cara penyajiannya?",
    content:
      "Panaskan kukusan hingga air mendidih, lalu kukus dimsum beku selama 10-15 menit. Sajikan hangat dengan saus sambal spesial kami.",
    value: "2",
  },
  {
    title: "Apakah bisa dikirim ke luar kota?",
    content:
      "Bisa! Kami menggunakan pengiriman Next Day (Paxel) atau kargo khusus frozen food agar kualitas tetap terjaga sampai tujuan.",
    value: "3",
  },
]);

const formatRupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
</script>

<template>
  <div class="home-page">
    <section class="hero" v-animate>
      <div class="container hero-content">
        <div class="hero-text">
          <h1>
            Rasakan Kelezatan <br /><span class="highlight">Dimsum Ratu</span>
          </h1>
          <p>
            Dibuat dengan resep rahasia keluarga. Hangat, padat, dan bikin
            nagih.
          </p>
          <div class="cta-buttons">
            <RouterLink to="/katalog" class="no-decoration">
              <Button
                label="Pesan Sekarang"
                icon="pi pi-shopping-bag"
                rounded
                size="large"
              />
            </RouterLink>
            <a href="#history" class="no-decoration">
              <Button
                label="Cerita Kami"
                icon="pi pi-history"
                severity="secondary"
                text
                rounded
                size="large"
              />
            </a>
          </div>
        </div>
        <div class="hero-image">
          <img
            src="https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Dimsum Enak"
          />
        </div>
      </div>
    </section>

    <!-- --- CAROUSEL PRODUK FAVORIT PELANGGAN --- -->
    <section class="carousel-section" v-animate>
      <div class="container">
        <h2 class="section-title">Favorit Pelanggan</h2>
        <div v-if="loading" class="text-center">Mengambil data...</div>

        <Carousel
          :value="products"
          :numVisible="3"
          :numScroll="1"
          :responsiveOptions="responsiveOptions"
          circular
          :autoplayInterval="4000"
        >
          <template #item="slotProps">
            <div class="product-item">
              <div class="image-container">
                <img
                  :src="slotProps.data.image || 'https://placehold.co/300x200'"
                  :alt="slotProps.data.name"
                />
                <Tag
                  value="Best Seller"
                  severity="success"
                  class="status-tag"
                />
              </div>
              <div class="product-details">
                <h4 class="mb-1">{{ slotProps.data.name }}</h4>
                <div class="price-action">
                  <span class="price">{{
                    formatRupiah(slotProps.data.price)
                  }}</span>
                  <Button
                    icon="pi pi-shopping-cart"
                    rounded
                    class="ml-2"
                    @click="router.push('/katalog')"
                  />
                </div>
              </div>
            </div>
          </template>
        </Carousel>
      </div>
    </section>

    <section id="history" class="history-section" v-animate>
      <div class="container">
        <h2 class="section-title">Perjalanan Kami</h2>
        <Timeline :value="events" align="alternate" class="customized-timeline">
          <template #marker="slotProps">
            <span
              class="custom-marker"
              :style="{ backgroundColor: slotProps.item.color }"
            >
              <i :class="slotProps.item.icon"></i>
            </span>
          </template>
          <template #content="slotProps">
            <Card class="timeline-card">
              <template #title>{{ slotProps.item.status }}</template>
              <template #subtitle>{{ slotProps.item.date }}</template>
              <template #content
                ><p>{{ slotProps.item.description }}</p></template
              >
            </Card>
          </template>
        </Timeline>
      </div>
    </section>

    <section class="testimonial-section" v-animate>
      <div class="container">
        <h2 class="section-title">Kata Mereka</h2>
        <div class="testimonial-grid">
          <div
            v-for="(testi, index) in testimonials"
            :key="index"
            class="testi-item"
          >
            <Fieldset class="custom-fieldset">
              <template #legend>
                <div class="legend-content">
                  <Avatar :image="testi.image" shape="circle" size="large" />
                  <span class="user-name">{{ testi.name }}</span>
                </div>
              </template>
              <p class="m-0">"{{ testi.text }}"</p>
            </Fieldset>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-section" v-animate>
      <div class="container">
        <h2 class="section-title">Pertanyaan Umum (FAQ)</h2>
        <div class="faq-container">
          <Accordion value="0">
            <AccordionPanel
              v-for="tab in faqTabs"
              :key="tab.title"
              :value="tab.value"
            >
              <AccordionHeader>{{ tab.title }}</AccordionHeader>
              <AccordionContent>
                <p class="m-0 text-content">{{ tab.content }}</p>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* --- STYLE UMUM --- */
.hero {
  padding: 60px 0;
}
.hero-content {
  display: flex;
  align-items: center;
  gap: 50px;
}
.hero-text h1 {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 20px;
  color: var(--text-dark);
}
.highlight {
  color: var(--brand-red);
}
.hero-text p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
}
.cta-buttons {
  display: flex;
  gap: 15px;
}
.hero-image img {
  width: 100%;
  border-radius: 30px 5px;
  box-shadow: 20px 20px 0 rgba(183, 28, 28, 0.1);
}
.no-decoration {
  text-decoration: none;
}
.section-title {
  text-align: center;
  font-size: 2rem;
  color: var(--brand-red);
  margin-bottom: 40px;
  font-weight: 700;
}

/* --- CAROUSEL --- */
.carousel-section {
  padding: 60px 0;
  background-color: #fff;
}
.product-item {
  border: 1px solid #eee;
  border-radius: 12px;
  margin: 10px;
  padding: 15px;
  background: white;
  transition: transform 0.3s;
}
.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.image-container {
  position: relative;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}
.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.status-tag {
  position: absolute;
  top: 10px;
  left: 10px;
}
.mb-1 {
  margin-bottom: 0.5rem;
  margin-top: 0;
  font-size: 1.1rem;
  color: var(--text-dark);
}
.price-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--brand-red);
}

/* --- TIMELINE --- */
.history-section {
  padding: 80px 0;
  background-color: #fafafa;
}
.custom-marker {
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 50%;
  z-index: 1;
  box-shadow: 0 0 0 4px white, 0 0 0 6px rgba(0, 0, 0, 0.05);
}
.timeline-card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: none;
  margin-bottom: 20px;
}

/* --- TESTIMONI --- */
.testimonial-section {
  padding: 60px 0;
  background-color: white;
}
.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}
.legend-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 5px;
}
.user-name {
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--text-dark);
}
.m-0 {
  margin: 0;
  color: #555;
  font-style: italic;
  line-height: 1.6;
}
.custom-fieldset {
  border-color: #eee;
  background: #fafafa;
}

/* --- FAQ (BARU) --- */
.faq-section {
  padding: 80px 0;
  background-color: #fafafa;
}
.faq-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.text-content {
  color: #666;
  line-height: 1.6;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column-reverse;
    text-align: center;
  }
  .cta-buttons {
    justify-content: center;
  }
  .customized-timeline ::v-deep(.p-timeline-event-opposite) {
    display: none;
  }
  .customized-timeline ::v-deep(.p-timeline-event-content) {
    text-align: left !important;
  }
}
</style>
