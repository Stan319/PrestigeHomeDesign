# PrestigeHomeDesign (Client Preview)

Light-theme, minimal multi-page website preview inspired by the clean elegance of Corbin Reeves Construction and Patterson Custom Homes.

## Pages
- `index.html` — Home / hero + featured work
- `services.html` — Services overview
- `projects.html` — Project gallery (realistic placeholder images)
- `contact.html` — Contact form (mailto-based for preview)

## Run locally
Open `index.html` in a browser, or use a quick local server:

```bash
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Client-facing preview link (fastest)
**Netlify Drop** (no account needed for a quick share link):
1. Go to Netlify Drop (search “Netlify Drop”).
2. Drag-and-drop the entire folder contents (or the zip) into the drop zone.
3. Netlify will instantly give you a public URL you can send to the client.

## Replace the placeholder photos
All images are in `assets/img/`. Swap them with real project images using the same filenames:
- `hero-home.jpg`
- `project-kitchen.jpg`
- `project-bathroom.jpg`
- `project-newbuild.jpg`
- `project-adu.jpg`

## Change the contact email
In `script.js`, update:
```js
const to = "hello@prestigehomedesign.com";
```

## Notes
- Placeholder photos are from Unsplash and are free to use under the Unsplash License.


## Admin editing (Netlify)
This site includes Decap (Netlify) CMS at `/admin`.

### Enable admin editing
1. Push this folder to a new GitHub repo.
2. Deploy the repo on Netlify.
3. In Netlify: **Site settings → Identity → Enable Identity**.
4. In Netlify: **Identity → Services → Enable Git Gateway**.
5. Invite your client under **Identity → Invite users**.
6. Visit `https://YOURDOMAIN.com/admin` to log in and edit content/images.

Content files live in `/content/*.json` and are automatically loaded by `cms-content.js`.
