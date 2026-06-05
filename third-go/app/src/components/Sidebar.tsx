import { Home, Search, Library, Music, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'library', label: 'Library', icon: Library },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside
      className="hidden md:flex flex-col h-full"
      style={{
        width: '240px',
        backgroundColor: '#14141C',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <Music className="w-7 h-7" style={{ color: '#F59E0B' }} />
        <span
          className="text-xl font-extrabold"
          style={{ color: '#F59E0B', letterSpacing: '-1px' }}
        >
          SonicStream
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map(item => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                color: isActive ? '#F59E0B' : '#9CA3AF',
                backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                borderLeft: isActive ? '3px solid #F59E0B' : '3px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#F3F4F6';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#9CA3AF';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      {user && (
        <div
          className="p-4 mx-4 mb-4 rounded-lg"
          style={{
            backgroundColor: '#1E1E28',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)' }}
            >
              <User className="w-4 h-4" style={{ color: '#F59E0B' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#F3F4F6' }}>
                {user.username}
              </p>
              <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{ color: '#9CA3AF', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#EF4444';
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#9CA3AF';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
