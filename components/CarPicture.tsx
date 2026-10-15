// Заглушка вместо фото: силуэт машины в цвете кузова. Реальные фото придут из API.
const COLOR_HEX: Record<string, string> = {
  Серый: '#6B7280', Белый: '#E5E7EB', Чёрный: '#1F2937', Синий: '#2B4C7E', Серебристый: '#A8AFBA', Зелёный: '#3F6B4E',
};

export default function CarPicture({ make, model, color, className = '' }: { make: string; model: string; color: string; className?: string }) {
  const fill = COLOR_HEX[color] ?? '#6B7280';
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-paper to-[#E9EBEF] ${className}`}>
      <svg viewBox="0 0 320 180" className="h-full w-full" role="img" aria-label={`${make} ${model}`}>
        <ellipse cx="160" cy="146" rx="120" ry="10" fill="#000" opacity="0.08" />
        <path d="M44 128c0-14 6-22 20-26l34-10 26-24c6-5 13-8 22-8h58c9 0 16 3 22 9l24 24 22 6c12 3 18 11 18 24v8c0 4-3 6-6 6H50c-4 0-6-3-6-6z" fill={fill} />
        <path d="M112 90l20-18c4-3 8-5 14-5h22v23zM176 67h22c6 0 10 2 14 6l17 17h-53z" fill="#fff" opacity="0.55" />
        <circle cx="96" cy="136" r="20" fill="#1F2328" /><circle cx="96" cy="136" r="9" fill="#9CA3AF" />
        <circle cx="232" cy="136" r="20" fill="#1F2328" /><circle cx="232" cy="136" r="9" fill="#9CA3AF" />
      </svg>
      <span className="absolute left-3 top-3 rounded-md bg-white/80 px-2 py-0.5 text-xs font-medium text-ink-soft">Фото появится из API</span>
    </div>
  );
}
