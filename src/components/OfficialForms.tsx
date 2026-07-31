import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  CheckSquare, 
  Square, 
  UserCheck, 
  ShieldAlert, 
  Stamp, 
  Printer, 
  PenTool,
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface FormProps {
  formType: 'training_备案' | 'training_補助' | 'training_全額' | 'family_切結' | 'stability_說明';
}

export const OfficialFormContainer: React.FC<FormProps> = ({ formType }) => {
  const [identityType, setIdentityType] = useState<'cat1' | 'cat2'>('cat1');

  if (formType === 'training_备案') {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-300 p-6 sm:p-8 font-sans shadow-xl rounded-none text-slate-900 dark:text-slate-100 max-w-4xl mx-auto space-y-6">
        
        {/* Government Official Header */}
        <div className="text-center space-y-1 border-b-2 border-slate-900 dark:border-slate-300 pb-4">
          <div className="text-sm font-semibold tracking-widest text-slate-600 dark:text-slate-400">
            國軍退除役官兵輔導委員會 〇〇 榮民服務處
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 dark:text-white">
            退除役官兵參加職業訓練申請表（備案）
          </h2>
          <div className="text-xs text-slate-500 font-mono">
            【依據「國軍退除役官兵參加職業訓練補助辦法」第五條規定辦理】
          </div>
        </div>

        {/* Section 1: Applicant Information Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 px-3 py-1 inline-block">
            壹、申請人與課程基本資訊
          </div>
          <div className="border-2 border-slate-900 dark:border-slate-300 text-xs">
            <div className="grid grid-cols-12 border-b border-slate-900 dark:border-slate-300">
              <div className="col-span-3 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300 flex items-center">
                身分別（請勾選）
              </div>
              <div className="col-span-9 p-2.5 flex items-center space-x-6">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="radio" name="cat" checked={identityType === 'cat1'} onChange={() => setIdentityType('cat1')} className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">第一類退除役官兵（榮民）</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="radio" name="cat" checked={identityType === 'cat2'} onChange={() => setIdentityType('cat2')} className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">第二類退除役官兵（輔導期限內）</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-slate-900 dark:border-slate-300">
              <div className="col-span-3 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300">
                申請人姓名
              </div>
              <div className="col-span-3 p-2.5 border-r border-slate-900 dark:border-slate-300 font-mono">
                [請填寫姓名]
              </div>
              <div className="col-span-3 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300">
                身分證字號
              </div>
              <div className="col-span-3 p-2.5 font-mono">
                [A123456789]
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-slate-900 dark:border-slate-300">
              <div className="col-span-3 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300">
                訓練機關（構）
              </div>
              <div className="col-span-9 p-2.5 font-semibold">
                [填寫立案訓練機構全銜，如：財團法人○○職業訓練中心]
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-slate-900 dark:border-slate-300">
              <div className="col-span-3 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300">
                課程名稱
              </div>
              <div className="col-span-9 p-2.5 font-semibold">
                [填寫預定參訓課程全名]
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-slate-900 dark:border-slate-300">
              <div className="col-span-3 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300">
                預定訓練期間
              </div>
              <div className="col-span-4 p-2.5 border-r border-slate-900 dark:border-slate-300">
                自 年 月 日 至 年 月 日
              </div>
              <div className="col-span-2 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300">
                總訓練時數
              </div>
              <div className="col-span-3 p-2.5">
                小時
              </div>
            </div>

            <div className="grid grid-cols-12">
              <div className="col-span-3 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300">
                訓練預估費用
              </div>
              <div className="col-span-9 p-2.5 font-bold text-blue-700 dark:text-blue-300">
                新臺幣 元 （實際補助金額以訓後審查核算為準）
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Checklist Table */}
        <div className="space-y-2">
          <div className="text-xs font-bold bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 px-3 py-1 inline-block">
            貳、檢附文件與應載事項自我檢核表
          </div>
          <div className="border-2 border-slate-900 dark:border-slate-300 p-3 space-y-2 text-xs">
            <div className="font-bold border-b pb-1">□ 檢附職訓課程資料（至少需包含下列資訊）：</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700 dark:text-slate-300 pl-4">
              <span>☑ 1. 訓練機構名稱</span>
              <span>☑ 2. 課程名稱</span>
              <span>☑ 3. 訓練期間與課表</span>
              <span>☑ 4. 授課方式與場地</span>
              <span>☑ 5. 訓練總時數</span>
              <span>☑ 6. 訓練所需費用</span>
              <span>☑ 7. 招生簡章/網站資料</span>
              <span>☑ 8. 退伍證明(屆退者)</span>
            </div>
          </div>
        </div>

        {/* Section 3: Applicant Signature Declaration */}
        <div className="border-2 border-slate-900 dark:border-slate-300 p-4 space-y-3 text-xs">
          <div className="font-bold flex items-center space-x-1 text-slate-900 dark:text-white">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>申請人切結與同意事項（切結簽章區）：</span>
          </div>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            本人申請參加旨揭職業訓練補助，已詳閱且知悉「國軍退除役官兵參加職業訓練補助辦法」各項規定，保證所填資料及檢附文件均屬實無訛。如有虛偽不實、提供身分資料供他人參訓或代參訓者，願負一切法律責任，並全數繳還已領取之補助款項。
          </p>
          <div className="flex justify-between items-end pt-4 border-t border-dashed border-slate-400">
            <div>
              <span className="font-bold">申請人簽章：</span>
              <span className="border-b border-slate-900 dark:border-slate-300 px-8 py-1 font-mono text-slate-400">（請蓋章或簽名）</span>
            </div>
            <div className="font-mono">
              中華民國 年 月 日
            </div>
          </div>
        </div>

        {/* Section 4: Veteran Services Center Approval Stamps (榮服處審查蓋章欄) */}
        <div className="space-y-2">
          <div className="text-xs font-bold bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 px-3 py-1 inline-block flex items-center gap-1">
            <Stamp className="w-3.5 h-3.5" />
            <span>參、榮民服務處審查欄（申請人請勿填寫）</span>
          </div>
          <div className="border-2 border-slate-900 dark:border-slate-300 text-xs">
            <div className="grid grid-cols-12 border-b border-slate-900 dark:border-slate-300 min-h-24">
              <div className="col-span-3 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300">
                初審結果
              </div>
              <div className="col-span-9 p-3 space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="font-bold">□ 同意備案</span>
                  <span>（備案文號：字第 號）</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400">
                  □ 不予備案，原因：□ 未依規定7日前申請 □ 逾補助上限/次數 □ 資格不符 □ 訓練機構不當招生
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 min-h-20 text-center">
              <div className="col-span-3 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
                <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">承辦人蓋章</span>
                <span className="text-slate-400 font-mono text-[10px]">（職章區）</span>
              </div>
              <div className="col-span-3 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
                <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">業務主管蓋章</span>
                <span className="text-slate-400 font-mono text-[10px]">（職章區）</span>
              </div>
              <div className="col-span-3 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
                <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">副副處長/副首長</span>
                <span className="text-slate-400 font-mono text-[10px]">（職章區）</span>
              </div>
              <div className="col-span-3 p-2 flex flex-col justify-between">
                <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">處長/首長核章</span>
                <span className="text-slate-400 font-mono text-[10px]">（決行章區）</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  if (formType === 'family_切結') {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-300 p-6 sm:p-8 font-sans shadow-xl rounded-none text-slate-900 dark:text-slate-100 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1 border-b-2 border-slate-900 dark:border-slate-300 pb-4">
          <div className="text-sm font-semibold tracking-widest text-slate-600 dark:text-slate-400">
            國軍退除役官兵輔導委員會
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 dark:text-white">
            退除役官兵眷屬參加職業訓練補助切結書
          </h2>
        </div>

        <div className="border-2 border-slate-900 dark:border-slate-300 p-6 space-y-4 text-xs leading-relaxed">
          <p className="font-bold text-sm">
            立切結書人（退除役官兵本人）：<span className="border-b border-slate-900 dark:border-slate-300 px-6 font-mono">[簽名/蓋章]</span> 
            身分證字號：<span className="border-b border-slate-900 dark:border-slate-300 px-6 font-mono">[A123456789]</span>
          </p>

          <p>
            茲同意本人眷屬（姓名：<span className="border-b border-slate-900 dark:border-slate-300 px-4 font-bold">[眷屬姓名]</span> ，關係：□配偶 □子女）參加輔導會核認之職業訓練課程（課程名稱：<span className="border-b border-slate-900 dark:border-slate-300 px-4">[課程名稱]</span> ），並依「退除役官兵眷屬參加職業訓練補助實施計畫」規定申請訓練費用補助。
          </p>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-semibold rounded">
            具結同意：眷屬獲核付之職業訓練補助金額與次數，將完全合併併入退除役官兵本人之個人職業訓練補助總額度（第一類12萬元 / 第二類8萬元）及每年2次上限內計算，絕無異議。
          </div>

          <div className="pt-6 flex justify-between items-end">
            <div className="space-y-1">
              <div>退除役官兵（立切結書人）簽章：<span className="border-b border-slate-900 px-8">（簽名）</span></div>
              <div>眷屬簽章：<span className="border-b border-slate-900 px-8">（簽名）</span></div>
            </div>
            <div className="font-mono text-xs">
              中華民國 年 月 日
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback default visual form card
  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-300 p-6 text-xs space-y-4">
      <div className="font-bold text-sm text-center border-b pb-2">
        國軍退除役官兵輔導委員會 官方核發申請表單
      </div>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
        本表單依據國軍退除役官兵輔導委員會法規標準製表，包含申請人資料欄、金融機構撥款帳號、訓練機構蓋章欄、在職證明欄與榮民服務處四級審查決行欄。
      </p>
    </div>
  );
};
