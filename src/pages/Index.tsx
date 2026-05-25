
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
import { getUpcomingEvents } from '@/data/events';

// Map of event id → homepage display config (icon, color, highlights, subtitle, time)
const eventDisplayConfig: Record<string, { icon: string; color: string; highlights: string[]; subtitle: string; time: string }> = {
  'kisumu-game-night-may':      { icon: '🎮', color: 'from-purple-600 to-pink-600',   subtitle: '2-Day Gaming Marathon',    time: '3:00 PM - Next Day',  highlights: ['Non-Stop Gaming', 'Community Fun', 'Great Food', 'Epic Prizes'] },
  'nakuru-potluck-hangout-may': { icon: '🍽️', color: 'from-green-600 to-teal-600',    subtitle: 'Food & Fellowship',        time: 'All Day',             highlights: ['Potluck Feast', 'Community Bonding', 'Great Venue', 'Fun Activities'] },
  'mothers-club-event-may':     { icon: '👩‍👧‍👦', color: 'from-pink-500 to-rose-500',    subtitle: 'Celebrating Motherhood',   time: 'From 12:00 PM',       highlights: ['Mother Celebration', 'Family Fun', 'Activities', 'Community Love'] },
  'eldoret-picnic-hangout-may': { icon: '🧺', color: 'from-yellow-500 to-orange-500', subtitle: 'Potluck & Nature',          time: 'From 10:00 AM',       highlights: ['Outdoor Picnic', 'Potluck Food', 'Nature Walk', 'Community Time'] },
  'karura-meetup-may':          { icon: '🌳', color: 'from-emerald-600 to-green-600', subtitle: 'May We Bloom',              time: 'All Day',             highlights: ['Nature Walk', 'Forest Vibes', 'Networking', 'Bloom Together'] },
};

const DEFAULT_CONFIG = { icon: '🎉', color: 'from-ngo-orange to-orange-400', highlights: ['Community Fun', 'Networking', 'Activities', 'Great Vibes'], subtitle: 'WAO Community Event', time: 'All Day' };

// Build upcoming events dynamically — past events are automatically excluded
const upcomingEvents = getUpcomingEvents().map((e) => {
  const cfg = eventDisplayConfig[e.id] ?? DEFAULT_CONFIG;
  return {
    id: e.id,
    title: e.title,
    subtitle: cfg.subtitle,
    date: e.date,
    time: cfg.time,
    venue: e.location,
    price: e.price,
    image: e.image,
    startDate: e.endDate ? new Date(e.endDate) : new Date(),
    color: cfg.color,
    icon: cfg.icon,
    highlights: cfg.highlights,
  };
});

