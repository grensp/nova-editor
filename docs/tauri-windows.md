# Building Nova for Windows with Tauri (100% Offline Desktop)

Nova is configured for standalone desktop distribution on Windows using **Tauri v2**. The application is bundled with all assets for full offline usage on Windows, with the landing screen set to the **Dashboard (`/dashboard`)**.

## Offline-First Architecture
- **Static Export**: The application compiles to static HTML/JS/CSS assets via Next.js `output: "export"` with `trailingSlash: true`, and all assets are embedded into the native binary via Tauri's `frontendDist: "../out"`.
- **Local Runtime & Bundling**: Offline vendor dependencies (`esbuild.wasm`, Babel Standalone, React, React DOM, Tailwind) are pre-bundled in the application package, allowing live JSX parsing and WebAssembly bundling without an internet connection.
- **Local Data Persistence**: Projects, components, assets, undo/redo history, and settings persist locally on Windows using encrypted IndexedDB.
- **Network Exemption**: Only optional remote actions (such as pulling Git repositories from GitHub or connecting to external LLM APIs) access the network; core design, editing, and running workflows function entirely offline.

---

## Quick Start on Windows

### Prerequisites
1. **Node.js 20+**
2. **Rust & Cargo** (install via [rustup.rs](https://rustup.rs/))
3. **Microsoft C++ Build Tools** (installed via Visual Studio Installer with the "Desktop development with C++" workload)
4. **WebView2** (pre-installed on Windows 10 & 11)

### Development Mode
To run the Windows desktop application with live reload:
```bash
npm run tauri:dev
```
This boots the Next.js dev server on `http://localhost:3000` and opens the Tauri desktop window directly at `http://localhost:3000/dashboard`.

### Production Build (.exe Installer)
To compile the standalone Windows executable and NSIS installer:
```bash
npm run tauri:build:windows
```
The compiled output will be generated in:
- **NSIS Installer**: `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/Nova_0.1.0_x64-setup.exe`

---

## Automated Cloud Builds (GitHub Actions)
A preconfigured workflow is located at `.github/workflows/tauri-build-windows.yml`. When pushed to GitHub or triggered manually via **Actions > Build Tauri Windows App**, it compiles the standalone Windows `.exe` installer on a Windows runner and uploads the release artifact.
