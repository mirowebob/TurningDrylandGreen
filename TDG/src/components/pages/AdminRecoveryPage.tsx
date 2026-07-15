// AdminRecoveryPage.tsx
import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { resetAdminPassword } from '../../services/api';

export default function AdminRecoveryPage() {
    const [secret, setSecret] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await resetAdminPassword(secret, email, newPassword);

            if (res) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                setError(err.response.data.error);
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
                    <h1 className="text-2xl font-semibold text-white">Account Recovery</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Requires the admin reset secret
                    </p>
                </div>

                {success ? (
                    <div className="text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 rounded-md px-3 py-2 text-center">
                        Password updated. Redirecting to login…
                    </div>
                ) : (
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
                            <label htmlFor="secret" className="block text-sm text-gray-300 mb-1.5">
                                Reset Secret
                            </label>
                            <input
                                id="secret"
                                type="password"
                                required
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-3 py-2 text-white
                           placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-emerald-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm text-gray-300 mb-1.5">
                                Admin Email
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
                            <label htmlFor="newPassword" className="block text-sm text-gray-300 mb-1.5">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-3 py-2 text-white
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-1.5">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-md bg-gray-800/80 border border-gray-700 px-3 py-2 text-white
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
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
                            {isLoading ? 'Updating…' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}