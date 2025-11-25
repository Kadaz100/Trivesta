# Trivesta - Crypto Presale & Investment Platform

A modern, responsive crypto presale and investment platform built with Next.js, Express, and Firebase.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with Firebase
- 💰 **Investment Plans** - Multiple investment tiers with customizable options
- 📊 **Real-time Dashboard** - Track investments with live growth simulation
- 💳 **Crypto Payments** - Support for USDT, BTC, ETH, and SOL
- 🔍 **Transaction Verification** - Blockchain-verified transaction hashes
- 📱 **Fully Responsive** - Beautiful UI that works on all devices
- 🎨 **Amazing Animations** - Smooth transitions powered by Framer Motion
- 🎨 **Beautiful Design** - White and deep purple theme

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Swiper** - Carousel component for About page

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Firebase Admin SDK** - Database and authentication
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Firebase project with Firestore enabled
- Firebase Admin SDK credentials

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy Firebase credentials:
   - Place your Firebase Admin SDK JSON file as `firebase-credentials.json` in the backend directory
   - Or set up environment variables (see `.env.example`)

4. Create a `.env` file:
```bash
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
TVS_RATE=10

# Wallet addresses (replace with your actual addresses)
USDT_WALLET_ADDRESS=your_usdt_address
BTC_WALLET_ADDRESS=your_btc_address
ETH_WALLET_ADDRESS=your_eth_address
SOL_WALLET_ADDRESS=your_sol_address

# Optional explorer configuration
ETH_RPC_URL=https://rpc.ankr.com/eth
USDT_CONTRACT_ADDRESS=0xdAC17F958D2ee523a2206206994597C13D831ec7
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
Trivesta/
├── backend/
│   ├── models/          # Data models (User, Investment)
│   ├── routes/          # API routes (auth, investments, wallet)
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions (crypto verification)
│   ├── firebase-config.js
│   └── index.js         # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js app router pages
│   │   ├── components/  # React components
│   │   └── lib/         # API client and utilities
│   └── package.json
└── README.md
```

## Pages

1. **Login/Signup** (`/`) - Landing page with authentication
2. **Home** (`/home`) - Welcome page with stats and features
3. **Invest** (`/invest`) - Investment plans and payment flow
4. **Dashboard** (`/dashboard`) - View investments and track growth
5. **About Us** (`/about`) - Platform information with carousels

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Investments
- `GET /api/investments` - Get all user investments (protected)
- `POST /api/investments` - Create new investment (protected)
- `GET /api/investments/:id` - Get investment by ID (protected)

### Wallet
- `GET /api/wallet/addresses` - Get wallet addresses for payments
- `GET /api/wallet/plans` - Get investment plans
- `GET /api/wallet/stats` - Get dashboard statistics (protected)

## Features in Detail

### Investment Flow
1. User selects an investment plan or creates a custom one
2. User chooses payment cryptocurrency (USDT, BTC, ETH, SOL)
3. System displays wallet address and QR code
4. User sends payment from external wallet
5. User pastes transaction hash
6. Backend verifies transaction via blockchain explorer APIs
7. Investment is created with locked TVS tokens
8. Growth simulation starts (0.5% daily)

### Growth Simulation
- Investments grow at 0.5% daily
- Real-time updates in dashboard
- Timer shows remaining lock period
- Visual progress bars

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Transaction hash verification
- Input validation

## Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
npm start
```

Backend:
```bash
cd backend
npm start
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `TVS_RATE` - Conversion rate (1 USD = X TVS)
- `*_WALLET_ADDRESS` - Wallet addresses for each cryptocurrency
- `ETH_RPC_URL` - Ethereum JSON-RPC endpoint used for verification (defaults to Ankr public RPC)
- `USDT_CONTRACT_ADDRESS` - Override if you fund from a different USDT contract/network
- `SKIP_TX_VERIFICATION` - Set to `true` locally to bypass blockchain verification

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Notes

- Transaction verification uses blockchain explorer APIs (Etherscan, Blockstream, Solana RPC)
- For production, you'll need API keys for these services
- Growth simulation is off-chain and for demonstration purposes
- Real token distribution would happen after token launch

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.

