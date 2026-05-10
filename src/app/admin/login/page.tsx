'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save token to cookie for Next.js middleware to access
        document.cookie = `admin_token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
        router.push('/admin');
      } else {
        setError(data.message || 'รหัสผ่านไม่ถูกต้อง');
      }
    } catch {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#1b1b1d] p-6 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold text-[var(--color-text-secondary)]">SeriesApp</p>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">Admin Login</h1>
        </div>
        
        {error && (
          <div className="mb-5 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-center text-sm font-semibold text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="mb-1 block text-sm font-semibold text-[var(--color-text-secondary)]">Username</label>
            <input 
              id="admin-username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-md border border-white/10 bg-black px-3 py-2.5 text-white outline-none transition-colors focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-semibold text-[var(--color-text-secondary)]">Password</label>
            <input 
              id="admin-password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-white/10 bg-black px-3 py-2.5 text-white outline-none transition-colors focus:border-[var(--color-primary)]"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center rounded-md bg-[var(--color-primary)] py-2.5 font-bold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}
