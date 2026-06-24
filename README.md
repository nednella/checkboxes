<div align="center">
  <h3><b>checkboxes</b></h3>
  <p>
    This is a learning project focussed on web sockets; inspiration for the use case is drawn from the popular <a href="https://eieio.games/blog/one-million-checkboxes/">One Million Checkboxes</a> project.
  </p>
  <p>
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img alt="Express" src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" />
    <img alt="ws" src="https://img.shields.io/badge/ws-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
    <img alt="pnpm" src="https://img.shields.io/badge/pnpm-yellow?style=for-the-badge&logo=pnpm&logoColor=white" />
  </p>
</div>

## Installation

Requires [Node 24+](https://nodejs.org) (pinned in `.nvmrc`) and [pnpm](https://pnpm.io/installation).

```bash
git clone git@github.com:nednella/checkboxes.git && cd checkboxes
```

```bash
pnpm i && pnpm dev         # install + run all workspaces
```

## Development

Commands runs from the monorepo root against all packages, or optionally you can `cd` into a package and run individually:

```bash
pnpm dev                    # run web + server together (parallel)
pnpm build                  # build every workspace
pnpm lint                   # lint every workspace
pnpm format                 # format every workspace
pnpm format:check           # check formatting without writing
```

By default, the web client and server are available on port `5173` and `3000`, respectively.

## Packages

Each package defines its own scripts and declares its own dependencies. The easiest way to work on one is to `cd` into it — pnpm then runs that package's scripts and installs into that package's `package.json`:

```bash
cd apps/web
pnpm dev                    # start the dev server
pnpm add <pkg>              # add a dependency
pnpm add -D <pkg>           # add a dev dependency
pnpm remove <pkg>           # remove a dependency
```

Anything a package can do is also reachable from the repo root with `--filter`:

```bash
pnpm --filter @checkboxes/web dev          # run a package script from the root
pnpm --filter @checkboxes/web add <pkg>    # install into a package from the root
pnpm --filter ./apps/web dev               # filter by directory instead of name
```
