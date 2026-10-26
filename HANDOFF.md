# Swim and Color — project handoff

Everything needed to pick this up cold. Written 2026-10-26.
State verified against the live site and the repo on that date.

---

## 1. What this is

**Swim and Color** is Michelle Senteio's brand built around play — a newsletter,
games, and whatever comes next. This repo is its website, live at
**https://swimandcolor.com**.

The site is three pages:

| Page | Path | What it is |
|---|---|---|
| Home | `/` | Full-screen wordmark, then Newsletter, Projects, Contact |
| Character Select | `/character-select/` | A playable setup flow that prints a pocket card, plus the blank PDF workbook |
| Tarocchi | `/tarocchi/` | How to play the 1500s Italian card game with a Rider-Waite deck |

---

## 2. How it's built and hosted

**Plain static files. No build step, no framework, no package.json.** Hand-written
HTML, CSS, and vanilla JS. This is deliberate — Michelle maintains it herself, and
she asked for the same setup as her personal site. Do not introduce a static-site
generator, a bundler, or CI without asking.

- **Repo:** `msenteio/swimandcolor-site` (public), branch `main`
- **Host:** GitHub Pages, legacy build, serving `main` at root
- **Deploy:** push to `main`. Pages rebuilds in roughly 30–90 seconds.
- **Domain:** `swimandcolor.com`, registered at **GoDaddy** (nameservers `ns59`/`ns60.domaincontrol.com`)
- **DNS:** four A records at the apex → `185.199.108–111.153`; `www` CNAME → `msenteio.github.io`
- **`CNAME` file** in the repo root holds `swimandcolor.com`. Don't delete it.
- **HTTPS:** enforced. Let's Encrypt cert, **expires 2026-12-09**, renews automatically.
- **Analytics:** Google Analytics 4, `G-P9ZLXRYSR8`, loaded by `analytics.js`,
  which exits early unless the hostname is `swimandcolor.com` — local previews and
  forks stay out of the reports.

### Michelle's accounts
- GitHub: `msenteio` (the `gh` CLI is already authenticated on her machine)
- Git commits are authored as `Missy <mlsenteio@gmail.com>`
- Newsletter: https://swimandcolor.substack.com (no custom domain — see §7)

---

## 3. Repo layout

```
index.html                    home
styles.css                    home styles (hero, glint, sections, project cards)
script.js                     two IIFEs: scroll-linked glint, then hero scroll-glide
analytics.js                  GA4, hostname-guarded
CNAME robots.txt sitemap.xml  domain + indexing (site IS indexed, deliberately)

character-select/
  index.html play.css play.js     the playable game
  character-select.pdf            blank 7-page workbook (US Letter)

tarocchi/
  index.html tarocchi.css         rules page, no JS

images/
  swim-color-wordmark.png     SWIM + COLOR, hand-drawn, transparent
  swim-color-wave.png         hand-drawn wave under the tagline
  swim-color-spiral.png       grainy spiral, the icon beside each section heading
  swim-color-crown-logo.jpg   crown badge — now only the favicon source
  character-select-cover.jpg  project card thumbnail
  character-select-og.jpg     link-preview image: a real render of the pocket card
  newsletter-*.jpg            cover image beside each newsletter post
  favicon-* apple-touch-icon og-image.jpg
```

**Not in git** (local only, `.git/info/exclude`):
- `_explore/` — abandoned design studies: `shine.html` (pool light, iridescence,
  sparkle), `home-glint.html`, and `wordmark-colors/` (six red/blue and pink/blue
  wordmark variants she rejected). Useful context, never deployed.
- `.claude/` — `launch.json`, `serve.py`, `version-assets.py` (see §4)

---

## 4. Two local tools you must know about

### `.claude/serve.py` — the preview server
`launch.json` runs this instead of `python -m http.server`. It sends
`Cache-Control: no-store`.

**Why it exists:** the plain server let the preview pane reuse stale CSS, which
three separate times looked like a broken site — missing sections, a giant
unstyled arrow. Michelle once thought half her site had vanished. **If a preview
ever looks wrong after an edit, suspect cache before code.** Verify against the
live site, or fetch the file with `{cache:'reload'}`.

### `.claude/version-assets.py` — run this after editing any CSS or JS

```bash
python3 .claude/version-assets.py
```

