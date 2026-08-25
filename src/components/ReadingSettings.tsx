import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Eye, RotateCcw, Type } from 'lucide-react';

export type FontScale = 'sm' | 'md' | 'lg';
export type LineHeight = 'compact' | 'comfortable' | 'spacious';
export type FontFamily = 'sans' | 'system' | 'serif';

export interface ReadingPreferences {
  fontScale: FontScale;
  lineHeight: LineHeight;
  fontFamily: FontFamily;
}

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  fontScale: 'md',
  lineHeight: 'comfortable',
  fontFamily: 'sans',
};

export const READING_PREFERENCES_STORAGE_KEY = 'vac_reading_preferences';
const LEGACY_FONT_SCALE_STORAGE_KEY = 'vac_font_scale';

const FONT_SCALE_OPTIONS: { value: FontScale; label: string; description: string }[] = [
  { value: 'sm', label: '小', description: '較精簡' },
  { value: 'md', label: '標準', description: '建議' },
  { value: 'lg', label: '大', description: '較易讀' },
];

const LINE_HEIGHT_OPTIONS: { value: LineHeight; label: string; description: string }[] = [
  { value: 'compact', label: '緊湊', description: '1.85' },
  { value: 'comfortable', label: '舒適', description: '2.05' },
  { value: 'spacious', label: '寬鬆', description: '2.30' },
];

const FONT_FAMILY_OPTIONS: { value: FontFamily; label: string; sample: string }[] = [
  { value: 'sans', label: '現代黑體', sample: '清晰' },
  { value: 'system', label: '系統字型', sample: '俐落' },
  { value: 'serif', label: '明體閱讀', sample: '典雅' },
];

const isFontScale = (value: unknown): value is FontScale => value === 'sm' || value === 'md' || value === 'lg';
const isLineHeight = (value: unknown): value is LineHeight => value === 'compact' || value === 'comfortable' || value === 'spacious';
const isFontFamily = (value: unknown): value is FontFamily => value === 'sans' || value === 'system' || value === 'serif';

export const readReadingPreferences = (): ReadingPreferences => {
  try {
    const saved = localStorage.getItem(READING_PREFERENCES_STORAGE_KEY);
    const legacyScale = localStorage.getItem(LEGACY_FONT_SCALE_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) as Partial<ReadingPreferences> : {};

    return {
      fontScale: isFontScale(parsed.fontScale) ? parsed.fontScale : isFontScale(legacyScale) ? legacyScale : DEFAULT_READING_PREFERENCES.fontScale,
      lineHeight: isLineHeight(parsed.lineHeight) ? parsed.lineHeight : DEFAULT_READING_PREFERENCES.lineHeight,
      fontFamily: isFontFamily(parsed.fontFamily) ? parsed.fontFamily : DEFAULT_READING_PREFERENCES.fontFamily,
    };
  } catch {
    return DEFAULT_READING_PREFERENCES;
  }
};

export const saveReadingPreferences = (preferences: ReadingPreferences) => {
  try {
    localStorage.setItem(READING_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    // Keep the original key in sync for users upgrading from the previous font-only control.
    localStorage.setItem(LEGACY_FONT_SCALE_STORAGE_KEY, preferences.fontScale);
  } catch {
    // Continue gracefully when browser storage is unavailable.
  }
};

interface ReadingSettingsProps {
  value: ReadingPreferences;
  onChange: (value: ReadingPreferences) => void;
}

export const ReadingSettings: React.FC<ReadingSettingsProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const update = <K extends keyof ReadingPreferences>(key: K, nextValue: ReadingPreferences[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  const reset = () => onChange(DEFAULT_READING_PREFERENCES);
  const currentFont = FONT_FAMILY_OPTIONS.find((option) => option.value === value.fontFamily)?.label;
  const currentLineHeight = LINE_HEIGHT_OPTIONS.find((option) => option.value === value.lineHeight)?.label;

  return (
    <div ref={panelRef} className="relative z-[70]">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-extrabold transition-all active:scale-[0.98] sm:px-3 ${isOpen ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-200' : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:border-blue-200 hover:bg-blue-50/70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/50'}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="開啟閱讀設定"
      >
        <Type className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">閱讀設定</span>
        <span className="sr-only">字級 {value.fontScale === 'sm' ? '小' : value.fontScale === 'lg' ? '大' : '標準'}、行距 {currentLineHeight}、字型 {currentFont}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[80] max-h-[min(70vh,560px)] w-[min(88vw,340px)] overflow-y-auto overscroll-contain rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30" role="dialog" aria-label="閱讀設定面板">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                閱讀設定
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400 dark:text-slate-500">調整後會自動記憶，下次開啟仍會保留。</p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title="恢復閱讀設定"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              重設
            </button>
          </div>

          <fieldset className="mt-4">
            <legend className="mb-2 text-xs font-extrabold tracking-wide text-slate-700 dark:text-slate-200">字體大小</legend>
            <div className="grid grid-cols-3 gap-2">
              {FONT_SCALE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update('fontScale', option.value)}
                  className={`rounded-xl border px-2 py-2 text-center transition-all active:scale-[0.98] ${value.fontScale === option.value ? 'border-blue-300 bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-200 dark:ring-blue-800' : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50/60 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/50'}`}
                  aria-pressed={value.fontScale === option.value}
                >
                  <span className="block text-sm font-black">A{option.value === 'sm' ? '−' : option.value === 'lg' ? '＋' : ''}</span>
                  <span className="mt-0.5 block text-[11px] font-semibold opacity-70">{option.label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="mb-2 text-xs font-extrabold tracking-wide text-slate-700 dark:text-slate-200">內文行距</legend>
            <div className="grid grid-cols-3 gap-2">
              {LINE_HEIGHT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update('lineHeight', option.value)}
                  className={`rounded-xl border px-2 py-2 text-center transition-all active:scale-[0.98] ${value.lineHeight === option.value ? 'border-emerald-300 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-800' : 'border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30'}`}
                  aria-pressed={value.lineHeight === option.value}
                >
                  <span className="block text-sm font-black">{option.label}</span>
                  <span className="mt-0.5 block text-[11px] font-semibold opacity-70">{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="mb-2 text-xs font-extrabold tracking-wide text-slate-700 dark:text-slate-200">字型樣式</legend>
            <div className="space-y-2">
              {FONT_FAMILY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update('fontFamily', option.value)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition-all active:scale-[0.99] ${value.fontFamily === option.value ? 'border-violet-300 bg-violet-50 text-violet-800 ring-1 ring-violet-200 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-200 dark:ring-violet-800' : 'border-slate-200 text-slate-600 hover:border-violet-200 hover:bg-violet-50/50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-violet-700 dark:hover:bg-violet-950/30'}`}
                  aria-pressed={value.fontFamily === option.value}
                >
                  <span className={`text-sm font-bold ${option.value === 'serif' ? 'font-serif' : ''}`}>{option.label}</span>
                  <span className="flex items-center gap-2 text-xs font-semibold opacity-70"><span className={option.value === 'serif' ? 'font-serif' : ''}>{option.sample}</span>{value.fontFamily === option.value && <Check className="h-4 w-4" aria-hidden="true" />}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
};
