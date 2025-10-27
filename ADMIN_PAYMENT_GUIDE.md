# Panduan Admin - Kelola Pembayaran

## Gambaran Umum
Halaman Kelola Pembayaran memungkinkan admin untuk mengelola dan memverifikasi pembayaran pelanggan secara manual. Karena website ini tidak menggunakan payment gateway otomatis, admin perlu melakukan verifikasi pembayaran berdasarkan bukti transfer yang diunggah pelanggan.

## Cara Mengakses

1. **Login ke Admin Dashboard**
   - Buka `/admin/login`
   - Email: `admin@example.com`
   - Password: `Admin123!`

2. **Navigasi ke Kelola Pembayaran**
   - Setelah login, klik menu "Kelola Pembayaran" di sidebar kiri
   - Anda akan melihat daftar semua pembayaran

## Fitur-Fitur

### 1. Filter Pembayaran
Di bagian atas halaman, terdapat dropdown filter untuk menyaring pembayaran berdasarkan status:
- **Semua Status**: Menampilkan semua pembayaran
- **Pending**: Pembayaran yang belum dikonfirmasi
- **Lunas**: Pembayaran yang sudah dikonfirmasi
- **Dibatalkan**: Pembayaran yang dibatalkan

### 2. Lihat Detail Pembayaran
Setiap kartu pembayaran menampilkan:
- Nama pelanggan
- Email pelanggan
- Rute penerbangan (dari - ke)
- Maskapai penerbangan
- Tanggal keberangkatan
- Total pembayaran
- Status pembayaran (badge berwarna)
- Tanggal pembayaran dibuat

Klik tombol **"Detail"** untuk membuka modal dengan informasi lengkap.

### 3. Ubah Status Pembayaran
Di dalam modal detail:
1. Lihat dropdown "Update Status"
2. Pilih status baru:
   - **Pending**: Pembayaran menunggu verifikasi
   - **Lunas**: Pembayaran sudah dikonfirmasi
   - **Dibatalkan**: Pembayaran dibatalkan

Status akan langsung berubah dan notifikasi sukses akan muncul.

### 4. Upload Bukti Pembayaran
Jika pelanggan belum mengunggah bukti pembayaran, atau admin perlu mengganti bukti:
1. Di modal detail, scroll ke bagian "Bukti Pembayaran"
2. Jika belum ada bukti, klik **"Upload Bukti Pembayaran"**
3. Jika sudah ada bukti, klik **"Ganti Bukti Pembayaran"**
4. Pilih file gambar dari komputer Anda
5. File akan otomatis terupload dan tersimpan

**Catatan**: File yang didukung adalah gambar (JPEG, PNG, WebP, GIF) maksimal 5MB.

### 5. Lihat Bukti Pembayaran
Jika bukti pembayaran sudah ada:
- Gambar akan ditampilkan langsung di modal
- Klik link "Lihat gambar ukuran penuh" untuk membuka di tab baru

### 6. Hapus Pembayaran
Jika perlu menghapus pembayaran:
1. Buka modal detail pembayaran
2. Klik tombol **"Hapus"** berwarna merah di bagian bawah
3. Konfirmasi penghapusan
4. Pembayaran akan dihapus permanen dari database

**Peringatan**: Tindakan ini tidak dapat dibatalkan!

## Alur Kerja Manual Payment

### Skenario 1: Pembayaran Baru Masuk
1. Pelanggan melakukan booking dan menerima informasi rekening bank
2. Pelanggan transfer ke salah satu rekening yang tersedia
3. Pelanggan mengunggah bukti transfer (opsional)
4. Admin memeriksa di halaman Kelola Pembayaran
5. Admin verifikasi bukti transfer (jika ada) atau cek langsung ke rekening bank
6. Admin mengubah status dari **Pending** ke **Lunas**
7. Pelanggan dapat menerima konfirmasi

### Skenario 2: Pelanggan Belum Upload Bukti
1. Admin melihat pembayaran dengan status Pending tanpa bukti
2. Admin menghubungi pelanggan (via email/WhatsApp)
3. Pelanggan mengirim bukti transfer via email/WhatsApp
4. Admin upload bukti pembayaran ke sistem
5. Admin verifikasi dan ubah status ke Lunas

### Skenario 3: Pembatalan Pembayaran
1. Pelanggan meminta pembatalan
2. Admin ubah status pembayaran ke **Dibatalkan**
3. Admin proses refund jika sudah ada pembayaran
4. Pembayaran tetap tercatat dengan status Dibatalkan

## Tips & Best Practices

1. **Rutin Cek Pembayaran Pending**
   - Minimal cek 2x sehari untuk pembayaran baru
   - Gunakan filter "Pending" untuk fokus pada yang perlu diverifikasi

2. **Verifikasi Bukti Transfer**
   - Periksa nama pengirim sesuai dengan nama booking
   - Pastikan jumlah transfer sesuai dengan total pembayaran
   - Cek tanggal transfer

3. **Komunikasi dengan Pelanggan**
   - Jika bukti tidak jelas, hubungi pelanggan untuk konfirmasi
   - Berikan update status segera setelah verifikasi

4. **Gunakan Tombol Refresh**
   - Klik tombol "Refresh" untuk memperbarui data terbaru
   - Berguna saat ada tim admin lain yang juga mengelola pembayaran

5. **Backup Bukti Transfer**
   - Bukti pembayaran tersimpan di folder `uploads/` di server
   - Pastikan backup rutin dilakukan

## Troubleshooting

### Gambar Bukti Tidak Muncul
- Refresh halaman browser
- Periksa koneksi internet
- Pastikan file gambar masih ada di server

### Status Tidak Berubah
- Pastikan Anda login sebagai admin
- Cek koneksi internet
- Refresh halaman dan coba lagi

### Upload Gagal
- Pastikan ukuran file < 5MB
- Pastikan format file adalah gambar (JPG, PNG, WebP, GIF)
- Coba compress gambar terlebih dahulu

## Keamanan

- Hanya admin yang bisa mengakses halaman ini
- Semua aksi tercatat dengan timestamp
- Session timeout otomatis setelah inaktif
- Logout setelah selesai mengelola pembayaran

## Dukungan Teknis

Jika ada masalah teknis atau butuh bantuan lebih lanjut:
1. Cek dokumentasi teknis di `README.md`
2. Periksa log server untuk error
3. Hubungi developer untuk support

---

**Terakhir Diperbarui**: 17 Oktober 2025
