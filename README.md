<div align="center">
    <h1>checkboxes</h1>
</div>

A smaller, learning-focused clone of [One Million Checkboxes](https://onemillioncheckboxes.com) — a grid of shared checkboxes that anyone can toggle, live, together.

## Prerequisites

- **Node** — version pinned in [`.nvmrc`](./.nvmrc); a version manager like [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) will pick it up automatically
- **pnpm** — see [installation](https://pnpm.io/installation)

## Getting started

```bash
git clone https://github.com/nednella/checkboxes.git
cd checkboxes
```

```bash
pnpm i       # install all workspaces
pnpm dev     # run web + server together
```

By default, the web client and server will be available on port `5173` and `3000`, respectively.

## Commands

```bash
pnpm dev                    # run web + server together
pnpm build                  # build every workspace

pnpm --filter web <cmd>     # run a script in the web app only (dev, build, lint, ...)
pnpm --filter server <cmd>  # run a script in the server only
pnpm --filter web add <pkg> # add a dependency to a specific workspace
pnpm -r <cmd>               # run a script across every workspace that defines it
```
