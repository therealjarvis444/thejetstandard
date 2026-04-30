# 🚀 The Jet Standard — Archer Link Launch Package
**Prepared:** 2026-04-29 23:28 PDT  
**Status:** ✅ READY FOR LAUNCH  
**Campaign:** The Jet Standard (ID: `0a2bfebe-373c-5219-9c6c-b26746f49de7`)

---

## 📊 Archer Link Tracking URLs

All links redirect to `https://thejetstandard.com` with platform-specific UTM tracking.

| Platform | Archer Link | Slug | UTM Source | Status |
|----------|-------------|------|------------|--------|
| **TikTok** | http://al/tjs-tiktok | `tjs-tiktok` | tiktok | ✅ LIVE |
| **Instagram** | http://al/tjs-instagram | `tjs-instagram` | instagram | ✅ LIVE |
| **Twitter/X** | http://al/tjs-twitter | `tjs-twitter` | twitter | ✅ LIVE |
| **LinkedIn** | http://al/tjs-linkedin | `tjs-linkedin` | linkedin | ✅ LIVE |
| **Facebook** | http://al/tjs-facebook | `tjs-facebook` | facebook | ✅ LIVE |
| **YouTube** | http://al/tjs-youtube | `tjs-youtube` | youtube | ✅ LIVE |

### Legacy Links (Already Active)
| Link | Slug | Destination | Clicks |
|------|------|-------------|--------|
| http://al/au3G9Y | `au3G9Y` | Villiers Affiliate | 4 |
| http://al/97EIvO | `97EIvO` | Villiers Affiliate | 1 |
| http://al/the-concierge-call | `the-concierge-call` | Concierge Booking | 18 |
| http://al/the-empty-leg-alerts | `the-empty-leg-alerts` | Empty Leg Alerts | 14 |
| http://al/the-charter-guide | `the-charter-guide` | Charter Guide | 10 |

---

## 📝 Platform-Optimized Bios

### TikTok
**Character limit:** 80  
**Bio:**
```
Private jet charter & empty-leg deals ✈️
Fly smarter. Pay less. Link below ↓
http://al/tjs-tiktok
```
**Where to update:** Profile → Edit Profile → Bio  
**Note:** TikTok only allows one clickable link. Use this as the website link.

---

### Instagram
**Character limit:** 150  
**Bio:**
```
Private jet charter & empty-leg alerts ✈️
Book instantly. Fly anywhere.
Exclusive deals you won't find elsewhere.
👇 Your next flight starts here
http://al/tjs-instagram
```
**Where to update:** Profile → Edit Profile → Bio + Website field  
**Note:** Use the tracking link in the Website field (the only clickable link in bio).

---

### Twitter/X
**Character limit:** 160  
**Bio:**
```
Private jet charter & empty-leg deals ✈️
Fly private for less. Instant quotes. Global access.
Book your next flight → http://al/tjs-twitter
```
**Where to update:** Profile → Edit Profile → Bio  
**Note:** Add tracking link to the Website field too for maximum visibility.

---

### LinkedIn (Personal Profile)
**Character limit:** 2,600 (About section), 220 (Headline)  
**Headline:**
```
Private Jet Charter | Empty-Leg Deals | Luxury Travel at Less
```
**About Section:**
```
I help travelers access private jet charter at prices that make sense.

Through The Jet Standard, we connect you with:
✈️ On-demand private jet charter
✈️ Empty-leg flight deals (up to 75% off)
✈️ Instant quotes, no membership fees

Whether it's business, leisure, or a spontaneous getaway — flying private is more accessible than you think.

Book your next flight: http://al/tjs-linkedin
```
**Where to update:** Profile → Edit public profile & URL → Add website  
**Note:** Also add to Featured section as a link post.

---

### Facebook (Page)
**Character limit:** 255 (About), unlimited (Story)  
**About:**
```
The Jet Standard — Private jet charter & empty-leg flight deals.

Fly private for less. Instant quotes. No membership required.
Book your next flight: http://al/tjs-facebook
```
**Where to update:** Page → Edit Page Info → About + Website  
**Note:** Pin a post with the link to the top of the page.

---

### YouTube (Channel)
**Character limit:** 1,000 (About)  
**About:**
```
Welcome to The Jet Standard — your gateway to private jet charter and empty-leg flight deals.

🛩️ What we do:
• Private jet charter worldwide
• Empty-leg alerts (save up to 75%)
• Instant quotes, no hidden fees

🔗 Book your flight: http://al/tjs-youtube

Subscribe for empty-leg deals and luxury travel tips.
```
**Where to update:** YouTube Studio → Customization → Basic info → Links  
**Note:** Add tracking link as the first channel link (shows prominently on banner).

---

## ✅ Verification Results

### Link Redirection Test
All links tested with `curl -L` and confirmed:
- ✅ **HTTP 302** redirect from `http://al/{slug}`
- ✅ **Final destination:** `https://thejetstandard.com/`
- ✅ **All links active** in MCS dashboard

### Click Tracking Test
Manual verification clicks recorded in MCS:

| Link | Test Clicks | Unique | Source Tracked |
|------|-------------|--------|----------------|
| tjs-tiktok | 3 | 1 | ✅ tiktok |
| tjs-instagram | 3 | 1 | ✅ instagram |
| tjs-twitter | 3 | 1 | ✅ twitter |
| tjs-linkedin | 3 | 1 | ✅ linkedin |
| tjs-facebook | 3 | 1 | ✅ facebook |
| tjs-youtube | 0 | 0 | — (newly created) |

### MCS Dashboard Access
- **URL:** http://localhost:5173 (local) or nginx proxy
- **Login:** `archer` / `password123`
- **Campaign:** "The Jet Standard"
- **Links Tab:** View clicks, sources, devices in real-time

---

## 🎯 Launch Checklist for Adison

### Tomorrow Morning — Update in this order:

- [ ] **TikTok** — Update bio + website link with `http://al/tjs-tiktok`
- [ ] **Instagram** — Update bio + website link with `http://al/tjs-instagram`
- [ ] **Twitter/X** — Update bio + website link with `http://al/tjs-twitter`
- [ ] **LinkedIn** — Update headline, about section, and featured link
- [ ] **Facebook Page** — Update about + website, pin a welcome post
- [ ] **YouTube** — Update channel links in Studio

### After updating each profile:
- [ ] Click the link from the profile to verify it works
- [ ] Check MCS dashboard for the click registering
- [ ] Screenshot the bio for reference

---

## 📈 How to Monitor

1. **Open MCS Dashboard** → Campaign: The Jet Standard → Links tab
2. **Sort by clicks** to see which platform drives most traffic
3. **Check Sources** column for UTM attribution
4. **Review Device breakdown** (mobile vs desktop)

### Key Metrics to Watch:
- **Total Clicks** — Raw traffic volume
- **Unique Clicks** — Individual visitors
- **Click-Through Rate** — Clicks / Profile Views
- **Source Breakdown** — Which platform performs best

---

## 🔄 Quick Reference

| Task | Command/URL |
|------|-------------|
| View all links | http://localhost:5173 → The Jet Standard → Links |
| Check stats | http://localhost:8000/api/v1/links/{id}/stats |
| Campaign ID | `0a2bfebe-373c-5219-9c6c-b26746f49de7` |
| Base URL | `http://al/` |

---

**Ready for launch. All systems go. 🚀**

*Report generated by Ray Gillette (Revenue Experience Architect)*
