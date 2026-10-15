import type { Dictionary } from '@/lib/i18n';

export default function Faq({ t }: { t: Dictionary['faq'] }) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  };
  return (
    <section id="faq" className="container-page mt-24">
      <h2 className="h2">{t.title}</h2>
      <div className="mt-8 divide-y divide-line rounded-2xl border border-line">
        {t.items.map((i) => (
          <details key={i.q} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
              {i.q}
              <span className="text-2xl leading-none text-ink-faint transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-3xl text-ink-soft">{i.a}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
