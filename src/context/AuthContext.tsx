import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, LoginCredentials } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock authentication - in real app, validate against backend
    if (credentials.username && credentials.password) {
      // Use static data instead of faker
      const newUser: User = {
        id: `EMP123456`,
        username: credentials.username,
        email: `${credentials.username.toLowerCase().replace(' ', '.')}@municipality.gov.in`,
        department: credentials.department,
        role: credentials.role,
        shift: credentials.shift,
        location: credentials.location,
        lastLogin: new Date(),
        joinDate: new Date('2021-08-15T00:00:00Z'),
        about: 'A dedicated and experienced administrator focused on improving civic infrastructure and response times.',
        avatarUrl: `https://i.pravatar.cc/150?u=${credentials.username}`,
      };
      
      setUser(newUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
