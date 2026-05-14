import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faLine } from '@fortawesome/free-brands-svg-icons';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'ติดต่อเรา',
  description: 'ติดต่อทีมงาน VSeries สำหรับคำถาม ข้อเสนอแนะ หรือแจ้งปัญหาการใช้งานเว็บดูซีรีส์',
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">ติดต่อเรา</h1>
        <p className="text-[var(--color-text-secondary)]">มีคำถามหรือพบปัญหาการใช้งาน ติดต่อทีมงานได้ตามช่องทางด้านล่างนี้</p>
      </div>

      <div className="space-y-3 rounded-lg border border-white/10 bg-[#1b1b1d] p-4 sm:p-6">
        
        <a href="mailto:support@vseries.com" className="flex items-center gap-4 rounded-md p-4 transition-colors hover:bg-white/5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)]/15 text-xl text-[var(--color-primary)]">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Email</h3>
            <p className="text-[var(--color-text-secondary)]">support@vseries.com</p>
          </div>
        </a>

        <div className="flex items-center gap-4 rounded-md p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#1877F2]/15 text-xl text-[#4b9cff]">
            <FontAwesomeIcon icon={faFacebook} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Facebook</h3>
              <span className="rounded bg-white/10 px-2 py-1 text-xs font-bold text-[var(--color-text-secondary)]">เร็ว ๆ นี้</span>
            </div>
            <p className="text-[var(--color-text-secondary)]">VSeries Thailand</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-md p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#00B900]/15 text-2xl text-[#28d928]">
            <FontAwesomeIcon icon={faLine} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Line Official</h3>
              <span className="rounded bg-white/10 px-2 py-1 text-xs font-bold text-[var(--color-text-secondary)]">เร็ว ๆ นี้</span>
            </div>
            <p className="text-[var(--color-text-secondary)]">@vseries</p>
          </div>
        </div>

      </div>
    </div>
  );
}
