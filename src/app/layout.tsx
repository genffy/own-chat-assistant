import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import RootStyleRegistry from './_emotion';
type LayoutProps = {
  children: React.ReactNode
}

export const metadata = {
  title: 'Own Chat Assistant',
  description: 'deploy your own chat assistant',
}
export default function RootLayout({ children }: LayoutProps) {

  return (
    <html lang="en">
      <body>
        <RootStyleRegistry>{children}</RootStyleRegistry>
        <Analytics />
      </body>
    </html>
  )
}
