# GitHub Pages deployment guide

Use this guide after the local gameplay and puzzle switching checks pass. The Cube Lab repository uses Vite to build and preview the static site.

## Prepare the production build

1. Use the final GitHub project repository slug to set `base` in the Vite config to `/<repo>/`. For example, a repository named `cube-lab` would use `/cube-lab/`, with a default site URL of `https://<owner>.github.io/cube-lab/`. Use `/` for an account site served at the root. [GitHub Pages site types](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#types-of-github-pages-sites) · [Vite base path guidance](https://vite.dev/guide/static-deploy.html#github-pages)
2. Run `npm ci`, `npm run build`, and `npm run preview`. Open the preview at the configured base path. Confirm the cube renders and the CSS, JavaScript, and any puzzle assets load. Try a timed 3×3 solve and switch between the available puzzles.

## Publish with GitHub Actions

1. In the project repository, open **Settings → Pages** and select **GitHub Actions** as the publishing source. [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
2. Add `.github/workflows/deploy.yml` using the current Vite Pages example. Set its push trigger to the repository’s actual default branch and keep a manual trigger. Use the Node version supported by the project and keep the Pages and identity-token permissions specified in the example. [Vite GitHub Actions example](https://vite.dev/guide/static-deploy.html#github-pages)
3. The workflow should check out the project, install dependencies with `npm ci`, build with `npm run build`, upload `dist` as a Pages artifact, and deploy it to the `github-pages` environment.
4. Push the publishing configuration to the default branch during the release. In **Actions**, confirm the deployment job succeeded and open the URL from its output or from **Settings → Pages**.

## Verify the release

- [ ] Open the live URL in a private browser window and reload it. Check that the console and network panel show no errors for required assets.
- [ ] Check a timed 3×3 solve, Reset, and switching between the published puzzles. Verify the on-screen controls on a phone or a phone-sized viewport.
- [ ] Capture a short preview from the released app. Add the linked preview and **Play Cube Lab** link to the profile README, then click through from the actual GitHub profile.
- [ ] Record the final URL, deploy workflow link, commit, and observed results in the [work log](WORK_LOG.md). Update these instructions to match any settings or commands that changed during deployment.

If the URL opens but the scene or styles are missing, check the first failing asset request against the Vite base path and the deployed repository slug. If the Pages job fails, inspect its logs and check the selected publishing source, workflow permissions, and uploaded artifact before rerunning it.

## Follow-up tilt release

Run the [mobile release checks](PROJECT_PLAN.md#mobile-release-checks) on a build served over HTTPS before releasing a tilt mode. Repeat the applicable checks on the published Pages URL and record the enabled modes, devices, and results in the work log.
