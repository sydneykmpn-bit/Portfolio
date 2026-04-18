import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sydney Pua Ng — AI Automation Engineer',
  description: 'AI Automation Engineer based in Manila, PH. I build smart automation systems and AI tools that save businesses time and effort.',
  keywords: ['AI automation', 'Zapier', 'n8n', 'Make', 'workflow', 'Tech VA', 'Philippines'],
  openGraph: {
    title: 'Sydney Puang — AI Automation Engineer',
    description: 'Building smart automation systems and AI tools that help businesses scale.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
