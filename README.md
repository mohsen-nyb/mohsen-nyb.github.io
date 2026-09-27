# Mohsen Nayebi — AI Research

Static personal research website for https://mohsen-nyb.github.io/.

## Deploy

The site is at the repository root. In Settings → Pages, select **Deploy from a branch**, **main**, and **/(root)**. Merging the portfolio pull request into main publishes through that configuration.

No package installation or build step is needed. `.nojekyll` serves the static assets directly.

## Edit

- General content: `index.html`
- Publications and paper links: `publications.json`; run `node generate.mjs` after changes
- Styles: `styles.css`
- Behavior: `script.js`
- Photos, slides, posters and resume: `assets/`

Under-review entries use “Manuscript under review” without naming submission venues. Their full author lists are pending. The supplied downloadable resume is unchanged and still contains its original submission labels.

Legacy images, fonts and resume files are retained to preserve existing external links.
