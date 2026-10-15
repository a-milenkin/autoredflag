import type { Severity } from '@/lib/report/types';
import Icon from './Icon';
import { SEVERITY_STYLE } from './Severity';

// Список разделов отчёта со статусами и замками: как у Автотеки, но статус виден сразу.
export default function TeaserList({ items, statusLabel, locked = true, columns = 2 }: { items: { title: string; severity: Severity }[]; statusLabel: Record<string, string>; locked?: boolean; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-x-8 gap-y-2.5 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {items.map((s) => {
        const st = SEVERITY_STYLE[s.severity];
        return (
          <li key={s.title} className="flex items-center gap-3">
            <Icon name="lock" className="h-4 w-4 shrink-0 text-ink-faint" />
            <span className="flex-1 text-[15px]">{s.title}</span>
            {locked && (
              <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                {statusLabel[s.severity]}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
