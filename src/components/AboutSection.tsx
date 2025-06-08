
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-full -translate-y-48 translate-x-48" />
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold">
                About <span className="text-ngo-orange relative">
                  Us
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-ngo-orange transform scale-x-0 animate-[scale-x_1s_ease-out_1s_forwards]" />
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                WE ARE ONE is more than just an organization - we're a movement dedicated to 
                breaking the stigma around mental health and creating safe spaces for healing.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed hover:text-gray-900 transition-colors duration-300">
                Founded on the belief that mental health is just as important as physical health, 
                we provide comprehensive support services including counseling, peer support groups, 
                addiction recovery programs, and community outreach initiatives.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed hover:text-gray-900 transition-colors duration-300">
                Our approach is holistic, addressing not just the symptoms but the whole person, 
                fostering resilience, hope, and connection within our community.
              </p>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center group">
                <AnimatedCounter 
                  end={1} 
                  suffix="+"
                  className="text-3xl font-bold text-ngo-orange group-hover:scale-110 transition-transform duration-300"
                />
                <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Years Serving</div>
              </div>
              <div className="text-center group">
                <AnimatedCounter 
                  end={500} 
                  suffix="+"
                  className="text-3xl font-bold text-ngo-orange group-hover:scale-110 transition-transform duration-300"
                />
                <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">People Helped</div>
              </div>
              <div className="text-center group">
                <AnimatedCounter 
                  end={1000} 
                  suffix="+"
                  className="text-3xl font-bold text-ngo-orange group-hover:scale-110 transition-transform duration-300"
                />
                <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Volunteers</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="relative group">
              <img
                src="/about_1.jpg"
                alt="Mental health support"
                className="w-full h-64 object-cover rounded-3xl shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ngo-orange/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="bg-orange-50 rounded-3xl p-8 hover:bg-orange-100 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-2xl font-bold text-ngo-orange mb-4">About the Founder</h3>
              <p className="text-gray-700 leading-relaxed">
                Our founder's personal journey through mental health challenges inspired the creation 
                of WE ARE ONE. Having experienced firsthand the power of community support and 
                professional guidance, they envisioned a place where others could find the same 
                hope and healing that transformed their life.
              </p>
              <div className="mt-6 flex items-center space-x-4">
                <div className="w-12 h-12 bg-ngo-orange rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform duration-300 hover:rotate-12">
                  F
                </div>
                <div>
                  <div className="font-semibold hover:text-ngo-orange transition-colors duration-300">Eltone Cruz</div>
                  <div className="text-gray-600">Mental Health Advocate</div>
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
