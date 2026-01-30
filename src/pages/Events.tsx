import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { events as staticEvents } from '@/data/events';
import { api } from '@/lib/api';
import BackToTop from '@/components/BackToTop';

interface EventItem {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  price: string;
  description?: string;
  host?: string;
  tickets?: Array<{ name: string; price: string; status: string }>;
  photos?: string[];
  mapEmbed?: string;
  adminEvent?: boolean;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(staticEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading events from API...');
        
        // Fetch admin events from the API
        const response = await api.get('/events/public');
        
        if (response.success && Array.isArray(response.data)) {
          // Combine static events with admin events
          const combinedEvents = [...staticEvents, ...response.data];
          setEvents(combinedEvents);
          console.log(`✅ Loaded ${response.data.length} admin events + ${staticEvents.length} static events`);
        } else {
          console.warn('⚠️ API response invalid, using static events only');
          setEvents(staticEvents);
        }
      } catch (error) {
        console.error('❌ Failed to load admin events:', error);
        console.log('📋 Using static events as fallback');
        setEvents(staticEvents);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Add error handling for events data
  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10 px-4 pt-28">
        <h1 className="text-4xl font-bold mb-8 text-center">Upcoming Events</h1>
        
        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 mx-auto animate-spin rounded-full border-2 border-orange-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-2">Loading events...</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {safeEvents.length > 0 ? (
            safeEvents.map(event => (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-56 w-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-red-600 font-semibold mb-2">{event.date}</div>
                    <div className="text-xl font-bold mb-1 line-clamp-2">{event.title}</div>
                    <div className="text-sm text-gray-600 mb-4 line-clamp-1">{event.location}</div>
                    {event.adminEvent && (
                      <div className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded mb-2 inline-block">
                        Admin Event
                      </div>
                    )}
                  </div>
                  <div className="mt-auto text-base font-semibold text-ngo-orange">
                    Starting <span className="text-lg">{event.price}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            !loading && (
              <div className="col-span-full text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Events Available</h2>
                <p className="text-gray-500">Check back soon for upcoming events!</p>
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};

export default Events; 