import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  DollarSign, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegulation: (regId: string) => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectRegulation
}) => {
  const [identity, setIdentity] = useState<'cat1' | 'cat2' | 'family'>('cat1');
  const [program, setProgram] = useState<'stability' | 'education' | 'training' | 'exam'>('stability');
  
  // Specific options
  const [stabilityType, setStabilityType] = useState<'agency' | 'self'>('agency');
  const [eduType, setEduType] = useState<'living' | 'award80' | 'award90'>('living');
  const [trainCost, setTrainCost] = useState<number>(30000);

  if (!isOpen) return null;

  // Calculation Logic
  const getResult = () => {
    if (program === 'stability') {
      if (identity === 'family') {
        return {
          eligible: false,
          monthly: 0,
          total: 0,
          duration: '無',
          title: '促進退除役官兵穩定就業津貼',
          note: '本津貼僅限退除役官兵本人（第一類及第二類輔導對象）申請，眷屬不適用。',
          regId: '____施行日1130630_pdf',
          article: '促進退除役官兵穩定就業津貼發給辦法第 2 條'
        };
      }
      const isAgency = stabilityType === 'agency';
      const monthly = isAgency ? 8000 : 4000;
      return {
        eligible: true,
        monthly,
        total: monthly * 12,
        duration: '最長 12 個月',
        title: isAgency ? '機關推介就業穩定津貼' : '自主就業穩定津貼',
        note: `經退輔會職業轉介或自行求職成功並穩定就業滿 3 個月起得按月申請。按月核發 NT$ ${monthly.toLocaleString()} 元，發給期限最長 12 個月。`,
        regId: '____施行日1130630_pdf',
        article: '促進退除役官兵穩定就業津貼發給辦法第 6 條、第 7 條'
      };
    }

    if (program === 'education') {
      if (identity === 'family') {
        return {
          eligible: false,
          monthly: 0,
          total: 0,
          duration: '無',
          title: '就學補助、生活津貼及獎勵金',
          note: '就學補助生活津貼及獎勵金僅限退除役官兵本人申請。',
          regId: '______________________pdf',
          article: '國軍退除役官兵就學補助生活津貼及獎勵辦法第 2 條'
        };
      }

      if (eduType === 'living') {
        return {
          eligible: true,
          monthly: 8429,
          total: 8429 * 9, // per academic year (~9 months)
          duration: '就學修業期間（按月發給）',
          title: '就學期間生活津貼（低收／中低收入戶）',
          note: '具低收入戶或中低收入戶資格者，於就學期間按月發給 NT$ 8,429 元（115年7月1日最新生效標準）。',
          regId: '國軍退除役官兵就學補助生活津貼及獎勵核發金額表_115年7月1日生效__pdf',
          article: '國軍退除役官兵就學補助生活津貼及獎勵核發金額表（115.07.01生效）'
        };
      } else if (eduType === 'award80') {
        return {
          eligible: true,
          monthly: 0,
          total: 10000,
          duration: '按學期核發（一次性）',
          title: '專科及大學學業成績優異獎勵金（80分以上）',
          note: '專科及大學就讀期間學期平均成績達 80 分以上，且全部及格者，每學期獎勵 NT$ 10,000 元（公立限50名、私立限100名）。',
          regId: '國軍退除役官兵就學補助生活津貼及獎勵辦法_pdf',
          article: '國軍退除役官兵就學補助生活津貼及獎勵辦法第 3 條第 4 款'
        };
      } else {
        return {
          eligible: true,
          monthly: 0,
          total: 10000,
          duration: '按學期核發（一次性）',
          title: '研究所學業成績優異獎勵金（90分以上）',
          note: '研究所就讀期間學期平均成績達 90 分以上，且全部及格者，每學期獎勵 NT$ 10,000 元（公私立各限50名）。',
          regId: '國軍退除役官兵就學補助生活津貼及獎勵核發金額表_115年7月1日生效__pdf',
          article: '國軍退除役官兵就學補助生活津貼及獎勵辦法第 3 條第 5 款'
        };
      }
    }

    if (program === 'training') {
      if (identity === 'family') {
        const sub = Math.min(trainCost * 0.5, 20000);
        return {
          eligible: true,
          monthly: 0,
          total: sub,
          duration: '每年最高補助 2 萬元',
          title: '退除役官兵眷屬職業訓練補助',
          note: `眷屬參訓學費補助 50%，本次預計補助 NT$ ${sub.toLocaleString()} 元（每年累計上限 20,000 元）。`,
          regId: '______________________pdf_11',
          article: '退除役官兵眷屬參加職業訓練補助實施計畫第 5 點'
        };
      }

      const sub = Math.min(trainCost, 120000);
      return {
        eligible: true,
        monthly: 0,
        total: sub,
        duration: '每年累計上限 12 萬元',
        title: '退除役官兵職業訓練補助',
        note: `退除役官兵參訓費用全額/部分補助，年度補助金額上限 NT$ 120,000 元。`,
        regId: '________________________odt',
        article: '國軍退除役官兵參加職業訓練補助辦法第 5 條'
      };
    }

    // Exam prep
    return {
      eligible: true,
      monthly: 0,
      total: 50000,
      duration: '總累計最高補助 5 萬元',
      title: '參加國家考試/公營事業招考進修補助',
      note: '參加公務人員考試或公營事業機構公開招考補習/教材補助，上限 NT$ 50,000 元。',
      regId: '___________________________________________________pdf_10',
      article: '輔導退除役官兵參加就業考試進修補助作業規定第 4 點'
    };
  };

  const result = getResult();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn no-print">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">承辦人補助與津貼智慧試算器</h2>
              <p className="text-xs text-blue-200">依據 115 年最新法規條文與核發金額標準自動算」</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Step 1: Select Identity */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              1. 選擇申請對象身份態樣
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'cat1', label: '第一類退除役官兵', sub: '服役10年以上 / 榮民' },
                { id: 'cat2', label: '第二類退除役官兵', sub: '服役4-9年 (輔導期內)' },
                { id: 'family', label: '退除役官兵眷屬', sub: '配偶及直系眷屬' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setIdentity(item.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    identity === item.id
                      ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.label}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Program */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              2. 選擇申請補助 / 津貼項目
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'stability', label: '穩定就業津貼' },
                { id: 'education', label: '就學生活津貼/獎勵' },
                { id: 'training', label: '職業訓練補助' },
                { id: 'exam', label: '就業考試補習補助' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setProgram(item.id as any)}
                  className={`py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                    program === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Parameters */}
          {program === 'stability' && identity !== 'family' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">就業管道類型：</label>
              <div className="flex space-x-3">
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="stabType"
                    checked={stabilityType === 'agency'}
                    onChange={() => setStabilityType('agency')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>機關推介就業 (按月 8,000 元)</span>
                </label>
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="stabType"
                    checked={stabilityType === 'self'}
                    onChange={() => setStabilityType('self')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>自主就業/自行求職 (按月 4,000 元)</span>
                </label>
              </div>
            </div>
          )}

          {program === 'education' && identity !== 'family' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">就學申辦類別：</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'living', label: '生活津貼 (8,429元/月)' },
                  { id: 'award80', label: '專科/大學80分 (10,000元)' },
                  { id: 'award90', label: '研究所90分 (10,000元)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setEduType(opt.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border ${
                      eduType === opt.id
                        ? 'bg-blue-100 dark:bg-blue-900/60 border-blue-400 text-blue-800 dark:text-blue-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {program === 'training' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">預計參訓學費金額：</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={trainCost}
                  onChange={(e) => setTrainCost(Number(e.target.value))}
                  step={1000}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold w-40"
                />
                <span className="text-xs text-slate-500">元</span>
              </div>
            </div>
          )}

          {/* Output Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-950/80 pb-3">
              <div className="flex items-center space-x-2">
                {result.eligible ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
                <span className="text-sm font-bold">{result.title}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                result.eligible ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {result.eligible ? '符合申辦條件' : '不符合對象'}
              </span>
            </div>

            {result.eligible && (
              <div className="grid grid-cols-2 gap-4">
                {result.monthly > 0 && (
                  <div>
                    <div className="text-[11px] text-indigo-300">按月核發金額</div>
                    <div className="text-2xl font-black text-emerald-400 mt-0.5">
                      NT$ {result.monthly.toLocaleString()} <span className="text-xs font-normal text-slate-300">/ 月</span>
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-[11px] text-indigo-300">試算試核總金額上限</div>
                  <div className="text-2xl font-black text-amber-300 mt-0.5">
                    NT$ {result.total.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
              {result.note}
            </p>

            {/* Regulation link */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-white/10">
              <span className="text-slate-400 text-[11px]">法規依據：{result.article}</span>
              <button
                onClick={() => {
                  onSelectRegulation(result.regId);
                  onClose();
                }}
                className="flex items-center space-x-1 text-blue-300 hover:text-white font-semibold transition-colors"
              >
                <span>跳轉查看法規原文</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 flex justify-end border-t border-slate-200 dark:border-slate-700">
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
