
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

const upcomingEvents = [
  {
    id: 'wrc-safari-rally-naivasha',
    title: 'WRC Safari Rally',
    subtitle: '2-Day Rally Adventure',
    date: 'SAT 14TH - SUN 15TH MAR',
    time: 'Full Weekend',
    venue: 'Naivasha',
    price: 'KES 1,800',
    image: '/EVENTS/WAO_WRC SAFARI RALLY 14TH AND 15TH MARCH 2026.png',
    startDate: new Date('2026-03-14T08:00:00'),
    color: 'from-red-600 to-orange-600',
    icon: '🏎️',
    highlights: ['Rally Action', 'Camping', 'Motorsport', 'Adventure']
  },
  {
    id: 'prom-night-githegi',
    title: 'WAO Prom Night',
    subtitle: 'Elegant Evening Celebration',
    date: 'SAT 28TH MAR',
    time: 'Evening',
    venue: 'Githegi Bay & Boat Resort',
    price: 'KES 1,000',
    image: '/EVENTS/WAO PROM NIGHT SAT 28TH MARCH 2026.png',
    startDate: new Date('2026-03-28T18:00:00'),
    color: 'from-purple-600 to-pink-600',
    icon: '💃',
    highlights: ['Elegant Dress', 'Dancing', 'Music', 'Dinner']
  },
  {
    id: 'kisumu-meetup-valley-view',
    title: 'Kisumu Meetup',
    subtitle: 'Lakeside Community Gathering',
    date: 'SAT 28TH MAR',
    time: '10:00 AM',
    venue: 'Valley View Resort, Kiboswa',
    price: 'KES 150',
    image: '/EVENTS/WAO_KISUMU MEETUP_VALLEY VIEW RESORT SAT 28TH MARCH.png',
    startDate: new Date('2026-03-28T10:00:00'),
    color: 'from-blue-600 to-cyan-600',
    icon: '🌊',
    highlights: ['Lakeside Fun', 'Networking', 'Activities', 'Food']
  },
  {
    id: 'game-night-utawala',
    title: 'WAO Game Night',
    subtitle: '24-Hour Gaming Marathon',
    date: 'SAT 21ST - SUN 22ND FEB',
    time: '11:00 AM - 11:00 AM',
    venue: 'La Mana City, Utawala',
    price: 'KES 750',
    image: '/EVENTS/WAO_GameNight_2026.jpeg',
    startDate: new Date('2026-02-21T11:00:00'),
    color: 'from-indigo-600 to-purple-600',
    icon: '🎮',
    highlights: ['24-Hour Gaming', 'Food & Drinks', 'Prizes', 'Community']
  }
];

const UpcomingEventSection: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
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

  const currentEvent = upcomingEvents[activeEvent];

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

        {/* Event Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {upcomingEvents.map((event, index) => (
            <button
              key={event.id}
              onClick={() => setActiveEvent(index)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeEvent === index
                  ? 'bg-ngo-orange text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl mr-2">{event.icon}</span>
              {event.title}
            </button>
          ))}
        </div>

        {/* Main Event Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: Event Details */}
            <div className={`bg-gradient-to-br ${currentEvent.color} text-white p-8 md:p-12 flex flex-col justify-between`}>
              <div>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  🎉 UPCOMING EVENT
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold mb-2">
                  {currentEvent.title}
                </h3>
                <p className="text-xl md:text-2xl font-light mb-6 opacity-90">
                  {currentEvent.subtitle}
                </p>

                {/* Event Info */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-semibold text-lg">{currentEvent.date}</p>
                      <p className="text-sm opacity-90">{currentEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <p className="font-semibold text-lg">{currentEvent.venue}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💰</span>
                    <p className="font-semibold text-2xl">{currentEvent.price}</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-8">
                  <p className="font-semibold text-lg mb-3">Event Highlights:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {currentEvent.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                        <span className="text-lg">✓</span>
                        <span className="text-sm font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to={`/events/${currentEvent.id}`}
                  className="inline-block w-full text-center px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Register Now →
                </Link>
              </div>

              {/* Countdown Timer */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-center text-sm font-semibold mb-4 opacity-90">EVENT STARTS IN</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-3xl md:text-4xl font-extrabold">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-xs font-semibold mt-1 opacity-90">DAYS</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-3xl md:text-4xl font-extrabold">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-xs font-semibold mt-1 opacity-90">HOURS</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-3xl md:text-4xl font-extrabold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-xs font-semibold mt-1 opacity-90">MINS</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-3xl md:text-4xl font-extrabold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-xs font-semibold mt-1 opacity-90">SECS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Event Poster */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-ngo-orange/20 to-transparent rounded-2xl blur-2xl"></div>
                <img
                  src={currentEvent.image}
                  alt={currentEvent.title}
                  className="relative w-full h-auto max-h-[600px] object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Event Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {upcomingEvents.map((event, index) => (
            <div
              key={event.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
                activeEvent === index ? 'ring-4 ring-ngo-orange' : ''
              }`}
              onClick={() => setActiveEvent(index)}
            >
              <div className="flex items-center gap-4 p-6">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${event.color} flex items-center justify-center text-4xl flex-shrink-0`}>
                  {event.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-gray-900 mb-1">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{event.date} • {event.venue}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-ngo-orange">{event.price}</span>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-sm font-semibold text-ngo-orange hover:underline"
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
