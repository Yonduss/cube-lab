# References

## Puzzle implementation

| Source | What to use it for |
| --- | --- |
| [cubing.js repository](https://github.com/cubing/cubing.js#readme) | Start here for installation and upstream license information. Review distribution terms for the selected package version before release. |
| [TwistyPlayer guide](https://js.cubing.net/cubing/twisty/) | Render a 3×3, pass move sequences, and explore viewer options. Review the experimental API notes before choosing how to handle direct gestures. |
| [Puzzle loaders](https://js.cubing.net/cubing/api/modules/puzzles.html) and [KPuzzle API](https://js.cubing.net/cubing/api/modules/kpuzzle.html) | Load puzzle definitions and evaluate how `KPattern` can represent the current position for move application and solved detection. |
| [Scramble API](https://js.cubing.net/cubing/api/modules/scramble.html) | Evaluate `randomScrambleForEvent` and confirm the mapping between puzzle IDs and scramble event IDs. |
| [WCA move notation](https://www.worldcubeassociation.org/regulations/#article-12-notation) | Check face-turn names and inverse notation, and use puzzle-specific notation in the control guide. |

## Interaction and visual references

| Source | What to study |
| --- | --- |
| [Twizzle Editor](https://alpha.twizzle.net/edit/) | Compare puzzle selection, setup sequences, and displayed move notation using the same library family. |
| [Zahid074/Rubiks-Cube](https://github.com/Zahid074/Rubiks-Cube) | Study the interaction flow for orbiting, turning layers, scrambling, timing, and showing a solved result. |
| [taylorjg/rubiks-cube](https://github.com/taylorjg/rubiks-cube) | Study move animation and cube presentation. The project repository links to its live demo. |
| [Three.js repository](https://github.com/mrdoob/three.js) | Evaluate custom meshes and animation if Mirror Cube needs a dedicated renderer. |

Use these applications as interaction references and build an original interface. Check the applicable license before reusing any code or asset. Record the source and required attribution for anything reused.

## Frontend and publishing

| Source | What to use it for |
| --- | --- |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | Look up types for moves, puzzle configuration, and timer state as they appear in the code. |
| [React custom HTML elements](https://react.dev/reference/react-dom/components#custom-html-elements) | Check how React passes properties and events to the `twisty-player` custom element. |
| [HTML standard for localStorage](https://html.spec.whatwg.org/multipage/webstorage.html#the-localstorage-attribute) | Check storage scope and access behavior when implementing solve records. |
| [Vite static deploy guide](https://vite.dev/guide/static-deploy.html#github-pages) | Set the production asset base and adapt the official GitHub Actions example. |
| [GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) | Set Pages to use GitHub Actions and find deployment troubleshooting steps. |
| [GitHub profile README guide](https://docs.github.com/en/account-and-profile/how-tos/profile-customization/managing-your-profile-readme) and [GitHub Markdown image syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images) | Set up the profile repository and add the linked preview. |
