# Fix untuk Bug Upload Gambar di VPS (PM2 + Nginx)

## Masalah
Gambar yang di-upload di admin dashboard tidak muncul sampai PM2 di-restart. Ini terjadi karena Next.js production mode serve static files dari folder `.next/static` yang di-build saat `npm run build`, sehingga file baru yang di-upload setelah build tidak bisa diakses.

## Solusi
File upload sekarang disimpan di folder eksternal (di luar `public/`) dan di-serve melalui API route yang dinamis.

---

## Langkah Deploy di VPS

### 1. Update Environment Variable
Tambahkan variable ini ke file `.env` di VPS:

```bash
UPLOADS_DIR=/var/www/uploads
```

**ATAU** jika tidak ingin set environment variable, file akan otomatis tersimpan di folder `uploads/` di root project.

### 2. Buat Folder Uploads (Optional, jika pakai /var/www/uploads)
```bash
sudo mkdir -p /var/www/uploads
sudo chown -R $USER:$USER /var/www/uploads
sudo chmod -R 755 /var/www/uploads
```

### 3. Update Kode di VPS
```bash
# Di folder project
git pull origin main
# ATAU copy file yang sudah di-update:
# - src/app/api/upload/route.ts
# - src/app/api/images/[filename]/route.ts
```

### 4. Rebuild dan Restart
```bash
npm run build
pm2 restart all
# ATAU
pm2 restart <app-name>
```

---

## Nginx Configuration (Optional - Untuk Performance)

Untuk performa lebih baik, Anda bisa serve file upload langsung dari Nginx tanpa melalui Next.js:

### Edit Nginx Config
```bash
sudo nano /etc/nginx/sites-available/your-domain
```

### Tambahkan Location Block untuk Uploads
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Serve uploaded images directly from Nginx
    location /api/images/ {
        alias /var/www/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Remove /api/images/ prefix and serve file
        rewrite ^/api/images/(.*)$ /$1 break;
    }

    # Proxy semua request lain ke Next.js
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Restart Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## Cara Kerja Solusi Baru

### Sebelum (Bermasalah):
```
Upload → public/uploads/image.jpg → /uploads/image.jpg
                                     ↓
                              Tidak bisa diakses sampai restart
```

### Sesudah (Fixed):
```
Upload → /var/www/uploads/image.jpg → /api/images/image.jpg
                                       ↓
                                  API route serve file (langsung accessible)
```

---

## Testing

### 1. Test Upload
1. Login ke admin dashboard
2. Upload gambar
3. Cek apakah gambar langsung muncul (tanpa perlu restart PM2)

### 2. Test Direct URL
Setelah upload, test akses langsung:
```
https://your-domain.com/api/images/1234567890-filename.jpg
```

Harus langsung muncul gambarnya.

---

## Troubleshooting

### Gambar masih tidak muncul?

1. **Cek permissions folder uploads:**
   ```bash
   ls -la /var/www/uploads/
   # Pastikan owner adalah user yang menjalankan PM2
   sudo chown -R $USER:$USER /var/www/uploads
   ```

2. **Cek PM2 logs:**
   ```bash
   pm2 logs
   ```

3. **Cek Nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

4. **Test manual dengan curl:**
   ```bash
   # Upload test
   curl -F "file=@/path/to/test-image.jpg" http://localhost:5000/api/upload
   
   # Download test
   curl -I http://localhost:5000/api/images/1234567890-test-image.jpg
   ```

### Gambar lama (sebelum fix) tidak muncul?

Jika ada gambar yang sudah di-upload sebelumnya di folder `public/uploads/`, pindahkan ke folder baru:

```bash
# Jika pakai /var/www/uploads
sudo cp -r public/uploads/* /var/www/uploads/
sudo chown -R $USER:$USER /var/www/uploads

# Jika pakai ./uploads (di root project)
mkdir -p uploads
cp -r public/uploads/* uploads/
```

Kemudian update URL di database (jika URL disimpan di DB):
```sql
-- Update URL dari /uploads/* ke /api/images/*
UPDATE table_name 
SET image_column = REPLACE(image_column, '/uploads/', '/api/images/')
WHERE image_column LIKE '/uploads/%';
```

---

## Keuntungan Solusi Ini

1. ✅ **Tidak perlu restart PM2** setelah upload
2. ✅ **Lebih aman** - File upload terpisah dari Next.js bundle
3. ✅ **Lebih cepat** - Bisa di-serve langsung dari Nginx
4. ✅ **Scalable** - Bisa dipindah ke CDN/S3 di masa depan dengan mudah
5. ✅ **Cache-friendly** - Headers cache yang proper

---

## Migrasi ke Cloud Storage (Future)

Jika traffic tinggi, pertimbangkan untuk migrasi ke cloud storage:

- **AWS S3**
- **Cloudflare R2** (gratis egress)
- **Google Cloud Storage**
- **DigitalOcean Spaces**

Code sudah siap untuk di-extend ke cloud storage, tinggal update bagian:
- `src/app/api/upload/route.ts` - Upload ke S3
- `src/app/api/images/[filename]/route.ts` - Redirect ke S3 URL

---

**Note:** Setelah deploy fix ini, bug upload gambar akan selesai dan tidak perlu restart PM2 lagi! 🚀
