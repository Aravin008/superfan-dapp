
import { getTimeAgo } from "../utils/utility";
import { ChatAlt2Icon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import AvatarWithName from "./AvatarWithName";
import { useNavigate } from "react-router-dom";
import Button from "./ui/button";
import { useWallet } from "../context/WalletContext";
import { useModal } from "../context/ModalProvider";
import { useEffect, useState } from "react";

const formatTip = (eth, fan) => {
  if (fan && fan !== "0.0") return `${parseFloat(fan).toFixed(3)} FAN`;
  if (eth && eth !== "0.0") return `${parseFloat(eth).toFixed(3)} ETH`;
  return null;
};

export default function MessageComp({ message, showAllReplies }) {
  const navigate = useNavigate();

  const [showReply, setShowReply] = useState(showAllReplies || false);

  const { showModal } = useModal();
  const { currentAccount } = useWallet();

  const tip = formatTip(message.tipAmountETH, message.tipAmountFAN);
  const replyTip = message.reply && formatTip(message.reply.tipAmountETH, message.reply.tipAmountFAN);
  const isReplayAllowed = message.to.toLowerCase() === currentAccount.toLowerCase() && !message.reply;

  useEffect(() => {
    setShowReply(showAllReplies);
  }, [showAllReplies]);

  const handleReply = async (message) => {
    showModal("SEND_MESSAGE", {
      replyTo: message,
      to: message.from,
      onSent: () => {
        console.log("Message sent!");
        // setRefreshFlag((f) => f + 1);
      }
    })
  }

  return (
    <>
      <div
        // key={m.msgId}
        className={"relative p-2 py-4 sm:p-4 rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition min-w-80"}
      >
        <div className="flex items-center justify-center gap-4 mb-2 pb-6">
          <div className="flex items-center gap-4 [@media(min-width:440px)]:gap-6 sm:gap-8 flex-wrap ">
            <AvatarWithName profile={message.fromProfile} address={message.from} handleClick={(profile, address) => navigate('/profile/' + address) }/>
            <span className="text-gray-400 dark:text-gray-500">➔</span>
            <AvatarWithName profile={message.toProfile} address={message.to} handleClick={(profile, address) => navigate('/profile/' + address)}/>
          </div>
        </div>

        <p className="text-xl text-gray-900 dark:text-gray-100 font-medium mb-2 text-center">
          "{message.text}"
        </p>

        <div className="flex justify-between pt-4">
          { message.createdAt && 
            <p className="text-xs text-gray-400 text-right mt-1">
              {getTimeAgo(message.createdAt)}
            </p>
          }

          {tip && (
            <p className="text-xs text-right text-blue-600 dark:text-blue-400 font-semibold">
              💰 {tip}
            </p>
          )}
        </div>
        {
          isReplayAllowed &&
          <div className="mt-4 flex justify-end">
            <Button
              variant="primary"
              size="md"
              className="flex gap-2 items-center w-full justify-center bg-gray-500 hover:bg-gray-400"
              onClick={() => handleReply(message)}
              >
                <ChatAlt2Icon className="w-4 h-4 text-white"/>
                <span className="">Reply</span>
              </Button>
          </div>
        }
      </div>
      {
        message.reply && 
        <>
          <h3 onClick={() => setShowReply((show) => (!show))} className="font-semibold ml-4 sm:ml-20 text-xs border rounded max-w-fit p-2 dark:text-gray-100 dark:border-gray-100 border-gray-600 text-gray-600 flex gap-2">
            Creator Reply
            {showReply ?
              <ChevronUpIcon className="w-4 h-4 dark:text-gray-100 text-gray-600"/>
              :
              <ChevronDownIcon className="w-4 h-4 dark:text-gray-100 text-gray-600"/>
            }
          </h3>
          { showReply && 
            <div
            key={message.msgId}
            className="relative p-2 py-4 ml-4 sm:ml-20 sm:p-4 rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center gap-4 mb-2 pb-6">
              <div className="flex items-center gap-4 [@media(min-width:440px)]:gap-6 sm:gap-8 flex-wrap ">
                <AvatarWithName profile={message.reply.fromProfile} address={message.reply.from} handleClick={(profile, address) => navigate('/profile/' + address) }/>
                <span className="text-gray-400 dark:text-gray-500">➔</span>
                <AvatarWithName profile={message.reply.toProfile} address={message.reply.to} handleClick={(profile, address) => navigate('/profile/' + address)}/>
              </div>
            </div>

            <p className="text-xl text-gray-900 dark:text-gray-100 font-medium mb-2 text-center">
              "{message.reply.text}"
            </p>

            <div className="flex justify-between pt-4">
              { message.reply.createdAt && 
                <p className="text-xs text-gray-400 text-right mt-1">
                  {getTimeAgo(message.reply.createdAt)}
                </p>
              }

              {replyTip && (
                <p className="text-xs text-right text-blue-600 dark:text-blue-400 font-semibold">
                  💰 {replyTip}
                </p>
              )}
            </div>
            </div>
          }
        </>
      }
    </>
  )
}