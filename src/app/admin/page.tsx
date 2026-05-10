'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faEye, faFilm, faListUl } from '@fortawesome/free-solid-svg-icons';

interface DashboardStats {
  totalSeries: number;
  totalEpisodes: number;
  activeUsers: number;
  dailyUsers: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('admin_token='))?.split('=')[1];
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        const res = await fetch(`${apiUrl}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const json = await res.json();
          setStats(json.data);
        }
      } catch {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const statCards = [
    { label: 'ซีรีส์ทั้งหมด', value: stats?.totalSeries.toLocaleString() ?? '-', icon: faFilm, tone: 'text-[var(--color-primary)]' },
    { label: 'ตอนทั้งหมด', value: stats?.totalEpisodes.toLocaleString() ?? '-', icon: faListUl, tone: 'text-sky-300' },
    { label: 'ผู้ใช้วันนี้', value: stats?.dailyUsers.toLocaleString() ?? '-', icon: faChartPie, tone: 'text-emerald-300' },
    { label: 'ยอดวิวรวม', value: stats?.totalViews.toLocaleString() ?? '-', icon: faEye, tone: 'text-amber-300' },
  ];
  const averageEpisodes = stats && stats.totalSeries > 0 ? (stats.totalEpisodes / stats.totalSeries).toFixed(1) : '-';
  const averageViews = stats && stats.totalSeries > 0 ? Math.round(stats.totalViews / stats.totalSeries).toLocaleString() : '-';

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-secondary)]">ภาพรวมระบบ</p>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">{card.label}</p>
              <FontAwesomeIcon icon={card.icon} className={`h-4 w-4 ${card.tone}`} />
            </div>
            <p className={`mt-3 text-2xl font-bold md:text-3xl ${card.tone}`}>{loading ? '-' : card.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
          <h2 className="font-bold">ภาพรวมคอนเทนต์</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <dt className="text-[var(--color-text-secondary)]">จำนวนซีรีส์ในระบบ</dt>
              <dd className="font-semibold">{stats?.totalSeries.toLocaleString() ?? '-'}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <dt className="text-[var(--color-text-secondary)]">จำนวนตอนทั้งหมด</dt>
              <dd className="font-semibold">{stats?.totalEpisodes.toLocaleString() ?? '-'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--color-text-secondary)]">ตอนเฉลี่ยต่อเรื่อง</dt>
              <dd className="font-semibold">{averageEpisodes}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
          <h2 className="font-bold">การเข้าชม</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <dt className="text-[var(--color-text-secondary)]">ผู้ใช้ที่บันทึกได้วันนี้</dt>
              <dd className="font-semibold">{stats?.dailyUsers.toLocaleString() ?? '-'}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <dt className="text-[var(--color-text-secondary)]">ผู้ใช้ขณะนี้</dt>
              <dd className="font-semibold">{stats?.activeUsers.toLocaleString() ?? '-'}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[var(--color-text-secondary)]">วิวเฉลี่ยต่อเรื่อง</dt>
              <dd className="font-semibold">{averageViews}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
