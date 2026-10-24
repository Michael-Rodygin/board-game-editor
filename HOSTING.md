# Static hosting

This project builds to `dist/` and does not need a server or framework at runtime.

## Cloudflare Pages

1. Put this project in a GitHub repository and push the branch you want to publish.
2. In Cloudflare, create a Pages project connected to that repository.
3. Set the build command to `npm run build` and the build output directory to `dist`.
4. Deploy. The site will be available at its `*.pages.dev` address. The hex workshop and card editor are `index.html` and `card.html`.

The build scans `hexes/terrain`, `hexes/buildings`, `icons`, and `cats` to create `asset-manifest.json`, and copies those folders plus `tile_icons/` into the deployable site. New or replaced images are included on the next deployment.

## Build locally

Run `npm run build`, then open `dist/index.html` or `dist/card.html` through a local static web server to preview the deployable files. You can deploy `dist/` directly with any static host.

The existing `Open Hex Tile Workshop.cmd` launcher remains available for local use and still discovers assets through `serve.mjs`.
