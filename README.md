## Bot Telegram untuk Informasi Domain

Bot Telegram ini dapat digunakan untuk mendapatkan informasi tentang suatu domain menggunakan layanan WHOIS. Bot ini memungkinkan pengguna untuk mengirimkan domain melalui pesan teks dan akan mengembalikan informasi WHOIS terkait domain tersebut.

Live bot: https://t.me/TheWhois_bot

### Fitur

- Menggunakan validasi domain untuk memastikan pesan yang diterima adalah domain yang valid.
- Menggunakan library Axios untuk melakukan permintaan HTTP ke layanan WHOIS.
- Menggunakan library Cheerio untuk memuat dan memanipulasi data HTML dari respon WHOIS.
- Mengirimkan balasan yang menampilkan informasi domain yang ditemukan.

### Penggunaan

1. Tambahkan token bot Telegram kamu ke file `.env` dengan nama variabel `TELEGRAM_SECRET_KEY`, `NODE_ENV`.
2. Pastikan kamu telah menginstal dependensi yang diperlukan dengan menjalankan perintah `npm install`.
3. Jalankan bot menggunakan perintah `npm start` atau `npm run dev` untuk mode development.
4. kamu dapat menggunakan bot dengan mengirimkan pesan teks berisi domain kepada bot Telegram.

### Production

Jika kamu ingin menjalankan bot di lingkungan production, kamu perlu mengatur webhook URL dan konfigurasi lainnya. Pastikan untuk memperbarui value yang diperlukan di file `.env` sesuai dengan lingkungan production kamu.

### License

Distributed under the MIT License. See `LICENSE` for more information.