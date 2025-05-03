import { useEffect, useState, useCallback } from "react";
import {ethers} from 'ethers';
import { getMessage, getMessageListWithReplies, getMessageListByAccountIdWithReplies, getMessageWithReply } from "../data/fetchData";
import Button from "./ui/button";
import { useWallet } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";
import MessageComp from "./MessageComp";
import ToggleSwitch from "./ui/ToggleSwitch";

export default function MessagesList({ refreshTrigger, pagination, maxMessages, noListener, messageQuery, noMessageNote, page }) {
  const navigate = useNavigate();

  const { setOnNewMessage, currentAccount, contract } = useWallet();

  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllReplies, setShowAllReplies] = useState(false);

  useEffect(() => {
    if(messageQuery) {
      fetchMessagesByQuery(1);
    } else {
      fetchMessages(1);
    }
  }, []);

  const updateMessage = (msg) => {
    setMessages((prevMessages) => {
      const parentMsgId = msg.replyToMsgId !== '0' ? msg.replyToMsgId : msg.msgId;
      const index = prevMessages.findIndex((m) => m.msgId === parentMsgId);

      let msgToReplace = msg;
      if (msg.replyToMsgId !== '0' && index !== -1) {
        // Clone parent and attach reply
        msgToReplace = {
          ...prevMessages[index],
          reply: msg,
        };
      }

      if (index !== -1) {
        return [
          ...prevMessages.slice(0, index),
          msgToReplace,
          ...prevMessages.slice(index + 1),
        ];
      } else {
        return [msg, ...prevMessages];
      }
    });
  };
  

  const listener = useCallback(async (fromPayload, toPayload) => {
    // console.log("fromPayload",fromPayload,"toPayload", toPayload);
    const { args, eventName, eventSignature, fragment, ...rest } = fromPayload || toPayload;
    const [from, to, msgId, text, tipAmountETH, tipAmountFAN, replyToMsgId, event] = args;
    // We ignore messages received from self
    if(toPayload && from === to) {
      console.log("Received from self, ignored!", {from, to, msgId, text });
      return;
    }

    console.trace("📥 Frontend NewMessage event:", { from, to, msgId, text });

    const msg = {
      msgId: msgId.toString(),
      from: from.toLowerCase(),
      to: to.toLowerCase(),
      text,
      tipAmountETH: ethers.formatEther(tipAmountETH),
      tipAmountFAN: ethers.formatUnits(tipAmountFAN, 18),
      replyToMsgId: replyToMsgId.toString()
      // blockNumber: event.blockNumber,
      // txHash: event.transactionHash,
    }

    console.log("🚀 New message received in MessagesPage!", msg);

    updateMessage(msg);
  
    const resp = await getMessage(msg.msgId);
    // const resp = await getMessageWithReply(msg.msgId);
    console.log("got response", resp);
    if (resp?.data?.msgId) {
      updateMessage(resp?.data);
    }
  }, []);

  useEffect(() => {
    if(noListener) return;
    if(!currentAccount || !contract) return;
    console.log("Register the OnNewMessage");
    contract.on(contract.filters.NewMessage(currentAccount, null), listener);
    // Messages sent TO me
    contract.on(contract.filters.NewMessage(null, currentAccount), listener);
    return () => {
      contract.off(contract.filters.NewMessage(currentAccount, null), listener);
      contract.off(contract.filters.NewMessage(null, currentAccount), listener); // clean up on unmount
    };
  }, [currentAccount, contract]);

  const fetchMessages = async (page) => {
    const pageToFetch = page || currentPage;
    const resp = await getMessageListWithReplies(pageToFetch);
    if(page === 1) {
      const items = resp?.data.slice(0, maxMessages);
      setMessages([...items]);
    } else {
      setMessages(messages => [...messages, ...resp?.data]);
    }
    if (resp?.meta) {
      setCurrentPage(resp?.meta?.next || null);
    }
  };

  const fetchMessagesByQuery = async (page) => {
    const pageToFetch = page || currentPage;
    const resp = await getMessageListByAccountIdWithReplies(messageQuery.accountId, messageQuery.type, pageToFetch);
    if(page === 1) {
      const items = resp?.data.slice(0, maxMessages);
      setMessages([...items]);
    } else {
      setMessages(messages => [...messages, ...resp?.data]);
    }
    if (resp?.meta) {
      setCurrentPage(resp?.meta?.next || null);
    }
  }

  if (!messages.length) {
    return <p className="text-gray-500 dark:text-gray-400 text-center m-16">
      {noMessageNote || "No messages yet. Be the first to share a thought with the community!"}
    </p>;
  }

  return (
    <div className="!mt-2 space-y-2">
      <div className="flex justify-end w-full p-2">
        <ToggleSwitch className="pr-2" isEnabled={showAllReplies} onToggle={() => setShowAllReplies(value => (!value))} label={"Show All Replies "}/> 
      </div>
      {messages.map((m, i) => {
        return (
          <div key={m.msgId} className={`${i%2==0?'bg-gray-200 dark:bg-gray-800':'bg-gray-100 dark:bg-gray-700'} space-y-2 p-4 rounded-md`}>
            <MessageComp message={m} showAllReplies={showAllReplies}/>
          </div>
        );
      })}
      { pagination && currentPage && (
        <div className="text-center !mt-6">
          <Button variant="primary" size="md" onClick={() => {
            if(messageQuery) {
              fetchMessagesByQuery();
            } else {
              fetchMessages();
            }
          }}>
            Load More Messages
          </Button>
        </div>
      )}
      { page === 'HOME' && messages.length >= 5 &&
        <Button
          variant="primary"
          onClick={() => navigate('/messages')}
          className="px-20 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 flex items-center gap-2 text-center !mt-4 mx-auto"
        >
          See More
        </Button>
      }
    </div>
  );
}
