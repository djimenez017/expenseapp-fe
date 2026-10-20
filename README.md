# Expense Tracker

Next.js app. Accounts and expenses are stored in Supabase.

## Setup

1. Create a Supabase project.
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql) once.
3. Copy `.env.example` to `.env.local` and set:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   Use the anon key. Do not put the service role key in this app.

4. Under Authentication → Providers → Email, turn **Confirm email** off if a new account should go straight to adding an expense. Leave it on if signup should stop and ask the user to confirm first.

Requires Node.js 22 or newer.

## Scripts

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Login uses email. Username is saved on the profile and is not the login field.
