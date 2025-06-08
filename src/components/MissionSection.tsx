
import { Heart, Users, Shield, Lightbulb } from 'lucide-react';

const MissionSection = () => {
  const missions = [
    {
      icon: Heart,
      title: "Support & Community",
      description: "Creating safe spaces where individuals can share their experiences, find understanding, and build meaningful connections with others who understand their journey."
    },
    {
      icon: Lightbulb,
      title: "Education & Awareness",
      description: "Raising awareness about mental health issues, reducing stigma, and providing educational resources to empower individuals and families."
    },
    {
      icon: Shield,
      title: "Advocacy & Policy Change",
      description: "Advocating for better mental health policies, improved access to services, and systemic changes that benefit our community."
    },
    {
      icon: Users,
      title: "Peer Mentorship",
      description: "Connecting individuals with trained peer mentors who can provide guidance, support, and hope based on lived experience."
    }
  ];

  return (
    <section id="mission" className="py-20 bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Our <span className="text-ngo-orange">Mission</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are committed to fostering mental wellness, building resilient communities, 
            and ensuring that no one faces their challenges alone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {missions.map((mission, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-2 transform transition-transform"
            >
              <div className="bg-ngo-orange rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <mission.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">{mission.title}</h3>
              <p className="text-gray-600 leading-relaxed">{mission.description}</p>
            </div>
          ))}
        </div>

        {/* Additional mission statement */}
        <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6 text-gray-800">
              Supporting Every Step of Your Journey
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Whether you're dealing with anxiety, depression, addiction, trauma, or any other 
              mental health challenge, we believe in your strength and resilience. Our comprehensive 
              approach includes individual counseling, group therapy, family support, crisis intervention, 
              and wellness programs designed to meet you wherever you are in your healing journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
