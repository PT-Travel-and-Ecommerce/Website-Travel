# Travel Agency Website - Replit Project

## Overview
This is a full-stack travel agency website built with Next.js 15, Prisma ORM, and Neon PostgreSQL. The application allows users to browse travel packages, flight options, and make bookings.

## Recent Changes (October 13, 2025)
- ✅ Successfully migrated from Supabase to Replit Neon PostgreSQL
- ✅ Configured Prisma ORM with PostgreSQL database
- ✅ Removed incorrect Drizzle configuration (server/db.ts)
- ✅ Pushed database schema to Neon PostgreSQL
- ✅ Seeded database with sample data:
  - 6 cities (Jakarta, Bandung, Yogyakarta, Bali, Surabaya, Medan)
  - 4 flight routes with complete fare breakdown
  - 3 bank accounts for payments
  - 3 customer reviews
  - 1 admin user (admin@example.com / Admin123!)
- ✅ Fixed translation keys (added viewMore/viewLess to reviews)
- ✅ Created popular-packages API endpoint
- ✅ Fixed bank-accounts API (corrected field name to displayOrder)
- ✅ All pages tested and working correctly
- ✅ Build completed successfully (npm run build)

## Project Architecture

### Technology Stack
- **Frontend**: Next.js 15 with React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL (Replit-hosted)
- **ORM**: Prisma
- **Authentication**: Custom auth with bcrypt

### Database Schema
- **cities**: Travel destination cities
- **packages**: Travel packages linked to cities
- **payments**: Payment/booking records
- **flight_packages**: Flight options
- **users**: Customer accounts
- **admins**: Admin accounts
- **hero_banners**: Homepage banners
- **customer_reviews**: Customer testimonials
- **popular_destinations**: Featured destinations

### Key Files
- `prisma/schema.prisma`: Database schema definition
- `src/lib/prisma.ts`: Prisma client singleton
- `src/app/api/*`: API route handlers
- `package.json`: Dependencies and scripts

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (configured)
- Admin credentials: admin@example.com / Admin123!

## Development Commands

```bash
# Start development server
npm run dev

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed database
npm run db:seed

# Open Prisma Studio
npm run prisma:studio
```

## User Preferences
- Project uses Indonesian language for content
- Already fully migrated from Supabase
- Uses Prisma ORM (not Drizzle)

## Testing Summary (October 13, 2025)
- ✅ All pages load correctly (Home, Flights, Admin Login)
- ✅ All API endpoints working:
  - /api/settings ✓
  - /api/cities ✓
  - /api/flight-routes ✓
  - /api/reviews ✓
  - /api/bank-accounts ✓
  - /api/popular-packages ✓
- ✅ Translation system working (Indonesian & English)
- ✅ Production build successful
- ✅ No critical errors or bugs

## Next Steps
- Application is ready for development and deployment
- Admin dashboard available at /admin/login
- Sample data is loaded and ready to use
- Consider adding:
  - Automated API tests for regression prevention
  - Request validation for mutation endpoints
  - Authentication guards for admin routes
