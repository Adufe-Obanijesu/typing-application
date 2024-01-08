import type { Metadata } from 'next'

import './globals.css';


import Navbar from '@/components/Navbar';
import Wrapper from '@/components/Wrapper';

export const metadata: Metadata = {
  title: 'Typing',
  description: 'Improve your typing speed',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>

          <Wrapper>
            <div className="px-8">
              <Navbar />
              {children}
            </div>
          </Wrapper>

      </body>
    </html>
  )
}
