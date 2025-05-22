import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContractContext } from "../../context/ContractContext";
import { parseEther } from "ethers";
import {
  ArrowRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import ProgressBar from "../common/ProgressBar";

const CampaignCard = ({ campaign, refreshCampaigns }) => {
  const { account, contracts, executeTx } = useContractContext();
  const [isDonating, setIsDonating] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleDonate = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }
    if (!contracts.campaign) {
      setError("Contract not initialized");
      return;
    }

    try {
      const tx = await executeTx(contracts.campaign.contribute, [], {
        value: parseEther(donationAmount),
      });

      setDonationAmount("");
      refreshCampaigns();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDonating(false);
    }
  };

  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.round(campaign.progress));

  return (
    <div
      className={`relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-indigo-300 transition-all duration-300 ${
        isHovered ? "transform hover:-translate-y-1 hover:shadow-lg" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Campaign Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={
            campaign.image.startsWith("/")
              ? campaign.image
              : `/assets/${campaign.image}`
          }
          onError={(e) => {
            e.target.src = "/assets/localart.jpg";
            e.target.onerror = null;
          }}
          alt={campaign.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Campaign Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {campaign.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {campaign.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <ProgressBar
            current={parseFloat(campaign.currentAmount)}
            total={parseFloat(campaign.goal)}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{progressPercentage}% Complete</span>
            <span>
              {campaign.currentAmount} / {campaign.goal} ETH
            </span>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
          <div className="flex items-center text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{campaign.daysLeft} days left</span>
          </div>

          <div className="flex items-center text-gray-500">
            <UserIcon className="h-4 w-4 mr-1" />
            <span title={campaign.creator}>
              {campaign.creator
                ? `${campaign.creator.slice(0, 4)}...${campaign.creator.slice(
                    -4
                  )}`
                : "Unknown"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
