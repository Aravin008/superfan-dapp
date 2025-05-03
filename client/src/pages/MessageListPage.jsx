import React from 'react';
import MessagesList from '../components/MessageListComp';
import { SparklesIcon, ChatAlt2Icon, StarIcon, BriefcaseIcon } from "@heroicons/react/outline";

export default function MessageListPage() {

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex-grow">
      {/* Hero Section */}
      <div className="text-center py-14 px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <SparklesIcon className="w-8 h-8 text-indigo-500" />
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Messages from the Community
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          See what the community is sharing. Real thoughts, no filters.
        </p>
      </div>

      <div className="container max-w-3xl mx-auto px-4 mt-4 mb-10">
        <MessagesList pagination={true} />
      </div>
    </div>
  )
}