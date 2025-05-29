# horroredu.com
# Game Edukasi Horor: Fiqh Qadha & Qadhar

Game edukasi sederhana berbasis web dengan nuansa horor untuk mempelajari materi Fiqh (lebih tepatnya Aqidah) tentang Qadha dan Qadhar. Aplikasi ini sepenuhnya berjalan di sisi klien (client-side) menggunakan HTML, CSS, dan JavaScript, dengan penyimpanan data menggunakan `localStorage` peramban.

## Fitur

* **Halaman Guru:**
    * Membuat dan mengedit 10 soal pilihan ganda dan 5 soal esai.
    * Menyimpan konfigurasi soal ke `localStorage`.
    * Menampilkan "link" (path ke file siswa) untuk dibagikan.
    * Melihat papan peringkat (leaderboard) siswa yang diurutkan berdasarkan skor.
* **Halaman Siswa:**
    * Halaman login untuk memasukkan nama dan kelas (disimpan di `sessionStorage`).
    * Mengerjakan soal yang telah disiapkan guru.
    * Penilaian otomatis untuk pilihan ganda (esai dinilai berdasarkan keterisian).
* **Umpan Balik Bernuansa Horor:**
    * Jika skor di bawah 75: Animasi jumpscare dengan audio.
    * Jika skor sempurna (100): Animasi dan audio tepuk tangan.
* **Papan Peringkat:** Hasil siswa (nama, kelas, skor, waktu) disimpan di `localStorage` dan ditampilkan di halaman guru.

## Struktur File
