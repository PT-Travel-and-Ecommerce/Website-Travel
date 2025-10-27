# Setup SSO untuk Semua Environment

## 🌍 Cara Kerja SSO Multi-Environment

Fitur SSO sudah dikonfigurasi untuk bekerja secara **dinamis** di semua environment menggunakan `window.location.origin`.

### Environments yang Didukung:

#### 1. **Localhost Development**
```
http://localhost:5000
```
- Callback URL: `http://localhost:5000/auth/callback`
- Testing lokal di laptop

#### 2. **Network Access (0.0.0.0)**
```
http://0.0.0.0:5000
```
- Callback URL: `http://0.0.0.0:5000/auth/callback`
- Akses dari jaringan lokal

#### 3. **VPS dengan IP**
```
http://157.66.35.83:5000
```
- Callback URL: `http://157.66.35.83:5000/auth/callback`
- Production dengan IP public

#### 4. **VPS dengan Domain**
```
https://yourdomain.com
```
- Callback URL: `https://yourdomain.com/auth/callback`
- Production dengan domain & SSL

---

## 🔧 Konfigurasi SSO

### File: `src/lib/sso-auth.ts`

```typescript
export function redirectToSSO(returnUrl?: string): void {
  // Menggunakan window.location.origin untuk deteksi otomatis
  const baseUrl = window.location.origin; // ← Dinamis!
  const callbackUrl = `${baseUrl}/auth/callback`;
  const redirectUrl = returnUrl ? 
    `${callbackUrl}?returnUrl=${encodeURIComponent(returnUrl)}` : 
    callbackUrl;
  
  window.location.href = `https://ssoauth.darulgs.co.id/login?redirectUrl=${encodeURIComponent(redirectUrl)}`;
}
```

### SSO Server: `https://ssoauth.darulgs.co.id`

**Endpoint Validasi:**
```
https://ssoauth.darulgs.co.id/api/example/ssovalidate?code={code}
```

**Response Format:**
```json
{
  "status": true,
  "message": "User found",
  "data": {
    "id": "1",
    "username": "dayat",
    "email": "dayat@email.com",
    "phone": "085210275004"
  }
}
```

---

## 🧪 Testing SSO

### 1. Test di Localhost
```bash
# Start development server
npm run dev

# Buka browser
http://localhost:5000/flights/[flight-id]/book

# Klik "Pay Now" → Login SSO
```

### 2. Test di VPS
```bash
# Deploy ke VPS
# Akses melalui IP atau domain
http://157.66.35.83:5000/flights/[flight-id]/book

# Klik "Pay Now" → Login SSO
```

### 3. Kredensial Test SSO
```
Username: dayat
Password: password
```

---

## 🔍 Debugging

### Browser Console Log
Setelah klik "Pay Now", cek browser console:
```
SSO Redirect - Base URL: http://localhost:5000
SSO Redirect - Callback URL: http://localhost:5000/auth/callback
SSO Redirect - Full Redirect URL: http://localhost:5000/auth/callback?returnUrl=/flights/xxx/book
```

### Server Console Log
Setelah login di SSO, cek server terminal:
```
SSO Callback - Code: 9a8e09d1baa42b93465eabdf8da7edb5
SSO Callback - ReturnUrl: /flights/xxx/book
Validating SSO code...
SSO Response: { status: true, message: 'User found', data: {...} }
SSO User: { id: '1', username: 'dayat', ... }
Creating new user... (atau Updating existing user...)
Safe Return URL: /flights/xxx/book
Login successful, redirecting to: /flights/xxx/book
```

---

## 🚨 Troubleshooting

### Problem: 404 di `/auth/callback`
**Solusi:** 
- Pastikan file `src/app/auth/callback/route.ts` exists
- Restart development server

### Problem: SSO validation failed
**Solusi:**
- Cek struktur response API SSO
- Pastikan menggunakan `data` bukan `user`
- Cek console log untuk detail error

### Problem: Redirect ke `?error=sso_failed`
**Solusi:**
- Cek internet connection
- Cek SSO server status
- Pastikan code dari SSO valid

### Problem: Cookie tidak tersimpan
**Solusi:**
- Cek browser security settings
- Pastikan `sameSite: 'lax'` di cookie config
- Cek domain dan path cookie settings

---

## 📝 File Structure

```
src/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          ← SSO callback route (utama)
│   ├── api/
│   │   └── auth/
│   │       ├── callback/
│   │       │   └── route.ts      ← Backup route
│   │       └── me/
│   │           └── route.ts      ← Get user session
│   └── flights/
│       └── [id]/
│           └── book/
│               └── page.tsx      ← Page dengan SSO login
├── lib/
│   └── sso-auth.ts               ← SSO helper functions
└── components/
    └── flights/
        └── flight-payment-modal.tsx  ← Modal pembayaran
```

---

## 🔐 Security Notes

1. **Cookie Settings:**
   - `httpOnly: true` untuk `user_session` (tidak bisa diakses JavaScript)
   - `secure: true` di production (hanya HTTPS)
   - `sameSite: 'lax'` untuk mencegah CSRF
   - `maxAge: 7 days`

2. **URL Validation:**
   - Fungsi `isValidReturnUrl()` mencegah open redirect
   - Hanya menerima relative path atau same-origin URL

3. **Database:**
   - User data disimpan di tabel `users`
   - `ssoUserId` menyimpan ID dari SSO server
   - Email sebagai unique identifier

---

## 📊 Flow Diagram

```
User Click "Pay Now"
    ↓
Check Login Status (getCurrentUser)
    ↓
[Belum Login] 
    ↓
Redirect ke SSO dengan callback URL dinamis
    ↓
User Login di SSO Server
    ↓
SSO Redirect ke: {origin}/auth/callback?code=xxx&returnUrl=yyy
    ↓
Server Validate Code ke SSO API
    ↓
Buat/Update User di Database
    ↓
Set Session Cookies
    ↓
Redirect ke Return URL
    ↓
[Sudah Login]
    ↓
Tampilkan Payment Modal
    ↓
Create Payment Record
    ↓
Tampilkan Info Bank Transfer
```

---

## ✅ Checklist Deployment

### Localhost
- [x] SSO redirect bekerja
- [x] Callback route exists
- [x] Database connection OK
- [x] Console logging untuk debugging

### VPS Production
- [ ] Update SSO allowlist (jika diperlukan)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (recommended)
- [ ] Update cookie secure flag
- [ ] Test SSO flow end-to-end
- [ ] Monitor server logs

---

**Note:** Fitur SSO sudah dikonfigurasi untuk bekerja di semua environment tanpa perlu perubahan kode. Cukup jalankan aplikasi di environment mana pun, dan callback URL akan otomatis menyesuaikan!
