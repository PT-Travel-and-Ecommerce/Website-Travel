# Travel Agency Website - Replit Project

## Overview
This is a full-stack travel agency website built with Next.js 15, Prisma ORM, and Neon PostgreSQL. The application allows users to browse travel packages, flight options, and make bookings.

## Recent Changes

### October 17, 2025 - Admin Payment Management
- ✅ Added "Kelola Pembayaran" menu in admin dashboard sidebar
- ✅ Created comprehensive payment management page (`/admin/dashboard/payments`)
- ✅ Features implemented:
  - View all payments with detailed flight route information
  - Filter payments by status (all, pending, paid/lunas, cancelled)
  - Manually update payment status
  - Upload and view payment proof images
  - Delete payment records
- ✅ Integration with existing API endpoints (`/api/payments`, `/api/upload`)
- ✅ Secure admin-only access with authentication checks
- ✅ Responsive UI with modal dialogs for payment details
- ✅ Client-side filtering for instant results

**How to Use:**
1. Login to admin dashboard at `/admin/login` (admin@example.com / Admin123!)
2. Navigate to "Kelola Pembayaran" menu
3. View payment list with filter options
4. Click "Detail" to manage individual payments
5. Update status, upload proof, or delete as needed

### October 16, 2025 - SSO Integration
- ✅ Added SSO authentication from Darulgs (https://ssoauth.darulgs.co.id)
- ✅ Created User model in Prisma with SSO fields (ssoUserId, username, phoneNumber, lastLogin)
- ✅ Implemented SSO callback route (`/api/auth/callback`)
- ✅ Created SSO auth utilities (`src/lib/sso-auth.ts`)
- ✅ Updated booking page to check login and redirect to SSO
- ✅ Added `/api/auth/me` endpoint for session verification
- ✅ Fixed open redirect vulnerability with URL validation
- ✅ Fixed httpOnly cookie detection issue with non-httpOnly email flag

**Security Note**: Current session management uses cookies without signing/encryption. For production:
- Implement signed JWT tokens or server-managed sessions
- Add session verification against database
- Consider using established auth libraries (NextAuth.js, Lucia, etc.)

### October 13, 2025 - Database Migration
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
- **Authentication**: 
  - Admin: Custom auth with bcrypt
  - Users: SSO from Darulgs (https://ssoauth.darulgs.co.id)

### Database Schema
- **cities**: Travel destination cities
- **flight_routes**: Flight routes with fare breakdown
- **payments**: Payment/booking records
- **users**: Customer accounts (SSO-enabled)
- **admins**: Admin accounts
- **customer_reviews**: Customer testimonials
- **site_settings**: Site configuration
- **bank_accounts**: Payment bank accounts
- **popular_flight_routes**: Featured flight routes

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

## SSO Integration Details

### How SSO Works
1. User clicks "Pay Now" on booking page (`/flights/:id/book`)
2. If not logged in, redirects to Darulgs SSO: `https://ssoauth.darulgs.co.id/login?redirectUrl=...`
3. After successful login, SSO redirects back to `/auth/callback?code=...`
4. Callback validates code, creates/updates user in database
5. Sets session cookies and redirects user back to booking page
6. User can now complete payment

### SSO Files
- `src/lib/sso-auth.ts`: Client-side auth utilities
- `src/app/api/auth/callback/route.ts`: SSO callback handler
- `src/app/api/auth/me/route.ts`: Session verification endpoint
- User model in `prisma/schema.prisma`: Includes SSO fields

### Security Considerations
- Open redirect protection: URLs are validated
- HttpOnly cookies for session data
- Non-httpOnly email flag for client-side login detection
- ⚠️ **TODO**: Implement signed tokens or server-managed sessions for production

## Next Steps
- Application is ready for development and deployment
- Admin dashboard available at /admin/login
- SSO login integrated for user authentication
- Sample data is loaded and ready to use
- Consider adding:
  - Signed/encrypted session tokens (JWT or similar)
  - Automated API tests for regression prevention
  - Request validation for mutation endpoints
  - Rate limiting for API endpoints
