import React, { useState, useEffect } from "react";
import CampaignList from "../components/campaign/CampaignList";
import CreateCampaign from "../components/campaign/CreateCampaign";
import ConnectWalletButton from "../components/common/ConnectWalletButton";
import WalletStatus from "../components/common/WalletStatus";
import MetaMaskAlert from "../components/common/MetaMaskAlert";
import TransactionHistory from "../components/common/TransactionHistory";
import { useContractContext } from "../context/ContractContext";

const CampaignPage = () => {
  const { provider } = useContractContext();
  const [activeTab, setActiveTab] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);

  useEffect(() => {
    // Check if MetaMask is installed
    setIsMetaMaskInstalled(typeof window.ethereum !== "undefined");
  }, []);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
  };

  const handleCampaignCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setActiveTab(0);
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Crowdfunding Campaigns
        </h1>
        <ConnectWalletButton />
      </div>
      {/* Show MetaMask alert if it's not installed */}
      {!isMetaMaskInstalled && <MetaMaskAlert />}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 0
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange(0)}
        >
          View Campaigns
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 1
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange(1)}
        >
          Create Campaign
        </button>
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 0 ? (
            <CampaignList key={refreshKey} />
          ) : (
            <CreateCampaign onCampaignCreated={handleCampaignCreated} />
          )}
        </div>
        <div className="lg:col-span-1">
          <WalletStatus />
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
};

export default CampaignPage;
