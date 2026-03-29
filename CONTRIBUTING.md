# Contributing

Thanks for your interest in contributing. We're happy to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

If you need any help, feel free to reach out to [sarabjit20s.bsky.social](https://bsky.app/profile/sarabjit20s.bsky.social).


## About this repository

This repository is a monorepo.

- We use [pnpm](https://pnpm.io) and [`workspaces`](https://pnpm.io/workspaces) for development.
- We use [Turborepo](https://turbo.build/repo) as our build system.
- We use [Fumadocs](https://fumadocs.vercel.app/) framework for our documentation site.

## Structure

This repository is structured as follows:

```
apps
├── ui      # React Native components & demo
└── www     # Documentation site
packages
├── cli     # The CLI tool
├── eslint-config
└── typescript-config
```

| Path           | Description                                  |
| -------------- | -------------------------------------------- |
| `apps/ui`      | React Native components and playground app.  |
| `apps/www`     | Documentation site (Next.js + Fumadocs).    |
| `packages/cli` | The `saaj` CLI tool to add components.       |


## Local Development

You can run different parts of the monorepo locally using the following commands:

- **Documentation**: `pnpm run dev --filter=www`
- **UI Playground**: `pnpm run dev --filter=ui`
- **CLI Development**: `pnpm run dev --filter=saaj`


## Commit Convention
Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) guide.


## Requests for new components
If you have a request for a new component, please open a discussion on GitHub. We'll be happy to help you out.

