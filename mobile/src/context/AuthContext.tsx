import React, { createContext, useContext, useState } from 'react';

export interface MockUser {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: MockUser | null;
    login: (email: string) => void;
    logout: () => void;
    register: (username: string, email: string) => void;
    verifyOtp: (code: string) => boolean;
}

const defaultUser: MockUser = {
    id: 'user_sahil',
    username: 'sahil.arote',
    email: 'sahil@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: 'Software Engineer & Pulse Chat Lead'
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: true, // Default to true for design navigation exploration
    user: defaultUser,
    login: () => {},
    logout: () => {},
    register: () => {},
    verifyOtp: () => true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const [user, setUser] = useState<MockUser | null>(defaultUser);

    const login = (email: string) => {
        setUser({
            ...defaultUser,
            email: email || defaultUser.email
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const register = (username: string, email: string) => {
        setUser({
            id: `user_${Date.now()}`,
            username: username || 'newuser',
            email: email || 'user@example.com',
            bio: 'Hey there! I am using Pulse Chat.'
        });
        setIsAuthenticated(true);
    };

    const verifyOtp = (code: string) => {
        return code.length === 6;
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                register,
                verifyOtp
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
