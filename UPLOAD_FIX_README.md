# 📸 Upload Image Fix - Quick Guide

## ✅ Masalah yang Sudah Diperbaiki

**SEBELUM:**
- ❌ Gambar tidak muncul setelah upload dari laptop
- ❌ Harus restart PM2 di VPS agar gambar muncul
- ❌ Error "image not found"

**SEKARANG:**
- ✅ Gambar langsung muncul setelah upload
- ✅ Tidak perlu restart PM2
- ✅ Stabil di production (PM2 + Nginx)

---

## 🔧 File yang Sudah Diperbaiki

1. **`src/app/api/upload/route.ts`** - Upload handler (simpan ke folder eksternal)
2. **`src/app/api/images/[filename]/route.ts`** - API untuk serve gambar (BARU)
3. **`src/app/api/reviews/route.ts`** - Update upload path
4. **`src/app/api/cities/route.ts`** - Update upload path
5. **`src/app/api/cities/[id]/route.ts`** - Update upload path

### Perubahan Utama:
```diff
- Upload ke: public/uploads/
+ Upload ke: /var/www/uploads/ (atau ./uploads di development)

- URL gambar: /uploads/image.jpg
+ URL gambar: /api/images/image.jpg (served via API route)
```

---

## 🚀 Cara Deploy di VPS

### Quick Deploy (5 Menit):
```bash
# 1. Di VPS, buat folder uploads
sudo mkdir -p /var/www/uploads
sudo chown -R $USER:$USER /var/www/uploads
sudo chmod -R 755 /var/www/uploads

# 2. Set environment variable
cd /path/to/project
echo 'UPLOADS_DIR="/var/www/uploads"' >> .env

# 3. Build & start
npm install
npm run build
pm2 restart all

# 4. Setup Nginx (PENTING!)
sudo nano /etc/nginx/sites-available/your-site
```

**Tambahkan di Nginx config:**
```nginx
# Serve images langsung dari Nginx
location /api/images/ {
    alias /var/www/uploads/;
    expires 1y;
    add_header Cache-Control "public, immutable";
    rewrite ^/api/images/(.*)$ /$1 break;
}
```

```bash
# Restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

**✅ DONE! Upload gambar sekarang langsung muncul!**

---

## 📖 Panduan Lengkap

Baca file ini untuk panduan detail step-by-step:
- **`CARA_DEPLOY_VPS.md`** - Panduan deploy lengkap dengan troubleshooting
- **`DEPLOYMENT_FIX.md`** - Technical details & Nginx configuration
- **`UPLOAD_BUG_FIX_SUMMARY.md`** - Summary semua perubahan

---

## 🧪 Testing

### Test di Local (Development):
```bash
npm run dev
# Upload gambar di admin -> harus langsung muncul
```

### Test di VPS (Production):
```bash
# 1. Upload gambar via admin dashboard
# 2. Cek gambar muncul di website
# 3. Restart PM2
pm2 restart all
# 4. Refresh website -> gambar harus tetap muncul ✅
```

---

## 🐛 Troubleshooting Cepat

### Gambar tidak muncul?
```bash
# Cek permissions
ls -la /var/www/uploads/
sudo chown -R $USER:$USER /var/www/uploads

# Cek PM2 logs
pm2 logs
```

### Nginx 404 untuk gambar?
```bash
# Cek Nginx config sudah benar
sudo nginx -t

# Cek folder uploads
ls /var/www/uploads/

# Restart Nginx
sudo systemctl restart nginx
```

### Upload error?
```bash
# Cek .env
cat .env | grep UPLOADS_DIR

# Cek folder exists
ls -la /var/www/uploads/
```

---

## 🎯 Cara Kerja Solusi

### Flow Sebelumnya (Bermasalah):
```
Upload → public/uploads/ → /uploads/image.jpg
                           ↓
                    ❌ Not accessible (cached build)
                    ⚠️ Need PM2 restart
```

### Flow Sekarang (Fixed):
```
Upload → /var/www/uploads/ → /api/images/image.jpg
                              ↓
                       API Route serve file
                              ↓
                    ✅ Immediately accessible
                    ✅ No restart needed
```

---

## 📝 Environment Variables

**Development (.env):**
```env
UPLOADS_DIR="./uploads"
```

**Production (.env di VPS):**
```env
UPLOADS_DIR="/var/www/uploads"
```

---

## ✨ Benefits

1. ✅ **Instant visibility** - Gambar langsung muncul setelah upload
2. ✅ **No restart needed** - PM2 tidak perlu di-restart
3. ✅ **Better security** - Upload folder terpisah dari Next.js bundle
4. ✅ **Better performance** - Nginx serve langsung dari disk
5. ✅ **Production ready** - Tested untuk PM2 + Nginx

---

**🎉 Website sekarang sudah siap deploy di VPS tanpa masalah upload gambar!**
