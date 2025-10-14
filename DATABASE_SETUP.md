# Database Setup Instructions

## Prerequisites

1. PostgreSQL installed dan running
2. Database bernama `travel` sudah dibuat
3. User `postgres` dengan password `EDUJUANDA12345`

## Quick Setup

### Option 1: Using Migration SQL File

```bash
# Pastikan Anda di root project
cd /path/to/project

# Jalankan migration
psql -U postgres -d travel -f migrations/001_initial_setup.sql

# Atau menggunakan connection string
psql "postgresql://postgres:EDUJUANDA12345@localhost:5432/travel" -f migrations/001_initial_setup.sql
```

### Option 2: Using Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema ke database (untuk development)
npm run prisma:push

# Atau buat migration (untuk production)
npm run prisma:migrate
```

## Verify Setup

1. Check apakah tables sudah dibuat:

```bash
psql -U postgres -d travel -c "\dt"
```

Expected output:
- cities
- packages
- payments
- flight_packages
- users
- admins

2. Check sample data:

```bash
psql -U postgres -d travel -c "SELECT * FROM cities;"
psql -U postgres -d travel -c "SELECT * FROM packages;"
psql -U postgres -d travel -c "SELECT * FROM flight_packages;"
```

## Connection Test

Test koneksi dari aplikasi:

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
# Homepage harus menampilkan packages yang tersedia
```

## Prisma Studio

Untuk melihat dan mengedit data secara visual:

```bash
npm run prisma:studio

# Akan membuka browser di http://localhost:5555
```

## Troubleshooting

### Error: relation "cities" does not exist

Solution: Jalankan migration lagi
```bash
psql -U postgres -d travel -f migrations/001_initial_setup.sql
```

### Error: Can't reach database server

Solution:
1. Check apakah PostgreSQL running: `pg_isready`
2. Check connection string di `.env`
3. Check firewall settings

### Error: password authentication failed

Solution:
1. Check password di `.env`
2. Update password PostgreSQL jika berbeda
3. Check pg_hba.conf untuk authentication method

## Database Credentials

Jika Anda ingin menggunakan credentials berbeda:

1. Update `.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

2. Update `prisma/schema.prisma` jika diperlukan

3. Regenerate Prisma Client:
```bash
npm run prisma:generate
```

## Creating Admin User

Untuk membuat admin user pertama:

1. Visit http://localhost:3000/admin/setup
2. Masukkan email dan password
3. Submit form
4. Login di http://localhost:3000/admin/login

Atau menggunakan SQL:

```bash
# Generate password hash dulu (contoh untuk password: admin123)
# Jalankan di Node.js REPL atau buat script kecil
node -e "console.log(require('bcrypt').hashSync('admin123', 10))"

# Copy hash yang dihasilkan, lalu insert ke database
psql -U postgres -d travel -c "INSERT INTO admins (email, password, name) VALUES ('admin@example.com', 'PASTE_HASH_HERE', 'Admin');"
```
