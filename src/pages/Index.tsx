
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MissionSection from '@/components/MissionSection';
import ImpactSection from '@/components/ImpactSection';
import CommunitySection from '@/components/CommunitySection';
import DonationSection from '@/components/DonationSection';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const nextEvent = {
  title: 'Kanunga Falls Meetup',
  date: 'Sunday October 12th | 10:00am - 6:00pm',
  venue: 'Kanunga Falls',
  image: '/EVENTS/WAO_KanungaFalls.jpg',
  // Set the event start date/time for countdown (ISO format)
  startDate: new Date('2025-10-12T10:00:00'),
};

const UpcomingEventSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = nextEvent.startDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow flex flex-col md:flex-row overflow-hidden">
        {/* Left: Info & Countdown */}
        <div className="md:w-1/2 flex flex-col justify-center items-center p-8 bg-ngo-orange text-white">
          <div className="mb-6 text-center">
            <div className="uppercase tracking-widest text-sm mb-2">Upcoming Event</div>
            <div className="text-4xl md:text-5xl font-extrabold mb-2 text-white">Kanunga Falls Meetup</div>
            <div className="text-xl mb-1 text-white font-semibold">Sunday October 12th | 10:00am - 6:00pm</div>
            <div className="text-lg mb-4 text-white">Kanunga Falls</div>
            <Link
              to="/events/kanunga-falls"
              className="inline-block mt-4 px-8 py-3 bg-white text-ngo-orange font-bold text-lg rounded shadow hover:bg-orange-100 transition"
            >
              Join Now
            </Link>
          </div>
          <div className="flex space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 mt-10">
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mt-1 tracking-wide">DAYS</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mt-1 tracking-wide">HOURS</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mt-1 tracking-wide">MINUTES</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mt-1 tracking-wide">SECONDS</div>
            </div>
          </div>
        </div>
        {/* Right: Poster */}
        <div className="md:w-1/2 flex items-center justify-center bg-orange-50 p-8">
          <img
            src={nextEvent.image}
            alt={nextEvent.title}
            className="w-full h-96 object-contain rounded-lg shadow-lg"
            style={{ maxWidth: '400px' }}
          />
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Show floating chat after scrolling down 200px
      const scrollPosition = window.scrollY;
      setShowFloatingChat(scrollPosition > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash navigation when coming from other pages
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const sectionId = hash.substring(1);
      // Try multiple times in case content isn't mounted yet
      let attempts = 0;
      const tryScroll = () => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < 5) {
          attempts += 1;
          setTimeout(tryScroll, 100);
        }
      };
      tryScroll();
    };

    handleHashNavigation();
  }, []);

  // Handle hash changes when navigating between sections
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const sectionId = hash.substring(1);
      let attempts = 0;
      const tryScroll = () => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < 5) {
          attempts += 1;
          setTimeout(tryScroll, 100);
        }
      };
      tryScroll();
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle location changes (when navigating from other pages)
  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;
    const sectionId = hash.substring(1);
    let attempts = 0;
    const tryScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (attempts < 5) {
        attempts += 1;
        setTimeout(tryScroll, 100);
      }
    };
    tryScroll();
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <UpcomingEventSection />
      <AboutSection />
      <MissionSection />
      <ImpactSection />
      <CommunitySection />
      {/* WAO Constitution Section */}
      <section id="constitution" className="w-full bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-center">
            WAO <span className="text-ngo-orange">Constitution</span>
          </h2>
          <p className="text-lg text-gray-700 text-center mb-8 max-w-3xl mx-auto">
            Read the official constitution of We Are One (WAO). You can view it below or open it in a new tab.
          </p>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <iframe
              title="WAO Constitution PDF"
              src={'/THE%20CONSTITUTION%20FINAL%20EDIT.pdf#view=FitH'}
              className="w-full"
              style={{ height: '80vh', border: 'none' }}
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a
              href={'/THE%20CONSTITUTION%20FINAL%20EDIT.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-ngo-orange text-white rounded shadow hover:bg-orange-600 transition"
            >
              Open in New Tab
            </a>
            <a
              href={'/THE%20CONSTITUTION%20FINAL%20EDIT.pdf'}
              download
              className="inline-block px-5 py-2 border border-ngo-orange text-ngo-orange rounded hover:bg-orange-50 transition"
            >
              Download PDF
            </a>
          </div>
        </div>
      </section>
      <DonationSection />
      <Footer />
      {/* Align vertically with chat icon on the right; BackToTop above Chat */}
      <BackToTop className="right-6 bottom-[104px] md:bottom-[104px]" />
      
      {/* Floating Chat Icon */}
      <Link
        to="/chat"
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out transform ${
          showFloatingChat 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-20 opacity-0 scale-75'
        }`}
      >
        <div className="relative group">
          {/* Main floating button */}
          <div className="w-16 h-16 bg-ngo-orange hover:bg-orange-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          
          {/* Pulse animation */}
          <div className="absolute inset-0 bg-ngo-orange rounded-full animate-ping opacity-20"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chat with AI Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Index;
