# laurela.com SEO Setup Guide

## Current Status Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Google Search Console | Verified | Meta tag in layout.tsx |
| Bing Webmaster | Verified | Meta tag in layout.tsx |
| IndexNow (Yandex/Bing) | Active | Auto-ping on news sync |
| Dynamic Sitemap | Active | Predictions + News |
| RSS Feed | Active | /rss endpoint |
| JSON-LD (News) | Active | NewsArticle schema |
| JSON-LD (Predictions) | Active | Article schema |
| OG/Twitter Meta (News) | Active | Dynamic per article |
| OG/Twitter Meta (Predictions) | Active | Dynamic per prediction |
| Share Buttons (News) | Active | Telegram, Facebook |
| Share Buttons (Predictions) | Active | Telegram, Facebook, X, Copy |

---

## 1. Google & Bing Verification

Added to `frontend/app/layout.tsx` metadata:
```typescript
verification: {
  google: 'eew01iLJ1tIGO97go29dMHO_N7fwiLMw5cwxxg7Iuf8',
  other: {
    'msvalidate.01': 'DBF2085FEDD8CDB457C1618B07E65EE1',
  },
},
```

## 2. IndexNow Setup

IndexNow instantly notifies Yandex and Bing about new content.

### Files:
- **Verification file**: `frontend/public/laurelacom20260116.txt` (contains the key)
- **Backend config**: `backend/.env` → `INDEXNOW_KEY=laurelacom20260116`

### How it works:
The `/api/news/sync` endpoint automatically pings IndexNow when new articles are synced.

**Implementation** (`backend/main.py`):
- `ping_indexnow()` function sends POST to both Yandex and Bing
- Called automatically after each successful sync
- Returns synced URLs in API response

### Test verification file:
```bash
curl https://www.laurela.com/laurelacom20260116.txt
# Should return: laurelacom20260116
```

### Test sync with IndexNow:
```bash
curl http://localhost:8024/api/news/sync
# Response includes: {"synced": 2, "urls": ["https://www.laurela.com/news/..."]}
```

### Check logs for ping status:
```bash
sudo journalctl -u laurela-backend --since "5 minutes ago" | grep IndexNow
# IndexNow Yandex: 200
# IndexNow Bing: 200
```

## 3. Sitemap

### Location:
`https://www.laurela.com/sitemap.xml`

### Dynamic content includes:
- Static pages (/, /about, /faq, /news, /privacy, /terms)
- All prediction pages (`/prediction/[slug]`)
- All news article pages (`/news/[slug]`)

### Implementation:
`frontend/app/sitemap.ts` fetches from `/api/predictions` and `/api/news`

Note: Google deprecated their sitemap ping endpoint in 2023. Google discovers sitemaps via robots.txt and Search Console only.

## 4. RSS Feed

### URL:
`https://www.laurela.com/rss`

### Content includes:
- News articles (with source, category)
- Predictions (with current probability)

### Auto-discovery in `layout.tsx`:
```typescript
alternates: {
  types: {
    'application/rss+xml': 'https://www.laurela.com/rss',
  },
},
```

### Submit to:
- Yandex Webmaster (Turbo pages / RSS)
- Yandex Zen (if applicable)
- Any RSS aggregators

## 5. Structured Data (JSON-LD)

### Root Layout (`/`):
- `Organization` schema
- `WebSite` schema

### News Article Page (`/news/[slug]`):
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Article title",
  "datePublished": "2026-01-17T12:00:00",
  "author": { "@type": "Organization", "name": "Source name" },
  "publisher": { "@type": "Organization", "name": "Laurela" },
  "image": "https://...",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.laurela.com/news/slug" }
}
```

### Prediction Page (`/prediction/[id]`):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Prediction question",
  "description": "Current probability: X%",
  "author": { "@type": "Organization", "name": "Laurela" },
  "publisher": { "@type": "Organization", "name": "Laurela" },
  "datePublished": "2026-01-17",
  "dateModified": "2026-01-22",
  "about": { "@type": "Thing", "name": "Probabilistic Prediction" }
}
```

