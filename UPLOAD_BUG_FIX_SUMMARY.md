# 🔧 Summary: Upload Bug Fix

## ❌ Masalah Sebelumnya
- Gambar yang di-upload di admin dashboard tidak langsung muncul
- Perlu restart PM2 agar gambar bisa diakses
- Penyebab: Next.js production mode serve static files dari `.next` folder yang di-build, bukan dari `public` folder

## ✅ Solusi yang Diterapkan
File upload sekarang disimpan di **folder eksternal** (di luar `public/`) dan di-serve melalui **API route dinamis**.

---

## 📝 File yang Diubah

### 1. **src/app/api/upload/route.ts**
- ✏️ Ubah upload path dari `public/uploads` → `process.env.UPLOADS_DIR || ./uploads`
- ✏️ Ubah return URL dari `/uploads/${filename}` → `/api/images/${filename}`

### 2. **src/app/api/reviews/route.ts**
- ✏️ Ubah upload path dari `public/uploads` → `process.env.UPLOADS_DIR || ./uploads`
- ✏️ Ubah return URL dari `/uploads/${filename}` → `/api/images/${filename}`

### 3. **src/app/api/cities/route.ts**
- ✏️ Ubah upload path dari `public/uploads` → `process.env.UPLOADS_DIR || ./uploads`
- ✏️ Ubah return URL dari `/uploads/${filename}` → `/api/images/${filename}`

### 4. **src/app/api/cities/[id]/route.ts**
- ✏️ Ubah upload path dari `public/uploads` → `process.env.UPLOADS_DIR || ./uploads`
- ✏️ Ubah return URL dari `/uploads/${filename}` → `/api/images/${filename}`

### 5. **src/app/api/images/[filename]/route.ts** *(BARU)*
- 🆕 API route untuk serve gambar yang di-upload
- Security: Prevent directory traversal attacks
- Cache headers: `max-age=31536000, immutable`
- Support: jpg, jpeg, png, gif, webp

### 6. **.env**
- ✏️ Rename `UPLOAD_DIR` → `UPLOADS_DIR` (untuk konsistensi)

### 7. **.env.example** *(BARU)*
- 🆕 Template environment variables dengan dokumentasi

### 8. **.gitignore**
- ✏️ Tambah `/uploads` dan `/public/uploads` ke gitignore

### 9. **DEPLOYMENT_FIX.md** *(BARU)*
- 🆕 Dokumentasi lengkap cara deploy fix ini di VPS
- Include: Nginx config, troubleshooting, migration guide

### 10. **migrate-uploads.sh** *(BARU)*
- 🆕 Script untuk migrasi gambar lama dari `public/uploads` ke folder baru

---

## 🚀 Cara Deploy di VPS

### Quick Steps:

```bash
# 1. Pull latest code
cd /path/to/project
git pull origin main

# 2. Update .env (optional, default: ./uploads)
echo 'UPLOADS_DIR="/var/www/uploads"' >> .env

# 3. Create uploads folder (jika pakai /var/www/uploads)
sudo mkdir -p /var/www/uploads
sudo chown -R $USER:$USER /var/www/uploads
sudo chmod -R 755 /var/www/uploads

# 4. Migrate old images (jika ada)
bash migrate-uploads.sh

# 5. Rebuild dan restart
npm run build
pm2 restart all

# 6. Test
curl -I http://localhost:5000/api/images/test.jpg
```

### Nginx Config (Optional - untuk performance):
```nginx
# Serve images langsung dari Nginx
location /api/images/ {
    alias /var/www/uploads/;
    expires 1y;
    add_header Cache-Control "public, immutable";
    rewrite ^/api/images/(.*)$ /$1 break;
}
```

---

## 🧪 Testing

### Test 1: Upload gambar
1. Login ke admin dashboard
2. Upload gambar baru
3. ✅ Gambar harus langsung muncul (tanpa restart PM2)

### Test 2: Direct URL access
```bash
curl -I https://your-domain.com/api/images/1234567890-image.jpg
# Expected: HTTP 200, Content-Type: image/jpeg
```

### Test 3: PM2 logs
```bash
pm2 logs
# Tidak boleh ada error "ENOENT" atau "404"
```

---

## 🔍 Troubleshooting

### Gambar masih tidak muncul?

**Cek 1: Permissions**
```bash
ls -la /var/www/uploads/
# Owner harus sama dengan user yang jalankan PM2
sudo chown -R $USER:$USER /var/www/uploads
```

**Cek 2: Environment variable**
```bash
# Di VPS, cek apakah env var ter-load
pm2 env <app-id> | grep UPLOADS_DIR
```

**Cek 3: Logs**
```bash
pm2 logs --lines 50
sudo tail -f /var/log/nginx/error.log
```

**Cek 4: Manual test**
```bash
# Test upload API
curl -F "file=@./test.jpg" http://localhost:5000/api/upload

# Test image serve API
curl -I http://localhost:5000/api/images/<filename>
```

---

## 📊 Comparison

### Before (Broken):
```
┌─────────┐     ┌──────────────┐     ┌──────────┐
│ Upload  │ --> │ public/      │ --> │ /uploads │ ❌ Not accessible
│         │     │ uploads/     │     │          │    until restart
└─────────┘     └──────────────┘     └──────────┘
```

### After (Fixed):
```
┌─────────┐     ┌──────────────┐     ┌─────────────┐
│ Upload  │ --> │ /var/www/    │ --> │ /api/images │ ✅ Immediately
│         │     │ uploads/     │     │             │    accessible
└─────────┘     └──────────────┘     └─────────────┘
```

---

## 💡 Benefits

1. ✅ **No restart needed** - Gambar langsung accessible setelah upload
2. ✅ **Better security** - Upload folder terpisah dari Next.js bundle
3. ✅ **Better performance** - Bisa di-serve langsung dari Nginx
4. ✅ **Scalable** - Mudah migrasi ke CDN/S3 di masa depan
5. ✅ **Cache-friendly** - Proper cache headers (1 year)

---

## 🔮 Future Improvements

### Option 1: CDN Integration
```typescript
// Update src/app/api/upload/route.ts
// Upload to CDN instead of local filesystem
const cdnUrl = await uploadToCDN(buffer, filename);
return NextResponse.json({ url: cdnUrl });
```

### Option 2: Cloud Storage (S3, R2, etc.)
```typescript
import { S3Client } from '@aws-sdk/client-s3';
// Upload to S3
const s3Url = await uploadToS3(buffer, filename);
return NextResponse.json({ url: s3Url });
```

### Option 3: Image Optimization
```typescript
import sharp from 'sharp';
// Compress & optimize image
const optimized = await sharp(buffer)
  .resize(1920, 1080, { fit: 'inside' })
  .webp({ quality: 80 })
  .toBuffer();
```

---

## ✅ Checklist Deploy

- [ ] Pull latest code dari git
- [ ] Update `.env` dengan `UPLOADS_DIR`
- [ ] Buat folder uploads dengan permissions yang benar
- [ ] Run migration script untuk gambar lama
- [ ] `npm run build`
- [ ] `pm2 restart all`
- [ ] Test upload gambar baru
- [ ] Test akses langsung ke `/api/images/...`
- [ ] Update Nginx config (optional)
- [ ] Test restart PM2 (gambar harus tetap muncul)
- [ ] Monitor logs untuk error

---

**Status: ✅ READY TO DEPLOY**

Setelah deploy, bug upload gambar akan selesai dan tidak perlu restart PM2 lagi! 🎉
