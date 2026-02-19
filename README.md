# 🎰 Family Spinners

> **Let fate decide!** A fun, neon arcade-style family decision maker.

Spin the wheel to settle any family debate — what's for dinner, what to do, which board game to play, who does the chores, and more!

---

## PUBLISHED HERE
[[https://prran77.github.io/spinner/](https://prran77.github.io/family-spinner/)](https://prran77.github.io/family-spinner/)
click above to go to the site

## ✨ Features

- 🎡 **Spinning wheel** with physics-based deceleration and neon glow
- 🪩 **Disco lights** — animated ring lights while spinning
- 🎉 **Confetti explosion** on the result reveal
- 🕹 **6 built-in modes**: Dinner, Activity, Board Game, Movie Night, Chores, Custom
- 💾 **Auto-saves** your options per mode as suggestions for next time
- 📜 **Spin history** — see the last 50 results
- 📱 **PWA installable** on iPhone and Android (works offline!)
- 🎨 **Mobile-first** design, kid-friendly for ages 10–14

---

## 🎮 Mode Guide

| Mode | Use it for |
|------|-----------|
| 🍕 Dinner | Tonight's meal — Pizza, Tacos, Curry... |
| 🎮 Activity | What to do — Park, Gaming, Movie... |
| 🎲 Board Game | Which game to play — Uno, Monopoly... |
| 🎬 Movie Night | What to watch — Marvel, Disney... |
| 🧹 Chores 😅 | Fair chore assignment (kids won't argue with the wheel!) |
| ⭐ Custom | Anything else — holiday destinations, ice cream flavours, who goes first... |

---

## 🚀 Deploy to GitHub Pages

### 1. Create & upload to GitHub

```
family-spinner/          ← repo root
├── index.html
├── manifest.json
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── storage.js
│   ├── wheel.js
│   ├── particles.js
│   └── app.js
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

### 2. Enable GitHub Pages

Repo → **Settings → Pages** → Branch: `main` → `/(root)` → Save

### 3. Visit & install!

`https://YOUR_USERNAME.github.io/family-spinner/`

---

## 📱 Install as App on Phone

### iPhone / iPad (Safari)
1. Open the URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. Tap **"Add"** — done! 🎉

### Android (Chrome)
1. Open the URL in **Chrome**
2. Tap the **⋮** menu (top right)
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **"Add"** — done! 🎉

The app works **offline** after first load — perfect for use at the dinner table!

---

## 🛠 Tech Stack

- Pure **HTML / CSS / JS** — no frameworks, no build step
- **Canvas API** for the spinning wheel
- **Web Animations** for disco lights and confetti
- **localStorage** for saving lists and history
- **Web App Manifest** for PWA / installability

---

## 📁 File Guide

| File | What it does |
|------|-------------|
| `index.html` | App structure and markup |
| `css/style.css` | All styles — neon arcade theme |
| `js/data.js` | Mode definitions and default suggestions |
| `js/storage.js` | localStorage: saved lists + spin history |
| `js/wheel.js` | Canvas wheel with physics + disco ring |
| `js/particles.js` | Confetti explosion + ambient background |
| `js/app.js` | UI controller — inputs, modes, history |
| `manifest.json` | PWA manifest for phone installation |
| `icons/` | App icons for home screen |

---

## 🧪 Running Tests

Tests cover the wheel logic (edge cases, Spin Again flow, reset behavior). To run:

1. **Serve the app** (required — `file://` can block script loading):
   ```bash
   npx serve -p 3456
   # or: python -m http.server 3456
   ```
2. Open **`http://localhost:3456/index.html?test=1`** in your browser.
3. Tests run automatically; results appear in the **console** and as a **toast**.

Test cases include: 0/1 segment early return, many segments, reset restores DOM for Spin Again, boundary winnerIndex.

---

## 💡 Fun Ideas

- **Holiday destinations** — where to go for summer break?
- **Ice cream flavours** — which one tonight?
- **Who goes first?** — add family member names
- **Random reward** — good grades spinner: trip to the movies, new game, pizza night...
- **Punishment spinner** — whoever loses picks their own chore from the wheel 😈

---

*Made with ❤️ for family fun. No more arguing at the dinner table!*
