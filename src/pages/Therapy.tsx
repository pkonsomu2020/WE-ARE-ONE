import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const Therapy: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [expanded, setExpanded] = useState<string | null>('individual');
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const steps = [
    {
      title: 'Initial Consultation',
      desc: 'We get to know you, your background, and what brings you to therapy.'
    },
    {
      title: 'Assessment & Goal Setting',
      desc: 'Together, we identify what you would like to achieve with clear, compassionate goals.'
    },
    {
      title: 'Therapy Sessions',
      desc: 'Meet regularly with your therapist in a safe, non-judgmental space.'
    },
    {
      title: 'Progress & Follow-Up',
      desc: 'We check in on your growth and offer continued support as needed.'
    },
  ];

  const gallery = [
    '/hero_1.jpg',
    '/hero_2.jpg',
    '/hero_3.jpg',
    '/about_1.jpg',
    '/community_img.jpg',
    '/about_1.jpg'
  ];
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-28">
        {/* Hero Banner */}
        <section className="relative w-full h-[320px] md:h-[420px] lg:h-[480px] overflow-hidden">
          <img
            src="/hero_3.jpg"
            alt="Therapy at We Are One"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Healing Begins With Connection</h1>
              <p className="text-white/90 md:text-lg">Safe, confidential therapy services - online or in-person - guided by compassion and professionalism.</p>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto py-10 px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">🧠 THERAPY SERVICES - We Are One</h2>
          <p className="text-lg text-gray-700 text-center mb-10">🌼 Welcome to We Are One Therapy</p>

          <div className="bg-white rounded-lg shadow p-6 md:p-10 space-y-8">
            <section>
              <p className="text-gray-700 leading-relaxed">
                At We Are One, we believe that healing begins with connection. Our therapy services provide a safe,
                confidential, and supportive space for you to explore your thoughts, emotions, and experiences.
                Whether you're facing personal struggles, relationship challenges, or simply seeking self-growth,
                our team is here to walk with you on your journey toward emotional wellness.
              </p>
            </section>

            <hr className="my-2" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">📸 Our Space & Sessions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.map((src) => (
                  <button
                    key={src}
                    onClick={() => setLightboxSrc(src)}
                    className="relative group rounded overflow-hidden shadow focus:outline-none focus:ring-2 focus:ring-ngo-orange"
                    aria-label="Preview image"
                  >
                    <img src={src} alt="Therapy visual" className="w-full h-36 md:h-40 object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </button>
                ))}
              </div>
            </section>

            <hr className="my-2" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">💬 Our Therapy Services</h2>
              <div className="space-y-3">
                <div className="border rounded-lg overflow-hidden">
                  <button onClick={() => setExpanded(expanded === 'individual' ? null : 'individual')} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
                    <span className="text-lg font-semibold">1. Individual Therapy</span>
                    <span className="text-gray-500">{expanded === 'individual' ? '−' : '+'}</span>
                  </button>
                  {expanded === 'individual' && (
                    <div className="p-4 space-y-1">
                      <p className="text-gray-700">
                        A one-on-one session with a professional therapist designed to help you work through personal
                        challenges such as stress, anxiety, depression, grief, or self-esteem issues.
                      </p>
                      <p className="text-gray-700"><span className="font-medium">Duration:</span> 45-60 minutes per session</p>
                      <p className="text-gray-700"><span className="font-medium">Mode:</span> In-person or online</p>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <button onClick={() => setExpanded(expanded === 'couples' ? null : 'couples')} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
                    <span className="text-lg font-semibold">2. Couples Therapy</span>
                    <span className="text-gray-500">{expanded === 'couples' ? '−' : '+'}</span>
                  </button>
                  {expanded === 'couples' && (
                    <div className="p-4 space-y-1">
                      <p className="text-gray-700">
                        For partners who want to improve communication, rebuild trust, or strengthen their bond. Our sessions
                        offer a safe environment for open and honest conversations.
                      </p>
                      <p className="text-gray-700"><span className="font-medium">Duration:</span> 60 minutes</p>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <button onClick={() => setExpanded(expanded === 'family' ? null : 'family')} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
                    <span className="text-lg font-semibold">3. Family Therapy</span>
                    <span className="text-gray-500">{expanded === 'family' ? '−' : '+'}</span>
                  </button>
                  {expanded === 'family' && (
                    <div className="p-4">
                      <p className="text-gray-700">
                        These sessions help families navigate conflict, improve understanding, and restore harmony within the home.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <button onClick={() => setExpanded(expanded === 'group' ? null : 'group')} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
                    <span className="text-lg font-semibold">4. Group Therapy</span>
                    <span className="text-gray-500">{expanded === 'group' ? '−' : '+'}</span>
                  </button>
                  {expanded === 'group' && (
                    <div className="p-4">
                      <p className="text-gray-700">
                        Join a small, supportive group of individuals who share similar experiences. Learn, grow, and heal together
                        through guided discussions.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <button onClick={() => setExpanded(expanded === 'online' ? null : 'online')} className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
                    <span className="text-lg font-semibold">5. Online Counselling</span>
                    <span className="text-gray-500">{expanded === 'online' ? '−' : '+'}</span>
                  </button>
                  {expanded === 'online' && (
                    <div className="p-4">
                      <p className="text-gray-700">
                        For those who prefer flexibility or privacy from home - same quality support through virtual sessions.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <hr className="my-2" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">🪷 What to Expect</h2>
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="md:w-1/3">
                  <ol className="space-y-2">
                    {steps.map((s, idx) => (
                      <li key={s.title}>
                        <button
                          onClick={() => setActiveStep(idx)}
                          className={`w-full text-left px-3 py-2 rounded border transition ${activeStep === idx ? 'bg-ngo-orange text-white border-ngo-orange' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                        >
                          <span className="font-semibold">{idx + 1}. {s.title}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="md:flex-1">
                  <div className="p-4 border rounded bg-gray-50">
                    <h3 className="text-xl font-bold mb-2">{steps[activeStep].title}</h3>
                    <p className="text-gray-700">{steps[activeStep].desc}</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-4">Every step of your journey is guided by compassion, professionalism, and confidentiality.</p>
            </section>

            <hr className="my-2" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">🌱 Meet Our Therapists</h2>
              <p className="text-gray-700 mb-6">
                Our therapists are passionate, trained, and committed to walking with you through every stage of healing.
                We provide an empathetic approach grounded in respect, confidentiality, and evidence-based practices.
              </p>
              
              {/* Therapists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {/* Anita Karembo */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src="/Anita karembo.jpg" 
                      alt="Anita Karembo - Therapist" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Anita Karembo</h3>
                    <p className="text-gray-600 mb-4">Licensed Professional Therapist</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <span className="text-ngo-orange mr-2">📞</span>
                        <a href="tel:0795676298" className="hover:text-ngo-orange transition-colors">0795676298</a>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="text-ngo-orange mr-2">📧</span>
                        <a href="mailto:agreathealth@gmail.com" className="hover:text-ngo-orange transition-colors break-all">agreathealth@gmail.com</a>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <a 
                        href="https://wa.me/254795676298" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-ngo-orange text-white text-center rounded hover:bg-orange-600 transition-colors text-sm"
                      >
                        WhatsApp
                      </a>
                      <a 
                        href="tel:0795676298"
                        className="flex-1 px-4 py-2 border border-ngo-orange text-ngo-orange text-center rounded hover:bg-orange-50 transition-colors text-sm"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>

                {/* Sharon Nancy Sunkuli */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src="/Sharon Nancy Sunkuli.jpg" 
                      alt="Sharon Nancy Sunkuli - Therapist" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sharon Nancy Sunkuli</h3>
                    <p className="text-gray-600 mb-4">Licensed Professional Therapist</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <span className="text-ngo-orange mr-2">📞</span>
                        <a href="tel:0794906248" className="hover:text-ngo-orange transition-colors">0794906248</a>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="text-ngo-orange mr-2">📧</span>
                        <a href="mailto:Sunkulisharon1989@gmail.com" className="hover:text-ngo-orange transition-colors break-all">Sunkulisharon1989@gmail.com</a>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <a 
                        href="https://wa.me/254794906248" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-ngo-orange text-white text-center rounded hover:bg-orange-600 transition-colors text-sm"
                      >
                        WhatsApp
                      </a>
                      <a 
                        href="tel:0794906248"
                        className="flex-1 px-4 py-2 border border-ngo-orange text-ngo-orange text-center rounded hover:bg-orange-50 transition-colors text-sm"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <blockquote className="italic text-gray-800 bg-orange-50 border border-orange-200 rounded p-4">
                "At We Are One, we do not just listen — we understand."
              </blockquote>
            </section>

            <hr className="my-2" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">💵 Session Information</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><span className="font-medium">Session Duration:</span> 45-60 minutes</li>
                <li><span className="font-medium">Frequency:</span> Weekly or as agreed with your therapist</li>
                <li><span className="font-medium">Fees:</span> Affordable rates - contact us for pricing and special student packages</li>
                <li><span className="font-medium">Confidentiality:</span> All sessions are strictly private and secure</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />

      {lightboxSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setLightboxSrc(null)}>
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute -top-2 -right-2 bg-white text-gray-800 rounded-full w-9 h-9 shadow flex items-center justify-center"
              aria-label="Close preview"
            >
              ✕
            </button>
            <img src={lightboxSrc} alt="Preview" className="w-full max-h-[80vh] object-contain rounded" />
          </div>
        </div>
      )}
    </>
  );
};

export default Therapy;