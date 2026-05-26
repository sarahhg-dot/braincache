# My External Brain Cache — Personal PWA

A clean, calm task list for your iPhone home screen. No accounts, no servers, no App Store. All your data lives on your device.

## What you have

```
todo-app/
├── index.html          ← the app
├── manifest.json       ← PWA metadata
├── sw.js               ← service worker (offline + caching)
├── icon-192.png        ← small app icon
├── icon-512.png        ← large app icon
├── icon-maskable.png   ← Android adaptive icon
├── apple-touch-icon.png← iOS home screen icon
└── favicon.png         ← browser tab icon
```

## Features

- **Tasks** with title, notes, deadline (date + time), recurrence, priority, category
- **9 default categories** with emoji icons and warm-earth color coding (Personal, Work, Health, Errands, Family, School, Cleaning, Organizing, Finance) — all fully editable in Settings with a color picker
- **Color-tinted task rows** — each task picks up a subtle background tint matching its category, so the list scans by color at a glance
- **High / Medium / Low priority** with subtle dot indicators
- **Flexible recurrence** — Every day, Every weekday (Mon–Fri), Every weekend (Sat–Sun), Specific days of week (any combination), or Every N days/weeks/months/years
- Next instance of a recurring task is auto-created when you mark the current one done
- Overdue tasks pinned to the top in warning colors (overrides category tint)
- Filters: All, Today, Overdue, Done, plus one per category
- Export / Import JSON backup
- Offline (full PWA via service worker)
- Light + dark mode (follows system)

## How the "remind me until done" works

When a task is overdue, the app:

- Pins it to the top of the list in red, with a clear "Overdue" badge
- Updates your home screen app icon badge with the overdue count
- Fires a notification each day at the original deadline time, until the task is marked done

There is one honest constraint with the local-only build: iOS notifications fire most reliably when the app has been opened recently. If you go a week without opening it, the nag notifications may not fire on a closed app. The badge count and visual overdue treatment will catch you up the moment you open it.

If you want true server-pushed nagging that works even when the app has been closed for days, that's the "with backend" build we can do as a follow-up.

## Deploy it

Pick one of these. All are free.

### Option 1: GitHub Pages (recommended for set-it-and-forget-it)

1. Create a new public repo on GitHub called whatever you want (e.g. `tasks`)
2. Upload all the files in this folder to the repo root
3. Go to **Settings → Pages**
4. Under "Source," pick **Deploy from a branch**, branch `main`, folder `/ (root)`
5. Save. Wait about a minute.
6. Your app is live at `https://<your-username>.github.io/<repo-name>/`

### Option 2: Vercel (drag-and-drop, no Git needed)

1. Sign up at vercel.com (free, GitHub login is fine)
2. On your dashboard, click **Add New → Project**
3. Drag this entire `todo-app` folder into the upload area
4. Click Deploy. About 30 seconds.
5. You get a URL like `tasks-abc123.vercel.app`

### Option 3: Cloudflare Pages

1. Sign up at pages.cloudflare.com
2. Click **Create a project → Direct upload**
3. Name your project, drag the folder in
4. Done. URL is `<project>.pages.dev`

## Install on iPhone

1. Open the deployed URL in **Safari** (must be Safari, not Chrome, for iOS PWA install)
2. Tap the share button (square with up arrow at the bottom)
3. Scroll down and tap **Add to Home Screen**
4. Confirm. The app appears on your home screen with the T icon.
5. Open the app from the home screen icon (not Safari).
6. Open Settings inside the app and tap **Enable notifications**. Tap Allow when iOS asks.

That's it. The app works offline from now on, and you'll get notifications for due and overdue tasks.

## To update the app later

- If on GitHub Pages: edit files in the repo, commit. Live in a minute.
- If on Vercel/Cloudflare: drag the new folder in to redeploy.
- On your phone: the app will pick up changes automatically the next time you open it (the service worker handles it).

## Backing up your tasks

Settings → Export JSON. Saves a file you can keep anywhere (iCloud Drive, email to yourself, etc.). Settings → Import JSON to restore.

## Notes on iOS PWA quirks

- Notifications only work after Add to Home Screen, not in a regular Safari tab
- Notifications fire most reliably with the app open or recently used
- The home screen app badge (red number on the icon) updates whenever you open the app
- Data is stored in localStorage, which iOS may clear if storage runs very low. Export periodically.

## To customize

Everything is in `index.html`. The CSS variables at the top of the `<style>` block control all the colors. Change `--accent` for a different accent color. The default categories live in the `DEFAULT_CATEGORIES` array near the top of the `<script>` block.
