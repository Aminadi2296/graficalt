import { SITE } from '@/lib/config'
import { clp } from '@/lib/format'
import type { Order } from '@/payload-types'

export type OrderEmailKind = 'paid' | 'transfer'

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const bankLines = () => (process.env.BANK_DETAILS ? process.env.BANK_DETAILS.split('\\n').map((l) => l.trim()).filter(Boolean) : [])
const leadTime = () => process.env.PRODUCTION_LEAD_TIME?.trim()
export const orderUrl = (o: Order) => `${SITE.url}/pedido/${o.orderNumber}?t=${o.accessToken ?? ''}`
export const adminUrl = (o: Order) => `${SITE.url}/admin/collections/orders/${o.id}`

function shell(preheader: string, inner: string) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.5">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden">
<tr><td style="background:#111;color:#fff;padding:18px 24px;font-size:20px;font-weight:bold">${esc(SITE.name)}</td></tr>
<tr><td style="padding:24px">${inner}</td></tr>
<tr><td style="padding:16px 24px;background:#fafafa;color:#666;font-size:12px">¿Dudas? Escríbenos a <a href="mailto:${esc(SITE.email)}" style="color:#666">${esc(SITE.email)}</a> o por <a href="https://wa.me/${esc(SITE.whatsapp)}" style="color:#666">WhatsApp</a>.</td></tr>
</table></td></tr></table></body></html>`
}

function itemsTable(o: Order) {
  const rows = o.items
    .map(
      (i) => `<tr>
<td style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px">${esc(i.quantity)} × ${esc(i.title)}${i.variantLabel ? `<br><span style="color:#666;font-size:12px">${esc(i.variantLabel)}</span>` : ''}${i.customization ? `<br><span style="color:#666;font-size:12px">Personalización: ${esc(i.customization)}</span>` : ''}</td>
<td align="right" style="padding:8px 0;border-bottom:1px solid #eee;font-size:14px;white-space:nowrap">${clp(i.unitPrice * i.quantity)}</td></tr>`,
    )
    .join('')
  const line = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:4px 0;font-size:14px;${strong ? 'font-weight:bold;font-size:16px' : ''}">${label}</td><td align="right" style="padding:4px 0;font-size:14px;${strong ? 'font-weight:bold;font-size:16px' : ''}">${value}</td></tr>`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
${line('Subtotal', clp(o.subtotal))}${line('Envío', o.shippingCost ? clp(o.shippingCost) : 'Gratis')}${line('Total', clp(o.total), true)}</table>`
}

const itemsText = (o: Order) =>
  [
    ...o.items.map((i) => `- ${i.quantity} x ${i.title}${i.variantLabel ? ` (${i.variantLabel})` : ''}${i.customization ? ` [Personalización: ${i.customization}]` : ''}: ${clp(i.unitPrice * i.quantity)}`),
    `Subtotal: ${clp(o.subtotal)}`,
    `Envío: ${o.shippingCost ? clp(o.shippingCost) : 'Gratis'}`,
    `Total: ${clp(o.total)}`,
  ].join('\n')

const addressText = (o: Order) => `${o.shipping?.address}, ${o.shipping?.comuna}, ${o.shipping?.region}`

// ---------------- Correo al cliente ----------------
export function customerEmail(o: Order, kind: OrderEmailKind) {
  const first = o.customer.name.split(' ')[0]
  const paid = kind === 'paid'
  const subject = paid ? `Confirmamos tu pedido ${o.orderNumber}` : `Recibimos tu pedido ${o.orderNumber}: datos para transferir`
  const lead = leadTime()
  const bank = bankLines()
  const card = o.payment?.cardLast4 ? ` con la tarjeta terminada en ${o.payment.cardLast4}` : ''

  const payHtml = paid
    ? `<p style="margin:0 0 16px">Recibimos tu pago de <strong>${clp(o.total)}</strong>${esc(card)}. ¡Gracias por tu compra!</p>`
    : `<p style="margin:0 0 8px">Para confirmar tu pedido, transfiere <strong>${clp(o.total)}</strong> e indica el número <strong>${esc(o.orderNumber)}</strong>:</p>
${bank.length ? `<p style="margin:0 0 16px;padding:12px;background:#f4f4f5;border-radius:6px;font-size:14px">${bank.map(esc).join('<br>')}</p>` : `<p style="margin:0 0 16px">Te enviaremos los datos de transferencia a este correo y por WhatsApp.</p>`}
<p style="margin:0 0 16px">Preparamos tu pedido cuando recibimos el pago.</p>`

  const html = shell(
    paid ? 'Tu pago fue recibido' : 'Datos para transferir',
    `<h1 style="margin:0 0 12px;font-size:22px">Hola, ${esc(first)}</h1>
