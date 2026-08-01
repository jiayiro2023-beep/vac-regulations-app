import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Calculator, 
  CheckCircle2, 
  ChevronRight,
  BookOpen,
  RefreshCw
} from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegulation: (regId: string) => void;
}

interface MonthBlock {
  monthIndex: number;
  startStr: string;
  endStr: string;
  totalDays: number;
  validDays: number;
  status: '足月' | '未足月' | '逾期';
  rate: number;
  amount: number;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectRegulation
}) => {
  const [allowanceType, setAllowanceType] = useState<'訓後就業津貼' | '推介就業津貼'>('訓後就業津貼');
  const [startDate, setStartDate] = useState<string>('2026-03-15');
  const [expiryDate, setExpiryDate] = useState<string>('2026-06-10');
  const [selectedMonths, setSelectedMonths] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true
  });

  // Reset selected months when start/expiry dates change to select all eligible months by default
  useEffect(() => {
    // Select months 1 to 12 if they have any valid days
    const newSelected: Record<number, boolean> = {};
    const blocks = calculateBlocks(allowanceType, startDate, expiryDate);
    blocks.forEach(b => {
      if (b.status !== '逾期') {
        newSelected[b.monthIndex] = true;
      }
    });
    setSelectedMonths(newSelected);
  }, [allowanceType, startDate, expiryDate]);

  // Core Math Calculation
  function calculateBlocks(
    type: '訓後就業津貼' | '推介就業津貼', 
    startStr: string, 
    expiryStr: string
  ): MonthBlock[] {
    const blocks: MonthBlock[] = [];
    if (!startStr || !expiryStr) return blocks;

    const start = new Date(startStr);
    const expiry = new Date(expiryStr);

    for (let m = 0; m < 12; m++) {
      // Month start
      const blockStart = new Date(start);
      blockStart.setMonth(start.getMonth() + m);

      // Month end
      const blockEnd = new Date(start);
      blockEnd.setMonth(start.getMonth() + m + 1);
      blockEnd.setDate(blockEnd.getDate() - 1);

      const totalDays = Math.round((blockEnd.getTime() - blockStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      // Determine valid days within guidance
      let validDays = 0;
      let status: '足月' | '未足月' | '逾期' = '逾期';

      if (expiry >= blockEnd) {
        validDays = totalDays;
        status = '足月';
      } else if (expiry >= blockStart) {
        validDays = Math.round((expiry.getTime() - blockStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        status = '未足月';
      } else {
        validDays = 0;
        status = '逾期';
      }

      // Determine rate
      let rate = 4000;
      if (type === '訓後就業津貼') {
        rate = (m < 6) ? 6000 : 4000;
      }

      const amount = status === '足月' 
        ? rate 
        : status === '未足月' 
          ? Math.round(rate * (validDays / totalDays)) 
          : 0;

      blocks.push({
        monthIndex: m + 1,
        startStr: formatDate(blockStart),
        endStr: formatDate(blockEnd),
        totalDays,
        validDays,
        status,
        rate,
        amount
      });
    }

    return blocks;
  }

  // Helper: format Date object to YYYY-MM-DD
  function formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const blocks = useMemo(() => {
    return calculateBlocks(allowanceType, startDate, expiryDate);
  }, [allowanceType, startDate, expiryDate]);

  // Total summary based on selection
  const summary = useMemo(() => {
    let total = 0;
    let fullMonthsCount = 0;
    const partialMonthsDetails: string[] = [];
    const formulaParts: string[] = [];

    blocks.forEach(b => {
      if (selectedMonths[b.monthIndex]) {
        total += b.amount;
        if (b.status === '足月') {
          fullMonthsCount += 1;
        } else if (b.status === '未足月') {
          partialMonthsDetails.push(
            `第 ${b.monthIndex} 個月：${b.rate.toLocaleString()} 元 × (${b.validDays}/${b.totalDays} 天) = ${b.amount.toLocaleString()} 元`
          );
        }
      }
    });

    if (fullMonthsCount > 0) {
      const rateLabel = allowanceType === '訓後就業津貼' ? '訓後就業基準' : '4,000 元';
      formulaParts.push(`足月部分：${rateLabel} × ${fullMonthsCount} 個月`);
    }
    blocks.forEach(b => {
      if (selectedMonths[b.monthIndex] && b.status === '未足月') {
        formulaParts.push(`未足月部分：${b.rate.toLocaleString()} 元 × (${b.validDays}/${b.totalDays} 天)`);
      }
    });

    const calculationFormula = formulaParts.length > 0 
      ? `${formulaParts.join(' + ')} ≈ ${total.toLocaleString()} 元`
      : '未勾選任何有效月份';

    return {
      total,
      fullMonthsCount,
      partialMonthsDetails,
      calculationFormula
    };
  }, [blocks, selectedMonths, allowanceType]);

  if (!isOpen) return null;

  // Preset Loaders
  const loadPreset = (caseNum: 1 | 2) => {
    if (caseNum === 1) {
      setAllowanceType('訓後就業津貼');
      setStartDate('2026-03-15');
      setExpiryDate('2026-06-10');
    } else {
      setAllowanceType('推介就業津貼');
      setStartDate('2026-03-01');
      setExpiryDate('2026-05-10');
    }
  };

  const handleToggleMonth = (idx: number) => {
    setSelectedMonths(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn no-print">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">第二類退除役官兵未足月津貼計算機</h2>
              <p className="text-[11px] text-blue-200">穩定就業津貼發給辦法第 5 條專用試算</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-700 dark:text-slate-350">
          
          {/* Quick Presets Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
              <span>載入官方釋例預設值：</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => loadPreset(1)}
                className="flex-1 sm:flex-none text-[11px] font-bold px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-xl transition-all border border-blue-200/50 dark:border-blue-800/50"
              >
                案例一：訓後就業 (3/15投保, 6/10滿期)
              </button>
              <button
                onClick={() => loadPreset(2)}
                className="flex-1 sm:flex-none text-[11px] font-bold px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-xl transition-all border border-indigo-200/50 dark:border-indigo-800/50"
              >
                案例二：推介就業 (3/1投保, 5/10滿期)
              </button>
            </div>
          </div>

          {/* Parameters Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
            {/* Input Left: Type & Dates */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  穩定就業津貼項目
                </label>
                <div className="flex gap-2">
                  {(['訓後就業津貼', '推介就業津貼'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setAllowanceType(type)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                        allowanceType === type
                          ? 'bg-blue-600 text-white border-transparent shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    投保就業開始日
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    輔導期限屆滿日
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Input Right: Info Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 dark:bg-slate-800/30 dark:border-slate-700/50 rounded-2xl flex flex-col justify-center space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>比例計算說明</span>
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                第二類退除役官兵超過輔導期限之就業期間不予發給津貼。
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                但<strong>輔導期限內未足月之就業期間</strong>，依日數按比率計算發給數額，四捨五入計算至 1 元。
              </p>
            </div>
          </div>

          {/* Month Range Select Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pl-1">
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                選擇欲核發之就業月份區間（勾選計算）
              </label>
              <button 
                onClick={() => {
                  const allOn: Record<number, boolean> = {};
                  blocks.forEach(b => {
                    if (b.status !== '逾期') allOn[b.monthIndex] = true;
                  });
                  setSelectedMonths(allOn);
                }}
                className="text-[10px] text-blue-500 hover:text-blue-600 font-bold"
              >
                重設為建議申辦月份
              </button>
            </div>
            
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {blocks.map((b) => {
                const isSelected = !!selectedMonths[b.monthIndex];
                const isEligible = b.status !== '逾期';
                
                return (
                  <div 
                    key={b.monthIndex} 
                    className={`flex items-center justify-between p-3 transition-colors ${
                      !isEligible 
                        ? 'bg-slate-50/50 dark:bg-slate-900/10 opacity-50' 
                        : isSelected 
                          ? 'bg-blue-50/10 dark:bg-blue-950/10' 
                          : 'bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected && isEligible}
                        disabled={!isEligible}
                        onChange={() => handleToggleMonth(b.monthIndex)}
                        className="rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 w-4 h-4"
                      />
                      <span className="font-bold text-slate-850 dark:text-slate-100">
                        第 {b.monthIndex} 個月
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                        ({b.startStr.slice(5)} ~ {b.endStr.slice(5)})
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Status Badge */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === '足月'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          : b.status === '未足月'
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                            : 'bg-slate-100 text-slate-450 dark:bg-slate-800 dark:text-slate-500 border border-slate-200/40 dark:border-slate-700/40'
                      }`}>
                        {b.status === '足月' ? '足月' : b.status === '未足月' ? `未足月 (${b.validDays}/${b.totalDays}天)` : '已逾輔導期'}
                      </span>

                      {/* Computed Payout */}
                      <span className={`font-mono font-bold text-right w-20 ${
                        b.amount > 0 ? 'text-slate-800 dark:text-slate-100' : 'text-slate-350 dark:text-slate-600'
                      }`}>
                        NT$ {b.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results Block */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg space-y-4 flex-shrink-0">
            <div className="flex items-center justify-between border-b border-indigo-950/80 pb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold">穩定就業津貼試算核算結果</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                試算成功
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-indigo-300 uppercase tracking-wide">核發津貼總金額</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">
                  NT$ {summary.total.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-indigo-300 uppercase tracking-wide">核算公式明細</div>
                <div className="text-xs text-slate-300 font-mono mt-2 break-all bg-white/5 p-2 rounded-lg border border-white/10">
                  {summary.calculationFormula}
                </div>
              </div>
            </div>

            {summary.partialMonthsDetails.map((det, idx) => (
              <p key={idx} className="text-xs text-slate-350 leading-relaxed bg-white/5 px-3 py-2 rounded-xl border border-white/5 font-mono">
                💡 未足月計算明細：{det}
              </p>
            ))}

            {/* Regulation link */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-white/10">
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>依據：穩定就業津貼發給辦法第 5 條</span>
              </span>
              <button
                onClick={() => {
                  onSelectRegulation('促進退除役官兵穩定就業津貼發給辦法作業說明_114.12.24修訂___1__pdf');
                  onClose();
                }}
                className="flex items-center space-x-1 text-blue-300 hover:text-white font-semibold transition-colors animate-pulse"
              >
                <span>查看作業說明問題一</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 flex justify-end border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            關閉試算視窗
          </button>
        </div>
      </div>
    </div>
  );
};
