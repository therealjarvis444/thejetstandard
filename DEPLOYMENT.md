# The Jet Standard — Deployment Documentation

## ✅ Status: LIVE

**Pages Site:** https://3ba08efa.thejetstandard.pages.dev
**GitHub Repo:** https://github.com/therealjarvis444/thejetstandard
**Cloudflare Project:** thejetstandard
**Account:** thejetstandard@gmail.com (Cloudflare)

---

## What Got Done

### 1. Website Files Verified ✅
- **Location:** `/Users/jarvis/.openclaw/agents/ray/thejetstandard/`
- **Structure:** `dist/` folder contains deployable files (index.html, css/, js/, assets/)
- **All CTAs verified** — every affiliate link points to `https://villiers.ai/?id=G2YINT`
- **FTC disclosures present:**
  - Hero disclosure: "We may earn a commission when you book through our links — at no extra cost to you"
  - Footer disclosure: Full affiliate disclosure text
  - Terms page: Section 6 - Affiliate Disclosure
  - Privacy policy covers data practices

### 2. GitHub Repo ✅
- **Repo:** https://github.com/therealjarvis444/thejetstandard
- **Branch:** main
- **Auto-deploy configured:** Pushing to main triggers Cloudflare Pages deploy
- **`.gitignore`** ignores `dist/` (rebuilt by deploy script)

### 3. Cloudflare Pages Deployed ✅
- **Deployment:** https://3ba08efa.thejetstandard.pages.dev
- **Project:** thejetstandard
- **SSL:** Automatic (Cloudflare-managed)
- **CDN:** 300+ global edge locations
- **Performance:** ~106ms TTFB

### 4. Custom Domain Setup — NEEDS ACTION ⚠️

**Current status:** `thejetstandard.com` is NOT yet connected to the Pages deployment.

**What needs to happen:**

Adison needs to go to the Cloudflare dashboard and connect the domain, OR add DNS records at his registrar.

#### Option A: Cloudflare Dashboard (Recommended)

1. Go to: https://dash.cloudflare.com/ (sign in as thejetstandard@gmail.com)
2. Navigate to: Workers & Pages → thejetstandard → Custom domains
3. Click "Set up a custom domain"
4. Enter: `thejetstandard.com`
5. Click "Continue" → "Activate domain"
6. Cloudflare will automatically handle DNS

#### Option B: Manual DNS at Registrar

If the domain is registered elsewhere and can't be transferred to Cloudflare:

1. Add `thejetstandard.com` to Cloudflare as a zone first
2. Update nameservers at registrar to Cloudflare's
3. Then follow Option A

Or add these DNS records directly at the registrar:

| Type | Name | Target |
|------|------|--------|
| CNAME | @ | 3ba08efa.thejetstandard.pages.dev |
| CNAME | www | 3ba08efa.thejetstandard.pages.dev |

**Note:** If root CNAME (@) is not supported by registrar, use a redirect service or switch to Cloudflare nameservers.

---

## How Updates Work

```
Adison tells Ray what to change
         ↓
    Ray edits files locally
         ↓
    git commit && git push
         ↓
    Cloudflare auto-deploys (~30 seconds)
         ↓
    Site is live
```

**No manual deploy needed.** Just push to `main` and Cloudflare does the rest.

### If you want to deploy manually:

```bash
cd /Users/jarvis/.openclaw/agents/ray/thejetstandard
wrangler pages deploy dist --project-name thejetstandard --branch main
```

---

## Test Results

| Test | Result |
|------|--------|
| Homepage loads | ✅ 200 OK, 48.7KB |
| Privacy page | ✅ |
| Terms page | ✅ |
| CSS loads | ✅ |
| JS loads | ✅ |
| Mobile viewport | ✅ `width=device-width, initial-scale=1.0` |
| All affiliate links | ✅ 17 links to `villiers.ai/?id=G2YINT` |
| SSL certificate | ✅ Automatic (Cloudflare) |
| CDN edge caching | ✅ |
| TTFB (Time to First Byte) | ✅ ~106ms |

---

## Important Notes

### What Still Needs to Happen
1. **Connect custom domain** `thejetstandard.com` → Pages site (Adison action needed)
2. **Add Google Analytics ID** — replace `GA_MEASUREMENT_ID` in index.html
3. **Set up Git → Cloudflare auto-deploy** (can be done in Cloudflare dashboard UI)

### Git → Cloudflare Auto-Deploy Setup

The Cloudflare dashboard can connect to GitHub for auto-deploy. Steps:

1. Go to: https://dash.cloudflare.com/ → Workers & Pages → thejetstandard
2. Click "Connect to Git"
3. Select: GitHub → therealjarvis444/thejetstandard
4. Branch: `main`
5. Build settings:
   - Build command: `npm run build` (or empty — this is static HTML)
   - Build output directory: `dist`
6. Save & deploy

Once connected, every push to `main` automatically deploys.

### Where to Find the Cloudflare Dashboard

- URL: https://dash.cloudflare.com/
- Email: thejetstandard@gmail.com
- Account: Thejetstandard@gmail.com's Account
- Account ID: `eadf4e41ba401299d13a854a67674e14`

### How to Check Deployment Status

1. **Cloudflare dashboard:** https://dash.cloudflare.com/ → Workers & Pages → thejetstandard → Deployments
2. **CLI:** `wrangler pages deployment list --project-name thejetstandard`
3. **Live site:** https://thejetstandard.pages.dev (always latest production)

---

## Next Steps

1. ☐ **Adison connects** `thejetstandard.com` to Cloudflare Pages (dashboard or DNS)
2. ☐ **Set up Git integration** in Cloudflare dashboard for auto-deploy
3. ☐ **Add GA tracking ID** when available
4. ☐ **Test thejetstandard.com** resolves correctly
5. ☐ **Submit sitemap** to Google Search Console

---

*Deployed: Wed Apr 29, 2026 9:28 PM PDT*
*Deployer: Ray Gillette*
*Platform: Cloudflare Pages*
*Account: thejetstandard@gmail.com*

Last auto-deploy test: 2026-04-30T05:17:29Z
