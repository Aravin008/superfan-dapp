import { useState } from "react";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/TextArea";
import Button from "../components/ui/button";
import { submitFeedbackForm } from "../data/fetchData";

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedback = {
      name,
      email,
      message,
      // submittedAt: new Date().toISOString(),
    };

    // TODO: Replace this with your backend call
    console.log("Feedback submitted:", feedback);
    const data = await submitFeedbackForm(feedback);

    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="flex-grow bg-white dark:bg-gray-900 text-gray-800 dark:text-white text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">We’d love your feedback</h1>

        {submitted ? (
          <div className="text-center text-green-600 dark:text-green-400 text-lg">
            Thank you! Your feedback has been submitted.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Let us know what you think..."
                required
              />
            </div>

            <div className="flex justify-center">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
