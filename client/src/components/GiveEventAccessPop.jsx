import {ethers} from 'ethers';
import {useState} from 'react';
import { useGuestbookContract } from '../hooks/useGuestbookContract';

export default function GiveEventAccess({ eventId, closeForm }) {
  const {contract} = useGuestbookContract();
  const [fanId, setFanId] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!ethers.isAddress(fanId)) {
      alert("Invalid fan address");
      return;
    }

    try { 
      const tx = await contract.giveAccess(eventId, fanId);
      await tx.wait();
      setFanId("");
      closeForm();
      alert("Access granted!");
    } catch (e) {
      alert("Access grant failed.");
      console.error(e);
    }
  }

  return (
    <div className='create-event'>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="fanId">Fan Id</label>
        <input type="text" id="fanId" name="fanId" onChange={(e) => setFanId(e.target.value)} />
        <div>
          <button type="submit">Give Access</button>
          <button type="reset" onClick={closeForm}>Cancel</button>
        </div>
      </form>
    </div>
  )
}