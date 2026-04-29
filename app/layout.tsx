import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SKMPN — Software Developer & AI Automation Specialist',
  description: 'Software Developer & AI Automation Specialist based in Manila, PH. Building smart automation systems, RAG pipelines, and AI tools that save businesses time.',
  keywords: ['AI automation', 'software developer', 'RAG pipeline', 'Zapier', 'n8n', 'Make', 'workflow', 'Philippines'],
  openGraph: {
    title: 'SKMPN — Software Developer & AI Automation Specialist',
    description: 'Building smart automation systems, RAG pipelines, and AI tools that help businesses scale.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
