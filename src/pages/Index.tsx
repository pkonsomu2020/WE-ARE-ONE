
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MissionSection from '@/components/MissionSection';
import ImpactSection from '@/components/ImpactSection';
import CommunitySection from '@/components/CommunitySection';
import DonationSection from '@/components/DonationSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <MissionSection />
      <ImpactSection />
      <CommunitySection />
      <DonationSection />
      <Footer />
    </div>
  );
};

export default Index;
