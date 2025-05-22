import { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useContractContext } from "../../context/ContractContext";
import { parseEther } from "ethers";

export default function DonationForm({ campaign, onDonationSuccess }) {
  const { account, contribute } = useContractContext();
  const [donationAmount, setDonationAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  // Check if deadline has passed
  useEffect(() => {
    if (campaign?.deadlineTimestamp) {
      const deadlineDate = new Date(campaign.deadlineTimestamp * 1000);
      setIsDeadlinePassed(deadlineDate < new Date());
    }
  }, [campaign]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (isDeadlinePassed) {
      setError(
        "This campaign has ended. Contributions are no longer accepted."
      );
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Convert amount to wei
      const amountInWei = parseEther(donationAmount);

      // Send the contribution
      await contribute(campaign.address, amountInWei);

      setSuccess(true);

      // Call the callback if provided
      if (onDonationSuccess) {
        onDonationSuccess();
      }
    } catch (err) {
      console.error("Contribution error:", err);
      setError(err.message || "Failed to process contribution");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircleIcon className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-3 text-lg font-medium text-green-800">
          Thank you for your support!
        </h3>
        <div className="mt-2 text-sm text-green-700">
          <p>
            Your contribution of{" "}
            <span className="font-semibold">{donationAmount} ETH</span> to{" "}
            <span className="font-semibold">"{campaign.title}"</span> has been
            processed.
          </p>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setDonationAmount("");
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Make another contribution
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Contribute ETH
        </h3>

        <div className="mt-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount (ETH)
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="amount"
              id="amount"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="0.1"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              min="0"
              step="0.01"
              disabled={isProcessing || isDeadlinePassed}
            />
          </div>
        </div>

        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

        <div className="mt-5">
          <button
            type="submit"
            className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
              isProcessing || !account || !donationAmount || isDeadlinePassed
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
            disabled={
              isProcessing || !account || !donationAmount || isDeadlinePassed
            }
          >
            {isProcessing ? (
              <span className="flex items-center">
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
            ) : !account ? (
              "Connect Wallet to Contribute"
            ) : isDeadlinePassed ? (
              "Campaign Has Ended"
            ) : (
              "Contribute Now"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
