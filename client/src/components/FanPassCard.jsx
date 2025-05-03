import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrcodeIcon, UserIcon, CurrencyDollarIcon, IdentificationIcon } from "@heroicons/react/solid";

export default function FanPassCard({ tokenId, tokenUri, event, nftEvent, currentAccount }) {
  const [showQR, setShowQR] = useState(false);
  const [tokenDetails, setTokenDetails] = useState(null);

  const fetchTokenDetails = async (tokenUrl) => {
    const data = await fetch(tokenUrl);
    const jsonData = await data.json();
    setTokenDetails(jsonData);
  };

  useEffect(() => {
    if (tokenUri) fetchTokenDetails(tokenUri);
  }, [tokenUri]);

  return (
    <div className="my-10 flex justify-center">
      <div className="w-full max-w-md">
        <h2 className="font-bold text-2xl text-gray-800 dark:text-white mb-6 text-center">
          🎟️ Your Event Pass
        </h2>

        <div
          className="relative rounded-3xl bg-white shadow-l hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border hover:border-indigo-500/30"
          onClick={() => setShowQR(true)}
        >
          {/* Glow Layer */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 blur-md z-0"></div>

          {/* Content */}
          <div className="relative z-10 flex rounded-l-3xl rounded-r-sm overflow-hidden">
            {/* Image */}
            <img
              src={"http://localhost:3001" + tokenDetails?.image}
              alt={tokenDetails?.name}
              className="w-44 object-cover rounded-3xl"
            />

            {/* Details */}
            <div className="p-4 flex-1 justify-center">
              <h3 className="text-lg font-semibold text-gray-800">{tokenDetails?.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{tokenDetails?.description}</p>

              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-indigo-500" />
                  <span className="font-medium">Creator:</span>
                  {event?.creator?.slice(0, 6)}...{event?.creator?.slice(-4)}
                </p>
                <p className="flex items-center gap-2">
                  <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Price:</span>
                  {nftEvent.priceInETH} ETH / {nftEvent.priceInFAN} FAN
                </p>
                <p className="flex items-center gap-2">
                  <IdentificationIcon className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Token:</span> #{tokenId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Modal */}
        {showQR && (
          <div
            className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowQR(false)}
          >
            <div
              className="bg-white p-6 rounded-2xl shadow-2xl text-center relative animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                <QrcodeIcon className="h-5 w-5 text-indigo-600" />
                Ownership QR
              </h4>

              <QRCodeCanvas
                value={JSON.stringify({ tokenId, currentAccount })}
                size={180}
                level="H"
                className="mx-auto border border-gray-300 p-2 bg-white rounded-lg"
              />
              <p className="mt-4 text-sm text-gray-600">
                Token ID: <strong>#{tokenId}</strong><br />
                Owner: {currentAccount?.slice(0, 6)}...{currentAccount?.slice(-4)}
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="mt-5 px-5 py-2 bg-indigo-600 text-white text-sm rounded-full hover:bg-indigo-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
