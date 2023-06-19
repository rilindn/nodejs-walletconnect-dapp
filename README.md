# NodeJS dApp (with standalone v2 client)

## Overview
This is an example implementation of a NodeJS dApp using the standalone client for WalletConnect v2 to:

- handle pairings
- manage sessions
- send JSON-RPC requests to a paired wallet



## Running locally

Install the app's dependencies:

```npm install```

Set up your local environment variables by copying the example into your own .env.local file:

```cp .env.example .env```

Your ```.env``` now contains the following environment variables:

```NEXT_PUBLIC_PROJECT_ID``` (placeholder) - You can generate your own ProjectId at https://cloud.walletconnect.com
