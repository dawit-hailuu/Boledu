# Boledu Coffee — Website

Marketing / landing site for **Boledu Coffee**, an Ethiopian specialty-coffee producer and
exporter operating washing stations in Yirgacheffe (Konga, Gedeb, Aricha) and Guji. The site
presents the company, its coffee grades, processing methods and origins, and lets roasters
send an enquiry.

## Tech

- Single, self-contained **`index.html`** — all CSS and JavaScript are inline. No build step,
  no dependencies, no framework.
- Vanilla JS for: footer year, sticky-header state, mobile nav drawer, reveal-on-scroll
  (`IntersectionObserver`), animated stat count-ups, auto-calculated "years in business",
  and the contact form.
- Google Fonts: Fraunces, Hanken Grotesque, Spline Sans Mono.

## Run locally

It's a static file — just open `index.html` in a browser, or serve the folder:

```bash
# any static server works, e.g.
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Host the folder on any static host (GitHub Pages, Netlify, Cloudflare Pages, etc.).

## Before going live — checklist

- [ ] **Set the real domain.** `index.html` uses `https://boleducoffee.com/` as a placeholder
      in the `<link rel="canonical">`, Open Graph and Twitter tags, and the JSON-LD block.
      Replace all occurrences with the real URL.
- [ ] **Replace the stock imagery.** All photos are Unsplash placeholders (marked with
      `<!-- Replace with … -->` comments). Swap in Boledu's own washing-station / farm photos,
      and update the `og:image` / `twitter:image` URLs to a real branded share image.
- [ ] **Fill in social links.** The footer Facebook / X / LinkedIn links are `href="#"` stubs.
- [ ] **Confirm contact details** (phones, emails, address) and the WhatsApp number
      (`WHATSAPP_NUMBER` in the script, and the `wa.me/251910336725` links).

## Contact form

The form has no server backend. On submit it validates the fields and opens WhatsApp with the
entered details (name, email, interest, volume) prefilled as a message. To collect submissions
by email instead, wire the form to a service such as [Web3Forms](https://web3forms.com/) or
[Formspree](https://formspree.io/), or replace the `wa.me` URL with a `mailto:` link. The
relevant code is the `orderForm` submit handler near the bottom of `index.html`.

## Editing common values

- **Founding year / "years in business":** change `const FOUNDED = 2018;` in the script — the
  badge and the stat update automatically each calendar year.
- **Footer copyright year:** set automatically from the current date.
- **Crop year label** ("Crop 2024/2025") is hard-coded in a few places (hero, header CTA,
  contact heading) — update these by hand each season.
