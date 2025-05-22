import { useState, useEffect } from "react";
import { useContractContext } from "../../context/ContractContext";

export default function ConnectWalletButton({
  variant = "default",
  className = "",
}) {
  const { account, chainId, provider } = useContractContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);

  // Common networks for DApps
  const supportedNetworks = {
    1: "Ethereum",
    5: "Goerli",
    11155111: "Sepolia",
    137: "Polygon",
    80001: "Mumbai",
    56: "Binance",
    42161: "Arbitrum",
  };

  // Check if current network is supported
  const isSupportedNetwork = chainId && supportedNetworks[chainId];

  // Initialize provider if not already connected
  useEffect(() => {
    if (!account && typeof window.ethereum !== "undefined") {
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0 && provider) {
            // Account and chainId will be updated via context
            await provider.send("eth_requestAccounts", []);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      };
      checkConnection();
    }
  }, [account, provider]);
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      // Open MetaMask download page in a new tab
      window.open("https://metamask.io/download/", "_blank");
      alert(
        "MetaMask is not installed. We've opened the download page for you. Please install MetaMask and refresh this page."
      );
      return;
    }

    try {
      setIsConnecting(true);
      if (!provider) {
        throw new Error("Wallet provider not initialized");
      }
      await provider.send("eth_requestAccounts", []);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === -32002) {
        alert(
          "MetaMask connection request already pending. Please check your MetaMask extension."
        );
      } else {
        alert(`Failed to connect wallet: ${error.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        alert(
          "This network is not available in your wallet. Please add it first."
        );
      }
      console.error("Error switching network:", switchError);
    }
  };

  const getButtonStyles = () => {
    const baseStyles =
      "relative overflow-hidden transition-all duration-300 group";

    switch (variant) {
      case "landing":
        return `${baseStyles} border-2 border-white/50 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-medium sm:font-semibold text-base sm:text-lg hover:border-white hover:bg-white/10`;
      case "mobile":
        return `${baseStyles} w-full flex justify-center items-center px-3  sm:px-4 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700`;
      default:
        return `${baseStyles} w-full max-w-xs sm:w-auto flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-xs sm:text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`;
    }
  };

  // Display the connected address
  const displayAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "Connect Wallet";

  return (
    <div className={className}>
      {isSupportedNetwork || !account ? (
        <button
          onClick={
            account ? () => setShowNetworkMenu(!showNetworkMenu) : connectWallet
          }
          className={getButtonStyles()}
          disabled={isConnecting}
        >
          {isConnecting ? (
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
              Connecting...
            </span>
          ) : (
            <span className="flex items-center">
              {account ? (
                <>
                  {displayAddress}
                  {!isSupportedNetwork && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Unsupported Network
                    </span>
                  )}
                </>
              ) : (
                "Connect Wallet"
              )}
            </span>
          )}
        </button>
      ) : (
        <button
          onClick={() => setShowNetworkMenu(!showNetworkMenu)}
          className={getButtonStyles()}
        >
          <span className="flex items-center">
            {displayAddress}
            {chainId && supportedNetworks[chainId] && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {supportedNetworks[chainId]}
              </span>
            )}
          </span>
        </button>
      )}

      {/* Network Selector Menu */}
      {showNetworkMenu && (
        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {Object.entries(supportedNetworks).map(([id, name]) => (
              <button
                key={id}
                onClick={() => {
                  switchNetwork(parseInt(id));
                  setShowNetworkMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  parseInt(id) === chainId
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="menuitem"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
