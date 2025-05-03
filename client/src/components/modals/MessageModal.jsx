import Modal from "../ui/Modal";
import { useRef, useState } from "react";
import { ethers } from "ethers";
// import { useGuestbookContract } from "../../hooks/useGuestbookContract";
import { useFanToken } from "../../hooks/useFanToken";
import { useWallet } from "../../context/WalletContext";
import Select from "../ui/Select";
import Textarea from "../ui/TextArea";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { getCreators } from "../../data/fetchData";
import AvatarWithName from "../AvatarWithName";
import { useDebounce } from "../../hooks/useDebounce";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalProvider";
import { SpinAnimation } from "../ui/Animations";

export default function MessageModal({ isOpen, onClose, to, onSent, replyTo }) {
  const [selected, setSelected] = useState(to || "");
  const [creators, setCreators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [tip, setTip] = useState("");
  const [tipType, setTipType] = useState("ETH");
  const [sending, setSending] = useState(false);

  const { contract, signer } = useWallet();
  const { contract: fanToken } = useFanToken();
  const { showToast } = useToast();
  const { showModal, hideModal } = useModal();
  const dataRef = useRef({contract, signer, fanToken});
  dataRef.current = {contract, signer, fanToken};


  const handleCreatorSearch = async (event) => {
    const search = event?.target?.value || "";
    let exact = false;
    const result = await getCreators(search, exact);
    setCreators(result.creators);
  }

  const debouncedSearch = useDebounce((search) => {
    handleCreatorSearch({ target: { value: search } });
  }, 300);

  const handleImmediateInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelected(""); // Clear selected immediately
    debouncedSearch(e.target.value); // Then debounce fetching
  };

  const handleCreatorSelect = (profile, address) => {
    setSelected(address);
    setSearchQuery(address);
    setCreators([]);
  }

  const handleSend = async () => {
    if (!ethers.isAddress(selected)) {
      // alert("Invalid creator address");
      showToast("Invalid creator address", 'error');
      return;
    }
    if (sending) return;
    setSending(true);
    try {
      let tx;
      const replyToMsgId = replyTo ? replyTo.msgId : 0n;
      if (tipType === "ETH") {
        const ethTip = ethers.parseEther(tip || "0");
        tx = await dataRef.current.contract.sendMessage(selected, message, 0, replyToMsgId, {
          value: ethTip,
        });
      } else {
        const fanTipAmount = tip ? ethers.parseUnits(tip, 18) : 0n;
        const sender = await dataRef.current.signer.getAddress();
        const contractAddress = await dataRef.current.contract.getAddress();
        const allowance = await dataRef.current.fanToken.allowance(sender, contractAddress);
        if (allowance < fanTipAmount) {
          await showModal("APPROVE_TOKEN", {
            contractAddress: contractAddress,
            approvalAmount: tip,
            // onClose: ,
            onProceed: async (approvedAmount) => {
              const fanTipAmountApproved = approvedAmount ? ethers.parseUnits(approvedAmount.toString(), 18) : 0n;
              const approveTx = await dataRef.current.fanToken.approve(contractAddress, fanTipAmountApproved);
              await approveTx.wait();
              showToast("✅ Approval successful. Sending Message with tip.", 'success');
              handleSend(); // send Message
              return;
            }
          })
          return;
        }
        tx = await dataRef.current.contract.sendMessage(selected, message, fanTipAmount, replyToMsgId, {
          value: ethers.parseEther("0"),
          // gasLimit: 200000,
        });
      }
      await tx.wait();
      // alert("🎉 Message sent successfully!");
      showToast("🎉 Message sent successfully!", 'success');
      setMessage("");
      setSearchQuery("");
      setTip("");
      setSelected("");
      onSent?.();
      onClose();
    } catch (err) {
      // alert("❌ Failed to send: " + (err?.reason || err.message));
      showToast("❌ Failed to send:"+ (err?.reason || err.message), 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-black dark:text-white font-medium">
        <h2 className="text-lg font-bold mb-4">{replyTo ? "Replay To Message" : "Send a Message"}</h2>

        { replyTo && 
          <div className="bg-gray-500 text-white text-sm mb-4 p-3 rounded">
            <p className="text-xs truncate"><strong>From: </strong> {replyTo?.fromProfile?.name || replyTo?.from}</p>
            <p className="text-xs truncate"><strong>Message: </strong> {replyTo.text}</p>
          </div>
        }
        <div className="space-y-4">
          <div className="relative">
            <Label>{replyTo?.to ? "Replying To" : "Select Creator"}</Label>
            <Input
              type="text"
              className="w-full rounded border p-2 dark:bg-gray-800"
              value={selected}
              onChange={(e) => handleImmediateInputChange(e)}
              onFocus={(e) => handleCreatorSearch(e)}
              placeholder="Creator Wallet Address"
              disabled={replyTo?.to ? true : false}
            />
            { creators && creators.length > 0 &&
              <div className="z-50 absolute max-h-60 w-full overflow-y-auto border rounded-lg bg-white shadow-sm shadow-gray-400 dark:bg-gray-900 mt-1">
                <ul className="">
                  {
                    creators.map( creator => {
                      return (
                        <li key={creator.accountId} className="px-4 py-2">
                          <AvatarWithName profile={creator} address={creator.accountId} handleClick={handleCreatorSelect} />
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            }
          </div>

          <div>
            <Label>Your Message</Label>
            <Textarea
              className="w-full rounded border p-2 dark:bg-gray-800 text-lg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message"
            />
          </div>

          <div>
            <Label>Tip</Label>
            <Input
              min={0}
              type="number"
              className="w-full rounded border p-2 dark:bg-gray-800"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="Tip amount"
              step={0.1}
            />
          </div>

          <div>
            <Label>Token</Label>
              <Select
              className="w-full rounded border p-2 dark:bg-gray-800"
              value={tipType}
              onChange={(e) => setTipType(e.target.value)}
            >
              <option value="ETH">ETH</option>
              <option value="FAN">FAN Token</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!selected || !message}
              className="px-4 py-2 flex items-center gap-2 rounded bg-blue-600 text-white disabled:opacity-50 font-semibold"
            >
              { sending && <SpinAnimation className="w-4 h-4" /> }
              Send
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
