# Nova Editor

**The last-mile visual editor for AI-generated web apps.** Browser-based,
Git-native, no lock-in.

---

## ⚡ Recent Updates: Windows Desktop & 100% Offline Mode (Tauri v2)

Nova is now configured with standalone desktop distribution for Windows and complete offline-first execution:

- **Tauri v2 Windows Desktop**:
  - Configured native desktop application core in `src-tauri/`.
  - Added standalone NSIS installer bundle target (`.exe`) via `npm run tauri:build:windows`.
  - Automated cloud build pipeline included via GitHub Actions (`.github/workflows/tauri-build-windows.yml`) to compile and release Windows `.exe` installers on `windows-latest` runners.
- **Dashboard as Default Main Window**:
  - The initial marketing landing page is excluded from the root route.
  - Both the web root (`/`) and Tauri's main window now boot directly into the **Dashboard (`/dashboard`)**.
- **100% Offline Workflow**:
  - **Static Export**: Compiles standalone static assets via Next.js `output: "export"` with `trailingSlash: true` into `out/`.
  - **Local Vendor Assets**: Pre-bundled local dependencies (`public/vendor/`) for Babel Standalone, React, React DOM, and Tailwind CSS.
  - **Local WebAssembly**: Pre-bundled local `esbuild.wasm` (`public/esbuild.wasm`) so live component compiling and bundling run without an internet connection.
  - **Encrypted Local Storage**: Projects, components, assets, and undo/redo history persist locally using IndexedDB.
  - **Companion Runner Integration**: Added Tauri webview origins (`http://tauri.localhost`, `https://tauri.localhost`, `tauri://localhost`) to the local runner agent's CORS whitelist (`runner/index.mjs`).
- **New Desktop Scripts**:
  - `npm run tauri:dev` — Starts Next.js and launches the live desktop window on `/dashboard`.
  - `npm run tauri:build:windows` — Compiles the offline static bundle and produces the Windows installer.
  - Complete instructions documented in [`docs/tauri-windows.md`](./docs/tauri-windows.md).

---

AI tools (Bolt, Lovable, v0, Cursor…) generate ~90% of an app from a prompt. Nova
is where you do the final 10% by hand — click an element, tweak its layout, color,
and copy on a live canvas, and push clean code back to your repo. No tokens spent
on micro-tweaks, nothing to install, your Git stays the source of truth.

> 🟢 **Alpha.** Actively developed — expect rough edges, and please send feedback.

## What it does

- **Visual editing on real code** — click any element, edit layout / spacing /
  typography / color in a Webflow-grade inspector. Edits round-trip to your source
  (Tailwind utility classes or inline styles).
- **Bi-directional sync** — a built-in Monaco code editor stays in lock-step with
  the canvas. Edit either side.
- **Bring-your-own-AI assistant** — an agentic helper that reads and edits your
  files, with your own key for **any** provider (Anthropic, OpenAI, Google, xAI,
  DeepSeek, Mistral, Groq, OpenRouter, or a custom model).
- **Run it live** — boot the real app in the browser (WebContainers), or run it on
  your own machine with the optional local-runner agent (`npx @novaeditor/runner`) for
  full Node + real `git`. Either way, click-to-edit it as it runs.
- **Git-native** — import a public repo or a full clone, edit, review a clean diff,
  then commit, push, or open a PR. Triggers your existing Vercel/Netlify deploy.
- **Sync & collaborate (paid)** — Pro backs up and syncs your projects across
  devices; Studio adds real-time editor collaboration with role-based access. Free
  stays fully local.

## Privacy

Local-first by default. Your **GitHub token and AI keys are encrypted and never
reach a Nova server** — they stay in your browser, or go straight to your own
machine (the local agent, over `127.0.0.1`) or to GitHub directly. On the free
plan your projects stay on-device too; **cloud sync is an opt-in paid feature**
(Pro/Studio), and only then does project data sync to Nova's cloud.

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:3000> (this repo's dev preview uses 3011).

Requirements: Node 18+. Folder storage and the live **Run** mode use the File
System Access API + WebContainers, which need a **Chromium** browser (Chrome,
Edge, Arc).

## Configuration

Nova runs with **zero config** for local, on-device use. The cloud features (auth,
sync, billing) need the environment variables below — set them in `.env.local`, or
in your host's env for a deploy. Copy [`.env.example`](./.env.example) to start.
Every `NEXT_PUBLIC_*` value is safe in the browser; **everything else is
server-only**.

**Supabase** — auth (magic link) + cloud project sync. Apply
[`supabase/schema.sql`](./supabase/schema.sql) to your project.

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client.
- `SUPABASE_SERVICE_ROLE_KEY` — server only; bypasses RLS, never expose to clients.

**Stripe** — Pro/Studio billing. Keys **and** prices must all be the same mode
(test or live), and the Price IDs are recurring prices (`price_…`, not `prod_…`).

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — server only.
- `STRIPE_PRO_PRICE_ID`, `STRIPE_STUDIO_PRICE_ID` — the Pro/Studio Price IDs.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — client flag that turns the billing UI on.
- Point a Stripe webhook at `/api/stripe/webhook` for `checkout.session.completed`
  and `customer.subscription.created|updated|deleted`.

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind · Zustand · Monaco · Babel
(`@babel/parser`) + parse5 for round-tripping · esbuild-wasm + esm.sh for the
in-browser component bundler · WebContainers for the live runtime · Supabase for
auth/sync · Stripe for billing · the GitHub REST API (plus the optional local
agent's real `git`) for clone/commit/PR.

## Documentation

Full guides live in [`/docs`](./docs) (and in-app at `/docs`): getting started,
importing, visual & code editing, the AI assistant, running live, publishing, and
an FAQ. The local-runner agent has its own [README](./runner/README.md).

## Status & roadmap

Working today: import (GitHub / folder / paste / clone), visual + code editing,
the streaming AI assistant (BYOK or on-device), live run (in-browser or local
agent) + click-to-edit, GitHub OAuth + publish (REST or real git), cloud sync
(Pro), and editor collaboration (Studio). On the roadmap: managed Nova AI tiers
and broader framework coverage.
