import Link from 'next/link';
import { Noto_Sans_KR } from 'next/font/google';

import GoogleAnalytics from '@/components/GoogleAnalytics';

import './globals.css';

export const metadata = {
  title: '유사과학 프롬프트 위키',
  description: '사주팔자, 타로, 점성술 프롬프트를 모아둔 정적 웹사이트',
};

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-kr',
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={notoSansKr.variable}>
        <GoogleAnalytics />
        <div className="page-wrap">
          <main className="phone">
            <header className="top-header">
              <Link href="/" className="brand-link">
                <img
                  className="brand-logo"
                  src="/assets/logo/ssseregi_logo.png"
                  alt="유사과학 프롬프트 위키 로고"
                  width="32"
                  height="32"
                />
                <strong className="brand-title">유사과학 프롬프트 위키</strong>
              </Link>
            </header>

            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
