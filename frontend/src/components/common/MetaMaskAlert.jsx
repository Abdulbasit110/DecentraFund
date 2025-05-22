import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const MetaMaskAlert = () => {
  const openMetaMaskDownload = () => {
    window.open("https://metamask.io/download/", "_blank");
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            MetaMask is required to use this application. Please install
            MetaMask to connect your wallet.
          </p>
          <div className="mt-2">
            <button
              type="button"
              onClick={openMetaMaskDownload}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Install MetaMask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskAlert;
