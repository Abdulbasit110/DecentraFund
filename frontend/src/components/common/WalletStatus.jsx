import React from "react";
import { useContractContext } from "../../context/ContractContext";

export default function WalletStatus() {
  const { account, chainId } = useContractContext();

  // Common networks for display
  const networkNames = {
    1: "Ethereum Mainnet",
    5: "Goerli Testnet",
    11155111: "Sepolia Testnet",
    137: "Polygon Mainnet",
    80001: "Mumbai Testnet",
    56: "Binance Smart Chain",
    42161: "Arbitrum One",
  };

  const networkName = chainId
    ? networkNames[chainId] || `Chain ID: ${chainId}`
    : "Unknown Network";

  // Format address for display
  const displayAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "Not Connected";

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden p-4 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-2">Wallet Status</h2>

      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-500">Status:</span>
          <span
            className={`font-medium ${
              account ? "text-green-600" : "text-red-500"
            }`}
          >
            {account ? "Connected" : "Not Connected"}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-500">Address:</span>
          <span className="font-medium text-indigo-600">{displayAddress}</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500">Network:</span>
          <span className="font-medium text-indigo-600">{networkName}</span>
        </div>
      </div>
    </div>
  );
}
