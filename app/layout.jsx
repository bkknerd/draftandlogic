import fs from 'node:fs';
import path from 'node:path';
import './globals.css';
import { getSite, SITE_URL } from '@/lib/content';
import Loader from '@/components/Loader';
import SmoothScroll from '@/components/SmoothScroll';

const { seo, analytics } = getSite();

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: seo.title,
  description: seo.description,
  openGraph: {
    type: 'website',
    url: SITE_URL + '/',
    siteName: 'Draft and Logic',
    title: seo.title,
    description: seo.shareDescription || seo.description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Draft and Logic' }],
  },
  twitter: { card: 'summary_large_image', title: seo.title, description: seo.shareDescription || seo.description, images: ['/og.png'] },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: { canonical: '/', types: { 'text/plain': '/llms.txt' } },
};

export const viewport = { themeColor: '#F1EEE8', width: 'device-width', initialScale: 1 };

// Matter is licensed and not in the repo. Drop Matter-Regular|Medium|Bold.woff2 into public/fonts/ and it's used.
const fontFaces = [['Regular', 400], ['Medium', 500], ['Bold', 700]]
  .filter(([n]) => fs.existsSync(path.join(process.cwd(), 'public', 'fonts', `Matter-${n}.woff2`)))
  .map(([n, w]) => `@font-face{font-family:'Matter';src:url(/fonts/Matter-${n}.woff2) format('woff2');font-weight:${w};font-style:normal;font-display:swap}`)
  .join('');

// Google Analytics from content/site/analytics.json. Visitors who send Do Not Track or GPC aren't measured.
const gaId = analytics && analytics.enabled !== false && /^G-[A-Z0-9]{6,14}$/.test(analytics.measurementId || '') ? analytics.measurementId : '';
const gaScript = gaId
  ? `(function(){var n=navigator;if(n.doNotTrack==='1'||window.doNotTrack==='1'||n.globalPrivacyControl)return;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${gaId}';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true})})();`
  : '';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Mark JS before first paint so reveal states never flash. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {fontFaces && <style dangerouslySetInnerHTML={{ __html: fontFaces }} />}
        {gaScript && <script dangerouslySetInnerHTML={{ __html: gaScript }} />}
      </head>
      <body>
        <Loader />
        <SmoothScroll />
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
