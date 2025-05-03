import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { XIcon, MenuIcon, SunIcon, MoonIcon, UserCircleIcon } from '@heroicons/react/outline';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';

function NavBar({ }) {
  const navigate = useNavigate();
  
  const { theme, toggleTheme } = useTheme();
  const {currentAccount} = useWallet();
  const { userProfile: profile } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleMobileMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const displayName = profile?.name || "Guest";
  const walletAddress = currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : null;

  return (
    <nav className="border-b border-gray-300 dark:border-gray-600 dark:bg-gray-800 p-4 py-5 shadow-md flex justify-between items-center relative">
      <div className="text-2xl font-extrabold text-gray-800 dark:text-white">
        <Link to="/">SuperFan</Link>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-4 items-center">
        <Link to="/messages" className="text-gray-800 font-extrabold text-lg dark:text-white hover:text-blue-900 dark:hover:text-blue-600">
          Messages
        </Link>

        <button
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="bg-transparent text-gray-800 hover:bg-blue-900 font-extrabold text-sm px-3 py-2 dark:text-white dark:border-white border-gray-600 border rounded hover:text-blue-300 dark:hover:text-blue-300"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* ProfileMenu - Desktop */}
        <div className="relative dark:border-white border-gray-600 border rounded hover:bg-blue-900 hover:text-blue-50  dark:text-white">
          <button
            // onClick={() => setIsProfileOpen(!isProfileOpen)}
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium"
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full border dark:border-white" />
            ) : (
              <UserCircleIcon className="w-6 h-6" />
            )}
            <div className='flex flex-col items-start text-xs leading-none font-semibold'>
              <span>{displayName}</span>
              {walletAddress && <span>{walletAddress}</span>}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-md z-10">
              {walletAddress ? (
                <>
                  <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    My Profile
                  </Link>
                  <Link to="/messages" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                    Messages
                  </Link>
                </>
              ) : (
                <span className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">Not Connected</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hamburger - Mobile */}
      <button className="md:hidden text-gray-800 dark:text-white" onClick={handleMobileMenuToggle}>
        {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-14 right-0 w-48 space-y-2 bg-white dark:bg-gray-700 p-4 rounded shadow-md text-left z-20">
          <Link to="/messages" className="block font-bold  py-2 dark:border-white border text-gray-800 dark:text-white rounded hover:text-blue-500 dark:hover:text-blue-500 text-center" onClick={() => setIsMobileMenuOpen(false)}>
            Messages
          </Link>

          <button
            onClick={() => {
              toggleTheme();
              setIsMobileMenuOpen(false);
            }}
            className="block w-full font-bold text-sm bg-transparent py-2 dark:border-white border text-gray-800 dark:text-white rounded hover:text-blue-500 dark:hover:text-blue-500 text-center"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          <button
            // onClick={() => setIsProfileOpen(!isProfileOpen)}
            onClick={() => {
              navigate('/profile');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center w-full gap-2 px-3 py-2 text-sm font-semibold dark:border-white border text-gray-800 dark:text-white rounded hover:text-blue-500 dark:hover:text-blue-500"
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full" />
            ) : (
              <UserCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
            <div className='flex flex-col items-start text-xs leading-none'>
              <span>{displayName}</span>
              {walletAddress && <span>{walletAddress}</span>}
            </div>
          </button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
