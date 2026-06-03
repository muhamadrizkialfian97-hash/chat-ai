# 🚀 PRAMA System - Panduan Deployment GitHub & Vercel

Repositori ini telah dikonfigurasi secara optimal untuk dideploy langsung ke **Vercel** dengan fitur API Serverless yang aman untuk menjalankan **Gemini Flash AI**.

---

## 🛠️ Langkah 1: Hubungkan & Ekspor ke GitHub

Anda dapat mengekspor seluruh kode dari workspace **Google AI Studio** ini langsung ke akun GitHub Anda:

1. Di pojok kanan atas layar **Google AI Studio**, klik ikon **Settings** (Roda Gigi) atau menu ekspansi.
2. Pilih opsi **Export to GitHub** atau **Download ZIP**.
   - *Rekomendasi (Export to GitHub)*: Berikan izin ke akun GitHub Anda dan buat repositori baru (misalnya `prama-system`).
   - *Alternatif (ZIP)*: Unduh file ZIP, ekstrak di komputer Anda, buat repositori baru di GitHub, lalu push kode tersebut ke repositori baru Anda menggunakan Git.

---

## ☁️ Langkah 2: Deploy ke Vercel

Setelah kode Anda berada di repositori GitHub, deploy ke Vercel sangatlah mudah:

1. Buka [Vercel Dashboard](https://vercel.com/) dan masuk menggunakan akun GitHub Anda.
2. Klik tombol **Add New...** lalu pilih **Project**.
3. Di daftar repositori GitHub Anda, cari repositori `prama-system` (atau nama repositori yang Anda buat) dan klik **Import**.
4. Di bagian **Framework Preset**, Vercel akan otomatis mendeteksi **Vite**. Jika belum, pilih **Vite** dari daftar.
5. Biarkan pengaturan **Build and Output Settings** secara default.

---

## 🔑 Langkah 3: Mengaktifkan Gemini AI di Vercel (SANGAT PENTING)

Agar AI Agent dapat merespons di lingkungan situs Vercel Anda tanpa mengekspos kunci rahasia Anda ke browser, Anda **wajib** mendaftarkan kunci API di menu Environment Variables Vercel:

1. Sebelum mengklik tombol *Deploy* di Vercel, buka bagian **Environment Variables** (atau buka menu *Settings > Environment Variables* di halaman proyek Vercel Anda jika sudah dideploy).
2. Tambahkan variabel baru dengan konfigurasi berikut:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *(Masukkan Kunci Gemini API Anda dari Google AI Studio)*
     > 💡 Anda bisa mendapatkan atau menyalin kunci gratis dari [Google AI Studio](https://aistudio.google.com/).
3. Klik **Add** untuk menyimpan variabel tersebut.
4. Klik tombol **Deploy**.

Selesai! Sekarang web PRAMA Anda akan aktif secara langsung, terjangkau secara global melalui domain Vercel Anda, dan AI pendukungnya akan selalu online dengan aman dan lancar! 🚀
