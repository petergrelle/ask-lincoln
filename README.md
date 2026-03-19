# Ask Lincoln

A live video conversation with Abraham Lincoln, powered by Runway's Characters API.

Built with [Runway Characters API](https://docs.dev.runwayml.com/characters/) and deployed on [Netlify](https://netlify.com).

## Setup

### Prerequisites

- Node.js 18+
- A [Runway Developer](https://dev.runwayml.com) account with credits
- A [Netlify](https://netlify.com) account

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/ask-lincoln.git
cd ask-lincoln
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your Runway API key:

```bash
cp .env.example .env
```

### 3. Run locally

```bash
netlify dev
```

### 4. Deploy to Netlify

Set these environment variables in your Netlify dashboard:

- `RUNWAYML_API_SECRET` — your Runway API key (starts with `key_`)
- `RUNWAY_AVATAR_ID` — `eaa8b03d-0a6a-4bd0-83a9-039609b47808`

Then deploy:

```bash
netlify deploy --prod
```

Or connect the GitHub repo to Netlify for automatic deploys on push.

## Project Structure

```
ask-lincoln/
├── index.html              # Entry point
├── netlify.toml             # Netlify build + redirect config
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
├── netlify/
│   └── functions/
│       └── create-session.js   # Serverless function for Runway session
└── src/
    ├── main.jsx
    ├── App.jsx             # Main React component
    └── App.css             # Styles
```
