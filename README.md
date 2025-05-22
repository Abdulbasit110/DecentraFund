# DecentraFund - Decentralized Crowdfunding DApp

DecentraFund is a decentralized crowdfunding platform built on Ethereum that allows creators to fund their projects through cryptocurrency contributions.

![DecentraFund Landing Page](./Landing%20page.png)

## 📋 Features

### Core Functionality
- **Wallet Connection**
  - Connect with MetaMask or other Ethereum wallets
  - Display connected wallet address in UI
  - Support for multiple networks
  - User-friendly wallet status display

- **Campaign Management**
  - View all crowdfunding campaigns
  - See detailed campaign information
  - Create new crowdfunding campaigns
  - Set funding goals and deadlines

- **Contribution System**
  - Contribute ETH to campaigns
  - Real-time transaction status updates
  - Transaction history tracking

- **Campaign Information Display**
  - Campaign details (title, description, goal, deadline)
  - Progress tracking with visual progress bars
  - ETH values properly formatted and displayed
  - Human-readable timestamps and dates

- **Smart Contract Integration**
  - Direct interaction with Ethereum blockchain
  - Secure fund management through smart contracts
  - Escrow functionality for fund protection

## 🛠️ Technologies Used

- **Frontend**
  - React.js
  - Tailwind CSS
  - Heroicons
  - React Router

- **Web3 Integration**
  - Ethers.js
  - MetaMask connectivity

- **Smart Contracts**
  - Solidity 
  - OpenZeppelin contracts
  - Foundry (for development & testing)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- MetaMask or other Ethereum wallet browser extension
- Test ETH for a supported testnet (Sepolia, Goerli, etc.)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Abdulbasit110/DecentraFund
   cd DecentraFund
   ```

2. Install frontend dependencies
   ```
   cd frontend
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:5173 (or the URL provided in the terminal)

## 📝 Usage Guide

### Connecting Your Wallet
1. Click the "Connect Wallet" button in the header
2. Approve the connection request in your MetaMask (or other wallet)
3. Your wallet address will appear in the UI once connected

### Browsing Campaigns
1. Navigate to the "View Campaigns" tab
2. Browse through available crowdfunding campaigns
3. Click on a campaign card to view more details

### Contributing to a Campaign
1. Open a campaign's details page
2. Enter the amount of ETH you want to contribute
3. Click "Contribute" button
4. Confirm the transaction in your wallet
5. Wait for transaction confirmation

### Creating a Campaign (if available)
1. Go to the "Create Campaign" tab
2. Fill in the campaign details (title, description, goal, deadline)
3. Submit the form
4. Confirm the transaction in your wallet

## ⚙️ Smart Contract Architecture

The DecentraFund platform is built on three main contracts:

1. **CrowdfundingFactory** - Creates and manages campaign contracts
2. **CrowdfundingCampaign** - Individual campaign with contribution functionality
3. **EscrowManager** - Handles secure fund management

## 🧪 Testing Smart Contracts

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Deploy

```shell
$ forge script script/Deploy.s.sol:DeployScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

## 🧪 Testing the DApp

The DApp can be tested on Ethereum testnets (Sepolia, Goerli) using test ETH. 
Make sure you have test ETH in your wallet before attempting to create campaigns or make contributions.

You can get test ETH from various faucets:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Goerli Faucet](https://goerlifaucet.com/)

## 📚 Important Notes

- This is a test project for demonstration purposes
- Always confirm that you're connected to the correct network when testing
- The DApp supports multiple Ethereum networks, but contracts must be deployed on the network you're using
- If MetaMask is not detected, the app will display a notification with installation instructions

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure contract libraries
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Ethereum](https://ethereum.org/) for the blockchain platform
- [Foundry](https://book.getfoundry.sh/) for smart contract development tools
