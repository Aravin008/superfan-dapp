import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import ToggleSwitch from './ui/ToggleSwitch'; // You already have this
import ConfirmDialog from './ui/ConfirmDialog';
import CreateNFTAccessTokens from './CreateNFTAccessToken';
import { useNftContract } from '../hooks/useNFTContract';
import { useFanToken } from '../hooks/useFanToken';
import FanPassCard from './FanPassCard';

export default function EventComp() {
  const { id } = useParams();
  const { readOnlyContract, signer, isCurrentUserCreator: isCreator, currentAccount } = useWallet();
  const {contract: nftContract, signer: nftSigner} = useNftContract();
  const { contract: fanToken } = useFanToken();

  const [event, setEvent] = useState(null);
  const [nftEvent, setNftEvent] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCreateNFTForm, setShowCreateNFTForm] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(1);
  const [tokenId, setTokenId] = useState(null);
  const [tokenUri, setTokenUri] = useState(null);

  useEffect(() => {
    if (readOnlyContract && signer && id && nftContract && refreshFlag) {
      fetchEventDetails();
    }
  }, [readOnlyContract, signer, id, nftContract, refreshFlag]);

  const fetchEventDetails = async () => {
    try {
      const event = await readOnlyContract.events(id);
      const signerAddr = await signer.getAddress();
      let hasAccess = await readOnlyContract.eventAccess(id, signerAddr);

      if(event.isNftGated && event.nftEventId >= 0) {
        const balance = await nftContract.balanceForEvent(event.nftEventId, signerAddr);
        if (balance > 0) {
          hasAccess = true;
          const tokenIdFetch = await nftContract.tokenOfUserForEvent(event.nftEventId, signerAddr);
          setTokenId(tokenIdFetch);
          const tokenUriFetch = await nftContract.tokenURI(tokenIdFetch);
          setTokenUri(tokenUriFetch);
        }
        const nftEvent = await nftContract.nftEvents(event.nftEventId);
        setNftEvent({
          ...nftEvent,
          priceInFAN: ethers.formatEther(nftEvent.priceInFAN),
          priceInETH: ethers.formatEther(nftEvent.priceInETH),
        })
      }

      setEvent({
        eventId: id,
        creator: event.creator,
        title: event.title,
        description: event.description,
        date: event.date,
        eventAccess: hasAccess,
        isNftGated: event.isNftGated,
        ...event
      });
    } catch (err) {
      console.error("Error fetching event or access", err);
    }
  };

  const handleNFTSwitchToggle = () => {
    if(event.isNftGated) {
      alert("You have already enabled NFT for the event, You can't disbale it.");
      return;
    }
    setShowConfirm({
      message: "This action cannot be reversed. Do you want to proceed?",
      handleConfirm: () => { setShowConfirm(null); setShowCreateNFTForm(true) },
      handleCancel: () => { setShowConfirm(null);}
    })
    // setNftEnabled(!nftEnabled)
  }

  const handleMintNFT = async (nftEventId, priceInETH, priceInFAN) => {
    if(priceInETH !== null) {
      try {
        const tx = await nftContract.mintWithETH(nftEventId, {
          value: ethers.parseEther(priceInETH), // if FAN is native price.toString()
        });
        await tx.wait();
        alert("NFT minted! 🎉 You now have access.");
        fetchEventDetails();
      } catch (err) {
        console.error(err);
        alert("Minting failed.");
      }
    } else {
      const contractAddress = await nftContract.getAddress();
      const sender = await nftSigner.getAddress();
      try {
        const allowance = await fanToken.allowance(sender, contractAddress);

        if (allowance < ethers.parseUnits(priceInFAN.toString(), 18)) {
          const approveTx = await fanToken.approve(contractAddress, ethers.parseUnits(priceInFAN, 18));
          await approveTx.wait();
          alert("✅ Approval successful. Click 'Buy With FAN' again to continue.");
          return;
        }
        const tx = await nftContract.mintWithFAN(nftEventId, {
          value: ethers.parseUnits( '0', "ether"), // if FAN is native price.toString()
        });
        await tx.wait();
        alert("NFT minted! 🎉 You now have access.");
        fetchEventDetails();
      } catch (err) {
        console.error(err);
        alert("Minting failed.");
      }
    }
    
  };

  if (!event) {
    return (
      <div className="p-6 text-center text-gray-700 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  const accessGranted = (ethers.getAddress(event.creator) === ethers.getAddress(currentAccount)) || event.eventAccess;

  return (
    <div className="w-full mx-auto px-16 py-8 bg-white dark:bg-gray-950 shadow-md min-h-screen">
      {/* Banner placeholder */}
      <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-md mb-8 flex items-center justify-center text-white text-2xl font-semibold">
        🎉 Event Details
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{event.title}</h1>

        <p className="mb-6 text-gray-700 dark:text-gray-300">{event.description}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-semibold">Creator</p>
            <p className="break-all text-gray-800 dark:text-gray-200">{event.creator}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-semibold">Date</p>
            <p className="text-gray-800 dark:text-gray-200">
              {new Date(ethers.getNumber(event.date)).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-semibold">Your Access</p>
          <p className={`text-lg font-semibold ${accessGranted ? "text-green-600" : "text-red-500"}`}>
            { (ethers.getAddress(event.creator) === ethers.getAddress(currentAccount))
              ? "✅ Your Event" 
              : event.eventAccess
              ? "✅ You have access to this event"
              : "❌ You do not have access"}
          </p>
        </div>

        {/* NFT Toggle (Only for Creator) */}
        {isCreator && ethers.getAddress(currentAccount) === ethers.getAddress(event.creator) && (
          <div className="mt-10 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-300">Enable NFT for this event</p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Let fans mint a commemorative NFT if enabled. This is currently {event.isNftGated ? "active" : "disabled"}.
                </p>
              </div>
              <ToggleSwitch
                isEnabled={event.isNftGated}
                onToggle={() => handleNFTSwitchToggle()} // Replace with real logic
              />
            </div>
          </div>
        )}

        { event.isNftGated && !isCreator && !event.eventAccess &&
          (
            <div className="p-4 border rounded bg-blue-50 dark:bg-gray-800 my-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-300">This event requires an NFT to join</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                You must mint an access NFT to participate in this event.
              </p>
              <div className='flex gap-4'>
                <button
                  onClick={() => handleMintNFT(event.eventId, nftEvent.priceInETH, null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Mint Access NFT {
                  event.isNftGated && (parseInt(nftEvent.priceInETH) === 0)
                  ? '(Free)' 
                  : `(${nftEvent.priceInETH} ETH)`}
                </button>
                {(parseInt(nftEvent.priceInFAN) !== 0) &&
                  <button
                    onClick={() => handleMintNFT(event.eventId, null, nftEvent.priceInFAN)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Mint Access NFT {`(${nftEvent.priceInFAN} FAN)`}
                  </button>
                }
              </div>
            </div>
          )
        }
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        message={showConfirm?.message}
        onConfirm={showConfirm?.handleConfirm}
        onCancel={showConfirm?.handleCancel}
      />

      <CreateNFTAccessTokens
        isOpen={showCreateNFTForm}
        onClose={() => setShowCreateNFTForm(false)}
        event={event}
        onSuccess={() => {
          console.log("Created NFT!!");
          setShowCreateNFTForm(false);
          setRefreshFlag((f) => f + 1);
        }}
      />

      {
        tokenId && tokenUri &&
        <FanPassCard
          event={event}
          nftEvent={nftEvent}
          tokenId={1}
          tokenUri={tokenUri}
          currentAccount={currentAccount}
        />

      }
    </div>
  );
}
