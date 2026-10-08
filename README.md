# AAYI TECH

AAYI TECH is a practical digital tools hub. Ambreen's existing portfolio and project pages remain under `/ambreen` (for example `/ambreen/projects`). Previous top-level portfolio URLs redirect to their Ambreen pages.

## Tools

- `/weather`: local forecast using MET Norway public forecast data. Location access is optional; visitors can select a city instead. No API key is required.
- `/news`: recent headlines by world, business, technology, science, entertainment, and sports topics using the GDELT DOC API. Stories link to their original publishers and the endpoint requires no API key.
- `/learn`: subject-based student questions, replies, teacher profiles, declared availability, and account-member reviews.
- `/markets/stocks`: stock quote lookup using Alpha Vantage (requires a server-side API key and is subject to provider limits).
- `/markets/crypto`: crypto market direction using Binance public market data; no API key required.
- `/assistant`: AAYI site assistant using OpenRouter. The free model route has usage limits and model availability can change.
- `/affiliates`: affiliate information and recommendations.

## Local setup

Copy `.env.example` to `.env.local` and configure server-only variables:

- `DATABASE_URL`: PostgreSQL connection string. Railway's Postgres service exposes this variable; link it to the web service with a Railway reference variable.
- `DATABASE_SSL`: set to `true` only when the database connection requires TLS.
- `AUTH_SECRET`: unique random secret of at least 32 characters for signing login sessions.
- `OPENROUTER_API_KEY`: enables the AAYI site assistant. `OPENROUTER_MODEL=openrouter/free` selects OpenRouter's free model route; availability and usage limits can change.
- `ALPHA_VANTAGE_API_KEY`: optional stock quote provider key.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_EMAIL`: optional signup notification configuration.

The first account request creates the account and community tables in the configured database. Passwords are stored as salted scrypt hashes. Community posts require an active signed-in account and are rate-limited. Signup does not verify email ownership, and teacher availability is self-declared. Weather and headline requests are fetched through server routes and cached to reduce requests to the public providers. Weather data is attributed to MET Norway under CC BY 4.0. Headlines link to their original publishers.

Configure secrets in Railway rather than committing them to the repository. The affiliate page currently provides the disclosure and category structure; partner recommendations and tracked links have not been added yet.
