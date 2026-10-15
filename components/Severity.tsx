import Icon from './Icon';
import type { Severity } from '@/lib/report/types';

export const SEVERITY_STYLE: Record<Severity, { text: string; bg: string; border: string; icon: string; dot: string }> = {
  red: { text: 'text-flag', bg: 'bg-flag-soft', border: 'border-flag/30', icon: 'flag', dot: 'bg-flag' },
  yellow: { text: 'text-warn', bg: 'bg-warn-soft', border: 'border-warn/30', icon: 'alert', dot: 'bg-warn' },
  green: { text: 'text-ok', bg: 'bg-ok-soft', border: 'border-ok/30', icon: 'check', dot: 'bg-ok' },
  info: { text: 'text-ink-soft', bg: 'bg-paper', border: 'border-line', icon: 'info', dot: 'bg-ink-faint' },
};

export function SeverityIcon({ severity, className = 'h-5 w-5' }: { severity: Severity; className?: string }) {
  const s = SEVERITY_STYLE[severity];
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full ${s.bg} ${s.text} p-1`}>
      <Icon name={s.icon} className={className} strokeWidth={2.2} />
    </span>
  );
}
