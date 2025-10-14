# Travel Booking Website - NextJS + PostgreSQL + Prisma

Website travel booking fullstack menggunakan NextJS 15, PostgreSQL, dan Prisma ORM.

## Tech Stack

- **Frontend**: NextJS 15, React 19, TailwindCSS, shadcn/ui
- **Backend**: NextJS API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Custom Auth dengan bcrypt
- **Deployment**: Ready for Vercel/Any Node.js hosting

## Features

✅ **Public Features**
- Browse travel packages by city
- View package details with pricing
- Flight search and booking
- Payment flow dengan multiple bank options
- Responsive design untuk mobile dan desktop

✅ **Admin Features**
- Admin authentication
- Cities management (CRUD)
- Dashboard overview
- Manage packages, flights, destinations (placeholder)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Pastikan PostgreSQL sudah running, kemudian:

```bash
# Generate Prisma Client
npm run prisma:generate

# Setup database dengan migration
psql "postgresql://postgres:EDUJUANDA12345@localhost:5432/travel" -f migrations/001_initial_setup.sql

# Atau gunakan Prisma push untuk development
npm run prisma:push
```

Lihat [DATABASE_SETUP.md](./DATABASE_SETUP.md) untuk instruksi lengkap.

### 3. Environment Variables

File `.env` sudah dikonfigurasi:

```env
DATABASE_URL="postgresql://postgres:EDUJUANDA12345@localhost:5432/travel"
```

Sesuaikan dengan credentials PostgreSQL Anda jika berbeda.

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat website.

### 5. Create Admin Account

Visit [http://localhost:3000/admin/setup](http://localhost:3000/admin/setup) untuk membuat admin account pertama.

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build untuk production
npm run start            # Start production server
npm run lint             # Run linter

# Prisma commands
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema ke database (development)
npm run prisma:migrate   # Create migration (production)
npm run prisma:studio    # Open Prisma Studio (database GUI)
```

## Project Structure

```
├── src/
│   ├── app/                    # NextJS App Router
│   │   ├── api/               # API Routes
│   │   │   ├── admin/         # Admin auth endpoints
│   │   │   ├── cities/        # Cities CRUD
│   │   │   ├── packages/      # Packages CRUD
│   │   │   ├── flights/       # Flights CRUD
│   │   │   └── payments/      # Payments CRUD
│   │   ├── admin/             # Admin pages
│   │   ├── packages/          # Public package pages
│   │   └── flights/           # Public flight pages
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── sections/          # Section components
│   │   ├── packages/          # Package components
│   │   └── flights/           # Flight components
│   ├── lib/                   # Utility functions
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # Auth helpers
│   │   └── admin-auth.ts      # Admin auth
│   └── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma          # Prisma schema
├── migrations/                # SQL migrations
└── public/                    # Static files
```

## Database Schema

### Main Tables

- **cities** - Daftar kota destinasi
- **packages** - Paket perjalanan dengan relasi ke cities
- **payments** - Transaksi pembayaran
- **flight_packages** - Paket penerbangan
- **users** - User accounts
- **admins** - Admin accounts

Lihat [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) untuk detail lengkap.

## API Routes

### Public Endpoints

```
GET  /api/packages          # List all packages
GET  /api/packages/[id]     # Get package details
GET  /api/cities            # List all cities
GET  /api/flights           # List flights (with filters)
POST /api/payments          # Create payment
```

### Admin Endpoints

```
POST /api/admin/login       # Admin login
POST /api/admin/register    # Admin registration

POST   /api/cities          # Create city
PUT    /api/cities/[id]     # Update city
DELETE /api/cities/[id]     # Delete city

POST   /api/packages        # Create package
PUT    /api/packages/[id]   # Update package
DELETE /api/packages/[id]   # Delete package

# Similar endpoints for flights
```

## Development Guide

### Adding New Features

1. **Create Prisma Model** di `prisma/schema.prisma`
2. **Generate Prisma Client**: `npm run prisma:generate`
3. **Create API Routes** di `src/app/api/`
4. **Create Components** di `src/components/`
5. **Create Pages** di `src/app/`

### Database Management

```bash
# View data in Prisma Studio
npm run prisma:studio

# Create new migration
npm run prisma:migrate

# Reset database (development only)
npx prisma migrate reset
```

## Production Deployment

### 1. Build Application

```bash
npm run build
```

### 2. Setup Database

Jalankan migration di production database:

```bash
npx prisma migrate deploy
```

### 3. Deploy

Deploy ke platform pilihan (Vercel, Railway, dll):

```bash
# Vercel
vercel deploy

# Or any Node.js hosting
npm start
```

### Environment Variables untuk Production

```env
DATABASE_URL="your_production_database_url"
NODE_ENV="production"
```

## Migration from Supabase

Website ini telah dimigrasi dari Supabase ke PostgreSQL + Prisma. Lihat [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) untuk detail lengkap proses migrasi.

## Troubleshooting

### Build Errors

```bash
# Clear cache dan rebuild
rm -rf .next
npm run build
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check Prisma connection
npx prisma db pull
```

### Prisma Issues

```bash
# Regenerate Prisma Client
npm run prisma:generate

# Reset Prisma cache
rm -rf node_modules/.prisma
npm run prisma:generate
```

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## License

MIT License - feel free to use for personal and commercial projects.

## Support

Untuk issue atau pertanyaan:
1. Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
2. Check [DATABASE_SETUP.md](./DATABASE_SETUP.md)
3. Create GitHub issue

---

Built with ❤️ using NextJS + PostgreSQL + Prisma
