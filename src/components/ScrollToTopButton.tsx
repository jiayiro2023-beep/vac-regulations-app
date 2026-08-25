import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  targetRef?: React.RefObject<HTMLElement>;
  threshold?: number;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ targetRef, threshold = 420 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const getWindowScrollTop = () => window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  useEffect(() => {
    const getScrollableTarget = () => {
      const target = targetRef?.current;
      return target && target.scrollHeight > target.clientHeight + 4 ? target : null;
    };
    const updateVisibility = () => {
      const target = getScrollableTarget();
      setIsVisible(target ? target.scrollTop > threshold : getWindowScrollTop() > threshold);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility, { passive: true });
    const target = targetRef?.current;
    target?.addEventListener('scroll', updateVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
      target?.removeEventListener('scroll', updateVisibility);
    };
  }, [targetRef, threshold]);

  if (!isVisible) return null;

  const handleScrollToTop = () => {
    const target = targetRef?.current;
    if (target && target.scrollHeight > target.clientHeight + 4) {
      target.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    document.scrollingElement?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="回到頂端"
      title="回到頂端"
      className="fixed bottom-5 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-[#1b568f] text-white shadow-[0_14px_30px_rgba(15,53,91,0.24)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#154574] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 active:translate-y-0 sm:bottom-7 sm:right-7 sm:h-14 sm:w-14 dark:border-slate-700 dark:bg-blue-600 dark:hover:bg-blue-500"
    >
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} aria-hidden="true" />
    </button>
  );
};
