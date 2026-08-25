import { Type } from 'lucide-react';

export type FontScale = 'sm' | 'md' | 'lg';
export const FONT_SCALE_STORAGE_KEY = 'vac_font_scale';

const OPTIONS: { value: FontScale; label: string; title: string }[] = [
  { value: 'sm', label: 'A−', title: '較小字級' },
  { value: 'md', label: 'A', title: '標準字級' },
  { value: 'lg', label: 'A＋', title: '較大字級' },
];

export const readFontScale = (): FontScale => {
  try {
    const saved = localStorage.getItem(FONT_SCALE_STORAGE_KEY);
    return saved === 'sm' || saved === 'lg' ? saved : 'md';
  } catch {
    return 'md';
  }
};

export const saveFontScale = (value: FontScale) => {
  try {
    localStorage.setItem(FONT_SCALE_STORAGE_KEY, value);
  } catch {
    // Continue gracefully when browser storage is unavailable.
  }
};

interface FontSizeControlProps {
  value: FontScale;
  onChange: (value: FontScale) => void;
  compact?: boolean;
}

const FontSizeControl: React.FC<FontSizeControlProps> = ({ value, onChange, compact = false }) => (
  <div className={`flex items-center gap-1.5 ${compact ? '' : 'rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/80'}`} aria-label="調整介面字級">
    {!compact && <Type className="ml-1 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />}
    {OPTIONS.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        title={option.title}
        aria-label={option.title}
        aria-pressed={value === option.value}
        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-extrabold transition-all active:scale-[0.97] ${
          value === option.value
            ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-700 dark:text-blue-200 dark:ring-slate-600'
            : 'text-slate-500 hover:bg-white/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/70 dark:hover:text-white'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export const FontSizeNudge: React.FC<{ value: FontScale; onChange: (value: FontScale) => void }> = ({ value, onChange }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900" aria-label="微調整介面字級">
    <FontSizeControl value={value} onChange={onChange} compact />
  </div>
);
