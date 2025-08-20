import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  className?: string;
}

const BackToTop = ({ className }: BackToTopProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      aria-label="Back to top"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-[60] bg-ngo-orange hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-colors',
        className
      )}
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};

export default BackToTop;


