# DecentraFund Frontend - React + Web3 Implementation

This is the frontend implementation for the DecentraFund decentralized crowdfunding platform, built with React and Ethers.js for Web3 integration.

![DecentraFund Landing Page](../Landing%20page.png)

## 🎯 Assessment Implementation

This project was completed as part of a skill test for React + Web3 development. The implementation includes:

### ✅ Wallet Connection
- Successfully integrated MetaMask wallet connection
- Displaying connected wallet address in the UI
- Added graceful error handling when MetaMask is not installed
- Created wallet status component showing current connection status

### ✅ Campaign Info Display
- Implemented `getCampaignData()` function to fetch campaign information
- Displaying campaign title, goal, raised amount, and deadline
- Converting ETH values from Wei to human-readable format
- Converting timestamps to user-friendly date formats

### ✅ Contribution Functionality
- Implemented the `contribute()` function to send ETH to campaigns
- Added proper transaction state handling (loading, success, error)
- Providing visual feedback during transaction processing
- Refreshing data after successful contributions

### ✅ UI Wiring
- Connected all React components according to requirements
- Implemented campaign info component with progress tracking
- Created contribution form with amount input and submit button
- Added wallet status section showing connection details

### 💎 Bonus Features
- Added deadline validation to disable contributions to ended campaigns
- Implemented data refresh functionality after successful transactions

## 🚀 Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to the URL provided in the terminal (typically http://localhost:5173)

## 🧰 Technologies Used

- **React** with Hooks for UI
- **Ethers.js** for blockchain interaction
- **TailwindCSS** for styling
- **React Router** for navigation
- **Heroicons** for UI elements

## 📝 Important Notes

- The app requires MetaMask or a similar Web3 wallet to function
- Smart contracts are deployed on Ethereum testnets - make sure to connect to the right network
- To test contributions, you'll need test ETH from a testnet faucet

## 📱 Testing Instructions

1. Connect your wallet using the "Connect Wallet" button
2. Browse the list of campaigns 
3. Select a campaign to view details
4. Enter an amount and click "Contribute" to test the contribution flow
5. Check that the UI updates with the new contribution amount

## 📚 Project Structure

- `src/components/campaign/` - Campaign-related components
- `src/components/common/` - Shared UI components
- `src/context/` - React context for state management
- `src/contracts/` - Contract ABIs and addresses
- `src/hooks/` - Custom React hooks
- `src/pages/` - Page components
- `src/utils/` - Utility functions and helpers
