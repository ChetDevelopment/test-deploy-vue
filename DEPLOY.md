# Deploy to Vercel - One Command

## Quick Deploy

### Option 1: Using npm script
```bash
npm run deploy
```

### Option 2: Using Node.js script
```bash
node deploy.js
```

### Option 3: Using PowerShell (Windows)
```powershell
.\deploy.ps1
```

---

## What This Script Does

1. ✅ Checks/installs Vercel CLI
2. ✅ Logs you into Vercel
3. ✅ Deploys your backend
4. ✅ Prompts for database connection string
5. ✅ Adds environment variable to Vercel
6. ✅ Creates database tables automatically
7. ✅ Redeploys with database connected

---

## Before Running

### 1. Create Vercel Account (one time)
Go to https://vercel.com and sign up

### 2. Have Database Connection String Ready
You'll need to create a database first:

1. Go to https://vercel.com/new
2. Click **Storage** → **Add Database**
3. Choose **Neon** (recommended) or **Vercel Postgres**
4. Click **Create Database**
5. Copy the **connection string**

The script will prompt you to paste it during deployment.

---

## After Deployment

Your API will be live at:
```
https://YOUR-PROJECT.vercel.app/api/users
```

### Test Your API

**Get all users:**
```bash
curl https://YOUR-PROJECT.vercel.app/api/users
```

**Create a user:**
```bash
curl -X POST https://YOUR-PROJECT.vercel.app/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John\",\"age\":30,\"email\":\"john@example.com\"}"
```

**Get user by ID:**
```bash
curl https://YOUR-PROJECT.vercel.app/api/users/1
```

---

## Redeploy Later

After the first deployment, just run:
```bash
vercel --prod
```

Or push to Git (if connected):
```bash
git push
```

---

## Files

| File | Purpose |
|------|---------|
| `deploy.js` | Node.js deployment script |
| `deploy.ps1` | PowerShell deployment script |
| `vercel.json` | Vercel configuration |
| `schema.sql` | Database schema |
| `.env.example` | Environment variables template |

---

## Troubleshooting

### "vercel: command not found"
```bash
npm install -g vercel
```

### Database connection error
- Check connection string is correct
- Ensure `POSTGRES_URL` is set in Vercel dashboard
- Redeploy: `vercel --prod`

### Table doesn't exist
Run manually:
```bash
node temp-init-db.js
```
(Or create table via Neon dashboard SQL editor)

---

## Support

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
