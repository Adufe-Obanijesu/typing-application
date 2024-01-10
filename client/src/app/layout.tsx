import type { Metadata } from 'next'

import './globals.css';


import Navbar from '@/components/Navbar';
import Wrapper from '@/components/Wrapper';
import Sidebar from '@/components/Sidebar';

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
            <div className="px-8 flex flex-col gap-4 h-full">
              <Navbar />
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-2">
                  <Sidebar />
                </div>
                <div className="col-span-10">
                  {children}
                </div>
              </div>
            </div>
          </Wrapper>

      </body>
    </html>
  )
}
