import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import React from 'react'
import './styles.css'
import { CartProvider } from '@/components/CartProvider'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { SITE } from '@/lib/config'
import { getCategoryTree } from '@/lib/data'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Señaléticas | Gráfica LT',
    template: '%s | Gráfica LT',
  },
  description: SITE.description,
  openGraph: { siteName: 'Gráfica LT', locale: 'es_CL', type: 'website' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { tree } = await getCategoryTree()
  return (
    <html lang="es-CL" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Gráfica LT',
            url: SITE.url,
            email: SITE.email,
          }}
        />
        <CartProvider>
          <Header tree={tree} />
          <main>{children}</main>
          <Footer tree={tree} />
        </CartProvider>
      </body>
    </html>
  )
}
