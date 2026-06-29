# 🚀 Deploy ScholarMall to Vercel with Supabase

## Step 1: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up with GitHub
2. Click **"New Project"**
   - Name: `scholarmall`
   - Database Password: (create a strong one, save it)
   - Region: Choose closest to your users
3. Wait ~2 minutes for provisioning
4. Go to **Project Settings → API**
5. Copy:
   - **Project URL** → paste into `.env.local` as `SUPABASE_URL`
   - **service_role secret** → paste into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`
   > ⚠️ Use `service_role` key, NOT `anon` key — the app needs admin access to read/write all data

## Step 2: Create Database Tables (2 minutes)

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open `supabase-setup.sql` from this project
4. Paste ALL of it and click **"Run"**
5. This creates all 3 tables + seed data + security policies

## Step 3: Test Locally

```bash
npm install
npm run dev
```

Go to http://localhost:3000 — scholarships should load from Supabase!

Admin: http://localhost:3000/secret-admin-portal
Password: `scholarmall-admin-2026`

## Step 4: Push to GitHub

```bash
git init
git add .
git commit -m "Migrate to Supabase"
git branch -M main
git remote add origin https://github.com/Leny848/scholarmall.git
git push -u origin main
```

## Step 5: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your `scholarmall` repo
5. Vercel auto-detects Next.js — keep defaults
6. Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | `https://your-project-ref.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...your-key...` |
| `RESEND_API_KEY` | `re_...` |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` |
| `ADMIN_EMAIL` | `lenydaplug63@gmail.com` |
| `ADMIN_PASSWORD` | `scholarmall-admin-2026` |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` |

7. Click **"Deploy"**
8. Wait ~2 minutes
9. Your app is live! 🎉

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard → your project → **Domains**
2. Add your domain (e.g., `scholarmall.com`)
3. Follow DNS instructions
4. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Missing SUPABASE_URL" | Check env vars in Vercel project settings |
| "relation does not exist" | Run `supabase-setup.sql` in SQL Editor |
| "new row violates row-level security" | Run the RLS policies in `supabase-setup.sql` |
| "Invalid API key" | Use `service_role` key, not `anon` key |
| Emails not sending | Check Resend API key; free plan only sends to verified emails |

## Supabase Free Tier Limits

| Feature | Limit |
|---------|-------|
| Database | 500 MB |
| File Storage | 1 GB |
| Bandwidth | 5 GB/month |
| **Cost** | **FREE** |

> Projects pause after 1 week of inactivity. Click "Resume" in dashboard to wake it up.
