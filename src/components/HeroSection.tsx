
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-play carousel with continuous looping
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => clearInterval(interval);
  }, [api]);

  const heroImages = [
  {
    src: "/hero_1.jpg",
    alt: "Community support group"
  },
  {
    src: "/hero_2.jpg",
    alt: "Mental health support session"
  },
  {
    src: "/hero_3.jpg",
    alt: "Group therapy meeting"
  },
  {
    src: "/hero_4.jpg",
    alt: "Community volunteers helping"
  }
];


  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-orange-50 to-white pt-20 overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight animate-scale-in">
                Welcome to<br />
                <span className="text-ngo-orange animate-pulse">WE ARE ONE</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed opacity-0 animate-fade-in" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
                Championing Mental Health Awareness and Building Stronger Communities Together
              </p>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed opacity-0 animate-fade-in" style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
              We believe that no one should face mental health challenges alone. Our community 
              provides support, resources, and hope for individuals dealing with mental health 
              issues, addiction, and life's challenges.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in" style={{animationDelay: '0.9s', animationFillMode: 'forwards'}}>
              <Button 
                size="lg"
                onClick={() => scrollToSection('community')}
                className="bg-ngo-orange hover:bg-orange-600 text-white px-8 py-3 text-lg hover:scale-105 transition-all duration-300 hover:shadow-xl"
              >
                Join Our Community
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('about')}
                className="border-ngo-orange text-ngo-orange hover:bg-ngo-orange hover:text-white px-8 py-3 text-lg hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content - Image Carousel */}
          <div className="relative animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="bg-ngo-orange rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
              <Carousel 
                className="w-full" 
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {heroImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative overflow-hidden rounded-2xl">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-96 object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/80 hover:bg-white border-none hover:scale-110 transition-all duration-300" />
                <CarouselNext className="right-2 bg-white/80 hover:bg-white border-none hover:scale-110 transition-all duration-300" />
              </Carousel>
              
              {/* Carousel indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {heroImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      current === index ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating stats with pulse animation */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce" style={{animationDelay: '1.2s'}}>
              <div className="text-3xl font-bold text-ngo-orange">500+</div>
              <div className="text-gray-600">Lives Touched</div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce" style={{animationDelay: '1.5s'}}>
              <div className="text-3xl font-bold text-ngo-orange">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-ngo-orange/20 rounded-full animate-ping" style={{animationDelay: '2s'}} />
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-ngo-orange/10 rounded-full animate-ping" style={{animationDelay: '3s'}} />
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-ngo-orange/30 rounded-full animate-ping" style={{animationDelay: '4s'}} />
      </div>
    </section>
  );
};

export default HeroSection;
