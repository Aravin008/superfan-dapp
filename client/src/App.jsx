import { useEffect, useState } from "react";
import CreatorForm from "./components/CreatorForm";
// import MessageForm from "./components/MessageForm";
// import MessagesList from "./components/MessageList";
import { useWallet } from "./context/WalletContext";
import MessageModal from "./components/MessageModal";
import MessagesList from "./components/MessageListNew";
import Button from "./components/ui/button";

function App() {
  const { currentAccount, creatorList: creators, loadCreators, isCurrentUserCreator } = useWallet();
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [showSendMsgModal, setShowSendMsgModal] = useState(false);

  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div style={{ padding: 20, width: '80%' }}>
      <h2>Guestbook</h2>
      <p>Connected as: <strong>{truncateAddress(currentAccount)}</strong></p>
      {!isCurrentUserCreator && <CreatorForm onRegistered={loadCreators} />}
      {/* <h3>Send a Message</h3> */}
      <Button variant="primary" onClick={() => setShowSendMsgModal(true)}>Send a Message</Button>
      {/* <MessageForm creators={creators} onSent={() => setRefreshFlag(f => f + 1)} /> */}
      <MessageModal
        isOpen={showSendMsgModal}
        onClose={() => setShowSendMsgModal(false)}
        creators={creators}
        onSent={() => {
          console.log("Message sent!");
          setRefreshFlag(f => f + 1)
        }}
      />
      <h3>Messages</h3>
      {/* <MessagesList refreshTrigger={refreshFlag} /> */}
      <MessagesList refreshTrigger={refreshFlag}/>
    </div>
  );
}

export default App;
