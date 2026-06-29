# ScholarMall Pro

A premium scholarship portal with admin CRUD, email notifications, and no sign-in required.

## Quick Start

```bash
cd scholarmall-pro
npm install
npm run dev
```

Open http://localhost:3000

**Admin Panel:** http://localhost:3000/secret-admin-portal  
**Password:** `scholarmall-admin-2026`

---

## CRITICAL: Vercel Will NOT Save Your Data

**Vercel serverless functions are stateless.** Every time a function runs, it starts fresh. Any JSON files written during one request will be gone on the next request. citeweb_search:17#0web_search:17#1web_search:17#7

### What This Means for You:
- Scholarships you add in admin → **DISAPPEAR** after the function restarts
- Applications submitted → **LOST** when the next person applies
- Contact messages → **GONE** after a few minutes

### Solution: Use a Real Database

You have 3 options:

---

## OPTION 1: Supabase (Recommended — FREE)

**Best for:** Free hosting with real database that persists forever.

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Name it `scholarmall`
5. Choose region closest to you
6. Click **"Create new project"**
7. Wait ~2 minutes for database to provision

### Step 2: Get Connection String
1. In your Supabase project, click **"Connect"** (top right)
2. Click **"ORMs and tools"**
3. Copy the **"Connection string"** (URI format)
4. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### Step 3: Create Tables
1. In Supabase, go to **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Paste this SQL and click **"Run"**:

```sql
-- Scholarships table
CREATE TABLE scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount TEXT NOT NULL,
  deadline DATE NOT NULL,
  eligibility TEXT NOT NULL,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id UUID REFERENCES scholarships(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  nationality TEXT NOT NULL,
  education_level TEXT NOT NULL,
  gpa TEXT NOT NULL,
  essay TEXT NOT NULL,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  admin_message TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 4: Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### Step 5: Update .env.local
```env
# Supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (email)
RESEND_API_KEY=re_YourActualApiKeyHere
RESEND_FROM_EMAIL=hello@yourdomain.com

# Admin
ADMIN_EMAIL=lenydaplug63@gmail.com
ADMIN_PASSWORD=scholarmall-admin-2026
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 6: Replace lib/db.ts
Replace the entire `lib/db.ts` with Supabase queries. See the Supabase docs for CRUD operations.

### Supabase Free Tier Limits
| Feature | Limit |
|---------|-------|
| Database | 500MB |
| File Storage | 1GB |
| Bandwidth | 5GB/month |
| Auth Users | 50,000/month |
| Projects | 2 active |
| **Cost** | **FREE** |

> Projects pause after 1 week of inactivity on free tier. Upgrade to Pro ($25/mo) to prevent pausing. citeweb_search:18#1web_search:18#2

---

## OPTION 2: Railway (Persistent Files)

**Best for:** Keeping your JSON file approach but with persistent storage.

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your ScholarMall repo
5. Railway auto-detects Next.js
6. Click **"Deploy"**

### Step 2: Add Environment Variables
1. In Railway dashboard, click your project
2. Go to **"Variables"** tab
3. Add all variables from `.env.local`

### Step 3: Persistent Storage (Optional but Recommended)
1. In Railway, go to **"Settings"** → **"Volumes"**
2. Click **"New Volume"**
3. Mount path: `/app/data`
4. This ensures your JSON files persist between restarts

### Railway Pricing
| Plan | Cost |
|------|------|
| Free Trial | $5 credit (enough for 1-2 months) |
| Hobby | ~$5-20/month depending on usage |
| Pro | $20/seat/month |

---

## OPTION 3: VPS (Full Control, Cheapest Long-Term)

**Best for:** Maximum control, lowest cost at scale.

