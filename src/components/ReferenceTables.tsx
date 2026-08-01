import React from 'react';
import { Regulation } from '../data/regulations';
import { Award } from 'lucide-react';

interface ReferenceTablesProps {
  regulation: Regulation;
}

interface TableRow {
  category: string;
  target: string;
  amount: React.ReactNode;
  note: string;
  highlight?: boolean;
}

export const ReferenceTables: React.FC<ReferenceTablesProps> = ({ regulation }) => {
  const isAmountTable = regulation.title.includes("就學補助生活津貼及獎勵核發金額表");

  if (isAmountTable) {
    const rows: TableRow[] = [
      {
        category: "國內大專校院學雜費補助",
        target: "國內公私立專科、大學（含進修部及進修學院）",
        amount: (
          <>
            公立：日間 40,000 / 進修 50,000 元<br />
            私立：日間 80,000 / 進修 60,000 元
          </>
        ),
        note: "依規定於期限內檢附學雜費收據核實補助。"
      },
      {
        category: "國內研究所學雜費補助",
        target: "國內公私立研究所（分有職業與無職業）",
        amount: (
          <>
            公立：有職業 30,000 / 無職業 20,000 元<br />
            私立：有職業 50,000 / 無職業 40,000 元
          </>
        ),
        note: "有職業者須檢附在職相關證明。"
      },
      {
        category: "國外研究所學雜費補助",
        target: "符合教育部採認規定之國外研究所學雜費",
        amount: "按學期最高補助 NT$ 50,000 元",
        note: "應於註冊就學後 2 個月內提出申請。"
      },
      {
        category: "就學期間生活津貼",
        target: "具有低收入戶或中低收入戶資格者（國內外就學）",
        amount: <span className="font-black text-amber-600 dark:text-amber-400 text-sm">NT$ 8,429 元 / 每月</span>,
        note: "115.07.01 生效最新修訂標準，按月核發。",
        highlight: true
      },
      {
        category: "專科及大學成績優異獎勵",
        target: "學期平均成績 80 分以上，且全部及格",
        amount: "NT$ 10,000 元 / 每學期",
        note: "公立限 50 名、私立限 100 名。"
      },
      {
        category: "研究所成績優異獎勵",
        target: "學期平均成績 90 分以上，且全部及格",
        amount: "NT$ 10,000 元 / 每學期",
        note: "公立限 50 名、私立限 50 名。"
      }
    ];

    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
            就學補助生活津貼及獎勵核發金額表
            <span className="block sm:inline sm:ml-1 text-xs font-normal text-slate-500 dark:text-slate-400">
              (115年7月1日最新生效標準)
            </span>
          </h3>
        </div>

        {/* Desktop: traditional table (sm+) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-200 dark:border-slate-700">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">項目類別</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">適用對象與資格條件</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">核發標準 / 金額 (NT$)</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 font-bold">備註說明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-600 dark:text-slate-300">
              {rows.map((row, i) => (
                <tr key={i} className={row.highlight ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                  <td className={`p-3 border border-slate-200 dark:border-slate-700 font-semibold ${row.highlight ? 'text-amber-900 dark:text-amber-200 font-bold' : 'text-blue-900 dark:text-blue-200'}`}>
                    {row.category}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700">
                    {row.target}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                    {row.amount}
                  </td>
                  <td className="p-3 border border-slate-200 dark:border-slate-700 text-[11px]">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: card-stack layout (< sm) */}
        <div className="sm:hidden space-y-3">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`rounded-xl border p-3.5 space-y-2.5 ${
                row.highlight
                  ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/20'
                  : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/20'
              }`}
            >
              {/* Category name as card title */}
              <div className={`text-xs font-bold leading-snug ${row.highlight ? 'text-amber-800 dark:text-amber-300' : 'text-blue-800 dark:text-blue-300'}`}>
                {row.category}
              </div>

              {/* Amount — prominent */}
              <div className={`text-sm font-bold ${row.highlight ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {row.amount}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200 dark:border-slate-700/60 pt-2 space-y-1.5">
                {/* Target label+value */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">適用對象</span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">{row.target}</span>
                </div>
                {/* Note label+value */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">備註</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{row.note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
