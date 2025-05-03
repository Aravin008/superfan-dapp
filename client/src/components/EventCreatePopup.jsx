import { useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/button";
import Input from './ui/Input';
import Textarea from './ui/TextArea';
import Label from './ui/Label'; // Optional
import { useWallet } from "../context/WalletContext";

export default function CreateEventModal({ isOpen, closeForm }) {
  const { contract, currentAccount } = useWallet();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.createEvent(title, desc, Date.parse(date));
      await tx.wait();
      setTitle("");
      setDesc("");
      closeForm();
      alert("Event created!");
    } catch (err) {
      alert("Event creation failed.");
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeForm}>
      <h2 className="text-lg font-semibold mb-4">Create an Event</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} required />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={closeForm}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Modal>
  );
}
