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
  AlertCircle,
  FileCheck,
  CreditCard,
  Briefcase
} from 'lucide-react';

interface FormProps {
  formType: 'training_备案' | 'training_補助' | 'training_全額' | 'family_切結' | 'stability_說明' | 'generic';
  rawTitle?: string;
  rawContent?: string;
}

export const OfficialFormContainer: React.FC<FormProps> = ({ formType, rawTitle, rawContent }) => {
  const [identityType, setIdentityType] = useState<'cat1' | 'cat2'>('cat1');

  // Form 1: 附件一 職業訓練備案申請表
  if (formType === 'training_备案') {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-300 p-6 sm:p-8 font-sans shadow-xl rounded-none text-slate-900 dark:text-slate-100 max-w-4xl mx-auto space-y-6">
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
                  <input type="radio" name="cat1" checked={identityType === 'cat1'} onChange={() => setIdentityType('cat1')} className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">第一類退除役官兵（榮民）</span>
                </label>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="radio" name="cat1" checked={identityType === 'cat2'} onChange={() => setIdentityType('cat2')} className="w-4 h-4 text-blue-600" />
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

        <div className="border-2 border-slate-900 dark:border-slate-300 p-4 space-y-3 text-xs">
          <div className="font-bold flex items-center space-x-1 text-slate-900 dark:text-white">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>申請人切結簽章：</span>
          </div>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            本人申請參加旨揭職業訓練補助，已詳閱且知悉規定，保證所填資料及檢附文件均屬實無訛。
          </p>
          <div className="flex justify-between items-end pt-4 border-t border-dashed border-slate-400">
            <div>
              <span className="font-bold">申請人簽章：</span>
              <span className="border-b border-slate-900 px-8 py-1 font-mono text-slate-400">（請蓋章或簽名）</span>
            </div>
            <div className="font-mono">中華民國 年 月 日</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 px-3 py-1 inline-block flex items-center gap-1">
            <Stamp className="w-3.5 h-3.5" />
            <span>榮民服務處審查欄（蓋章區）</span>
          </div>
          <div className="border-2 border-slate-900 dark:border-slate-300 text-xs grid grid-cols-12 min-h-20 text-center">
            <div className="col-span-3 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
              <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">承辦人蓋章</span>
              <span className="text-slate-400 font-mono text-[10px]">（職章區）</span>
            </div>
            <div className="col-span-3 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
              <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">業務主管蓋章</span>
              <span className="text-slate-400 font-mono text-[10px]">（職章區）</span>
            </div>
            <div className="col-span-3 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
              <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">副首長核章</span>
              <span className="text-slate-400 font-mono text-[10px]">（職章區）</span>
            </div>
            <div className="col-span-3 p-2 flex flex-col justify-between">
              <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">首長決行章</span>
              <span className="text-slate-400 font-mono text-[10px]">（決行章區）</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form 2: 附件二 職業訓練補助金申請表 (完成訓練後)
  if (formType === 'training_補助') {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-300 p-6 sm:p-8 font-sans shadow-xl rounded-none text-slate-900 dark:text-slate-100 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1 border-b-2 border-slate-900 dark:border-slate-300 pb-4">
          <div className="text-sm font-semibold tracking-widest text-slate-600 dark:text-slate-400">
            國軍退除役官兵輔導委員會 〇〇 榮民服務處
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 dark:text-white">
            退除役官兵參加職業訓練補助金申請表（完成訓練後）
          </h2>
          <div className="text-xs text-slate-500 font-mono">
            【依據「國軍退除役官兵參加職業訓練補助辦法」第七條規定辦理】
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 px-3 py-1 inline-block">
            壹、申請人與撥款金融帳號
          </div>
          <div className="border-2 border-slate-900 dark:border-slate-300 text-xs">
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
                金融機構撥款帳號
              </div>
              <div className="col-span-9 p-2.5 font-mono flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>郵局 / 銀行名稱：[○○銀行 ○○分行] 帳號：[1234-5678-9012-34]</span>
              </div>
            </div>

            <div className="grid grid-cols-12 border-b border-slate-900 dark:border-slate-300">
              <div className="col-span-3 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300">
                實際參訓金額 / 申請補助
              </div>
              <div className="col-span-4 p-2.5 border-r border-slate-900 dark:border-slate-300 font-bold">
                學費實繳：新臺幣 元
              </div>
              <div className="col-span-5 p-2.5 font-bold text-emerald-600 dark:text-emerald-400">
                擬申請補助金額：新臺幣 元
              </div>
            </div>

            <div className="grid grid-cols-12">
              <div className="col-span-3 bg-slate-100 dark:bg-slate-800 p-2.5 font-bold border-r border-slate-900 dark:border-slate-300">
                訓後就業機構與到職日
              </div>
              <div className="col-span-9 p-2.5 flex items-center space-x-4">
                <span>就業機構：[○○股份有限公司]</span>
                <span>到職日期：[年 月 日]</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 px-3 py-1 inline-block">
            貳、應檢附證明文件對照表
          </div>
          <div className="border-2 border-slate-900 dark:border-slate-300 p-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. 備案同意函影本。</span>
            </div>
            <div className="flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>2. 申請人國內金融機構存摺封面影本。</span>
            </div>
            <div className="flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. 繳費收據或發票正本。</span>
            </div>
            <div className="flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>4. 載明職訓法細則第四條資訊之結訓證明文件影本。</span>
            </div>
            <div className="flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>5. 在保之職業保險證明影本（如投保單位為職業工會，加附在職證明）。</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 px-3 py-1 inline-block flex items-center gap-1">
            <Stamp className="w-3.5 h-3.5" />
            <span>參、榮民服務處撥款審查蓋章欄</span>
          </div>
          <div className="border-2 border-slate-900 dark:border-slate-300 text-xs grid grid-cols-12 min-h-20 text-center">
            <div className="col-span-3 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
              <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">審查擬核付金額</span>
              <span className="font-black text-blue-700 dark:text-blue-300">NT$ 元</span>
            </div>
            <div className="col-span-3 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
              <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">承辦人簽章</span>
              <span className="text-slate-400 font-mono text-[10px]">（職章區）</span>
            </div>
            <div className="col-span-3 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
              <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">主計/會計核章</span>
              <span className="text-slate-400 font-mono text-[10px]">（職章區）</span>
            </div>
            <div className="col-span-3 p-2 flex flex-col justify-between">
              <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">首長決行章</span>
              <span className="text-slate-400 font-mono text-[10px]">（決行章區）</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form 3: 附件三 首次申請全額補助申請表
  if (formType === 'training_全額') {
    return (
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-300 p-6 sm:p-8 font-sans shadow-xl rounded-none text-slate-900 dark:text-slate-100 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-1 border-b-2 border-slate-900 dark:border-slate-300 pb-4">
          <div className="text-sm font-semibold tracking-widest text-slate-600 dark:text-slate-400">
            國軍退除役官兵輔導委員會 〇〇 榮民服務處
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 dark:text-white">
            首次申請職業訓練費用全額補助申請表（不受上限限制）
          </h2>
          <div className="text-xs text-slate-500 font-mono">
            【依據「國軍退除役官兵參加職業訓練補助辦法」第八條規定辦理】
          </div>
        </div>

        <div className="border-2 border-slate-900 dark:border-slate-300 p-4 space-y-3 text-xs">
          <div className="font-bold text-sm text-blue-900 dark:text-blue-200">
            一、全額補助要件與佐證資料檢核（須符合下列情形之一）：
          </div>
          <div className="space-y-2 pl-2">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 border">
              ☑ 1. 訓後所從事行（職）業與職業訓練相關，符合輔導會「職業訓練與相關行(職)業參照表」。
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 border">
              ☑ 2. 從事農業者或於同一機構連續工作滿三個月以上證明（檢附商工登記與在職證明）。
            </div>
          </div>

          <div className="flex justify-between items-end pt-6 border-t border-dashed border-slate-400">
            <div>
              <span className="font-bold">申請人切結簽章：</span>
              <span className="border-b border-slate-900 px-8 py-1 font-mono text-slate-400">（請蓋章或簽名）</span>
            </div>
            <div className="font-mono">中華民國 年 月 日</div>
          </div>
        </div>
      </div>
    );
  }

  // Form 4: 眷屬切結書
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
            立切結書人（退除役官兵本人）：<span className="border-b border-slate-900 px-6 font-mono">[簽名/蓋章]</span> 
            身分證字號：<span className="border-b border-slate-900 px-6 font-mono">[A123456789]</span>
          </p>

          <p>
            茲同意本人眷屬（姓名：<span className="border-b border-slate-900 px-4 font-bold">[眷屬姓名]</span> ，關係：□配偶 □子女）參加輔導會核認之職業訓練課程（課程名稱：<span className="border-b border-slate-900 px-4">[課程名稱]</span> ），並依「退除役官兵眷屬參加職業訓練補助實施計畫」規定申請訓練費用補助。
          </p>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-semibold rounded">
            具結同意：眷屬獲核付之職業訓練補助金額與次數，將完全合併併入退除役官兵本人之個人職業訓練補助總額度（第一類12萬元 / 第二類8萬元）及每年2次上限內計算，絕無異議。
          </div>

          <div className="pt-6 flex justify-between items-end">
            <div className="space-y-1">
              <div>退除役官兵（立切結書人）簽章：<span className="border-b border-slate-900 px-8">（簽名）</span></div>
              <div>眷屬簽章：<span className="border-b border-slate-900 px-8">（簽名）</span></div>
            </div>
            <div className="font-mono text-xs">中華民國 年 月 日</div>
          </div>
        </div>
      </div>
    );
  }

  // Generic / Default Form Renderer (Parses any attachment into official black-border form grid)
  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-300 p-6 sm:p-8 font-sans shadow-xl rounded-none text-slate-900 dark:text-slate-100 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-1 border-b-2 border-slate-900 dark:border-slate-300 pb-4">
        <div className="text-sm font-semibold tracking-widest text-slate-600 dark:text-slate-400">
          國軍退除役官兵輔導委員會 官方核發申辦表格
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 dark:text-white">
          {rawTitle || '官方指定申辦表單與檢附文件明細'}
        </h2>
      </div>

      <div className="border-2 border-slate-900 dark:border-slate-300 p-4 space-y-3 text-xs">
        <div className="font-bold text-sm border-b pb-2 flex items-center space-x-1.5">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>表單內文與欄位應載明事項：</span>
        </div>
        <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-800 dark:text-slate-200">
          {rawContent}
        </div>
      </div>

      {/* Official Approval Stamp Box */}
      <div className="space-y-2">
        <div className="text-xs font-bold bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 px-3 py-1 inline-block flex items-center gap-1">
          <Stamp className="w-3.5 h-3.5" />
          <span>榮民服務處審查與決行蓋章欄</span>
        </div>
        <div className="border-2 border-slate-900 dark:border-slate-300 text-xs grid grid-cols-12 min-h-20 text-center">
          <div className="col-span-4 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
            <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">承辦人簽章</span>
            <span className="text-slate-400 font-mono text-[10px]">（職章區）</span>
          </div>
          <div className="col-span-4 border-r border-slate-900 dark:border-slate-300 p-2 flex flex-col justify-between">
            <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">業務主管簽章</span>
            <span className="text-slate-400 font-mono text-[10px]">（職章區）</span>
          </div>
          <div className="col-span-4 p-2 flex flex-col justify-between">
            <span className="font-bold bg-slate-100 dark:bg-slate-800 py-1">首長決行章</span>
            <span className="text-slate-400 font-mono text-[10px]">（決行章區）</span>
          </div>
        </div>
      </div>
    </div>
  );
};
