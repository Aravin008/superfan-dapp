import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import Button from "./ui/button";
import Input from "./ui/Input";
import Label from "./ui/Label";
import Modal from "./ui/Modal";
import Textarea from "./ui/TextArea";
import { updateProfile } from "../data/fetchData";
import { useToast } from "../context/ToastContext";


export default function ProfileForm({isOpen, closeForm, onSubmit, isCreator, profile}) {
  const {currentAccount} = useWallet();
  const {showToast} = useToast();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [twitter, setTwitter] = useState(null);
  const [instagram, setInstagram] = useState(null);
  const [website, setWebsite] = useState(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatarUrl || null);
      setTwitter(profile.socials?.twitter || null);
      setInstagram(profile.socials?.instagram || null);
      setWebsite(profile.socials?.website || null);
    }
  }, [profile]);

  const handleFormSubmit = async (e) => {
    //handle profile update to db
    try {
      e.preventDefault();
      const profileDetail = await updateProfile({
        accountId: currentAccount,
        name: name,
        bio: bio,
        avatarUrl: avatarUrl,
        isCreator: isCreator,
        socials: {
          twitter: twitter,
          instagram: instagram,
          website: website
        }
      })
      onSubmit(profileDetail);
      showToast("Profile Updated", "success");
    } catch(err) {
      showToast("Failed to update profile.", "error");
    }
  }

  return(
    <Modal isOpen={isOpen} onClose={closeForm}>
    <h2 className="text-lg font-semibold mb-4">Create Profile</h2>
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" rows={2} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="avatar">Avatar Url</Label>
        <Input id="avatar" value={avatarUrl || ''} onChange={(e) => setAvatarUrl(e.target.value)} />
      </div>

      <h3 className="text-base font-semibold mb-4 mt-4">Socials</h3>
      <div>
        <Label htmlFor="twitter">Twitter</Label>
        <Input id="twitter" value={twitter || ''} onChange={(e) => setTwitter(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="instagram">Instagram</Label>
        <Input id="instagram" value={instagram || ''} onChange={(e) => setInstagram(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input id="website" value={website || ''} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={closeForm}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  </Modal>
  )
}