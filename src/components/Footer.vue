<template>
  <footer class="site-footer">
    <div class="container footer-content">
      <div class="footer-col">
        <h3>🥟 Dimsum Ratu</h3>
        <p>Menyajikan kehangatan dalam setiap gigitan sejak 2020.</p>
      </div>

      <div class="footer-col">
        <h4>Hubungi Kami</h4>
        <p>WA: 085156287360</p>
        <p>IG: @dimsumratu.telukjambe</p>
        <p>Jalan Dimsum No. 88, Jakarta</p>
      </div>

      <div class="footer-col">
        <h4>Jam Operasional</h4>
        <p>Senin - Jumat: 10.00 - 21.00</p>
        <p>Sabtu - Minggu: 09.00 - 22.00</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 Dimsum Ratu. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: #730606; /* Warna Gelap Elegan */
  color: #ecf0f1;
  padding-top: 60px;
  margin-top: auto; /* Trik agar footer selalu di paling bawah */
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  padding-bottom: 40px;
}

.footer-col h3 {
  color: var(--accent);
  margin-bottom: 15px;
}
.footer-col h4 {
  color: white;
  margin-bottom: 15px;
  border-bottom: 2px solid var(--primary);
  display: inline-block;
  padding-bottom: 5px;
}
.footer-col p {
  margin-bottom: 10px;
  color: #fff;
  font-size: 0.9rem;
}

.footer-bottom {
  background-color: #380000;
  text-align: center;
  padding: 20px;
  font-size: 0.85rem;
  color: #fff;
}
</style>
