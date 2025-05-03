import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { useGuestbookContract } from '../hooks/useGuestbookContract';
import GiveEventAccess from './GiveEventAccessPop';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { ClipboardListIcon, UserIcon, CalendarIcon, PencilAltIcon } from '@heroicons/react/outline'; // Import Heroicons

export default function EventsList() {
  const navigate = useNavigate();
  const { isCurrentUserCreator: isUserCreator, currentAccount: currentUser } = useWallet();
  const { readOnlyContract } = useGuestbookContract();
  const [events, setEvents] = useState([]);
  const [giveAccessPanel, showGiveAccessPanel] = useState(null);

  useEffect(() => {
    if (!readOnlyContract) return;

    (async () => {
      try {
        const eventList = await readOnlyContract.getAllEvents();
        const filteredList = eventList.filter((e) => e.title);
        setEvents(filteredList);
      } catch (err) {
        console.error("Error fetching events", err);
      }
    })();
  }, [readOnlyContract]);

  if (!events.length) {
    return (
      <div className="text-center mt-10 text-gray-600 dark:text-gray-300">
        No Events at this time.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-6 py-8 bg-white dark:bg-gray-950 shadow-md min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 dark:text-white text-center">Upcoming Events</h2>

      {/* Event Cards Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.map((event) => {
          const isEventCreator =
            isUserCreator && ethers.getAddress(currentUser) === ethers.getAddress(event.creator);

          return (
            <div
              key={event.eventId}
              className="relative rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer"
              onClick={() => navigate(`/event/${event.eventId}`)}
            >
              {/* Event Title and Description */}
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{event.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>

              {/* Event Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 flex-wrap">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <UserIcon className="w-5 h-5" />
                  <span className="truncate text-ellipsis">{event.creator}</span> {/* Prevent address overflow */}
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>{new Date(ethers.getNumber(event.date)).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Button for Creators */}
              {isEventCreator && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showGiveAccessPanel(event.eventId);
                  }}
                  className="ml-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  <PencilAltIcon className="inline w-5 h-5 mr-2" />
                  Give Access
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Event Access Panel */}
      {giveAccessPanel !== null && (
        <GiveEventAccess
          eventId={giveAccessPanel}
          closeForm={() => showGiveAccessPanel(null)}
        />
      )}
    </div>
  );
}
