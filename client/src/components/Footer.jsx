import { HeartIcon } from "@heroicons/react/outline";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-300 dark:bg-gray-800 py-6 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 font-bold">
        
        {/* Left: Links */}
        <div className="flex space-x-6 text-sm">
          <a
            href="/about"
            className="hover:text-blue-600 transition-colors duration-150"
          >
            About SuperFan
          </a>
          <a
            href="/feedback"
            className="hover:text-blue-600 transition-colors duration-150"
          >
            Feedback
          </a>
        </div>

        {/* Right: Built with love */}
        <div className="flex items-center space-x-2 text-sm">
          <HeartIcon className="h-5 w-5 text-red-500" />
          <span>Built with love</span>
        </div>
      </div>
    </footer>
  );
}
