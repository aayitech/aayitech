This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## AAYI TECH Hub setup

The root site is the AAYI TECH tools hub. Ambreen's existing portfolio and its project, service, about, approach, and technology pages live under `/ambreen` (for example `/ambreen/projects`). Previous top-level portfolio URLs redirect to their matching Ambreen pages.

### Local services

Copy `.env.example` to `.env.local` and configure the server-only environment variables:

- `DATABASE_URL`: PostgreSQL connection string. Railway's Postgres service exposes this variable; link it to the web service with a Railway reference variable.
- `DATABASE_SSL`: set to `true` only when the database connection requires TLS.
- `AUTH_SECRET`: a unique random secret of at least 32 characters for signing login sessions.
- `GROQ_API_KEY`: enables the SEO research generator and AAYI site assistant. The key stays on the server. Provider availability and limits depend on the selected Groq account/model.
- `ALPHA_VANTAGE_API_KEY`: enables stock quote lookups. Without it, the site explains that quotes are not configured.

The first account request creates the `aayi_users` and `aayi_keyword_reports` tables in the configured database. Passwords are stored as salted scrypt hashes. Signed-in keyword reports are associated with the account. Crypto market direction uses Binance public market data and does not need an account or API key.

In Railway, add a PostgreSQL service, reference its `DATABASE_URL` from the Next.js service, and set `AUTH_SECRET`, `GROQ_API_KEY`, and optionally `ALPHA_VANTAGE_API_KEY` in the Next.js service's Variables tab. Set `DATABASE_SSL=true` only if the connection requires TLS. Configure secrets in Railway rather than committing them to the repository.

The affiliate page currently provides the disclosure and category structure; partner recommendations and tracked links have not been added yet.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
