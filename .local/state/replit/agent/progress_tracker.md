[x] 1. Install the required packages
[x] 2. Restart the workflow to see if the project is working
[x] 3. Migrate Supabase to Neon Postgres
  [x] 1. Move Supabase client calls to the server, use server-side PostgreSQL queries with Prisma (already done)
  [x] 2. Port Supabase Edge Functions into a server route (already done)
  [x] 3. Secure API keys & env vars (DATABASE_URL configured)
  [x] 4. Push the database schema using Prisma `npx prisma db push`
  [x] 5. Remove Supabase code (project already uses Prisma)
[x] 4. Verify the project is working using screenshot
[x] 5. Inform user the import is completed and they can start building, mark the import as completed using the complete_project_import tool