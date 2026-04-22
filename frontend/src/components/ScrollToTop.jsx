import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls the window to top on every route change.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Immediate scroll
    window.scrollTo(0, 0);
    
    // Delayed fallback for slower rendering pages
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname, search]); // Added search to trigger on filter changes too

  return null;
}
