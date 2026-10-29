"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest, isApiConfigured } from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password.length < (isApiConfigured() ? 8 : 6)) {
            setError(`Use a password with at least ${isApiConfigured() ? 8 : 6} characters.`);
            return;
        }

        if (isApiConfigured()) {
            try {
                const { user } = await apiRequest('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ name, email, password })
                });
                router.replace(`/login?registered=1&email=${encodeURIComponent(user.email)}`);
            } catch (apiError) {
                setError(apiError.message);
            }
            return;
        }

        window.localStorage.setItem('yatra-account', JSON.stringify({ name, email, password }));
        router.replace(`/login?registered=1&email=${encodeURIComponent(email)}`);
    };

    return (
        <main className="container py-5" style={{ maxWidth: '34rem' }}>
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                    <p className="section-label">Start your journey</p>
                    <h1 className="h2 mb-3">Create your Yatra account</h1>
                    <p className="text-secondary">Register to save itineraries, places, and future trips. You will sign in after creating your account.</p>
                    <form onSubmit={handleSubmit} className="vstack gap-3">
                        <label className="form-label mb-0" htmlFor="register-name">Name</label>
                        <input id="register-name" className="form-control" required value={name} onChange={(event) => setName(event.target.value)} />
                        <label className="form-label mb-0" htmlFor="register-email">Email</label>
                        <input id="register-email" className="form-control" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                        <label className="form-label mb-0" htmlFor="register-password">Password</label>
                        <div className="input-group">
                            <input id="register-password" className="form-control" type={showPassword ? 'text' : 'password'} minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {error && <div className="alert alert-danger mb-0">{error}</div>}
                        <button className="btn btn-forest mt-2" type="submit">Register</button>
                    </form>
                    <p className="small text-secondary mt-4 mb-0">Already registered? <Link href="/login">Login</Link></p>
                </div>
            </div>
        </main>
    );
}
