'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export function ClientLayout({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
