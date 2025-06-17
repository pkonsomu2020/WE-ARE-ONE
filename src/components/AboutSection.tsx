import { useEffect, useRef, useState } from 'react';
import AnimatedCounter from './AnimatedCounter';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: About Content + Stats */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}
          >
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold">
                About{' '}
                <span className="text-ngo-orange relative inline-block">
                  Us
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-ngo-orange transform scale-x-0 animate-[scale-x_1s_ease-out_1s_forwards]" />
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                WE ARE ONE is more than just an organization — we're a movement
                dedicated to breaking the stigma around mental health and
                creating safe spaces for healing.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed hover:text-gray-900 transition-colors duration-300">
                Founded on the belief that mental health is just as important
                as physical health, we provide comprehensive support services
                including counseling, peer support groups, addiction recovery
                programs, and community outreach initiatives.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed hover:text-gray-900 transition-colors duration-300">
                Our approach is holistic, addressing not just the symptoms but
                the whole person, fostering resilience, hope, and connection
                within our community.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10">
              {[
                { end: 1, label: 'Years Serving' },
                { end: 500, label: 'People Helped' },
                { end: 1000, label: 'Volunteers' },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <AnimatedCounter
                    end={stat.end}
                    suffix="+"
                    className="text-3xl font-bold text-ngo-orange group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Founder Content with Image */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
          >
            <div className="relative w-full max-w-[420px] mx-auto bg-ngo-orange rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/Dela_IMG.jpg"
                alt="Founder"
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-500 rounded-t-3xl"
              />
              <div className="p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">About the Founder</h3>
                <p className="text-white/90 mb-4">
                  Our founder's personal journey through mental health
                  challenges inspired the creation of WE ARE ONE. Having
                  experienced firsthand the power of community support and
                  professional guidance, he envisioned a place where others
                  could find the same hope and healing that transformed their
                  life.
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white text-ngo-orange rounded-full flex items-center justify-center font-bold hover:scale-110 transition-transform duration-300">
                    F
                  </div>
                  <div>
                    <div className="font-semibold">Eltone Cruzz</div>
                    <div className="text-sm text-white/80">Founder</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
