import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const events = [
  {
    id: 'food-drive',
    title: 'WAO Food Drive',
    image: '/EVENTS/WAO_Food Drive.jpg',
    date: 'JUNE 1ST - JULY 31ST 2025',
    location: 'Community Center, Nairobi',
    price: 'KES 0',
    description: 'Join us for the WAO Food Drive to support our community with essential food supplies. Everyone is welcome!',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'General Admission', price: 'KES 0', status: 'Available' },
    ],
    photos: ['/EVENTS/WAO_Food Drive.jpg'],
    mapEmbed: 'https://maps.google.com/maps?q=Nairobi&t=&z=13&ie=UTF8&iwloc=&output=embed',
  },
  {
    id: 'movie-night',
    title: 'WAO Movie Night',
    image: '/EVENTS/WAO_Movie Night.jpg',
    date: 'SAT 2ND AUGUST 2025 4:00PM - 7:00PM',
    location: 'Anga Cinema Diamond Plaza, Parklands',
    price: 'KES 800',
    description: 'Enjoy a fun-filled evening under the stars with great movies and company at the WAO Movie Night.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Advanced Ticket', price: 'KES 800', status: 'Available' },
    ],
    photos: ['/EVENTS/WAO_Movie Night.jpg'],
    mapEmbed: 'https://www.google.com/maps?q=Anga+Cinema+Diamond+Plaza,+Parklands&output=embed',
  },
];

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <Link to="/events" className="text-ngo-orange underline">Back to Events</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 flex flex-col items-center">
        <div className="max-w-6xl w-full bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Event Image & Info */}
          <div className="md:col-span-2">
            <div className="w-full bg-gray-100 rounded mb-6 flex items-center justify-center" style={{ minHeight: '300px', maxHeight: '420px' }}>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-contain rounded"
                style={{ maxHeight: '420px' }}
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <span className="material-icons text-ngo-orange mr-1">location_on</span>
              <span>{event.location}</span>
            </div>
            <div className="text-xs text-red-600 font-semibold mb-4">{event.date}</div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-1">Host</h2>
              <div className="text-gray-700 mb-2">{event.host}</div>
              <h2 className="text-lg font-semibold mb-1">Description</h2>
              <div className="text-gray-800 mb-2">{event.description}</div>
              <h2 className="text-lg font-semibold mb-1">Dates</h2>
              <div className="text-gray-700 mb-2">{event.date}</div>
              <h2 className="text-lg font-semibold mb-1">Photos</h2>
              <div className="flex space-x-2 mb-4">
                {event.photos.map((photo, idx) => (
                  <img key={idx} src={photo} alt="Event" className="w-20 h-16 object-cover rounded" />
                ))}
              </div>
              <h2 className="text-lg font-semibold mb-1">Location</h2>
              <div className="mb-2">{event.location}</div>
              <div className="w-full h-56 rounded overflow-hidden">
                <iframe
                  src={event.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Event Location"
                ></iframe>
              </div>
            </div>
          </div>
          {/* Right: Ticket Options & Booking */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
              <h2 className="text-xl font-bold mb-4">Get your tickets to {event.title}</h2>
              <div className="space-y-3 mb-6">
                {event.tickets.map((ticket, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-semibold">{ticket.name}</div>
                      <div className="text-sm text-gray-600">{ticket.price}</div>
                    </div>
                    <div>
                      {ticket.status === 'Available' ? (
                        <button className="bg-ngo-orange text-white px-3 py-1 rounded text-sm">Select</button>
                      ) : (
                        <span className="text-red-500 font-semibold">Sold Out</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <form className="space-y-3">
                <input type="text" placeholder="Full Name" className="w-full border rounded px-3 py-2" />
                <input type="email" placeholder="Email address" className="w-full border rounded px-3 py-2" />
                <input type="tel" placeholder="Phone Number" className="w-full border rounded px-3 py-2" />
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="privacy" />
                  <label htmlFor="privacy" className="text-xs">I have read and agree to <a href="#" className="underline text-ngo-orange">Privacy Policy</a>, <a href="#" className="underline text-ngo-orange">Terms and Conditions</a></label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="updates" />
                  <label htmlFor="updates" className="text-xs">I accept to receive news & updates</label>
                </div>
                <button type="submit" className="w-full bg-ngo-orange text-white py-2 rounded font-semibold mt-2">Book Now</button>
              </form>
            </div>
            <Link to="/events" className="block text-center text-ngo-orange underline">Back to Events</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EventDetails; 