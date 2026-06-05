import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Music, LogIn, UserPlus } from 'lucide-react';

export default function AuthOverlay() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(loginEmail, loginPassword);
    if (!success) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const success = await signup({
      first_name: firstName,
      last_name: lastName,
      username,
      email: signupEmail,
      password: signupPassword,
      confirm_password: confirmPassword,
    });

    if (!success) {
      setError('Email already registered or invalid data');
    }
    setLoading(false);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(11, 11, 16, 0.95)' }}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl"
        style={{
          backgroundColor: '#14141C',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Music className="w-8 h-8" style={{ color: '#F59E0B' }} />
          <span
            className="text-2xl font-extrabold"
            style={{ color: '#F59E0B', letterSpacing: '-1px' }}
          >
            SonicStream
          </span>
        </div>

        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
          >
            {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={{
                  backgroundColor: '#1E1E28',
                  color: '#F3F4F6',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
                onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={{
                  backgroundColor: '#1E1E28',
                  color: '#F3F4F6',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
                onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#fff',
                transform: 'scale(1)',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={{
                  backgroundColor: '#1E1E28',
                  color: '#F3F4F6',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
                onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
                style={{
                  backgroundColor: '#1E1E28',
                  color: '#F3F4F6',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
                onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
              />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: '#1E1E28',
                color: '#F3F4F6',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
              onFocus={e => (e.target.style.borderColor = '#F59E0B')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
            />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={e => setSignupEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: '#1E1E28',
                color: '#F3F4F6',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
              onFocus={e => (e.target.style.borderColor = '#F59E0B')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={signupPassword}
              onChange={e => setSignupPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: '#1E1E28',
                color: '#F3F4F6',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
              onFocus={e => (e.target.style.borderColor = '#F59E0B')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors"
              style={{
                backgroundColor: '#1E1E28',
                color: '#F3F4F6',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
              onFocus={e => (e.target.style.borderColor = '#F59E0B')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)')}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#fff',
                transform: 'scale(1)',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={toggleForm}
            className="text-sm transition-colors"
            style={{ color: '#9CA3AF' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F59E0B')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}
