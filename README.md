# Myprotein Popup Activations Map

Interactive UK map of proposed Myprotein popup activation locations for FY26.

**Live demo:** Deploy to GitHub Pages (see below)

## Locations

| # | Location | City | Type |
|---|----------|------|------|
| 1 | Battersea Power Station | London | Premium Destination |
| 2 | Spinningfields | Manchester | Premium District |
| 3 | Piccadilly Gardens | Manchester | High Footfall |
| 4 | Edinburgh Waverley | Edinburgh | Transport Hub |
| 5 | Edinburgh Castle | Edinburgh | Iconic Landmark |

## Features

- Interactive map powered by [OpenFreeMap](https://openfreemap.org) Liberty style
- Click any pin or sidebar card to fly to that location
- City filter pills (All / London / Manchester / Edinburgh)
- Hover tooltips with location details
- Fully responsive (mobile friendly)

## Stack

- [Leaflet](https://leafletjs.com/) — map interaction layer
- [MapLibre GL JS](https://maplibre.org/) — vector tile rendering
- [MapLibre GL Leaflet](https://github.com/maplibre/maplibre-gl-leaflet) — binding layer
- [OpenFreeMap](https://openfreemap.org/) — free, open vector tile hosting

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from branch → main → / (root)**
4. Your map will be live at `https://<username>.github.io/<repo-name>`

## Run locally

No build step needed — just open `index.html` in a browser, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080)

## Customise locations

Edit the `LOCATIONS` array in `app.js` to add, remove or change locations:

```js
{
  id: 'unique-id',
  name: 'Location Name',
  city: 'City',          // used by filter pills
  lat: 51.123,
  lng: -0.456,
  tag: 'Location Type',
  desc: 'Short description shown in popup and sidebar.',
  color: '#DD592B',      // pin and accent colour
}
```

---

*THG Nutrition · Production & Planning · FY26*
