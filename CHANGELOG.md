# Changelog

## Perubahan Terbaru

### 1. Fix Error di Halaman /flights
- Menambahkan null checking untuk semua properti yang mungkin undefined
- Memperbaiki error "Cannot read properties of undefined (reading 'toString')"
- Menambahkan fallback values untuk data yang kosong

### 2. Fitur Rute Populer
- Menambahkan tabel `popular_flight_routes` di database
- Membuat API endpoints:
  - `GET /api/popular-flight-routes` - Mendapatkan list rute populer
  - `POST /api/popular-flight-routes` - Menambah rute populer
  - `PUT /api/popular-flight-routes/[id]` - Update rute populer
  - `DELETE /api/popular-flight-routes/[id]` - Hapus rute populer
- Membuat halaman admin `/admin/dashboard/popular-routes` untuk mengelola rute populer
- Fitur yang tersedia:
  - Menambah rute ke daftar populer
  - Mengatur urutan tampilan dengan tombol up/down
  - Toggle aktif/nonaktif
  - Hapus dari daftar populer
- Update component `popular-flight-destinations` untuk menampilkan data dari `popular_flight_routes`

### 3. Dynamic Fare Form (CRUD untuk Rincian Tarif)
- Membuat component `DynamicFareForm` yang reusable
- Fitur:
  - Form tarif dasar dan pajak (fixed)
  - Tambah biaya tambahan dinamis (nama dan jumlah)
  - Hapus biaya tambahan
  - Diskon
  - Kalkulasi otomatis total harga
  - Preview rincian biaya lengkap
- Form ini dapat digunakan di halaman flight-routes

### 4. Perubahan Database Schema
- Menambahkan model `PopularFlightRoute` di Prisma schema
- Menambahkan field `otherFees` (JSONB) di `FlightRoute` untuk menyimpan biaya tambahan dinamis

## File Migration
- `migrations/002_add_popular_flight_routes.sql` - SQL migration untuk tabel popular_flight_routes

## Cara Menjalankan Migration
Jalankan migration SQL manual di database:
```bash
psql $DATABASE_URL < migrations/002_add_popular_flight_routes.sql
```

Atau update Prisma schema:
```bash
npm run prisma:push
npm run prisma:generate
```
