# Running the application

The website is made in HTML/CSS + Typescript using SvelteKit and Tailwind. In addition this, we use Python (along with several libraries/APIs) for the backend of the project.
## Installation
The application can be run through npm. Install [Node.js](https://nodejs.org/en/download) and use the package manager 'npm' to install [Svelte](https://svelte.dev/docs/introduction) and [Tailwind](https://tailwindcss.com/docs/installation)


```bash
npm install
```
```bash
npm install -D tailwindcss postcss autoprefixer
npm install --save @types/proj4

npx tailwindcss init -p

pip install Flask flask-cors
pip install pandas #If you don't already have it installed
```

## Developing

```bash
# to start the server
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
### To start the api:
```bash
## From the root of the project:
cd src/routes/api
python query_data.py
```

## Building

To create a production version of the app:

```bash
npm run build
```
You can preview the production build with `npm run preview`.

See "To start the api" above: [To start the api](#to-start-the-api) 
