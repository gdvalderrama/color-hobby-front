# Color Approximator

Find the closest matching paint color across popular ranges like Citadel, Vallejo, AK, and more.

🔗 **Live site**: https://guiomar.xyz/color-hobby-front/

## Features

- Pick a paint range (Citadel, Vallejo Model, Vallejo Game, AK)
- Enter any hex color code or use the built-in color picker
- Displays the closest matching paint with a color swatch and copy-to-clipboard for the hex code
- Supports multiple closest-match results if the API returns an array

## Development

The CSS is built with [Tailwind CSS](https://tailwindcss.com/) and purged to only include used classes.

After making changes to `index.html` or `assets/js/app.js`, rebuild the stylesheet:

```bash
npm install
npx tailwindcss -i assets/css/tailwind.input.css -o assets/css/tailwind.min.css --minify
```

To test locally, serve the project with any static file server (opening `index.html` directly won't work due to browser CORS restrictions on `fetch`):

```bash
npx serve .
```

## Deployment

This repository is configured as a GitHub Pages publishing source.
Changes pushed to the `main` branch are automatically deployed to https://guiomar.xyz/color-hobby-front/.

This can be changed in the repository settings.