It stamps every local stylesheet and script link with a hash of that file's
contents (`styles.css?v=a2ae2e22`) across all three pages.

**Why it matters:** GitHub Pages sends `max-age=600` on everything. Without this,
someone who visited in the last ten minutes gets new HTML paired with an old
cached stylesheet. That shipped a visibly broken hero once. Running it with no
file changes is a no-op, so it's safe to run every time.

---

## 5. How the home page behaves

**The hero fills the first screen** — wordmark, tagline, wave, and a hand-drawn
arrow, centered, with nothing else visible. Sizes shrink on short screens
(phone landscape, 1280×600) so the whole stack always fits.

**Scroll-linked glint** (`script.js`, first IIFE). A streak of warm light crosses
the wordmark, tagline, and wave as the page scrolls, driven by a `--glint` CSS
variable moving from `.15` (off the left) to `.85` (off the right). Images take a
pale highlight masked to their own shapes; the tagline catches **gold** instead,
because pale light washed the grey type into the paper.

**Scroll-glide** (`script.js`, second IIFE). Any downward scroll, swipe,
ArrowDown, Space, or PageDown in the hero glides to `<main>` in under a second.
Clicking the arrow does the same. Deliberately untouched: scrolling up,
pinch-zoom, sideways scroll, pull-to-refresh, and typing in form fields.
Trackpad momentum is swallowed briefly after landing so the page doesn't overshoot.

**Both features are skipped entirely under `prefers-reduced-motion`,** which
leaves a completely normal page. Keep it that way.

> Note: during the glide the light crosses each element in about 0.2s, so it's
> easy to miss. Michelle once thought the glint had been removed. If she says it's
> gone, it's the glide speed, not a missing feature.

---

## 6. Voice and aesthetic — read before writing any copy

**Tagline: "The beauty of fun."** Current home copy is just the wordmark,
tagline, and wave — there is no intro paragraph. She cut it.

Her own words on the aesthetic of play: *light glinting off freshly painted nails
while cards pass across a table; sun flaring off a summer pool as the whistle
starts a race; the warm, blank mind of flow.* So: **grown-up, sunlit, glossy
leisure with a little glamour** — not primary colors, cartoon shapes, or kid
nostalgia. The beauty sits beside the game; you catch the glint while your
attention is on your hand.

**What she has rejected,** each time pulling shorter and warmer:
- first-person bio copy ("I'm Michelle…")
- abstract/academic framing ("a cultural imperative", "makes the case")
- copy explaining how the brand is organized — readers don't care about structure
- coloring the wordmark: she tried six red/blue and pink/blue pairs and went
  **back to black**. Don't re-propose it unless she raises it.

She asks for "short and simple", "a soft punch". Write brand-forward ("we" is
fine), in plain words, few of them. Prefer a warm turn over a clever one.

Current section lines, as examples of the register that landed:
- Newsletter — *"Emails for the kid you were, sent to the adult you are."*
- Projects — *"Games, tools, and objects by Swim and Color."*

**Design system:** Fraunces (serif) + Inter (sans); paper `#F7F5F0`, ink `#1C1B1A`,
muted `#726D63`, rules `#E3DFD5`; 680px column. Character Select has its own
palette sampled from the PDF: `#FED54F` yellow, `#F2A3C1` pink, `#E9E4DD` paper,
`#201F25` ink, set in Space Grotesk.

**Typeface note:** the PDF uses **ATP Norme** (Atipo), which is commercially
licensed and cannot be served from the site. Space Grotesk is the free stand-in.
If she ever buys a webfont license, swapping it in is a ten-minute job.

---

## 7. Open items

### The Character Select page links to the wrong place — easy win
`character-select/index.html` has *"Read more about the game on Substack →"*
pointing at `https://swimandcolor.substack.com`, the publication homepage.

It was written before the post existed. **The post now exists:**

```
https://swimandcolor.substack.com/p/i-created-a-game-that-reprograms
"I created a game that reprograms your subconscious" — Sep 18, 2026
```

