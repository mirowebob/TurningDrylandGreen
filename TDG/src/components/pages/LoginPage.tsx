// LoginPage.tsx
import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../services/AuthContext';
import { loginUser } from '../../services/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await loginUser(email, password)

            login(response.data.token, response.data.refreshToken);
            navigate('/admin');
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                setError('Invalid email or password.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
                    <p className="text-gray-400 text-sm mt-1">Sign in to continue</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-xl p-6 space-y-5"
                >
                    {error && (
                        <div
                            role="alert"
                            className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-md px-3 py-2"
                        >
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-300 mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-3 py-2 text-white
                         placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-emerald-500"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-300 mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-3 py-2 text-white
                         placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-emerald-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50
                       disabled:cursor-not-allowed text-white font-medium py-2.5 transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                       focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                    >
                        {isLoading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}