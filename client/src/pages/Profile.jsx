import React, { useState, useEffect, useReducer } from "react";
import { useFanToken } from "../hooks/useFanToken";
import { useWallet } from "../context/WalletContext";
import CreateEvent from "../components/EventCreatePopup";
import Button from "../components/ui/button";
import { UserIcon, LightningBoltIcon, CogIcon, GlobeAltIcon, BriefcaseIcon } from "@heroicons/react/solid";
import { fetchProfile } from "../data/fetchData";
// import { ethers } from "ethers";
import ProfileForm from "../components/ProfileForm";
import { profileTabs } from "../utils/enums";
import Tabs from "../components/ui/Tabs";
import MessagesList from "../components/MessageListComp";

const Profile = () => {
  const { isCurrentUserCreator, currentAccount, contract, connectWallet } = useWallet();
  const { account, balance, loading } = useFanToken();
  const [eventCreatePopup, setEventCreatePopup] = useState(false);
  const [profile, setProfile] = useState(null);
  const [refreshCount, setRefreshCount] = useState(1);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [selectedTab, setSelectedTab] = useState(profileTabs.SENT);

  const tabItems = [
    { label: "Sent", value: profileTabs.SENT },
    { label: "Received", value: profileTabs.RECEIVED }
  ];


  useEffect(() => {
    if (!currentAccount) return;
    fetchProfile(currentAccount.toLowerCase()).then((profile) => setProfile(profile));
  }, [currentAccount, contract, refreshCount]);

  const showEventCreatePopUp = () => setEventCreatePopup(true);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if(!currentAccount) {
    return (
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white py-10 px-4 flex justify-center flex-grow">
      <div className="w-full max-w-4xl space-y-8 flex justify-center flex-none items-start">
        <p className=""></p>
        <Button
          variant="primary"
          onClick={() => connectWallet()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 flex items-center gap-2"
        >
          <BriefcaseIcon className="w-4" />
          Connect Wallet to Manage Your Profile
        </Button>
      </div>
    </div>
    )
  }

  const hasSocials = profile?.socials?.twitter || profile?.socials?.instagram || profile?.socials?.website;

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white py-10 px-4 flex justify-center flex-grow">
      <div className="w-full max-w-4xl space-y-8">

        {/* Profile Header */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 flex items-center gap-4 shadow-sm [@media(max-width:440px)]:flex-col">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold truncate">
              {profile?.name?.slice(0, 2).toUpperCase() || currentAccount?.slice(2, 4).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold">{profile?.name || "Your Profile"}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {account?.slice(0, 6)}...{account?.slice(-4)} • {isCurrentUserCreator ? "Creator" : "Fan"}
            </p>
            {profile?.bio && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                {profile.bio}
              </p>
            )}
          </div>
          <div className="[@media(min-width:440px)]:ml-auto">
            <Button
              variant="ghost"
              className="flex items-center gap-1 text-sm"
              onClick={() => setShowProfileEdit(true)}
            >
              <CogIcon className="w-4 h-4" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* Social Links */}
        {hasSocials && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow space-y-2">
            <h3 className="text-lg font-semibold mb-2">Connect With Me</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              {profile?.socials?.twitter && (
                <a
                  href={`https://twitter.com/${profile.socials.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  🐦 Twitter
                </a>
              )}
              {profile?.socials?.instagram && (
                <a
                  href={`https://instagram.com/${profile.socials.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:underline"
                >
                  📸 Instagram
                </a>
              )}
              {profile?.socials?.website && (
                <a
                  href={profile.socials.website.startsWith("http") ? profile.socials.website : `https://${profile.socials.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  🌐 Website
                </a>
              )}
            </div>
          </div>
        )}

        {/* Token Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-1">FAN Token Balance</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{balance} FAN</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-1">Account Address</h3>
            <p className="text-sm [@media(max-width:440px)]:text-xs">{account}</p>
          </div>
        </div>

        {/* Creator Panel */}
        {isCurrentUserCreator && false && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <LightningBoltIcon className="w-5 h-5 text-yellow-500" />
                Creator Tools
              </h3>
              <Button onClick={showEventCreatePopUp}>Create Event</Button>
            </div>
            <p className="text-sm text-gray-500">Your upcoming events will appear here soon.</p>
          </div>
        )}

        {/* Coming Soon */}
        <div className="text-center mt-10">
          <p className="text-sm text-gray-500">More profile features like RSVPs, collectibles, and settings are coming soon 🚀</p>
        </div>

        <Tabs tabs={tabItems} selected={selectedTab} onSelect={setSelectedTab} className={""}/>
        <MessagesList
          pagination={true}
          key={selectedTab}
          noListener={true}
          messageQuery={{ accountId: currentAccount, type: selectedTab }}
          noMessageNote={"No Messages"}
        />
      </div>

      {/* Popups */}
      <CreateEvent
        isOpen={eventCreatePopup}
        closeForm={() => setEventCreatePopup(false)}
      />

      <ProfileForm
        isOpen={showProfileEdit}
        onSubmit={() => {
          setRefreshCount(refreshCount + 1);
          setShowProfileEdit(false);
        }}
        closeForm={() => setShowProfileEdit(false)}
        profile={profile}
      />
    </div>
  );
};

export default Profile;
