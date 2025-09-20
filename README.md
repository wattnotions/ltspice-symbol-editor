# LTspice .asy Editor (modular)

- Pure client-side, no build step required
- SVG rendering, grid, wheel zoom
- Click → move → click to add a snapped LINE
- Open `.asy` files (LINE only for now)

## Run locally
Use any static server (modules won't load from file://):
```bash
# Python
python -m http.server 8000
# or Node
npx http-server -c-1
```
Then open http://localhost:8000

## Publish to GitHub Pages
1. Create a new public repo on GitHub (e.g., `asy-editor`).
2. Push these files to the repo root (so `index.html` is at the top level).
3. In the repo: **Settings → Pages → Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main` / `/ (root)`
4. Wait for the green check. Your site will be at:
   `https://<your-username>.github.io/<your-repo>/`

(If you use a `/docs` folder instead, move `index.html` into `docs/` and select `/docs` in Pages settings.)
