import { useState } from "react";
import Button from "./ui/button";
import ProfileForm from "./ProfileForm";
import { useWallet } from "../context/WalletContext";
import { useToast } from "../context/ToastContext";

export default function RegisterCreator({ onRegistered }) {
  const { contract } = useWallet();
  const {showToast} = useToast();
  const [showProfileForm, setShowProfileForm] = useState(false);

  const handleRegister = async (profileDetails) => {
    if(!profileDetails) {
      // alert("Failed to create Profile");
      showToast("Failed to create Profile", "error");
      return;
    }
    setShowProfileForm(false);
    try {
      const tx = await contract.registerAsCreator();
      await tx.wait();
      // alert("You're now a creator!");
      showToast("You're now a creator!", "success");
      onRegistered(); // refresh creators
    } catch (e) {
      // alert("Registration failed.");
      showToast("Registration failed.", "success");
      console.error(e);
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowProfileForm(true)}
        variant="primary"
        className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
      >
        Register as Creator
      </Button>
      <ProfileForm
        isOpen={showProfileForm}
        onSubmit={handleRegister}
        closeForm={() => setShowProfileForm(false)}
        isCreator={true}
      />
    </>
  )
}
