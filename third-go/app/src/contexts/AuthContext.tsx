import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
}

export interface SignupData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    const storedToken = localStorage.getItem('auth_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const users: Array<User & { password: string }> = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return false;

    const { password: _, ...userWithoutPassword } = found;
    const token = 'mock_token_' + Math.random().toString(36).substring(2);

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
    return true;
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    if (data.password !== data.confirm_password) return false;
    if (data.password.length < 6) return false;

    const users: Array<User & { password: string }> = JSON.parse(localStorage.getItem('mock_users') || '[]');
    if (users.some(u => u.email === data.email)) return false;

    const newUser = {
      id: Date.now(),
      email: data.email,
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
    };

    users.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    const token = 'mock_token_' + Math.random().toString(36).substring(2);

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