(That post is already linked correctly from the home page's newsletter list.)
Nothing is broken — readers just land on the homepage and have to go find it.
Confirm with Michelle, then swap the one `href`.

### Smaller things
- **Home page no longer names Michelle anywhere a reader sees it.** The bio
  paragraph was removed. Her name survives only in the page's search description
  and the links to michellesenteio.com. A footer credit line would fix it if she
  wants it back.
- **Workshops & Teaching was removed "for now"** in commit `807c2cf`.
  `git revert 807c2cf` brings the whole section back, styles included.
- **Site search descriptions** still read *"Swim and Color puts play first — games,
  writing, and things we haven't thought of yet"*, copy that no longer appears on
  the page. It still describes the brand accurately; left on purpose.
- **Unused shine studies** in `_explore/shine.html`: pool light, iridescence, and
  sparkle. She picked glint; the others are built and viewable.

---

## 8. Working practices that have served this project

1. **Verify against the live site, not the preview.** The cache has produced
   several convincing false alarms.
2. **Don't trust an exit code as proof.** A `brew install` here returned 0 while
   installing nothing. Check that the thing actually exists.
3. **Push only what was asked for.** Experiments stay uncommitted or in
   `_explore/`. At one point the working copy held an unapproved colored wordmark
   while a copy fix needed shipping; the fix was staged alone via
   `git hash-object` + `git update-index`, leaving the experiment untouched.
4. **Commit in separable pieces** so single changes can be reverted —
   that's why Workshops is a one-command restore.
5. **Build the thing rather than describing it.** Shine, wordmark colors, and
   arrow weights were all decided from real renders. Headless Chrome is available
   at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless
   --screenshot`, and ImageMagick (`magick`) is installed.
6. **Regenerate derived images when their source changes.** The link-preview
   image is a genuine render of the live card markup, not a mockup, so it can't
   drift — but it has to be re-rendered when the card changes.
7. **Michelle iterates fast and mid-task.** She often sends a new instruction
   while something is still running. Fold it in rather than finishing first.

---

## 9. Known failure mode: the TLS certificate

If the custom domain is ever re-pointed and HTTPS doesn't come up:

GitHub Pages can stall **forever** on certificate provisioning even with perfect
DNS. It happened here for over two hours — the `https_certificate` field was
absent from the API entirely, meaning provisioning never began rather than
running slowly. Re-PUTting the CNAME via the API did nothing.

**The fix:** GitHub → Settings → Pages → remove the custom domain, wait ~30
seconds, re-add `swimandcolor.com`. The certificate was approved within minutes.

Two side effects to expect: GitHub commits `Delete CNAME` then `Create CNAME`, so
the local clone diverges — `git pull --rebase` before the next push. And one
build errors transiently while the CNAME is missing; check the
`pages/builds` list, not the `status` field on the pages config, which lags.

Before reaching for this, rule out a CAA record blocking Let's Encrypt and stray
AAAA records. Neither was the cause here, but both produce the same silence.

---

## 10. State as of 2026-10-26

```
branch main, local == remote == 24297f5, working tree clean
```

- All three pages: **200** over HTTPS
- `http://` → `https://`, and `www` → apex, both 301
- Certificate valid through 2026-12-09, HTTPS enforced
- Asset version hashes in sync with file contents
- `robots.txt` allows everything; `sitemap.xml` lists all three pages
- Site is **deliberately indexable** — unlike michellesenteio.com, which is
  noindex + Disallow all. Don't copy robots rules between the two.

Recent commits:

```
24297f5  Add How to Play Tarocchi page and link it from Projects
313366e  Add the Sep 18 newsletter post and a lighter Character Select cover
344f997  Use the new box photo for the Character Select card and embed
bdd19c9  Add Google Analytics, skipped on anything but the live domain
c2f64ba  Remove the email address from Contact
```

---

## 11. Common tasks

**Preview locally** — start the server from `.claude/launch.json` (named
`swimandcolor`, port 4321), then open `http://localhost:4321/`.

**Add a newsletter post to the home page** — copy an existing `<li>` in the
`#newsletter` list: link, title, date, one-line subtitle, and a cover image in
`images/newsletter-*.jpg`. The list shows the three most recent.

**Add a project** — copy an `<a class="project">` block in `#projects`. Each has a
thumbnail, a kicker, a title, a description, and an optional italic note.

**Ship a change**

```bash
python3 .claude/version-assets.py     # only needed if CSS or JS changed
git add -A && git commit && git push origin main
```

Then poll until the deployed commit matches:

```bash
gh api repos/msenteio/swimandcolor-site/pages/builds/latest --jq '.status + " " + .commit'
```

and verify the live URL with a `?cb=` buster on the page URL.
