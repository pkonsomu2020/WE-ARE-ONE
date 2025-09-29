import { useEffect } from 'react';

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
const IS_PROD = (import.meta.env.PROD ?? false) as boolean;

const Analytics = () => {
  useEffect(() => {
    if (!IS_PROD) return;

    if (GA_ID) {
      // Google Analytics (gtag.js) - Priority 1
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
      document.head.appendChild(gtagScript);

      const inline = document.createElement('script');
      inline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);} 
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { anonymize_ip: true });
      `;
      document.head.appendChild(inline);
    } else if (PLAUSIBLE_DOMAIN) {
      // Plausible Analytics - Fallback only
      const script = document.createElement('script');
      script.setAttribute('defer', '');
      script.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
      script.src = 'https://plausible.io/js/plausible.js';
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default Analytics;


