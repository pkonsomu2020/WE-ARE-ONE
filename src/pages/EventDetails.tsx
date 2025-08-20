import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getEventById } from '@/data/events';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import BackToTop from '@/components/BackToTop';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const event = getEventById(id);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);
  const [ticketType, setTicketType] = useState<'WAO Members' | 'Public'>('WAO Members');
  const ticketPrice = ticketType === 'WAO Members' ? 800 : 1000;

  // Monitor form reference
  useEffect(() => {
    console.log('🔄 Form reference updated:', formRef);
  }, [formRef]);

  // Robust form reset function
  const resetForm = () => {
    try {
      // Method 1: Use stored form reference
      if (formRef) {
        formRef.reset();
        console.log('✅ Form reset via stored reference');
        return;
      }
      
      // Method 2: Use document.querySelector
      const form = document.querySelector('form');
      if (form) {
        form.reset();
        console.log('✅ Form reset via document.querySelector');
        return;
      }
      
      // Method 3: Manual input clearing
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
      inputs.forEach((input: any) => {
        if (input.type === 'checkbox') {
          input.checked = false;
        } else {
          input.value = '';
        }
      });
      console.log('✅ Form reset via manual input clearing');
      
    } catch (error) {
      console.error('❌ Form reset failed:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const fullName = String(form.get('fullName') || '').trim();
    const email = String(form.get('email') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const experience = String(form.get('experience') || '').trim();
    const mpesaCode = String(form.get('mpesaCode') || '').trim();
    const acceptTerms = form.get('acceptTerms') === 'on';
    const acceptUpdates = form.get('acceptUpdates') === 'on';

    if (!fullName || !email || !phone || !acceptTerms || !mpesaCode) {
      setSubmitting(false);
      setMessage({ type: 'error', text: 'Please fill in Full Name, Email, Phone, M-Pesa code and accept Terms.' });
      return;
    }

    try {
      const apiBase = api.getBaseUrl();
      console.log('🌐 API Base URL:', apiBase);
      
      // Test backend connectivity first
      try {
        const healthCheck = await fetch(`${apiBase}/health`, { 
          method: 'GET',
          timeout: 5000 
        });
        console.log('🏥 Backend Health Check:', healthCheck.status);
        
        // Test events endpoint
        const eventsTest = await fetch(`${apiBase}/api/events/test`, { 
          method: 'GET',
          timeout: 5000 
        });
        console.log('🎯 Events Endpoint Test:', eventsTest.status);
        
        if (eventsTest.ok) {
          const testData = await eventsTest.json();
          console.log('✅ Events Test Response:', testData);
        }
      } catch (healthErr) {
        console.warn('⚠️ Backend health check failed:', healthErr);
      }
      
      console.log('📝 Form Data:', {
        eventId: event.id,
        fullName,
        email,
        phone,
        experience,
        acceptTerms,
        acceptUpdates,
      });
      
      // Use the centralized API utility
      try {
        const data = await api.post('/api/events/register', {
          eventId: event.id,
          fullName,
          email,
          phone,
          experience,
          acceptTerms,
          acceptUpdates,
          ticketType,
          amount: ticketPrice,
          mpesaCode,
        });
        
        console.log('✅ Success Response:', data);
        const tno = data.ticketNumber ? ` Your Ticket Number is ${data.ticketNumber}.` : '';
        setMessage({ type: 'success', text: `Registration received! We have emailed a confirmation.${tno}` });
        resetForm();
        
      } catch (apiErr) {
        console.warn('⚠️ Centralized API failed, trying direct fetch:', apiErr);
        
        // Fallback to direct fetch
        const res = await fetch(`${apiBase}/api/events/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            eventId: event.id,
            fullName,
            email,
            phone,
            experience,
            acceptTerms,
            acceptUpdates,
          }),
        });

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          console.log('✅ Direct Fetch Success:', data);
          setMessage({ type: 'success', text: 'Registration received! We have emailed a confirmation.' });
          resetForm();
        } else {
          const errText = await res.text();
          throw new Error(errText || `HTTP ${res.status}: ${res.statusText}`);
        }
      }
      
    } catch (err) {
      console.error('🚨 API Error:', err);
      setMessage({ type: 'error', text: `Registration failed: ${err instanceof Error ? err.message : 'Please try again.'}` });
    } finally {
      setSubmitting(false);
    }
  };

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
              <div className="space-y-3 mb-4">
                <label className="flex items-center justify-between border-b pb-2 cursor-pointer">
                  <div>
                    <div className="font-semibold">WAO Members</div>
                    <div className="text-sm text-gray-600">KES 800</div>
                  </div>
                  <input type="radio" name="ticketType" value="WAO Members" checked={ticketType === 'WAO Members'} onChange={() => setTicketType('WAO Members')} />
                </label>
                <label className="flex items-center justify-between border-b pb-2 cursor-pointer">
                  <div>
                    <div className="font-semibold">Public</div>
                    <div className="text-sm text-gray-600">KES 1000</div>
                  </div>
                  <input type="radio" name="ticketType" value="Public" checked={ticketType === 'Public'} onChange={() => setTicketType('Public')} />
                </label>
              </div>
              <div className="text-sm font-semibold mb-4">Total: KES {ticketPrice}</div>
              
              {message && (
                <div className={`mb-3 text-sm px-3 py-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}
              <form className="space-y-3" onSubmit={handleSubmit} ref={setFormRef}>
                <input defaultValue={user?.fullName || ''} name="fullName" type="text" placeholder="Full Name" className="w-full border rounded px-3 py-2" />
                <input defaultValue={user?.email || ''} name="email" type="email" placeholder="Email address" className="w-full border rounded px-3 py-2" />
                <input name="phone" type="tel" placeholder="Phone Number" className="w-full border rounded px-3 py-2" />
                <div>
                  <label className="block text-sm font-medium mb-1">What are you hoping to experience during this event?</label>
                  <textarea name="experience" className="w-full border rounded px-3 py-2 h-24 resize-none" placeholder="Tell us your expectation (optional)"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">M-Pesa Confirmation Code</label>
                  <input name="mpesaCode" type="text" placeholder="e.g., WAO1ABCD23" className="w-full border rounded px-3 py-2 uppercase tracking-wide" />
                  <div className="text-xs text-gray-500 mt-1">We will verify your payment against the ticket amount (KES {ticketPrice}).</div>
                </div>
                <div className="flex items-center space-x-2">
                  <input name="acceptTerms" type="checkbox" id="privacy" />
                  <label htmlFor="privacy" className="text-xs">I have read and agree to <a href="#" className="underline text-ngo-orange">Privacy Policy</a>, <a href="#" className="underline text-ngo-orange">Terms and Conditions</a></label>
                </div>
                <div className="flex items-center space-x-2">
                  <input name="acceptUpdates" type="checkbox" id="updates" />
                  <label htmlFor="updates" className="text-xs">I accept to receive news & updates</label>
                </div>
                <button disabled={submitting} type="submit" className="w-full bg-ngo-orange text-white py-2 rounded font-semibold mt-2 disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Book Now'}
                </button>
              </form>
            </div>
            <Link to="/events" className="block text-center text-ngo-orange underline">Back to Events</Link>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
};

export default EventDetails; 