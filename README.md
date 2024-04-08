# Running the frontend

The website is made in HTML/CSS + Typescript using SvelteKit and Tailwind.
## Installation
The application can be run through npm. Install [Node.js](https://nodejs.org/en/download) and use the package manager 'npm' to install [Svelte](https://svelte.dev/docs/introduction) and [Tailwind](https://tailwindcss.com/docs/installation)


```bash
npm install
```
```bash
npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p
```


## Developing

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
