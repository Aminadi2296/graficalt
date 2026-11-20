import { SITE } from '@/lib/config'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Envía un correo con la API de Resend.
 *  - Sin RESEND_API_KEY no envía nada (solo deja un aviso en los registros).
 *  - EMAIL_TEST_TO: mientras el dominio no esté verificado en Resend, solo se puede enviar a tu propia dirección.
 *    Con esta variable TODOS los correos llegan a esa dirección, marcados como [PRUEBA].
 */
export async function sendEmail(input: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn('[correo] RESEND_API_KEY no está configurada: no se envió', { asunto: input.subject })
    return { sent: false as const }
  }

  const testTo = process.env.EMAIL_TEST_TO
  const banner = testTo
    ? `<div style="background:#fff3cd;padding:10px 14px;font:13px Arial,sans-serif;color:#664d03">Modo de pruebas: este correo iba dirigido a <strong>${esc(input.to)}</strong>.</div>`
    : ''
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || `${SITE.name} <onboarding@resend.dev>`,
      to: [testTo || input.to],
      subject: testTo ? `[PRUEBA] ${input.subject}` : input.subject,
      html: banner ? input.html.replace(/(<body[^>]*>)/i, `$1${banner}`) : input.html,
      text: testTo ? `[Modo de pruebas: iba dirigido a ${input.to}]\n\n${input.text}` : input.text,
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(15000),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Resend respondió ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`)
  return { sent: true as const }
}
