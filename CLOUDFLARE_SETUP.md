# Cloudflare Pages Deployment Setup

## Current Status
✅ Website files ready (dist/ built)
✅ GitHub repo connected (therealjarvis444/thejetstandard)
⬜ Cloudflare Pages project creation
⬜ DNS configuration
⬜ Custom domain binding

---

## Step 1: Authenticate Wrangler

```bash
# In terminal, run:
wrangler login
```
This opens a browser window to authorize Cloudflare access.

---

## Step 2: Create Cloudflare Pages Project

### Option A: Via Wrangler CLI (Recommended)
```bash
cd /Users/jarvis/.openclaw/agents/ray/thejetstandard

# Create the project
wrangler pages project create thejetstandard --production-branch=main

# Deploy initial build
wrangler pages deploy dist --project-name=thejetstandard --branch=main
```

### Option B: Via Cloudflare Dashboard
1. Go to https://dash.cloudflare.com/
2. Navigate to **Workers & Pages** → **Pages**
3. Click **Create a project**
4. Select **Upload assets** directly
5. Name: `thejetstandard`
6. Upload the `dist/` folder contents

---

## Step 3: Configure GitHub Action Secrets

In GitHub repo settings, add these secrets:

| Secret Name | Value Source |
|------------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dash → **My Profile** → **API Tokens** → Create token with **Cloudflare Pages:Edit** permission |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dash → right sidebar shows Account ID |

### API Token Required Permissions:
- Zone:Read (for DNS)
- Account:Read
- Cloudflare Pages:Edit

---

## Step 4: DNS Records for thejetstandard.com

Adison needs to add these at his domain registrar (wherever he bought thejetstandard.com):

### Option A: Full Cloudflare DNS (Recommended)
Change nameservers to Cloudflare's:
- `alexa.ns.cloudflare.com`
- `greg.ns.cloudflare.com`

Then Cloudflare manages all DNS automatically.

### Option B: Manual DNS Records
If keeping existing DNS provider, add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 192.0.2.1 | Auto |
| CNAME | www | thejetstandard.pages.dev | Auto |

**Note:** The A record IP above is a placeholder. After Cloudflare Pages project is created, the actual Cloudflare IPs will be provided in the dashboard. Typically:
- Cloudflare Pages apex domains use A records pointing to Cloudflare edge IPs
- Or use CNAME flattening if provider supports it

---

## Step 5: Bind Custom Domain in Cloudflare

1. Cloudflare Dashboard → Pages → thejetstandard → **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `thejetstandard.com`
4. Cloudflare will verify DNS and issue SSL certificate automatically
5. Repeat for `www.thejetstandard.com` (redirects to apex)

---

## Deployment Workflow

### Manual Deploy (Now):
```bash
./deploy-cloudflare.sh
```

### Auto Deploy (Future):
Push to `main` branch → GitHub Action triggers → Auto-deploys to Cloudflare Pages

---

## Affiliate Link Verification

All CTAs should route to: `https://villiers.ai/?id=G2YINT`

Verified in:
- [ ] index.html hero CTA
- [ ] index.html floating nav CTA
- [ ] index.html comparison section CTA
- [ ] index.html FAQ CTA
- [ ] thank-you.html redirect

---

## Post-Launch Checklist

- [ ] Cloudflare Pages project created
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] DNS propagated (check with dig/nslookup)
- [ ] Affiliate links working
- [ ] Mobile responsive verified
- [ ] Cookie consent functioning
- [ ] Privacy policy accessible
- [ ] Analytics receiving events
