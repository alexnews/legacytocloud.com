# Search Engines Webmaster Setup (Template)

**Copy this guide to any Next.js 14+ project**

---

## Step 1: Update layout.tsx

Add to `src/app/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#YOUR_COLOR",  // Your brand color
};

export const metadata: Metadata = {
  metadataBase: new URL("https://YOUR_DOMAIN.com"),

  title: {
    default: "Your Site Title",
    template: "%s | Your Site",
  },

  description: "Your site description for search engines (150-160 chars)",

  keywords: ["keyword1", "keyword2", "keyword3"],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "ru_RU",  // or "en_US"
    url: "https://YOUR_DOMAIN.com",
    siteName: "Your Site",
    title: "Your Site Title",
    description: "Description for social sharing",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Site preview image",
      },
    ],
  },

  // ====== SEARCH ENGINE VERIFICATION ======
  verification: {
    google: "GOOGLE_CODE",
    yandex: "YANDEX_CODE",
    other: {
      "msvalidate.01": "BING_CODE",
      "mailru-verification": "MAILRU_CODE",
    },
  },
};
```

---

## Step 2: Create HTML Verification Files

Create these files in `public/` folder:

### Google: `public/googleXXXXXXXXXXXXXXXX.html`
```
google-site-verification: googleXXXXXXXXXXXXXXXX.html
```
*(Replace X's with your actual code from Google)*

### Yandex: `public/yandex_XXXXXXXXXXXXXXXX.html`
```html
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body>Verification: XXXXXXXXXXXXXXXX</body>
</html>
```
*(Replace X's with your actual code from Yandex)*

### Bing (optional): `public/BingSiteAuth.xml`
Download from Bing Webmaster Tools, or use meta tag method.

---

## Step 3: Create robots.txt

Create `public/robots.txt`:

```
# YOUR_SITE_NAME
# https://YOUR_DOMAIN.com

User-agent: *
Allow: /

# Block admin/private areas
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Sitemap
Sitemap: https://YOUR_DOMAIN.com/sitemap.xml

# Crawl delay
Crawl-delay: 1

# Yandex specific
User-agent: Yandex
Allow: /
Crawl-delay: 2

# Google specific
User-agent: Googlebot
Allow: /
```

---

## Step 4: Create Dynamic Sitemap

Create `src/app/sitemap.ts`:

```tsx
import { MetadataRoute } from "next";

const BASE_URL = "https://YOUR_DOMAIN.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Add more static pages...
  ];

  // Dynamic pages (fetch from API/database)
  // const items = await fetchItems();
  // const dynamicPages = items.map((item) => ({
  //   url: `${BASE_URL}/items/${item.id}`,
  //   lastModified: new Date(item.updated_at),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.6,
  // }));

  return [...staticPages];
}
```

---

## Step 5: Get Verification Codes

### Google Search Console
1. Go to https://search.google.com/search-console
2. Click "Add property"
3. Enter: `https://YOUR_DOMAIN.com`
4. Choose "HTML file" or "HTML tag" method
5. Copy the code

### Yandex Webmaster
1. Go to https://webmaster.yandex.ru
2. Click "+" to add site
3. Enter: `https://YOUR_DOMAIN.com`
4. Choose "HTML file" or "Meta tag" method
5. Copy the code

### Bing Webmaster
1. Go to https://www.bing.com/webmasters
2. Sign in with Microsoft account
3. Add your site
4. Choose verification method
5. Copy the code

### Mail.ru Webmaster (for Russian sites)
1. Go to https://webmaster.mail.ru
2. Sign in with Mail.ru account
3. Add your site
4. Get the meta tag code

---

## Step 6: Build and Deploy

```bash
npm run build
sudo systemctl restart YOUR_SERVICE_NAME
```

---

## Step 7: Verify & Submit Sitemap

After deploying:

1. **Test verification files:**
   - `https://YOUR_DOMAIN.com/googleXXXX.html`
   - `https://YOUR_DOMAIN.com/yandex_XXXX.html`
   - `https://YOUR_DOMAIN.com/sitemap.xml`
   - `https://YOUR_DOMAIN.com/robots.txt`

2. **Verify in each webmaster tool**

3. **Submit sitemap in each tool:**
   - URL: `https://YOUR_DOMAIN.com/sitemap.xml`

---

## Checklist

- [ ] `layout.tsx` - metadata with verification codes
- [ ] `public/googleXXXX.html` - Google verification file
- [ ] `public/yandex_XXXX.html` - Yandex verification file
- [ ] `public/robots.txt` - crawler rules
- [ ] `src/app/sitemap.ts` - dynamic sitemap
- [ ] Rebuild and deploy
- [ ] Verify Google Search Console
- [ ] Verify Yandex Webmaster
- [ ] Verify Bing Webmaster
- [ ] Verify Mail.ru Webmaster (if Russian site)
- [ ] Submit sitemap to all

---

## Quick Reference: Webmaster URLs

| Engine | URL | Covers |
|--------|-----|--------|
| Google | https://search.google.com/search-console | Google |
| Yandex | https://webmaster.yandex.ru | Yandex (Russia #1) |
| Bing | https://www.bing.com/webmasters | Bing, Yahoo, DuckDuckGo |
| Mail.ru | https://webmaster.mail.ru | Mail.ru (Russia) |

---

## Meta Tag Reference

```html
<!-- Google -->
<meta name="google-site-verification" content="CODE" />

<!-- Yandex -->
<meta name="yandex-verification" content="CODE" />

<!-- Bing -->
<meta name="msvalidate.01" content="CODE" />

<!-- Mail.ru -->
<meta name="mailru-verification" content="CODE" />
```

Next.js generates these automatically from `metadata.verification` in `layout.tsx`.