### Recommended: DigitalOcean Droplet ($6/month)
1. Go to [digitalocean.com](https://digitalocean.com)
2. Create account, get $200 free credit
3. Create a **"Droplet"** (Basic, $6/month plan)
4. Choose Ubuntu 24.04
5. Choose datacenter region
6. Add SSH key (or use password)
7. Click **"Create Droplet"**

### Setup Commands
```bash
# SSH into your server
ssh root@your-droplet-ip

# Install Node.js
apt update && apt install -y nodejs npm nginx git

# Install PM2 globally
npm install -g pm2

# Clone your project
git clone https://github.com/YOUR-USERNAME/scholarmall-pro.git
cd scholarmall-pro

# Install dependencies
npm install

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "scholarmall" -- start

# Save PM2 config
pm2 save
pm2 startup

# Setup Nginx
nano /etc/nginx/sites-available/scholarmall
```

### Nginx Config
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/scholarmall /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Your app is now live at your server IP!
```

---

## RESEND EMAIL SETUP (Works on ALL Hosting Options)

### The Problem
`onboarding@resend.dev` only sends to test recipients. To email ANY address, you need a verified domain.

### Step 1: Buy a Domain
- Namecheap: ~$10/year
- Cloudflare: ~$9/year (recommended for DNS)
- GoDaddy: ~$12/year

### Step 2: Add Domain to Resend
1. Go to [resend.com/domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter: `scholarmall.com` (your domain)
4. Resend shows DNS records to add

### Step 3: Add DNS Records

#### If using Cloudflare (Recommended):
1. Log into [cloudflare.com](https://cloudflare.com)
2. Add your site → enter domain → select **Free Plan**
3. Cloudflare scans existing DNS → click **Continue**
4. Copy Cloudflare nameservers (e.g., `lara.ns.cloudflare.com`)
5. Go to your domain registrar → change nameservers to Cloudflare's
6. Back in Cloudflare, go to **DNS** → **Records** → **Add Record**

Add these records from Resend:

| Type | Name | Content | TTL | Proxy |
|------|------|---------|-----|-------|
| MX | `resend._domainkey` | `dkim.resend.com` | Auto | DNS Only (grey cloud) |
| TXT | `resend._domainkey` | `v=DKIM1; k=rsa; p=...` | Auto | DNS Only |
| TXT | `@` | `v=spf1 include:spf.resend.com ~all` | Auto | DNS Only |

> **IMPORTANT:** Turn OFF the orange cloud (proxy) for email records. They must be DNS Only. citeweb_search:16#0

### Step 4: Verify
1. Back in Resend, click **"Check DNS"**
2. Wait 15 min - 24 hours
3. Status changes to **"Verified"**

### Step 5: Update .env.local
```env
RESEND_FROM_EMAIL=hello@scholarmall.com
RESEND_API_KEY=re_your_new_api_key
```

### Resend Pricing
| Plan | Emails/Month | Cost |
|------|-------------|------|
| Free | 3,000 | $0 |
| Pro | 50,000 | $20/month |

---

## GITHUB INTEGRATION (Auto-Deploy)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/scholarmall-pro.git
git push -u origin main
```

### Step 2: Connect to Vercel (if using Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Vercel auto-detects Next.js
5. Add environment variables in project settings
6. Click **"Deploy"**
7. Every `git push` auto-deploys!

### Step 2: Connect to Railway (if using Railway)
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repo
4. Railway auto-deploys on every push

---

## FEATURES

| Feature | Status |
|---------|--------|
| No sign-in required | Browse & apply freely |
| Admin CRUD | Add, Edit, Delete scholarships |
| Application review | Accept/Reject with custom email message |
| Email notifications | Auto-sent via Resend |
| Contact form | Auto-reply + admin notification |
| Mobile responsive | Premium glass-morphism design |
| Real database | Supabase/Railway/VPS options |

---

## SUPPORT

Email: lenydaplug63@gmail.com


---

## 🔧 FIXES APPLIED (Latest Update)

### Problem 1: `ERR_INVALID_ARG_TYPE` — "Received undefined"
**Cause:** The GitHub API returned a 404 or a response with no `content` field when reading `data/*.json` files. The code then tried to call `Buffer.from(undefined, "base64")` which crashes.

**Fix in `lib/github-db.ts`:**
- Added guard check: `if (!data.content || typeof data.content !== "string") return [];`
- Removed the `await writeJsonToGitHub(filename, [], config)` on 404 — this was causing a secondary write error when credentials were also bad

### Problem 2: `Bad credentials` (401)
**Cause:** `GITHUB_TOKEN` was missing or invalid in `.env.local`.

**Fix:**
- Created `.env.local` template with clear instructions
- Improved error message: "Set GITHUB_TOKEN and GITHUB_REPO in .env.local or Admin Settings"

### Problem 3: Missing `data/` folder in GitHub repo
**Cause:** The app tries to read `data/scholarships.json`, etc. from your GitHub repo, but those files don't exist yet.

**Fix:**
- Included `setup.sh` script that creates these files automatically
- Included local `data/` folder with empty JSONs as fallback

---

## 🚀 Quick Start (After Downloading)

### Step 1: Get Your GitHub Token
1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Check ONLY: **[x] repo** (Full control of private repositories)
4. Click **"Generate token"** and COPY it immediately
5. Open `.env.local` and replace `ghp_YOUR_TOKEN_HERE` with your real token

### Step 2: Run Setup Script
```bash
bash setup.sh
```
This creates the `data/` folder and empty JSON files in your GitHub repo.

### Step 3: Install & Run
```bash
npm install
npm run dev
```

---

## ⚠️ Important Notes

1. **GitHub as Database:** This app stores all data as JSON files in your GitHub repo under `data/`. This is a workaround, not a real database. GitHub API has a 5,000 req/hour limit.

2. **For Production:** Switch to Supabase (free tier) or another real database. See the original README for Supabase setup instructions.

3. **Email:** The free Resend plan (`onboarding@resend.dev`) only sends to your own verified email. To send to anyone, you need a verified domain.


---

## 🗄️ Supabase Database (New!)

This version uses **Supabase** (PostgreSQL) instead of GitHub JSON files.

### Why Supabase?
- ✅ Data persists forever
- ✅ Works perfectly on Vercel
- ✅ Real database with queries, indexes, backups
- ✅ Free tier: 500MB database, 1GB storage
- ✅ No more "Bad credentials" or "file not found" errors

### Quick Setup
1. See `DEPLOY-TO-VERCEL.md` for full deployment guide
2. Run `supabase-setup.sql` in Supabase SQL Editor to create tables
3. Fill in `.env.local` with your Supabase credentials

### Files Changed
- `lib/db.ts` — Now uses Supabase client instead of GitHub API
- `lib/supabase.ts` — New Supabase client configuration
- `package.json` — Added `@supabase/supabase-js`
- Removed: `lib/github-db.ts`, `data/` folder, `setup.sh`
