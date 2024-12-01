import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  walletLoggedIn: boolean;
  setWalletLoggedIn: (loggedIn: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [walletLoggedIn, setWalletLoggedIn] = useState<boolean>(false);

  return (
    <AuthContext.Provider value={{ walletLoggedIn, setWalletLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
