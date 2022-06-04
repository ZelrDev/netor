# Netor Dashboard

This repo contains the Dashboard for Netor. There is another repo for the [Bot and API](https://github.com/zelrdev/netor-bot).

## Tech Stack

- [Prisma](https://prisma.io)
- [Typescript](https://typescriptlang.org)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Mantine](https://mantine.dev)
- [Vercel](https://vercel.com)
- [Docker](https://docker.com)
- [RemixJS](https://remix.run)

## Development

- Install dependencies:

```sh
npm i
```

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

```sh
npm run docker
```

> **Note:** The npm script will complete while Docker sets up the container in the background. Ensure that Docker has finished and your container is running before proceeding.

- Create a `.env`:

```
DATABASE_URL="<database url from docker, if in doubt use: 'postgresql://postgres:postgres@localhost:5432/postgres'>"
SESSION_SECRET="<can be anything>"
API_URL="<api url, get this through setting up the bot>"
SPECIAL_AUTH="<can be anything, must be the same for the bot and dashboard>"
DEV="<yes or no>"
```

- Initial setup:

```sh
npm run setup
```

- Run the first build:

```sh
npm run build
```

- Start dev server:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
