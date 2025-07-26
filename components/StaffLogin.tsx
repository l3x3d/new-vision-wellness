
import React, { useState, useRef, useEffect } from 'react';

interface StaffLoginProps {
    onLoginSuccess: () => void;
}

// NOTE: This is a hardcoded password for demonstration purposes ONLY.
// In a real application, use a secure authentication provider (e.g., OAuth, JWT).
const DEMO_PASSWORD = 'Vision2024!';

const StaffLogin: React.FC<StaffLoginProps> = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            if (password === DEMO_PASSWORD) {
                onLoginSuccess();
            } else {
                setError('Invalid password. Please try again.');
                setPassword('');
                inputRef.current?.focus();
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-screen py-12 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Staff Portal Login</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Access to this area is restricted to authorized personnel.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800/80 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    ref={inputRef}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 dark:focus:ring-offset-slate-900 transition-colors"
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
                 <p className="mt-6 text-center text-xs text-slate-500">
                    For demonstration: password is <code className="font-mono bg-slate-200 dark:bg-slate-700 rounded p-1">Vision2024!</code>
                </p>
            </div>
        </div>
    );
};

export default StaffLogin;