const UpcomingEventSection: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  // Reset image loaded state when active event changes
  useEffect(() => { setImgLoaded(false); }, [activeEvent]);

  useEffect(() => {
    if (upcomingEvents.length === 0) return;
    const updateCountdown = () => {
      const now = new Date();
      const diff = upcomingEvents[activeEvent].startDate.getTime() - now.getTime();
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
  }, [activeEvent]);

  // No upcoming events — show a friendly message
  if (upcomingEvents.length === 0) {
    return (
      <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-lg text-gray-600 mb-6">Stay tuned — new events are being planned. Check back soon!</p>
          <Link to="/events" className="inline-block px-8 py-4 bg-ngo-orange text-white font-bold rounded-xl hover:bg-orange-600 transition">
            View Past Events →
          </Link>
        </div>
      </section>
    );
  }

  const currentEvent = upcomingEvents[Math.min(activeEvent, upcomingEvents.length - 1)];

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join us for exciting community events! Connect, have fun, and build lasting friendships.
          </p>
        </div>

        {/* Event Tabs - Mobile Optimized */}
        <div className="flex overflow-x-auto gap-2 md:gap-4 mb-8 pb-2 scrollbar-hide snap-x snap-mandatory">
          {upcomingEvents.map((event, index) => (
            <button
              key={event.id}
              onClick={() => setActiveEvent(index)}
              className={`flex-shrink-0 snap-center px-3 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeEvent === index
                  ? 'bg-ngo-orange text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl md:text-2xl mr-1 md:mr-2">{event.icon}</span>
              <span className="text-xs md:text-base whitespace-nowrap">{event.title}</span>
            </button>
          ))}
        </div>

        {/* Main Event Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: Event Details */}
            <div className={`bg-gradient-to-br ${currentEvent.color} text-white p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-between`}>
              <div>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
                  🎉 UPCOMING EVENT
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2">
                  {currentEvent.title}
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-4 md:mb-6 opacity-90">
                  {currentEvent.subtitle}
                </p>

                {/* Event Info */}
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-xl md:text-2xl">📅</span>
                    <div>
                      <p className="font-semibold text-sm sm:text-base md:text-lg">{currentEvent.date}</p>
                      <p className="text-xs md:text-sm opacity-90">{currentEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-xl md:text-2xl">📍</span>
                    <p className="font-semibold text-sm sm:text-base md:text-lg">{currentEvent.venue}</p>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-xl md:text-2xl">💰</span>
                    <p className="font-semibold text-lg sm:text-xl md:text-2xl">{currentEvent.price}</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6 md:mb-8">
                  <p className="font-semibold text-sm md:text-lg mb-2 md:mb-3">Event Highlights:</p>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {currentEvent.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5 md:px-3 md:py-2">
                        <span className="text-sm md:text-lg">✓</span>
                        <span className="text-xs md:text-sm font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={`/events/${currentEvent.id}`}
                  className="inline-block w-full text-center px-6 py-3 md:px-8 md:py-4 bg-white text-gray-900 font-bold text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Register Now →
                </Link>
              </div>

              {/* Countdown Timer */}
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/20">
                <p className="text-center text-xs md:text-sm font-semibold mb-3 md:mb-4 opacity-90">EVENT STARTS IN</p>
                <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-[10px] md:text-xs font-semibold mt-1 opacity-90">DAYS</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-[10px] md:text-xs font-semibold mt-1 opacity-90">HOURS</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-[10px] md:text-xs font-semibold mt-1 opacity-90">MINS</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-[10px] md:text-xs font-semibold mt-1 opacity-90">SECS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Event Poster */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-8 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-ngo-orange/20 to-transparent rounded-2xl blur-2xl"></div>
                {/* Skeleton placeholder shown while image loads */}
                {!imgLoaded && (
                  <div className="w-full rounded-2xl bg-gray-300 animate-pulse" style={{ aspectRatio: '3/4', maxHeight: '600px' }} />
                )}
                <img
                  src={currentEvent.image}
                  alt={currentEvent.title}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setImgLoaded(true)}
                  className={`relative w-full h-auto max-h-[400px] md:max-h-[600px] object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Event Cards - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
          {upcomingEvents.map((event, index) => (
            <div
              key={event.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
                activeEvent === index ? 'ring-2 md:ring-4 ring-ngo-orange' : ''
              }`}
              onClick={() => setActiveEvent(index)}
            >
              <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center text-3xl md:text-4xl flex-shrink-0`}>
                  {event.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base md:text-xl text-gray-900 mb-1 truncate">{event.title}</h4>
                  <p className="text-xs md:text-sm text-gray-600 mb-2 truncate">{event.date} • {event.venue}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base md:text-lg font-bold text-ngo-orange">{event.price}</span>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-xs md:text-sm font-semibold text-ngo-orange hover:underline whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
      <DonationSection />
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
            <div className="relative">
              {/* Primary PDF viewer using object tag */}
              <object
                data="/THE%20CONSTITUTION%20FINAL%20EDIT.pdf"
                type="application/pdf"
                className="w-full"
                style={{ height: '80vh' }}
              >
                {/* Fallback iframe for browsers that don't support object tag */}
                <iframe
                  title="WAO Constitution PDF"
                  src="/THE%20CONSTITUTION%20FINAL%20EDIT.pdf"
                  className="w-full"
                  style={{ height: '80vh', border: 'none' }}
                  loading="lazy"
                >
                  {/* Final fallback for browsers that don't support either */}
                  <div className="flex items-center justify-center bg-gray-100 p-8" style={{ height: '80vh' }}>
                    <div className="text-center">
                      <div className="text-6xl mb-4">📄</div>
                      <h3 className="text-xl font-bold mb-4">PDF Viewer Not Supported</h3>
                      <p className="text-gray-600 mb-6">
                        Your browser doesn't support PDF viewing. Please use the buttons below to view or download the constitution.
                      </p>
                      <div className="space-x-4">
                        <a
                          href="/THE%20CONSTITUTION%20FINAL%20EDIT.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-5 py-2 bg-ngo-orange text-white rounded shadow hover:bg-orange-600 transition"
                        >
                          Open in New Tab
                        </a>
                        <a
                          href="/THE%20CONSTITUTION%20FINAL%20EDIT.pdf"
                          download="WAO_Constitution.pdf"
                          className="inline-block px-5 py-2 border border-ngo-orange text-ngo-orange rounded hover:bg-orange-50 transition"
                        >
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </iframe>
              </object>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <a
              href="/THE%20CONSTITUTION%20FINAL%20EDIT.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-ngo-orange text-white rounded shadow hover:bg-orange-600 transition"
            >
              Open in New Tab
            </a>
            <a
              href="/THE%20CONSTITUTION%20FINAL%20EDIT.pdf"
              download="WAO_Constitution.pdf"
              className="inline-block px-5 py-2 border border-ngo-orange text-ngo-orange rounded hover:bg-orange-50 transition"
            >
              Download PDF
            </a>
          </div>
        </div>
      </section>
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
