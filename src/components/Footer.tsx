import Link from 'next/link'
import Image from 'next/image'
import type { CategoryNode } from '@/lib/data'
import { SITE } from '@/lib/config'

export function Footer({ tree }: { tree: CategoryNode[] }) {
  return (
    <footer className="site-footer">
      <div className="footer-accent" aria-hidden="true" />
      <div className="footer-grid">
        <div>
          <Link href="/" className="footer-brand" aria-label="Gráfica LT">
            <Image src="/logo.png" alt="Gráfica LT" width={342} height={70} />
          </Link>
          <p>
            Fabricamos señalética de seguridad normada para empresas, obras, condominios y colegios.
          </p>
        </div>
        <div>
          <p className="footer-title">Categorías</p>
          <ul className="footer-categories">
            {tree.map((c) => (
              <li key={c.id}>
                <Link href={`/categoria/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/catalogo">Todo el catálogo</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="footer-title">Gráfica LT</p>
          <ul>
            <li>
              <Link href="/">Volver al inicio</Link>
            </li>
            <li>
              <Link href="/#servicios">Otros servicios</Link>
            </li>
            <li>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <p className="footer-legal">
        © 2026 Gráfica LT. Precios en pesos chilenos, IVA incluido.
      </p>
    </footer>
  )
}
