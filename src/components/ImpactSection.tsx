
import { useEffect, useRef, useState } from 'react';
import AnimatedCounter from './AnimatedCounter';

const ImpactSection = () => {
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

  const impacts = [
    {
      number: 500,
      suffix: "+",
      label: "Lives Transformed",
      description: "Individuals who have found hope and healing through our programs"
    },
    {
      number: 80,
      suffix: "+",
      label: "Counseling Sessions",
      description: "Professional therapy sessions provided to community members"
    },
    {
      number: 200,
      suffix: "+",
      label: "Group Sessions",
      description: "Peer support group meetings fostering connection and understanding"
    },
    {
      number: 1000,
      suffix: "+",
      label: "Volunteers",
      description: "Dedicated community members supporting our mission"
    },
    {
      number: 24,
      suffix: "/7",
      label: "Crisis Support",
      description: "Round-the-clock availability for those in immediate need"
    },
    {
      number: 1,
      suffix: "+",
      label: "Years of Service",
      description: "Continuous commitment to mental health advocacy and support"
    }
  ];

  return (
    <section ref={sectionRef} id="impact" className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-ngo-orange/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-ngo-orange/5 rounded-full animate-ping" style={{animationDuration: '3s'}} />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-ngo-orange/10 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Our <span className="text-ngo-orange relative">
              Impact
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-ngo-orange transform scale-x-0 animate-[scale-x_1s_ease-out_1s_forwards]" />
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Through dedication, compassion, and community support, we've been able to make a 
            meaningful difference in the lives of hundreds of individuals and families.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {impacts.map((impact, index) => (
            <div 
              key={index} 
              className={`bg-gray-800 rounded-3xl p-8 text-center hover:bg-gray-700 transition-all duration-500 hover:scale-105 hover:shadow-2xl group ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
            >
              <div className="relative">
                <AnimatedCounter 
                  end={impact.number} 
                  suffix={impact.suffix}
                  className="text-4xl lg:text-5xl font-bold text-ngo-orange mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-ngo-orange/20 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-ngo-orange transition-colors duration-300">{impact.label}</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{impact.description}</p>
            </div>
          ))}
        </div>

        {/* Success Stories Section */}
        <div className={`bg-gray-800 rounded-3xl p-8 lg:p-12 hover:bg-gray-750 transition-all duration-500 hover:shadow-2xl ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`} style={{transitionDelay: '800ms'}}>
          <h3 className="text-3xl font-bold mb-8 text-center">Success Stories</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-700 rounded-2xl p-6 hover:bg-gray-600 transition-all duration-300 hover:scale-105 group">
              <p className="text-gray-300 italic mb-4 leading-relaxed group-hover:text-white transition-colors duration-300">
                "WE ARE ONE gave me hope when I had none. The peer support group helped me 
                realize I wasn't alone in my struggles with anxiety. Today, I'm not just surviving - I'm thriving."
              </p>
              <div className="font-semibold text-ngo-orange group-hover:text-orange-400 transition-colors duration-300">- Sarah M.</div>
            </div>
            <div className="bg-gray-700 rounded-2xl p-6 hover:bg-gray-600 transition-all duration-300 hover:scale-105 group">
              <p className="text-gray-300 italic mb-4 leading-relaxed group-hover:text-white transition-colors duration-300">
                "The addiction recovery program here saved my life. The combination of professional 
                counseling and peer mentorship gave me the tools I needed to rebuild my life."
              </p>
              <div className="font-semibold text-ngo-orange group-hover:text-orange-400 transition-colors duration-300">- Michael R.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
