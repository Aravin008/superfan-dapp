import { useEffect, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import RegisterCreator from "../components/RegisterCreator";
import { useWallet } from "../context/WalletContext";
import MessagesList from "../components/MessageListComp";
import Button from "../components/ui/button";
import { SparklesIcon, ChatAlt2Icon, StarIcon, BriefcaseIcon } from "@heroicons/react/outline";
import { useModal } from "../context/ModalProvider";
import { useAuth } from "../context/AuthContext";

function MessagePage() {
  const navigate = useNavigate();
  const { currentAccount, loadCreators, isCurrentUserCreator, connectWallet, readOnlyContract } = useWallet();
  const { showModal } = useModal();
  const {initUser} = useAuth();

  const [refreshFlag, setRefreshFlag] = useState(0);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     const messages = await readOnlyContract.getMessages();
  //     console.log("messages",Array.from(messages));
  //   }
  //   fetchMessages();
  // }, [readOnlyContract])

  const checkAndConnectWallet = () => {
    if (typeof window.ethereum === 'undefined') {
      showModal("NO_WALLET")
      return;
    }
    connectWallet();
  }

  const handleSendMsg = () => {
    if(!currentAccount) checkAndConnectWallet();
    showModal("SEND_MESSAGE", {
      onSent: () => {
        console.log("Message sent!");
        // setRefreshFlag((f) => f + 1);
      }
    })
  }

  const handleOnRegister = () => {
    // Delay fetch User details from DB.
    setTimeout(() => {
      initUser();
    }, 500);
  }

  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex-grow">
      {/* Hero Section */}
      <div className="text-center py-14 px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <SparklesIcon className="w-8 h-8 text-indigo-500" />
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Welcome to SuperFan
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Send a Shoutout to Your Favorite Creator and Get Noticed. Fuel your fandom with <strong>$FAN</strong> tokens.
        </p>
      </div>

      {/* Actions */}
      <div className="container max-w-4xl mx-auto px-4 mt-2 mb-14 flex flex-col items-center gap-6">
        <p className="text-center text-lg text-gray-600 dark:text-gray-300">
          {currentAccount ? (
            // <>
            //   Connected as:{" "}
            //   <span className="font-mono bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
            //     {truncateAddress(currentAccount)}
            //   </span>
            // </>
            <></>
          ) : (
            <Button
              variant="primary"
              onClick={() => checkAndConnectWallet()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 flex items-center gap-2"
            >
              <BriefcaseIcon className="w-4" />
              Connect To Wallet
            </Button>
          )}
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          {!isCurrentUserCreator && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-sm w-full md:w-auto">
              <h2 className="font-semibold mb-2 text-center">Are you a Creator?</h2>
              <RegisterCreator onRegistered={handleOnRegister} />
            </div>
          )}
          <Button
            variant="primary"
            onClick={() => handleSendMsg()}
            className="px-6 py-6 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 flex items-center gap-2"
          >
            <ChatAlt2Icon className="w-4" />
            Send a Message
          </Button>
        </div>
      </div>

      <div className="w-full">
        <section className=" bg-gray-100 dark:bg-gray-800 text-center py-12 px-4 rounded-xl shadow-inner mt-12 mx-4 lg:mx-auto lg:max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
            Fandom, reimagined.
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300 mb-6">
            Discover why we're building SuperFan—and what makes FAN different.
          </p>
          <a
            href="/vision"
            className={clsx("inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition",
              " bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 font-semibold"
            )}
          >
            Read the Vision
          </a>
        </section>
      </div>

      {/* Messages Feed */}
      <div className="container max-w-4xl mx-auto px-4 mt-16 mb-6">
        <h3 className="text-2xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
          <StarIcon className="text-yellow-400 w-6" /> Fan Messages
        </h3>
        
        <MessagesList refreshTrigger={refreshFlag} maxMessages={5} pagination={false} page={"HOME"}/>
      </div>
    </div>
  );
}

export default MessagePage;
