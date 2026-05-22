import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faQuestionCircle, faHeadset } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faLine } from '@fortawesome/free-brands-svg-icons';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'โปรไฟล์',
  description: 'จัดการโปรไฟล์ และติดต่อสอบถามช่วยเหลือการใช้งาน VSeries',
  canonical: '/profile',
});

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* Profile Header Section */}
      <div className="flex flex-col items-center space-y-4 rounded-xl border border-white/10 bg-[#1b1b1d] p-8 text-center">
        <div className="text-6xl text-[var(--color-text-secondary)]">
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white">ผู้เยี่ยมชม Guest</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">เร็วๆ นี้</p>
        </div>
        <button className="mt-2 rounded-full bg-white/5 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10 border border-white/10">
          เข้าสู่ระบบ / สมัครสมาชิก
        </button>
      </div>

      {/* Help Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <FontAwesomeIcon icon={faQuestionCircle} className="text-[var(--color-primary)]" />
          <h2 className="text-xl font-bold text-white">ช่วยเหลือ</h2>
        </div>
        <div className="divide-y divide-white/5 overflow-hidden rounded-lg border border-white/10 bg-[#1b1b1d]">
          <div className="p-4 space-y-1">
            <h3 className="font-bold text-white">วิดีโอไม่โหลด หรือกระตุก?</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">ลองรีเฟรชหน้าเว็บ หรือตรวจสอบความเร็วอินเทอร์เน็ตของคุณ ระบบใช้การสตรีมแบบ HLS ที่ปรับความละเอียดตามความเร็วเน็ตอัตโนมัติ</p>
          </div>
          <div className="p-4 space-y-1">
            <h3 className="font-bold text-white">ต้องการดูซีรีส์เรื่องไหน?</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">หากคุณหาซีรีส์ที่ต้องการไม่เจอ หรือต้องการให้ทีมงานเพิ่มเรื่องใหม่ๆ สามารถติดต่อแจ้งแอดมินได้ผ่านช่องทางด้านล่างนี้เลยครับ</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <FontAwesomeIcon icon={faHeadset} className="text-[var(--color-primary)]" />
          <h2 className="text-xl font-bold text-white">ติดต่อทีมงาน</h2>
        </div>
        <div className="space-y-3">
          {/* Line Official - prioritized */}
          <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#00B900]/15 text-2xl text-[#28d928]">
              <FontAwesomeIcon icon={faLine} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Line Official</h3>
                <div className="flex gap-1">
                  <span className="rounded bg-[var(--color-primary)] px-2 py-1 text-[10px] font-bold text-black uppercase tracking-wider">แนะนำ</span>
                  <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">เร็ว ๆ นี้</span>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] text-sm">@vseries (ติดต่อสอบถามได้รวดเร็วที่สุด)</p>
            </div>
          </div>

          {/* Facebook */}
          <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-[#1b1b1d] p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#1877F2]/15 text-xl text-[#4b9cff]">
              <FontAwesomeIcon icon={faFacebook} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Facebook</h3>
                <span className="rounded bg-white/10 px-2 py-1 text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">เร็ว ๆ นี้</span>
              </div>
              <p className="text-[var(--color-text-secondary)] text-sm">VSeries Thailand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
