# OPPORTUNITIES — Equal opportunities for every teenager

A youth platform created by **Evelina from Moldova** that helps teenagers (13–19), especially in villages and small towns, find workshops, volunteering, Erasmus+ exchanges, scholarships, competitions, forums, careers and local events.

> Your location should never determine your opportunities.

## Run it

It's a static site with no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

To host it on GitHub Pages, go to **Settings → Pages → Deploy from branch** and choose the root folder.

## What's inside

| Path | Purpose |
| --- | --- |
| `index.html` | Page shell: header, language switcher, mobile menu, footer |
| `css/styles.css` | Design tokens (blue / green / yellow / red), light & dark themes, responsive layout |
| `js/data.js` | **Content**: site settings, all Moldovan districts, categories, opportunities, gallery |
| `js/i18n.js` | All interface text in Romanian (default) and English |
| `js/app.js` | Router and pages: Home, Explore, Regions, Map, Events calendar, Opportunity details, About, Contact, Share an opportunity |
| `js/moldova-outline.js` | Moldova border for the map (simplified from Natural Earth 1:10m via `world-atlas`) |
| `vendor/leaflet/` | Leaflet 1.9.4 map library (BSD-2-Clause), kept locally so the map has no CDN dependency |
| `assets/img/` | Photos taken from *Local Opportunities.pdf* |

## Content rules

- The 15 activities come from *Local Opportunities.pdf*. Anything the PDF lists as "to be confirmed" (dates, times, organisers, contacts, deadlines, costs, what's covered) is stored as `null`. The site shows these as **"De confirmat / To be confirmed"** and never makes up values.
- Listings with `source: "demo"` are demonstration examples that show online and international entries. The site labels them **"Exemplu demonstrativ / Demo example"**.
- Gallery photos are past events shown for inspiration. Their captions only repeat what is visible in the images.

## Interactive map (`#/map`)

- **Left panel:** location search (village, town or district), "use my location", search radius, and filters by date, type, cost and keyword. Below them is the list of matching events.
- **Map:** one pin per in-person opportunity. Pins that share a town fan out so each one can be tapped. The area outside Moldova is dimmed, and Moldova's border is always drawn, so the region still reads clearly if map tiles fail to load.
- **Right panel:** details of the selected event, with a Share tab, an "I'm interested" toggle and a link to the full page. On phones, this panel becomes a bottom sheet.
- **Pin an event:** tap the button, tap the map inside Moldova, drag the pin to adjust it, then fill in the form. New pins show as "under review". For now they are saved only in the visitor's browser; to share them with everyone, connect a backend.
- Map pin coordinates live in `js/data.js` → `OPP_GEO`.
- The map tiles are © OpenStreetMap contributors © CARTO, and the credit is shown on the map.

## Adding or updating an opportunity

Edit `js/data.js` → `OPPORTUNITIES`. Fill in `date` (`YYYY-MM-DD`), `time`, `deadline`, `organizer`, `contact`, `link` and `covers` once the organiser confirms them. Set `link` to show an **Apply** button; without a link, the button reads **Ask about it** and opens the contact form.

## Before going live

- Set `SITE.email` and the `SITE.social` links in `js/data.js`.
- Connect the Contact and "Share an opportunity" forms to a backend or form service. Right now they only save submissions in the visitor's browser, and the forms say so.
