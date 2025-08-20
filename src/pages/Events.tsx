import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { events } from '@/data/events';
import BackToTop from '@/components/BackToTop';

const Events: React.FC = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10 px-4 pt-28">
        <h1 className="text-4xl font-bold mb-8 text-center">Upcoming Events</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {events.map(event => (
            <Link
              to={`/events/${event.id}`}
              key={event.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col"
            >
              <img
                src={event.image}
                alt={event.title}
                className="h-56 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-red-600 font-semibold mb-2">{event.date}</div>
                  <div className="text-xl font-bold mb-1 line-clamp-2">{event.title}</div>
                  <div className="text-sm text-gray-600 mb-4 line-clamp-1">{event.location}</div>
                </div>
                <div className="mt-auto text-base font-semibold text-ngo-orange">
                  Starting <span className="text-lg">{event.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};

export default Events; 