${payHtml}
<p style="margin:0 0 16px;font-size:14px">Pedido <strong>${esc(o.orderNumber)}</strong></p>
${itemsTable(o)}
<p style="margin:20px 0 4px;font-size:14px"><strong>Despacho a</strong><br>${esc(addressText(o))}</p>
<p style="margin:16px 0;font-size:14px">${lead ? `Fabricamos tu pedido a medida. Plazo estimado: <strong>${esc(lead)}</strong>.` : 'Fabricamos tu pedido bajo pedido y te avisaremos cuando esté listo para el despacho.'}</p>
<p style="margin:20px 0 0"><a href="${esc(orderUrl(o))}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:bold">Ver mi pedido</a></p>`,
  )

  const text = [
    `Hola, ${first}`,
    '',
    paid
      ? `Recibimos tu pago de ${clp(o.total)}${card}. ¡Gracias por tu compra!`
      : `Para confirmar tu pedido, transfiere ${clp(o.total)} e indica el número ${o.orderNumber}:\n${bank.length ? bank.join('\n') : 'Te enviaremos los datos de transferencia a este correo y por WhatsApp.'}\nPreparamos tu pedido cuando recibimos el pago.`,
    '',
    `Pedido ${o.orderNumber}`,
    itemsText(o),
    '',
    `Despacho a: ${addressText(o)}`,
    lead ? `Plazo estimado de fabricación: ${lead}.` : 'Fabricamos tu pedido bajo pedido y te avisaremos cuando esté listo para el despacho.',
    '',
    `Ver mi pedido: ${orderUrl(o)}`,
  ].join('\n')

  return { subject, html, text }
}

// ---------------- Aviso a la tienda ----------------
export function storeEmail(o: Order, kind: OrderEmailKind) {
  const paid = kind === 'paid'
  const state = paid ? 'Pagado con tarjeta' : 'Transferencia pendiente'
  const subject = `Nuevo pedido ${o.orderNumber} - ${clp(o.total)} - ${state}`
  const c = o.customer
  const row = (k: string, v?: string | null) =>
    v ? `<tr><td style="padding:3px 12px 3px 0;color:#666;font-size:13px;vertical-align:top">${k}</td><td style="padding:3px 0;font-size:14px">${esc(v)}</td></tr>` : ''

  const html = shell(
    `Nuevo pedido de ${c.name}`,
    `<h1 style="margin:0 0 4px;font-size:22px">Nuevo pedido ${esc(o.orderNumber)}</h1>
<p style="margin:0 0 16px;font-size:15px"><strong>${esc(state)}</strong>${paid ? '' : ': falta confirmar la transferencia y marcar el pedido como pagado en el panel.'}</p>
<h2 style="margin:16px 0 6px;font-size:16px">Cliente</h2>
<table role="presentation" cellpadding="0" cellspacing="0">${row('Nombre', c.name)}${row('Email', c.email)}${row('Teléfono', c.phone)}${row('Empresa', c.companyName)}${row('RUT', c.rut)}</table>
<h2 style="margin:16px 0 6px;font-size:16px">Despacho</h2>
<p style="margin:0;font-size:14px">${esc(addressText(o))}</p>
${o.notes ? `<h2 style="margin:16px 0 6px;font-size:16px">Comentarios del cliente</h2><p style="margin:0;font-size:14px">${esc(o.notes)}</p>` : ''}
<h2 style="margin:16px 0 6px;font-size:16px">Productos</h2>
${itemsTable(o)}
<p style="margin:20px 0 0"><a href="${esc(adminUrl(o))}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:bold">Abrir en el panel</a></p>`,
  )

  const text = [
    `Nuevo pedido ${o.orderNumber} - ${state}`,
    '',
    'CLIENTE',
    `Nombre: ${c.name}`,
    `Email: ${c.email}`,
    c.phone ? `Teléfono: ${c.phone}` : '',
    c.companyName ? `Empresa: ${c.companyName}` : '',
    c.rut ? `RUT: ${c.rut}` : '',
    '',
    `DESPACHO: ${addressText(o)}`,
    o.notes ? `COMENTARIOS: ${o.notes}` : '',
    '',
    'PRODUCTOS',
    itemsText(o),
    '',
    `Panel: ${adminUrl(o)}`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n')

  return { subject, html, text }
}
