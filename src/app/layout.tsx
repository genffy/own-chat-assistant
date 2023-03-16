import { Analytics } from '@vercel/analytics/react';

import './globals.css'

export const metadata = {
  title: 'Own Chat Assistant',
  description: 'deploy your own chat assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
