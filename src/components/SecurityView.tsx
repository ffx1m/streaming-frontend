'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faTrashAlt, faBan, faSyncAlt, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface LockoutRecord {
  _id: string;
  ip: string;
  attempts: number;
  lockUntil: string;
  isBlacklisted: boolean;
  updatedAt: string;
}

export default function SecurityView() {
  const [records, setRecords] = useState<LockoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/admin/security/lockouts`, {
        headers: {
          'Authorization': `Bearer ${getCookie('admin_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch security records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleBlacklist = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการแบน IP นี้ถาวร?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/admin/security/blacklist/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getCookie('admin_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchRecords();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to blacklist IP');
    }
  };

  const handleWhitelist = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการปลดแบน/รีเซ็ต IP นี้?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/admin/security/lockouts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getCookie('admin_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchRecords();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to whitelist IP');
    }
  };

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }

  const formatTimeRemaining = (dateStr: string) => {
    const remaining = new Date(dateStr).getTime() - Date.now();
    if (remaining <= 0) return 'Expired';
    
    if (remaining > 24 * 60 * 60 * 1000) {
      return `${Math.ceil(remaining / (24 * 60 * 60 * 1000))} days`;
    }
    if (remaining > 60 * 60 * 1000) {
      return `${Math.ceil(remaining / (60 * 60 * 1000))} hours`;
    }
    if (remaining > 60 * 1000) {
      return `${Math.ceil(remaining / (60 * 1000))} minutes`;
    }
    return `${Math.ceil(remaining / 1000)} seconds`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FontAwesomeIcon icon={faShieldAlt} className="text-[var(--color-primary)]" />
            การจัดการความปลอดภัย
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">จัดการ IP ที่ถูกระงับการเข้าถึงและตรวจสอบการพยายามเจาะระบบ</p>
        </div>
        <button 
          onClick={fetchRecords}
          className="flex items-center gap-2 rounded-md bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          <FontAwesomeIcon icon={faSyncAlt} className={loading ? 'animate-spin' : ''} />
          รีเฟรช
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-red-500/10 p-4 text-red-400 border border-red-500/20">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#161617]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs font-semibold uppercase text-[var(--color-text-secondary)]">
              <tr>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">พยายาม (ครั้ง)</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4">เวลาที่เหลือ</th>
                <th className="px-6 py-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[var(--color-text-secondary)]">
                    {loading ? 'กำลังโหลดข้อมูล...' : 'ไม่พบข้อมูล IP ที่ถูกแบนในขณะนี้'}
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-white">{record.ip}</td>
                    <td className="px-6 py-4 text-white">{record.attempts}</td>
                    <td className="px-6 py-4">
                      {record.isBlacklisted ? (
                        <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-400 border border-red-500/20">
                          แบนถาวร
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-400 border border-yellow-500/20">
                          ระงับชั่วคราว
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)] flex items-center gap-2">
                      <FontAwesomeIcon icon={faClock} className="text-xs" />
                      {record.isBlacklisted ? 'ไม่มีกำหนด' : formatTimeRemaining(record.lockUntil)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!record.isBlacklisted && (
                          <button
                            onClick={() => handleBlacklist(record._id)}
                            title="แบนถาวร"
                            className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <FontAwesomeIcon icon={faBan} />
                          </button>
                        )}
                        <button
                          onClick={() => handleWhitelist(record._id)}
                          title="ปลดแบน / รีเซ็ต"
                          className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
