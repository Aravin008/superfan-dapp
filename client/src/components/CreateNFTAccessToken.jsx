import {useRef, useState} from 'react';
import {ethers} from 'ethers';
import Label from "./ui/Label";
import Modal from "./ui/Modal";
import Input from './ui/Input';
import Textarea from './ui/TextArea';
import { useWallet } from '../context/WalletContext';

export default function CreateNFTAccessTokens({ isOpen, onClose, event, onSuccess }) {
  const [nftName, setNftName] = useState("");
  const [nftDesc, setNftDesc] = useState("");
  const [nftPriceETH, setNftPriceETH] = useState(0);
  const [nftPriceFAN, setNftPriceFAN] = useState(0);
  const [nftImage, setNftImage] = useState(null);
  const {contract} = useWallet();
  const fileUploadRef = useRef();

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("Form Submit");
      // console.log(nftName, nftPriceETH, nftPriceFAN, nftDesc, nftImage);
      // First upload image and get back url of json for nft
      const formData = new FormData();
      formData.append("image", nftImage); // your image file
      formData.append("name", nftName);
      formData.append("description", nftDesc);
      formData.append("attributes", JSON.stringify([
        { trait_type: "Access Level", value: "Gold" },
        { trait_type: "Valid Till", value: "2025-12-31" }
      ]));
  
      // setLoading(true);
      const resp = await fetch("http://localhost:3001/upload-nft", {
        method: "POST",
        body: formData,
      })
      const data = await resp.json();
      console.log("NFT metadata URL:", data.metadataUrl);
      const priceFan = nftPriceFAN ? ethers.parseUnits(nftPriceFAN, 18) : 0n;
      const priceETH = nftPriceETH ? ethers.parseEther(nftPriceETH || "0") : 0n;
      const tx = await contract.enableNFTAccessForEvent(event.eventId, priceETH, priceFan, data.metadataUrl)
      await tx.wait();
      alert("Successfully Created NFT");
      onSuccess();
    } catch(err) {
      console.log("Error Creating NFT tokens", err);
      return;
    }
  }

  const handleImageChange = (e) => {
    const uploadFile = fileUploadRef.current.files[0];
    if (!uploadFile) return;
  
    setNftImage(uploadFile); // Save the actual File object for upload
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleFormSubmit} className="space-y-4 text-black dark:text-white items-center">
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white text-center">Create NFT Access Token</h2>
        <div>
          <Label htmlFor="nftname">Name</Label>
          <Input id="nftname" placeholder="Enter NFT Name" value={nftName} onChange={(e) => setNftName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" placeholder="Enter NFT Description" rows={3} value={nftDesc} onChange={(e) => setNftDesc(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="price">Price [ETH]</Label>
          <Input id="price" placeholder="Enter NFT Price in ETH" type="number" step="0.1" value={nftPriceETH} onChange={(e) => setNftPriceETH(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="price">Price [FAN]</Label>
          <Input id="price" placeholder="Enter NFT Price in FAN" type="number" step="0.1" value={nftPriceFAN} onChange={(e) => setNftPriceFAN(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="image">Image</Label>
          <Input id="image" type="file" ref={fileUploadRef} accept="image/png, image/jpeg"  onChange={handleImageChange} required />
          {nftImage && <img src={URL.createObjectURL(nftImage)} className='w-16 object-cover text-center my-6 mx-auto'/>}
        </div>
        <div className='flex justify-center items-center gap-4'>
        <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white"
          >
            Cancel
          </button>
          <button
            // onClick={handleSend}
            disabled={!nftName || !nftDesc || !nftImage}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  )
}