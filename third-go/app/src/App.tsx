import { useState, useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AudioProvider } from '@/contexts/AudioContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import PlayerBar from '@/components/PlayerBar';
import AuthOverlay from '@/components/AuthOverlay';
import AudioReactiveCanvas from '@/components/AudioReactiveCanvas';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Library from '@/pages/Library';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback((page: string) => {
    if (page === activePage) return;

    // GSAP page transition
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => {
          setActivePage(page);
          if (contentRef.current) {
            gsap.fromTo(
              contentRef.current,
              { opacity: 0, x: 20 },
              { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
            );
          }
        },
      });
    } else {
      setActivePage(page);
    }
  }, [activePage]);

  // Mobile bottom nav
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'search':
        return <Search />;
      case 'library':
        return <Library />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: '#0B0B10' }}>
      {/* Auth overlay */}
      {!isAuthenticated && <AuthOverlay />}

      {/* Sidebar (desktop) */}
      {isAuthenticated && <Sidebar activePage={activePage} onNavigate={handleNavigate} />}

      {/* Main content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Audio reactive background */}
        <AudioReactiveCanvas />

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto relative z-10"
          style={{ paddingBottom: isAuthenticated ? '100px' : '0' }}
        >
          <div ref={contentRef} className="p-6 md:p-8">
            {isAuthenticated ? renderPage() : (
              <div className="flex items-center justify-center h-full">
                <p style={{ color: '#9CA3AF' }}>Please log in to continue</p>
              </div>
            )}
          </div>
        </div>

        {/* Player bar */}
        {isAuthenticated && <PlayerBar />}
      </main>

      {/* Mobile bottom nav */}
      {isMobile && isAuthenticated && (
        <MobileNav activePage={activePage} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

function MobileNav({
  activePage,
  onNavigate,
}: {
  activePage: string;
  onNavigate: (page: string) => void;
}) {
  const items = [
    { id: 'home', label: 'Home', icon: '&#127968;' },
    { id: 'search', label: 'Search', icon: '&#128269;' },
    { id: 'library', label: 'Library', icon: '&#128218;' },
  ];

  return (
    <nav
      className="fixed bottom-[90px] left-0 right-0 flex justify-around items-center py-2 md:hidden"
      style={{
        backgroundColor: '#14141C',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 55,
      }}
    >
      {items.map(item => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center gap-1 py-1 px-4 rounded-lg transition-colors"
          >
            <span
              className="text-xl"
              dangerouslySetInnerHTML={{ __html: item.icon }}
              style={{ color: isActive ? '#F59E0B' : '#9CA3AF' }}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: isActive ? '#F59E0B' : '#9CA3AF' }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </AuthProvider>
  );
}
