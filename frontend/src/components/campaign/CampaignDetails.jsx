import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContractContext } from "../../context/ContractContext";
import { parseEther, formatEther } from "ethers";
import { EscrowState } from "../../utils/enums";
import ProgressBar from "../common/ProgressBar";
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  CheckIcon,
  XIcon,
} from "@heroicons/react/24/outline";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    account,
    contracts,
    executeTx,
    getCampaignData, // We'll use this to fetch campaign data
    contribute, // We'll use this for contributions
    getEscrowStatus,
    getEscrowBalance,
    getRequiredApprovals,
    getCurrentApprovals,
    isApprover,
    depositToEscrow,
    requestFundsRelease,
    approveFundsRelease,
    releaseFunds,
    claimRefund,
  } = useContractContext();
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDonating, setIsDonating] = useState(false);
  const [escrow, setEscrow] = useState({
    status: null,
    balance: null,
    requiredApprovals: null,
    currentApprovals: null,
    isUserApprover: false,
    isLoading: false,
  });
  const [withdrawRequest, setWithdrawRequest] = useState({
    description: "",
    amount: "",
    recipient: "",
  });
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const fetchCampaignAndEscrowData = useCallback(async () => {
    try {
      if (!contracts.factory) {
        throw new Error("Contract not initialized");
      }

      // Get the campaign address from factory
      const campaignAddress = await contracts.factory.deployedCampaigns(id);
      // Fetch campaign data using our new function
      const campaignData = await getCampaignData(campaignAddress);

      if (!campaignData) {
        throw new Error("Failed to fetch campaign data");
      }

      setCampaign({
        id,
        address: campaignAddress,
        title: campaignData.title,
        description: campaignData.description,
        image: campaignData.imageURL || "/assets/localart.jpg",
        goal: formatEther(campaignData.goal),
        currentAmount: formatEther(campaignData.totalRaised),
        deadline: new Date(
          Number(campaignData.deadline) * 1000
        ).toLocaleDateString(),
        deadlineTimestamp: Number(campaignData.deadline),
        owner: campaignData.creator,
        isOwner: campaignData.isCreator,
      });

      // Fetch escrow data
      setEscrow((prev) => ({ ...prev, isLoading: true }));
      const [status, balance, required, current, approver] = await Promise.all([
        getEscrowStatus(id),
        getEscrowBalance(id),
        getRequiredApprovals(id),
        getCurrentApprovals(id),
        isApprover(id, account),
      ]);

      setEscrow({
        status,
        balance: formatEther(balance),
        requiredApprovals: required,
        currentApprovals: current,
        isUserApprover: approver,
        isLoading: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    id,
    contracts.factory,
    account,
    getEscrowStatus,
    getEscrowBalance,
    getRequiredApprovals,
    getCurrentApprovals,
    isApprover,
  ]);

  useEffect(() => {
    fetchCampaignAndEscrowData();
  }, [fetchCampaignAndEscrowData]);
  const handleDonate = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setIsDonating(true);
      setError(null);

      // Convert the donation amount to wei
      const amountInWei = parseEther(donationAmount);

      // Use our contribute function to send the transaction
      await contribute(campaign.address, amountInWei);

      // Clear the donation amount input
      setDonationAmount("");

      // Refresh campaign data to show updated amount
      await fetchCampaignAndEscrowData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDonating(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      if (!contracts.campaign) {
        throw new Error("Contract not initialized");
      }

      setIsCreatingRequest(true);
      setError(null);

      const tx = await executeTx(contracts.campaign.createRequest, [
        withdrawRequest.description,
        parseEther(withdrawRequest.amount),
        withdrawRequest.recipient,
      ]);

      await tx.wait();
      setWithdrawRequest({
        description: "",
        amount: "",
        recipient: "",
      });
      // Refresh campaign data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreatingRequest(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      if (!contracts.campaign) {
        throw new Error("Contract not initialized");
      }

      const tx = await executeTx(contracts.campaign.approveRequest, [
        requestId,
      ]);

      await tx.wait();
      // Refresh campaign data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFinalizeRequest = async (requestId) => {
    try {
      if (!contracts.campaign) {
        throw new Error("Contract not initialized");
      }

      const tx = await executeTx(contracts.campaign.finalizeRequest, [
        requestId,
      ]);

      await tx.wait();
      // Refresh campaign data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load campaign details</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
            <p>Error: {error}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Go Back
          </button>
        </div>
      ) : campaign ? (
        <div>
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
          </button>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {campaign.title}
              </h1>
              <p className="text-gray-500 mb-4">{campaign.description}</p>

              {/* Campaign Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">
                    {(
                      (parseFloat(campaign.currentAmount) /
                        parseFloat(campaign.goal)) *
                      100
                    ).toFixed(1)}
                    % Complete
                  </span>
                  <span className="text-gray-500">
                    Goal: {campaign.goal} ETH
                  </span>
                </div>
                <ProgressBar
                  current={parseFloat(campaign.currentAmount)}
                  total={parseFloat(campaign.goal)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium">Raised</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {campaign.currentAmount} ETH
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <ClockIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium">Deadline</span>
                  </div>
                  <p className="text-2xl font-bold">{campaign.deadline}</p>
                  {campaign.deadlineTimestamp * 1000 < Date.now() && (
                    <p className="text-red-500 text-sm">Campaign has ended</p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <UserIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <span className="font-medium">Creator</span>
                  </div>
                  <p className="text-md font-medium overflow-hidden text-ellipsis">
                    {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}
                  </p>
                </div>
              </div>

              {/* Donation Form */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Contribute to this Campaign
                </h2>
                {campaign.deadlineTimestamp * 1000 < Date.now() ? (
                  <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-4">
                    This campaign has ended. Contributions are no longer
                    accepted.
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="Amount in ETH"
                      className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      step="0.01"
                    />
                    <button
                      onClick={handleDonate}
                      disabled={isDonating || !account || !donationAmount}
                      className={`px-6 py-2 rounded-md text-white ${
                        isDonating || !account || !donationAmount
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                    >
                      {isDonating ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Contribute"
                      )}
                    </button>
                  </div>
                )}
                {error && (
                  <div className="mt-2 text-red-600 text-sm">{error}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p>Campaign not found</p>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails;
