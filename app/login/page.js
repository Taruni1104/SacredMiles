"use client";

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { storeUser } from '@/lib/auth';
import { apiRequest, isApiConfigured } from '@/lib/api';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (isApiConfigured()) {
            try {
                const { user } = await apiRequest('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });
                storeUser(user);
                router.replace(searchParams.get('next') || '/planner');
            } catch (apiError) {
                setError(apiError.message);
            }
            return;
        }

        const storedAccount = window.localStorage.getItem('yatra-account');
        let account = null;
        try {
            account = storedAccount ? JSON.parse(storedAccount) : null;
        } catch (parseError) {
            console.error('Unable to read the local account:', parseError);
        }

        if (!account || account.email !== email || account.password !== password) {
            setError('No matching local account found. Register first or check your details.');
            return;
        }

        storeUser({ name: account.name, email: account.email });
        router.replace(searchParams.get('next') || '/planner');
    };

    return (
        <main className="container py-5" style={{ maxWidth: '34rem' }}>
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                    <p className="section-label">Welcome back</p>
                    <h1 className="h2 mb-3">Sign in to your Yatra</h1>
                    <p className="text-secondary">Your plans, bucket-list places, and saved trips stay connected to your account.</p>
                    <form onSubmit={handleSubmit} className="vstack gap-3">
                        <label className="form-label mb-0" htmlFor="login-email">Email</label>
                        <input id="login-email" className="form-control" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                        <label className="form-label mb-0" htmlFor="login-password">Password</label>
                        <input id="login-password" className="form-control" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
                        {error && <div className="alert alert-danger mb-0">{error}</div>}
                        <button className="btn btn-forest mt-2" type="submit">Login</button>
                    </form>
                    <p className="small text-secondary mt-4 mb-0">New here? <Link href="/register">Create an account</Link></p>
                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return <Suspense fallback={<main className="container py-5 text-center">Loading login...</main>}><LoginForm /></Suspense>;
}
