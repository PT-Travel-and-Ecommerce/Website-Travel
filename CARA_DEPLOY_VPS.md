# 🚀 CARA DEPLOY DI VPS (PM2 + Nginx)

## ✅ Masalah yang Sudah Diperbaiki

**Masalah Sebelumnya:**
- ❌ Gambar tidak muncul setelah upload
- ❌ Harus restart PM2 agar gambar muncul
- ❌ Error "image not found" setelah upload

**Solusi Sekarang:**
- ✅ Gambar langsung muncul setelah upload
- ✅ Tidak perlu restart PM2
- ✅ Stabil untuk production dengan PM2 + Nginx

---

## 📋 LANGKAH DEPLOY DI VPS

### 1️⃣ Login ke VPS
```bash
ssh user@ip-vps-anda
```

### 2️⃣ Install Dependencies (Jika Belum)
```bash
# Install Node.js 18+ (jika belum)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 3️⃣ Clone/Upload Project ke VPS
```bash
# Clone dari Git (jika pakai Git)
cd /var/www
git clone https://github.com/username/repo-anda.git
cd repo-anda

# ATAU upload via FTP/SFTP ke /var/www/repo-anda
```

### 4️⃣ Setup Environment
```bash
# Copy .env.example ke .env
cp .env.example .env

# Edit .env
nano .env
```

**Isi .env di VPS:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# PENTING: Set upload directory untuk production
UPLOADS_DIR="/var/www/uploads"

MAX_FILE_SIZE="10485760"
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/jpg,application/pdf"
```

**Simpan:** Ctrl + X, lalu Y, lalu Enter

### 5️⃣ Buat Folder Uploads & Set Permissions
```bash
# Buat folder uploads
sudo mkdir -p /var/www/uploads

# Set owner ke user Anda (bukan root)
sudo chown -R $USER:$USER /var/www/uploads

# Set permissions
sudo chmod -R 755 /var/www/uploads

# Verify
ls -la /var/www/uploads
```

### 6️⃣ Install & Build Project
```bash
cd /var/www/repo-anda

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Build production
npm run build
```

### 7️⃣ Start dengan PM2
```bash
# Start aplikasi
pm2 start npm --name "website-travel" -- start

# Set PM2 startup
pm2 startup
pm2 save

# Cek status
pm2 status
pm2 logs website-travel
```

### 8️⃣ Setup Nginx

**Buat file konfigurasi Nginx:**
```bash
sudo nano /etc/nginx/sites-available/website-travel
```

**Paste konfigurasi ini:**
```nginx
server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;
    # Ganti domain-anda.com dengan domain Anda
    # Atau gunakan IP jika belum ada domain

    # Maximum upload size
    client_max_body_size 10M;

    # Serve uploaded images directly from Nginx (FAST!)
    location /api/images/ {
        alias /var/www/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Remove /api/images/ prefix
        rewrite ^/api/images/(.*)$ /$1 break;
        
        # Handle file not found
        try_files $uri =404;
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

**Simpan:** Ctrl + X, lalu Y, lalu Enter

**Aktifkan konfigurasi:**
```bash
# Buat symbolic link
sudo ln -s /etc/nginx/sites-available/website-travel /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Jika OK, restart Nginx
sudo systemctl restart nginx
```

### 9️⃣ Setup Firewall (Jika Belum)
```bash
# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (pastikan sudah allow sebelum enable!)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

### 🔟 Setup SSL (HTTPS) dengan Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Dapatkan SSL Certificate (ganti domain-anda.com)
sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com

# Follow the prompts (isi email, agree to terms)
# Certbot akan otomatis setup SSL di Nginx
```

---

## ✅ VERIFIKASI & TESTING

### Test 1: Cek Website Bisa Diakses
```bash
# Dari VPS
curl -I http://localhost:5000

