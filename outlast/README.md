# Outlast

Clear, checked survival skills in one place: step-by-step guides, gear checklists, scenarios and a community forum. In English and Polish.

This is a standalone site with no build step and no dependencies. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8100
```

Then open http://localhost:8100. Over http(s), the site caches itself after the first visit (`sw.js`), so guides open without signal.

## What's where

| Path | Contents |
| --- | --- |
| `js/guides.js` | Skill categories and the 14 step-by-step guides (needs, safety warnings, steps, sources) |
| `js/content.js` | Gear checklists, scenarios, forum categories and rules, home "start here" paths |
| `js/ui.js` | Interface text and the About / Safety pages, in English and Polish |
| `js/diagrams.js` | The step illustrations and icons, drawn as SVG and recoloured for dark mode |
| `js/app.js` | Burger menu, search, routing and every page |
| `css/outlast.css` | Colours (light: white, dark: dark blue, forest-green header), type and layout |

## Content status

The guides are drafts written from commonly cited sources. Each guide lists its sources and shows a "draft" note until someone experienced has reviewed it.

## Saved on the device only (for now)

- **Forum posts:** a shared forum needs a server, e.g. Supabase.
- **Checklist ticks and "practised" skills:** these are personal and stay on the device.
