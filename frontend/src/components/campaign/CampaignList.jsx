import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useContractContext } from "../../context/ContractContext";
import { formatEther } from "ethers";
import CampaignCard from "./CampaignCard";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const CampaignList = () => {
  const { contracts, getCampaignData } = useContractContext();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampaigns = useCallback(async () => {
    if (!contracts.factory) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get deployed campaign addresses
      const campaignAddresses = await contracts.factory.getDeployedCampaigns();

      // Fetch data for each campaign
      const campaignData = await Promise.all(
        campaignAddresses.map(async (address) => {
          const data = await getCampaignData(address);
          if (!data) return null;

          // Calculate days left
          const daysLeft = Math.max(
            0,
            Math.floor(
              (Number(data.deadline) - Math.floor(Date.now() / 1000)) / 86400
            )
          );

          // Format data
          return {
            id: campaignAddresses.indexOf(address),
            address,
            title: data.title,
            description: data.description,
            goal: formatEther(data.goal),
            currentAmount: formatEther(data.totalRaised),
            progress: (Number(data.totalRaised) / Number(data.goal)) * 100,
            deadline: new Date(
              Number(data.deadline) * 1000
            ).toLocaleDateString(),
            creator: data.creator,
            daysLeft,
            imageURL: data.imageURL || "/assets/localart.jpg",
          };
        })
      );

      // Filter out null values (in case of errors)
      const validCampaigns = campaignData.filter(
        (campaign) => campaign !== null
      );
      setCampaigns(validCampaigns);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [contracts.factory, getCampaignData]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleRefresh = () => {
    fetchCampaigns();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="h-5 w-5 text-red-500 mr-2">
            <ExclamationTriangleIcon />
          </div>
          <span className="font-medium">Error: {error}</span>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-red-300 text-sm leading-5 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:border-red-400 focus:shadow-outline-red active:bg-red-200"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Retry
        </button>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          No Campaigns Found
        </h3>
        <p className="text-gray-500 mb-4">
          There are no active crowdfunding campaigns at the moment.
        </p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">All Campaigns</h2>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {campaigns.map((campaign) => (
          <Link
            to={`/campaigns/${campaign.id}`}
            key={campaign.address}
            className="block hover:shadow-md transition duration-150"
          >
            <CampaignCard campaign={campaign} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;
