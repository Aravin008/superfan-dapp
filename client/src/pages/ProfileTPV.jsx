import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { fetchProfile } from "../data/fetchData"; // adjust this to your fetch function
import Tabs from "../components/ui/Tabs";
import MessagesList from "../components/MessageListComp";
import { profileTabs } from "../utils/enums";

const tabItems = [
  { label: "Sent", value: profileTabs.SENT },
  { label: "Received", value: profileTabs.RECEIVED }
];

export default function ProfileTPView() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(profileTabs.SENT);

  useEffect(() => {
    if (id) {
      (async () => {
        const fetchedProfile = await fetchProfile(id.toLowerCase());
        setProfile(fetchedProfile);
        setLoading(false);
      })();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-center text-lg text-gray-800 dark:text-white">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-center text-lg text-gray-500 dark:text-gray-400">Profile not found</p>
      </div>
    );
  }

  const { name, bio, avatarUrl, socials } = profile;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center text-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name || "User Avatar"}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-700"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
              No Avatar
            </div>
          )}
          <h2 className="text-3xl font-semibold mt-4">{name || "Guest User"}</h2>
          {bio && <p className="text-gray-600 dark:text-gray-400 mt-2">{bio}</p>}
        </div>

        {(socials?.twitter || socials?.instagram || socials?.website) && (
          <div className="mt-8 space-y-2">
            <h3 className="text-xl font-semibold">Socials</h3>
            <ul className="text-blue-600 dark:text-blue-400 space-y-1">
              {socials?.twitter && (
                <li>
                  <a
                    href={`https://twitter.com/${socials.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Twitter: @{socials.twitter}
                  </a>
                </li>
              )}
              {socials?.instagram && (
                <li>
                  <a
                    href={`https://instagram.com/${socials.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Instagram: @{socials.instagram}
                  </a>
                </li>
              )}
              {socials?.website && (
                <li>
                  <a
                    href={socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Website
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-10">
        <Tabs tabs={tabItems} selected={selectedTab} onSelect={setSelectedTab} className={"mb-4"}/>
        <MessagesList
          pagination={true}
          key={selectedTab}
          noListener={true}
          messageQuery={{ accountId: id.toLowerCase(), type: selectedTab }}
          noMessageNote={"No Messages"}
        />
      </div>
    </div>
  );
}
