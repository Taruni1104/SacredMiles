"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { storeUser } from '@/lib/auth';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password.length < 6) {
            setError('Use a password with at least 6 characters.');
            return;
        }

        window.localStorage.setItem('yatra-account', JSON.stringify({ name, email, password }));
        storeUser({ name, email });
        router.replace('/planner');
    };

    return (
        <main className="container py-5" style={{ maxWidth: '34rem' }}>
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                    <p className="section-label">Start your journey</p>
                    <h1 className="h2 mb-3">Create your Yatra account</h1>
                    <p className="text-secondary">Register to save itineraries, places, and future trips.</p>
                    <form onSubmit={handleSubmit} className="vstack gap-3">
                        <label className="form-label mb-0" htmlFor="register-name">Name</label>
                        <input id="register-name" className="form-control" required value={name} onChange={(event) => setName(event.target.value)} />
                        <label className="form-label mb-0" htmlFor="register-email">Email</label>
                        <input id="register-email" className="form-control" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                        <label className="form-label mb-0" htmlFor="register-password">Password</label>
                        <input id="register-password" className="form-control" type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} />
                        {error && <div className="alert alert-danger mb-0">{error}</div>}
                        <button className="btn btn-forest mt-2" type="submit">Register</button>
                    </form>
                    <p className="small text-secondary mt-4 mb-0">Already registered? <Link href="/login">Login</Link></p>
                </div>
            </div>
        </main>
    );
}
