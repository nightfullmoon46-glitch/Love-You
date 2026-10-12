# Only Us v2 — Single-Screen Love Experience

This version is intentionally NOT a scrolling website.

## How it works

Only one full-screen scene is visible at a time.
The user must complete the interaction on that scene before the Continue button appears.

Journey:
1. Landing portal
2. Reasons I Love You — discover 3 reasons
3. Random generative painting — create/keep an artwork
4. Scratch-to-reveal — scratch enough of the card
5. Hold-to-unlock — press and hold
6. Relationship Wrapped — view all 4 cards
7. Countdown — make a wish
8. Do You Love Me? — choose Yes
9. Love Calculator — calculate a result
10. Final animated letter

There is no navbar and the page itself does not scroll.

## Files

- index.html
- style.css
- script.js

## Personalize

Open `script.js` and edit the CONFIG object:

- countdownTitle
- countdownTarget
- specialPair
- reasons

Edit the final letter in `index.html`.

## GitHub Pages

Upload the three main files to a GitHub repository.
Then use Settings → Pages → Deploy from a branch → main / root.

No backend or database is required.


## V3 upgrades

- More cinematic scene-to-scene transition animation
- Animated global star/dust field
- Moving ambient color fields
- More animated portal with orbiting symbols
- Staggered scene entrance animation
- Interactive light inside the generative-art panel
- Animated scratch-card sheen
- Extra hold-to-unlock floating particles
- 3D Relationship Wrapped card response on desktop
- Countdown number animation
- Calculator score pulse
- More polished envelope motion
- Dedicated CSS for short laptops, landscape devices, normal phones and short phones
- Uses `100dvh`, safe-area insets and no document scrolling so each scene stays inside the visible screen

## Final change

The Relationship Wrapped section no longer uses an exact relationship date. Its first card now reads **OUR FAVORITE ERA / US / still my favorite plot twist.**
