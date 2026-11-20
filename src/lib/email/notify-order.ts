import { getClient } from '@/lib/data'
import { sendEmail } from './resend'
import { customerEmail, storeEmail, type OrderEmailKind } from './templates'

/**
 * Envía los dos correos de un pedido: confirmación al cliente y aviso a la tienda.
 *  - kind "paid": pago con tarjeta aprobado.   - kind "transfer": pedido por transferencia (pago pendiente).
 * Cada correo se envía una sola vez por pedido (queda marcado en el pedido), aunque esta función se ejecute dos veces.
 * Nunca lanza errores hacia afuera: un problema con el correo no debe afectar el pedido ni el pago.
 */
export async function notifyOrder(orderId: number, kind: OrderEmailKind) {
  try {
    const payload = await getClient()
    const order = await payload.findByID({ collection: 'orders', id: orderId, depth: 0 })
    const storeTo = process.env.ORDER_NOTIFY_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL

    const jobs = [
      { flag: 'customerEmailSentAt' as const, to: order.customer.email, mail: customerEmail(order, kind), replyTo: storeTo },
      { flag: 'storeEmailSentAt' as const, to: storeTo, mail: storeEmail(order, kind), replyTo: order.customer.email },
    ]
    for (const job of jobs) {
      if (!job.to) {
        console.warn('[correo] sin destinatario, no se envió', { pedido: order.orderNumber, correo: job.flag })
        continue
      }
      // Reclama el envío: si otro proceso ya lo reclamó, no hace nada
      const claim = await payload.update({
        collection: 'orders',
        where: { and: [{ id: { equals: order.id } }, { [job.flag]: { exists: false } }] },
        data: { [job.flag]: new Date().toISOString() },
      })
      if (claim.docs.length === 0) continue
      try {
        const res = await sendEmail({ to: job.to, subject: job.mail.subject, html: job.mail.html, text: job.mail.text, replyTo: job.replyTo })
        if (!res.sent) throw new Error('correo no configurado')
        console.info('[correo] enviado', { pedido: order.orderNumber, correo: job.flag })
      } catch (e) {
        console.error('[correo] falló el envío', { pedido: order.orderNumber, correo: job.flag }, e)
        // Libera la marca para poder reintentar después
        await payload.update({ collection: 'orders', id: order.id, data: { [job.flag]: null } }).catch(() => {})
      }
    }
  } catch (e) {
    console.error('[correo] error al preparar los correos del pedido', e)
  }
}
