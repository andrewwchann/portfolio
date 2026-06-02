# Developer Portfolio (React)

A developer portfolio built with **React**, **Vite**, and the [React Bits Line Waves](https://reactbits.dev/backgrounds/line-waves?color1=EAB308) background (`#EAB308` amber).

## Stack

- React 18 + TypeScript
- Vite
- [ogl](https://github.com/oframe/ogl) (WebGL, required by Line Waves)
- Line Waves component from [React Bits](https://reactbits.dev/) ([MIT](https://github.com/DavidHDev/react-bits))

## Customize content

Edit **`src/data/content.ts`** — name, bio, skills, experience, projects, and links.

## Line Waves props

Tweak the background in **`src/components/PageBackground.tsx`**:

```tsx
<LineWaves
  color1="#EAB308"
  color2="#FACC15"
  color3="#CA8A04"
  brightness={0.22}
  speed={0.3}
  enableMouseInteraction={false}
/>
```

See all props on the [Line Waves docs](https://reactbits.dev/backgrounds/line-waves).

## Local development

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source:** GitHub Actions.
3. On push to `main`, the workflow builds and deploys automatically.

### Project site (e.g. `username.github.io/portfolio`)

1. In the repo: **Settings → Secrets and variables → Actions → Variables**
2. Add `VITE_BASE_PATH` = `/portfolio/` (match your repo name, with slashes).
3. Re-run the deploy workflow or push a commit.

For a **user site** (`username.github.io`), leave `VITE_BASE_PATH` unset or set it to `/`.

### Manual build

```bash
VITE_BASE_PATH=/portfolio/ npm run build
```

Output is in `dist/`.

## Resume

Place your PDF at **`public/resume.pdf`** (linked from the hero).

## License

Portfolio code: MIT. Line Waves is from [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits).
