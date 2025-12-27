# Virgosoft Exchange - Frontend

A modern, real-time cryptocurrency exchange frontend built with Vue 3, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Secure login and registration with JWT tokens
- **Real-time Updates**: Live order matching notifications via Pusher/Laravel Echo
- **Limit Orders**: Place buy/sell limit orders for BTC and ETH
- **Orderbook**: Real-time orderbook display with sorted buy/sell orders
- **Order Management**: View, filter, and cancel your orders
- **Wallet Overview**: Track USD balance and crypto assets
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Pinia** - Modern state management
- **Vue Router** - Client-side routing with route guards
- **Axios** - HTTP client with request/response interceptors
- **Pusher/Laravel Echo** - Real-time WebSocket connections
- **Tailwind CSS** - Utility-first CSS framework


## Prerequisites

- Node.js 18+ and npm
- Access to the Virgosoft Exchange API

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
The `.env` file is already configured with:
```env
VITE_API_BASE_URL=https://api-virgosoft-exchange.mirrorlog.com/api/v1
VITE_PUSHER_APP_KEY=
VITE_PUSHER_APP_CLUSTER=mt1
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`


## Available Test Accounts

```
Email: bob@example.com
Password: password

Email: alice@example.com
Password: password
```
