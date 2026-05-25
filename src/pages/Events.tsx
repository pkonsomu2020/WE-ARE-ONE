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

/** Card with lazy-loaded image and skeleton placeholder */
const EventCard: React.FC<{ event: EventItem }> = ({ event }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <Link
      to={`/events/${event.id}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col"
    >
      {/* Image container with fixed aspect ratio */}
      <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
        {!loaded && !errored && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={errored ? '/placeholder.svg' : event.image}
          alt={event.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => { setErrored(true); setLoaded(true); }}
          className={`h-56 w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

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
  );
};

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(staticEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/events/public');
        if (response.success && Array.isArray(response.data)) {
          setEvents([...staticEvents, ...response.data]);
        } else {
          setEvents(staticEvents);
        }
      } catch {
        setEvents(staticEvents);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10 px-4 pt-28">
        <h1 className="text-4xl font-bold mb-2 text-center">WAO Events</h1>
        <p className="text-center text-gray-500 mb-8">All events — past and upcoming — since the start of We Are One.</p>

        {/* Skeleton grid while loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-56 w-full bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {safeEvents.length > 0 ? (
              safeEvents.map(event => <EventCard key={event.id} event={event} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Events Available</h2>
                <p className="text-gray-500">Check back soon for upcoming events!</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};

export default Events;
