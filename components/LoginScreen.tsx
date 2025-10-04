
import React, { useState } from 'react';
import { UserIcon } from './icons';

interface LoginScreenProps {
    onLogin: (email: string, pass: string) => boolean;
    onSignUp: (email: string, pass: string) => boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email || !password) {
            setError("Email and password cannot be empty.");
            return;
        }

        let success = false;
        if (isLoginView) {
            success = onLogin(email, password);
            if (!success) {
                setError("Invalid credentials. Please try again or sign up.");
            }
        } else {
            success = onSignUp(email, password);
            if (!success) {
                setError("An account with this email already exists.");
            }
        }
    };
    
    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError(null);
        setEmail('');
        setPassword('');
    }

    return (
        <div className="text-center bg-slate-800/50 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full animate-fade-in-up">
            <div className="mb-6">
                <UserIcon className="w-20 h-20 text-cyan-400 mx-auto" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                {isLoginView ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="text-slate-300 mb-8">
                {isLoginView ? 'Sign in to continue your journey.' : 'Join the community of explorers!'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <input 
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        aria-label="Email Address"
                    />
                </div>
                 <div>
                    <input 
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        aria-label="Password"
                    />
                </div>

                {error && <p className="text-red-400 text-sm animate-fade-in">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
                >
                    {isLoginView ? 'Sign In' : 'Sign Up'}
                </button>
            </form>

            <div className="mt-6">
                <button onClick={toggleView} className="text-slate-400 hover:text-cyan-400 transition-colors">
                    {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
            </div>
        </div>
    );
};

export default LoginScreen;