### News Listing Page (`/news`):
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Latest News - Laurela",
  "url": "https://www.laurela.com/news"
}
```

### Validate:
https://search.google.com/test/rich-results

## 6. Cronjob Setup

### Pull news automatically:
```bash
crontab -e
```

Add line (runs every 60 minutes):
```bash
0 * * * * curl -s http://localhost:8024/api/news/sync >> /var/log/laurela-news-sync.log 2>&1
```

### What the sync endpoint does:
1. Pulls articles from `coollinks.pipeline_articles` where `site='laurela.com'` and `status='ready'`
2. Generates SEO-friendly slugs from titles
3. Inserts into `laurela_public.news` table
4. Marks source articles as `status='pulled'` with `pulled_at=NOW()`
5. Pings IndexNow (Yandex + Bing) for new URLs
6. Returns list of synced URLs

### Manual sync:
```bash
curl http://localhost:8024/api/news/sync
```

## 7. Social Sharing

### Share buttons on news articles (`/news/[slug]`):
- Telegram share button
- Facebook share button

### Share buttons on predictions (`/prediction/[id]`):
- Telegram share button
- Facebook share button
- X (Twitter) share button
- Copy link button

### Homepage CTA section:
- LinkedIn: https://www.linkedin.com/company/laurela/
- Facebook: https://www.facebook.com/groups/bosscc
- RSS: /rss

### Footer social icons:
- LinkedIn: https://www.linkedin.com/company/laurela/
- Facebook: https://www.facebook.com/groups/bosscc
- RSS: /rss

### JSON-LD sameAs:
```typescript
sameAs: [
  'https://www.linkedin.com/company/laurela/',
  'https://www.facebook.com/groups/bosscc',
],
```

## 8. News Feature

### Pages:
- `/news` - News listing with grid layout, images, sources
- `/news/[slug]` - Individual article page with full content, share buttons, source link

### API Endpoints:
- `GET /api/news?limit=50` - List news articles
- `GET /api/news/{slug}` - Single article by ID or slug
- `GET /api/news/sync` - Pull new articles and ping IndexNow

### Database:
- Source: `coollinks.pipeline_articles` (where `site='laurela.com'`)
- Destination: `laurela_public.news`

### Image Handling:
Images are pulled from `coollinks.pipeline_articles.image_url`. If no images appear:
1. Check that your news pipeline extracts and saves `image_url` for each article
2. Run: `SELECT id, title, image_url FROM coollinks.pipeline_articles WHERE site='laurela.com' LIMIT 10;`
3. If `image_url` is NULL, update your pipeline to extract images from articles

## 9. Target Keywords & SEO Strategy

### Primary Keywords (Homepage):
- AI predictions
- Probabilistic forecasting
- Prediction tracking
- Machine learning predictions
- Daily probability updates

### Prediction Page Keywords (Dynamic):
- [Topic] prediction
- [Topic] probability
- Will [event] happen
- [Topic] forecast 2026
- [Topic] likelihood

### News Page Keywords:
- Latest news [topic]
- [Topic] news today
- Breaking [topic] news

### URL Structure:
| Page | URL Pattern | SEO Notes |
|------|-------------|-----------|
| Home | `/` | Main keywords in title/description |
| Predictions | `/prediction/[id]` | Question becomes H1, probability in meta |
| News List | `/news` | Collection page schema |
| News Article | `/news/[slug]` | SEO-friendly slug from title |
| About | `/about` | Static content, methodology keywords |
| FAQ | `/faq` | Question-answer format |

### Content Recommendations:
1. **Prediction Questions**: Write as natural questions people would search for
   - Good: "Will the US Federal Reserve cut interest rates before June 2026?"
   - Bad: "Fed rate cut Q2"

2. **News Titles**: Keep original titles, they're already optimized by publishers

3. **Descriptions**: Include probability percentage for engagement
   - "Current probability: 65% - Track daily updates and signals"

## 10. Quick Checklist

- [x] Google Search Console verification meta tag
- [x] Bing Webmaster verification meta tag
- [x] Dynamic sitemap with predictions + news
- [x] RSS feed with news + predictions
- [x] IndexNow auto-ping on sync
- [x] JSON-LD on all pages (Organization, WebSite, NewsArticle, Article)
- [x] OG/Twitter meta tags on predictions
- [x] OG/Twitter meta tags on news articles
- [x] Share buttons on article pages (Telegram, Facebook)
- [x] Share buttons on prediction pages (Telegram, Facebook, X, Copy)
- [x] Social links on homepage (LinkedIn, Facebook, RSS)
- [x] Footer social icons (LinkedIn, Facebook, RSS)
- [x] News section on homepage (4 latest articles)
- [x] Individual news article pages for SEO
- [x] Server-side rendering for prediction pages (metadata)
- [ ] Submit sitemap to search engines
- [ ] Submit RSS to Yandex
- [ ] Setup cronjob for auto-sync
- [ ] Test with Google Rich Results
- [ ] Generate OG images for predictions (future enhancement)
- [ ] Add news images to pipeline (if missing)

## 11. Deploy Commands

```bash
# On server2 after git pull:

# Backend
cd /usr/local/www/laurela.com/server2/backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart laurela-backend

# Frontend
cd /usr/local/www/laurela.com/server2/frontend
NEXT_PUBLIC_API_URL=https://www.laurela.com npm run build
sudo systemctl restart laurela-frontend
```

## 12. Future SEO Enhancements

### Priority 1:
- [ ] Dynamic OG images with probability gauge visualization
- [ ] Add images to news pipeline if missing
- [ ] Implement canonical URLs for duplicate content

### Priority 2:
- [ ] Add FAQ schema to /faq page
- [ ] Implement breadcrumb schema
- [ ] Add HowTo schema to /methodology page

### Priority 3:
- [ ] Implement AMP pages for news
- [ ] Add video schema if videos are added
- [ ] Implement review/rating schema for predictions
