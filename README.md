

# 🌟 SuperFan — Web3 Hybrid DApp

**SuperFan** is a full-stack decentralized celebrity-fan platform. It enables fans to send messages (optionally with tips) to celebrities, backed by smart contracts. Messages can be sent using both ETH and a custom token called **FAN**. The app combines a Web3 smart contract system with a modern React frontend and a Node.js + MongoDB backend.


## ⚙️ Tech Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: Vite + React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Wallet Integration**: MetaMask via Ethers.js
- **Utilities**: dotenv, concurrently, nodemon, CORS


## 📁 Project Structure


```

root/  
├── contracts/ # Solidity smart contracts  
├── artifacts/ # Hardhat build output  
├── client/ # Frontend (React + Vite)  
│ ├── .env # Frontend config (created from .env.example)  
│ ├── .env.example # Sample env vars for client  
│ └── package.json  
├── server/ # Backend (Express + MongoDB)  
│ └── package.json  
├── .env # Backend config (created from .env.example)  
├── .env.example # Sample env vars for backend  
├── package.json # Root-level scripts and Hardhat deps

```


## 🚀 Requirements

- **Node.js v20+** (required)
- **MetaMask wallet** installed in browser
- **MongoDB URI** (local or Atlas)
- **FAN Token, NFT & Guestbook contracts deployed locally** (see below)


## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Aravin008/superfan-dapp.git
cd superfan-dapp

```

----------

### 2. Install Dependencies

Install separately in three locations:

#### a) Root (for Hardhat & contracts)

```bash
npm install

```

#### b) Client (Frontend)

```bash
cd client
npm install

```

#### c) Server (Backend)

```bash
cd ../server
npm install

```

----------

### 3. Configure Environment Variables

#### a) Backend (`.env` in root)

```bash
cp .env.example .env

```

Update `.env` with:

```env
MONGO_URI=
RPC_URL=http://localhost:8545
JWT_SECRET=

FAN_TOKEN_ADDRESS=
NFT_CONTRACT_ADDRESS=
GUESTBOOK_ADDRESS=

```

#### b) Frontend (`.env` in `client/`)

```bash
cd client
cp .env.example .env

```

Update `client/.env` with:

```env
VITE_FAN_TOKEN_ADDRESS=
VITE_NFT_CONTRACT_ADDRESS=
VITE_GUESTBOOK_ADDRESS=

```

----------

## 🧪 Local Blockchain Setup

### Step 1: Start Local Hardhat Node

From the root directory:

```bash
npx hardhat node

```

This boots a local Ethereum network on `http://localhost:8545`.

----------

### Step 2: Deploy and Setup Contracts

Deploy contracts to the local network:

```bash
npx hardhat run scripts/setupMyInfra.js --network localhost

```

This will deploy and print contract addresses like:

```
FanToken deployed at: 0x...
EventNFT deployed at: 0x...
GuestbookWithTips deployed at: 0x...

```

----------

### Step 3: Copy Addresses to .env Files

Update the above addresses in:

-   `.env` (for backend)
    
-   `client/.env` (for frontend)
    

----------

### Step 3: Copy Addresses to .env Files

Update the above addresses in:

-   `.env` (for backend)
    
-   `client/.env` (for frontend)
    

----------

## ⚠️ Troubleshooting: Hardhat + MetaMask Reset Guide [Only on Hardhat restarts]

Hardhat runs an in-memory blockchain that resets every time it's restarted. This leads to broken MetaMask connections, missing contracts, and incorrect balances.

> You **must repeat these steps every time** you restart Hardhat to avoid issues.


### 🧱 Hardhat Reset Steps

1.  **Restart Hardhat node**:
    
    ```bash
    npx hardhat node
    
    ```
    
2.  **Re-deploy contracts to local network**:
    
    ```bash
    npx hardhat run scripts/setupMyInfra.js --network localhost
    
    ```
    
3.  **Start the full-stack app**:
    
    ```bash
    npm run dev
    
    ```


### 🦊 MetaMask Reset Steps

1.  **Remove previously imported Hardhat accounts**:
    
    -   Go to MetaMask → Settings → Accounts → Remove
        
2.  **Switch to another network** temporarily  
    (MetaMask doesn't allow deleting the current network)
    
3.  **Delete the `localhost 8545` network**
    
4.  **Re-add Hardhat local network**:
    
    -   **Network Name**: Hardhat Localhost
        
    -   **RPC URL**: `http://127.0.0.1:8545`
        
    -   **Chain ID**: `31337`
        
5.  **Re-import Hardhat accounts**:
    
    -   Use the **first account's private key** (printed by `npx hardhat node`)
        
    -   Repeat for fan account (second key)
        
6.  **Re-import FAN Token in MetaMask**:
    
    -   Go to the imported account → "Import Tokens"
        
    -   Paste the **FAN token contract address** (from deploy logs)
        

> 🧠 These steps are mandatory every time you restart `npx hardhat node`.

----------

## 📦 Start the Full Stack Development Environment

From the root directory, run:

```bash
npm run dev

```

----------


### Step 4: Setup MetaMask for Local Development

1.  Open **MetaMask** in your browser.
    
2.  Add a new **Custom Network**:
    
    -   **Network Name**: Hardhat Localhost
        
    -   **RPC URL**: `http://localhost:8545`
        
    -   **Chain ID**: `31337`
        
3.  Import accounts from Hardhat:
    
    -   Use the **first Hardhat account**'s **private key** to import the deployer.  
        This account owns **999,000 FAN tokens** and can be used to **register as a Creator** on the landing page.
        
    -   Use the **second Hardhat account** as the **fan**.  
        It holds **1000 FAN tokens** and can be used to interact with creators.
        
    
    > Private keys are printed in the Hardhat console when you run `npx hardhat node`.
    

----------

## 📦 Start the Full Stack Development Environment

From the root directory, run:

```bash
npm run dev

```

This concurrently starts:

-   **Frontend** on [http://localhost:5173](http://localhost:5173/)
    
-   **Backend API** on [http://localhost:3001](http://localhost:3001/)
    

----------

### Scripts (`package.json`)

```json
"scripts": {
  "client": "npm --prefix client run dev",
  "server": "nodemon server/server.js",
  "dev": "concurrently \"npm run client\" \"npm run server\""
}

```

----------

## ✨ Key Features

-   ⚡ Send messages to celebrities (on-chain & off-chain)
    
-   💰 Tip messages with ETH or FAN tokens
    
-   🎖 NFT-based interactions with smart contract validation
    
-   🧾 RESTful backend API with MongoDB
    
-   🔐 MetaMask wallet authentication
    
-   🛠 Real smart contract events + UI updates
    

----------

## 🔮 Future Enhancements

-   Deploy to public testnet or mainnet
    
-   Add Events and NFT functionality
    
-   Add Sign-In with Ethereum (SIWE)
    
-   Dockerize for seamless deployment
    

----------

> Built with ❤️ for creators and their biggest fans — powered by Web3.
