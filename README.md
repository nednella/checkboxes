<div align="center">
    <h1>checkboxes</h1>
</div>

This is a learning project focussed on web sockets; inspiration for the use case is drawn from the popular [One Million Checkboxes](https://eieio.games/blog/one-million-checkboxes/) project.

## Prerequisites

- **Node** — version pinned in [`.nvmrc`](./.nvmrc)
- **pnpm** — see [installation guide](https://pnpm.io/installation)

## Getting started

```bash
git clone https://github.com/nednella/checkboxes.git && cd checkboxes
```

```bash
pnpm i && pnpm dev         # install + run all workspaces
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