# Dari browser
http://ip-vps-anda
# ATAU
http://domain-anda.com
```

### Test 2: Upload Gambar
1. Buka website di browser
2. Login ke admin dashboard
3. Upload gambar
4. **✅ Gambar harus langsung muncul!**

### Test 3: Cek PM2 Status
```bash
pm2 status
pm2 logs website-travel --lines 50
```

### Test 4: Restart PM2 (Gambar Harus Tetap Muncul)
```bash
pm2 restart website-travel
# Buka admin lagi, gambar yang sudah di-upload harus tetap muncul
```

---

## 🔄 UPDATE CODE DI VPS (Jika Ada Perubahan)

```bash
# 1. Pull latest code
cd /var/www/repo-anda
git pull origin main

# 2. Install dependencies (jika ada yang baru)
npm install

# 3. Rebuild
npm run build

# 4. Restart PM2
pm2 restart website-travel

# 5. Cek logs
pm2 logs website-travel
```

---

## 🐛 TROUBLESHOOTING

### Problem 1: Gambar tidak muncul setelah upload
```bash
# Cek permissions folder uploads
ls -la /var/www/uploads/
sudo chown -R $USER:$USER /var/www/uploads
sudo chmod -R 755 /var/www/uploads

# Cek apakah file ter-upload
ls /var/www/uploads/

# Cek PM2 logs
pm2 logs website-travel
```

### Problem 2: PM2 tidak jalan setelah reboot VPS
```bash
# Setup PM2 startup
pm2 startup
# Copy & paste command yang muncul, lalu jalankan

pm2 save
```

### Problem 3: Nginx error 502 Bad Gateway
```bash
# Cek Next.js berjalan di port 5000
pm2 status

# Cek Nginx config
sudo nginx -t

# Cek Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Problem 4: Error "EACCES: permission denied"
```bash
# Fix permissions
sudo chown -R $USER:$USER /var/www/uploads
sudo chown -R $USER:$USER /var/www/repo-anda
```

### Problem 5: Upload terlalu besar
```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/website-travel

# Tambah/update line ini:
client_max_body_size 20M;  # Sesuaikan dengan kebutuhan

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📊 MONITORING & MAINTENANCE

### Cek Status PM2
```bash
pm2 status
pm2 monit  # Real-time monitoring
```

### Cek Logs
```bash
# PM2 logs
pm2 logs website-travel --lines 100

# Nginx access log
sudo tail -f /var/log/nginx/access.log

# Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
# Restart PM2
pm2 restart website-travel

# Restart Nginx
sudo systemctl restart nginx

# Restart semua
pm2 restart all && sudo systemctl restart nginx
```

### Backup Uploads
```bash
# Backup folder uploads
cd /var/www
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Download ke laptop via SCP
# Dari laptop:
scp user@ip-vps:/var/www/uploads-backup-*.tar.gz ~/Downloads/
```

---

## 🎯 CHECKLIST DEPLOY

- [ ] VPS sudah install Node.js 18+
- [ ] PM2 sudah terinstall global
- [ ] Nginx sudah terinstall
- [ ] Project sudah di-clone/upload ke `/var/www/`
- [ ] File `.env` sudah dibuat dengan `UPLOADS_DIR="/var/www/uploads"`
- [ ] Folder `/var/www/uploads` sudah dibuat dengan permissions yang benar
- [ ] `npm install` berhasil
- [ ] `npm run build` berhasil
- [ ] PM2 sudah start aplikasi di port 5000
- [ ] PM2 startup & save sudah dijalankan
- [ ] Nginx config sudah dibuat & diaktifkan
- [ ] Firewall sudah allow port 80 & 443
- [ ] SSL certificate sudah diinstall (jika pakai domain)
- [ ] Test upload gambar berhasil
- [ ] Gambar langsung muncul tanpa restart PM2

---

## ✨ SELESAI!

Setelah semua langkah di atas, website Anda sudah:
- ✅ Running di VPS dengan PM2
- ✅ Accessible via Nginx
- ✅ Upload gambar langsung muncul
- ✅ Tidak perlu restart PM2 manual
- ✅ Stabil untuk production

**Jika ada masalah, cek bagian TROUBLESHOOTING di atas!**
