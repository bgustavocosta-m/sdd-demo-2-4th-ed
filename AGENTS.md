# AGENTS.md

Online tic-tac-toe rooms over PeerJS: a static Vite + React + TypeScript app on GitHub Pages, no backend.
Spec: [Spec: tic-tac-toe rooms over PeerJS (#6)](https://github.com/bgustavocosta-m/sdd-demo-2-4th-ed/issues/6)

## Commands
npm ci                     # install
npm run dev                # local dev server
npm test -- --run          # all Vitest tests, once
npm run lint -- --fix      # ESLint
npm run build              # tsc + vite build into dist/

## Project
Game rules:      src/game/        (pure, no React, no PeerJS)
Rooms & slugs:   src/room/        (slug.ts, hostReducer.ts — pure)
Networking:      src/net/         (protocol.ts, heartbeat.ts pure; usePeerRoom.ts is the only PeerJS user)
Routing:         src/router/useHashPath.ts
UI:              src/ui/          (Home, ProfileForm, RoomScreen, Board, PlayerBar)
Deploy:          vite.config.ts (base '/sdd-demo-2-4th-ed/'), .github/workflows/deploy.yml

## Conventions
- Logic is pure and test-first: write the Vitest test in a sibling `*.test.ts`, then the code.
- The host is authoritative: only the host runs `applyMove` / `voteRematch`; the guest only renders `state`.
- Every peer message is a member of the `Message` union in src/net/protocol.ts and goes through `parseMessage`.
- Host peer ID is always `hostPeerId(slug)` (`sdd-ttt-<slug>`); never build it by hand.
- Routes are hash routes (`#/tic-tac-toe/room/<slug>`); navigate with `navigate()`, no router library.
- Timers in logic are injected so tests use fake timers.
- Plain CSS; no UI or state libraries.

## Boundaries
ALWAYS     run tests, lint and build before you finish; keep one ticket per PR
ASK FIRST  any new dependency (runtime deps are only react, react-dom, peerjs); changing the message protocol or peer ID format; editing the deploy workflow or Pages settings
NEVER      commit secrets; add a backend or server; push to main directly; edit dist/ or node_modules/
