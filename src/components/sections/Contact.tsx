import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site, whatsappUrl } from "@/data/site";

export function Contact() {
  return (
    <section id="contacto" className="bg-ink py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-cyan">
            Contacto
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Hablemos de tu <span className="text-brand-gradient">proyecto</span>
          </h2>
          <p className="mt-4 max-w-lg text-lg text-white/70">
            Cuéntanos qué necesitas y te enviamos una cotización.
          </p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-magenta px-7 py-3 font-semibold transition-transform hover:scale-105"
          >
            <MessageCircle className="size-5" />
            Escribir por WhatsApp
          </a>
        </div>

        <ul className="space-y-4">
          <ContactItem icon={<Phone className="size-5" />} label="Teléfono / WhatsApp">
            <a href={`tel:+${site.whatsapp}`} className="hover:text-cyan">
              {site.phone}
            </a>
          </ContactItem>
          <ContactItem icon={<Mail className="size-5" />} label="Correo">
            {site.emails.map((email) => (
              <a key={email} href={`mailto:${email}`} className="block hover:text-cyan">
                {email}
              </a>
            ))}
          </ContactItem>
          <ContactItem icon={<MapPin className="size-5" />} label="Dirección">
            {site.address}
          </ContactItem>
        </ul>
      </div>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan/15 text-cyan">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
        <div className="mt-1 text-white">{children}</div>
      </div>
    </li>
  );
}
