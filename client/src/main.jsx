import React from 'react';
import './index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Profile from './pages/Profile';
import EventsList from './components/EventsList';
import EventPage from './components/EventPage';
import { WalletProvider } from './context/WalletContext';
import { AuthProvider } from './context/AuthContext';
import NavBar from './components/NavBar';
import ProfileTPView from './pages/ProfileTPV';
import Home from './pages/Home';
import Footer from './components/Footer';
import VisionPage from './pages/Vision';
import About from './pages/About';
import FeedbackPage from './pages/Feedback';
import { ModalProvider } from './context/ModalProvider';
import { ToastProvider } from './context/ToastContext';
import MessageListPage from './pages/MessageListPage';
import NotFound from './pages/NotFound';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <WalletProvider>
              <Router>
                <ModalProvider>
                  <div className='min-h-screen flex flex-col'>
                    <NavBar />
                    <main className='flex-grow'>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path='/messages' element={<MessageListPage />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:id" element={<ProfileTPView />} />
                        <Route path="/events" element={<EventsList />} />
                        <Route path="/event/:id" element={<EventPage />} />
                        <Route path="/vision" element={<VisionPage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/feedback" element={<FeedbackPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer/>
                  </div>
                </ModalProvider>
              </Router>
        </WalletProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
