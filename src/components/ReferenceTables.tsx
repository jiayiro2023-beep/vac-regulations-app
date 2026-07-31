import React from 'react';
import { Regulation } from '../data/regulations';
import { Building2, Award, Table, CheckCircle2 } from 'lucide-react';

interface ReferenceTablesProps {
  regulation: Regulation;
}

export const ReferenceTables: React.FC<ReferenceTablesProps> = ({ regulation }) => {
  const isAmountTable = regulation.title.includes("就學補助生活津貼及獎勵核發金額表");
  const isPublicEnterprise = regulation.title.includes("公營事業機構參考名冊");

  if (isAmountTable) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            就學補助生活津貼及獎勵核發金額表 (115年7月1日最新生效標準)
          </h3>
        </div>

        <div className="overflow-x-auto">
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
              <tr>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-blue-900 dark:text-blue-200">
                  國內大專校院學雜費補助
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700">
                  國內公私立專科、大學（含進修部及進修學院）
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                  公立：日間 40,000 / 進修 50,000 元<br />
                  私立：日間 80,000 / 進修 60,000 元
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 text-[11px]">
                  依規定於期限內檢附學雜費收據核實補助。
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-blue-900 dark:text-blue-200">
                  國內研究所學雜費補助
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700">
                  國內公私立研究所（分有職業與無職業）
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                  公立：有職業 30,000 / 無職業 20,000 元<br />
                  私立：有職業 50,000 / 無職業 40,000 元
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 text-[11px]">
                  有職業者須檢附在職相關證明。
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-blue-900 dark:text-blue-200">
                  國外研究所學雜費補助
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700">
                  符合教育部採認規定之國外研究所學雜費
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                  按學期最高補助 NT$ 50,000 元
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 text-[11px]">
                  應於註冊就學後 2 個月內提出申請。
                </td>
              </tr>
              <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-amber-900 dark:text-amber-200">
                  就學期間生活津貼
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-medium">
                  具有低收入戶或中低收入戶資格者（國內外就學）
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-black text-amber-600 dark:text-amber-400 text-sm">
                  NT$ 8,429 元 / 每月
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 text-[11px]">
                  115.07.01 生效最新修訂標準，按月核發。
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-blue-900 dark:text-blue-200">
                  專科及大學成績優異獎勵
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700">
                  學期平均成績 80 分以上，且全部及格
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                  NT$ 10,000 元 / 每學期
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 text-[11px]">
                  公立限 50 名、私立限 100 名。
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-blue-900 dark:text-blue-200">
                  研究所成績優異獎勵
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700">
                  學期平均成績 90 分以上，且全部及格
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                  NT$ 10,000 元 / 每學期
                </td>
                <td className="p-3 border border-slate-200 dark:border-slate-700 text-[11px]">
                  公立限 50 名、私立限 50 名。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (isPublicEnterprise) {
    const orgs = [
      { name: "台灣電力股份有限公司 (台電)", type: "國營事業", note: "包含專科以上層級公開甄試" },
      { name: "台灣自來水股份有限公司 (台水)", type: "國營事業", note: "評價職務與職員公開招考" },
      { name: "台灣中油股份有限公司 (中油)", type: "國營事業", note: "僱用人員與新進職員招考" },
      { name: "台灣糖業股份有限公司 (台糖)", type: "國營事業", note: "新進人員甄試" },
      { name: "中華郵政股份有限公司", type: "國營公司", note: "職缺公開甄選" },
      { name: "臺灣菸酒股份有限公司 (台酒)", type: "國營公司", note: "從業人員招考" },
      { name: "財政部印刷廠", type: "事業機構", note: "公開甄選" },
      { name: "中央造幣廠 / 中央印製廠", type: "中央銀行所屬", note: "公開新進人員甄試" }
    ];

    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            辦理公開招考之公營事業機構參考名冊 (113年版)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {orgs.map((org, i) => (
            <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">{org.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{org.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
