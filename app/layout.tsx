import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sydney Pua Ng — AI Automation Specialist',
  description:
    'AI-powered portfolio of Sydney Kaitlyn Pua Ng — Tech VA and Automation Specialist based in Manila. Ask me anything.',
  keywords: ['AI automation', 'Zapier', 'n8n', 'Make', 'workflow', 'Tech VA', 'Philippines'],
  openGraph: {
    title: 'Sydney Pua Ng — AI Automation Specialist',
    description: 'Talk to my AI. Ask about projects, skills, or how I can automate your business.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
