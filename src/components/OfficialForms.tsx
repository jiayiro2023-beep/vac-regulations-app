import React, { useState } from 'react';
import { Stamp, ShieldAlert, CheckCircle2, CreditCard, FileCheck } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export type FormType =
  | 'training_备案'
  | 'training_補助'
  | 'training_全額'
  | 'family_切結'
  | 'generic';

interface OfficialFormContainerProps {
  formType: FormType;
  rawTitle?: string;
  rawContent?: string;
}

// ─── Shared Primitives ────────────────────────────────────────────────────────

const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white dark:bg-slate-950 border-2 border-slate-800 dark:border-slate-300 font-sans text-slate-900 dark:text-slate-100 w-full max-w-3xl mx-auto overflow-hidden">
    {children}
  </div>
);

const FormHeader: React.FC<{ agency: string; title: string; note?: string }> = ({
  agency,
  title,
  note,
}) => (
  <div className="border-b-2 border-slate-800 dark:border-slate-300 py-4 px-6 text-center space-y-1">
    <div className="text-sm font-semibold tracking-widest text-slate-600 dark:text-slate-300">
      {agency}
    </div>
    <h2 className="text-lg font-black tracking-wide text-slate-900 dark:text-white leading-snug">
      {title}
    </h2>
    {note && (
      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{note}</div>
    )}
  </div>
);

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold px-3 py-1 flex items-center gap-1">
    {label}
  </div>
);

interface CellProps {
  label: string;
  value?: string;
  colSpan?: number;
  isHeader?: boolean;
}

/** A single label + value cell row that spans any number of columns in the table grid */
const Row2Col: React.FC<{ label: string; value: React.ReactNode; labelCols?: number; valueCols?: number }> = ({
  label,
  value,
  labelCols = 3,
  valueCols = 9,
}) => (
  <div className="grid border-b border-slate-800 dark:border-slate-300 last:border-b-0" style={{ gridTemplateColumns: `${labelCols}fr ${valueCols}fr` }}>
    <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300 flex items-center leading-tight">
      {label}
    </div>
    <div className="px-3 py-2 text-xs text-slate-800 dark:text-slate-200 flex items-center leading-relaxed">
      {value}
    </div>
  </div>
);

const StampBox: React.FC<{ columns: string[] }> = ({ columns }) => (
  <div>
    <SectionLabel label="　　機關首長審核蓋章欄　　" />
    <div className="grid border-t-0" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
      {columns.map((col, i) => (
        <div
          key={i}
          className={`border-r last:border-r-0 border-slate-800 dark:border-slate-300 flex flex-col items-center justify-between py-4 px-2 min-h-[80px] ${i < columns.length - 1 ? '' : ''}`}
        >
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 w-full text-center py-1">
            {col}
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-auto">（職章區）</span>
        </div>
      ))}
    </div>
  </div>
);

const CheckItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-start gap-2 text-xs py-0.5">
    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
    <span>{text}</span>
  </div>
);

// ─── 附件一：備案申請表 ───────────────────────────────────────────────────────
const Form備案: React.FC = () => {
  const [idType, setIdType] = useState<'cat1' | 'cat2'>('cat1');

  return (
    <FormWrapper>
      <FormHeader
        agency="國軍退除役官兵輔導委員會 ○○ 榮民服務處"
        title="退除役官兵參加職業訓練申請表（備案）"
        note="依據「國軍退除役官兵參加職業訓練補助辦法」第五條規定辦理"
      />

      {/* 申請資訊 */}
      <SectionLabel label="壹、申請資訊" />
      <div className="border border-slate-800 dark:border-slate-300 border-t-0">
        {/* 身分別 */}
        <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 9fr' }}>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300 flex items-center">
            身分別（請勾選）
          </div>
          <div className="px-3 py-2 flex items-center gap-6 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="idtype" checked={idType === 'cat1'} onChange={() => setIdType('cat1')} className="w-3.5 h-3.5 accent-blue-600" />
              <span className="font-semibold">□ 第一類退除役官兵（榮民）</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="idtype" checked={idType === 'cat2'} onChange={() => setIdType('cat2')} className="w-3.5 h-3.5 accent-blue-600" />
              <span className="font-semibold">□ 第二類退除役官兵（輔導期限內）</span>
            </label>
          </div>
        </div>

        {/* 姓名 + 身分證 */}
        <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 3fr 3fr 3fr' }}>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300 flex items-center">姓名</div>
          <div className="px-3 py-2 text-xs border-r border-slate-800 dark:border-slate-300 text-slate-400 font-mono">〔請填寫姓名〕</div>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300 flex items-center">國民身分證統一編號</div>
          <div className="px-3 py-2 text-xs text-slate-400 font-mono">A123456789</div>
        </div>

        <Row2Col label="訓練機關（構）" value="〔填寫立案訓練機構全銜，如：財團法人○○職業訓練中心〕" />

        {/* 聯絡方式 */}
        <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 9fr' }}>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300 flex items-center">聯絡方式</div>
          <div className="px-3 py-2 text-xs text-slate-500 space-y-0.5">
            <div>電話：___________　行動電話：___________</div>
            <div>通訊地址：___________________________</div>
            <div>電子郵址：___________________________</div>
          </div>
        </div>

        <Row2Col label="課程名稱" value="〔填寫課程正式名稱〕" />

        {/* 開/結訓日期 + 時數 */}
        <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 3fr 3fr 3fr' }}>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">開訓日期</div>
          <div className="px-3 py-2 text-xs border-r border-slate-800 dark:border-slate-300 text-slate-400 font-mono">　年　月　日</div>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">結訓日期</div>
          <div className="px-3 py-2 text-xs text-slate-400 font-mono">　年　月　日</div>
        </div>
        <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 3fr 3fr 3fr' }}>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">訓練總時數</div>
          <div className="px-3 py-2 text-xs border-r border-slate-800 dark:border-slate-300 text-slate-400 font-mono">________ 小時</div>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">訓練所需費用</div>
          <div className="px-3 py-2 text-xs text-slate-400 font-mono">新臺幣________ 元</div>
        </div>
      </div>

      {/* 職訓課程資料 */}
      <SectionLabel label="貳、職訓課程資料（請勾選並附相關文件）" />
      <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-3 text-xs space-y-1.5">
        <div className="grid grid-cols-2 gap-1">
          {['□ 招生簡章。', '□ 網站資料。', '□ 社群資訊。', '□ 其他：_______________。'].map((item, i) => (
            <div key={i} className="text-slate-700 dark:text-slate-300">{item}</div>
          ))}
        </div>
        <div className="text-slate-700 dark:text-slate-300">□ 國防部或所屬軍種司令部核定之退伍除役證明文件影本（依第五條第二項申請備案者，始須檢附）。</div>
        <div className="text-slate-500">□ 核定退伍日：　年　月　日</div>
      </div>

      {/* 應載明事項自我檢核 */}
      <SectionLabel label="參、應載明事項（職訓課程資料須包含以下所有事項）" />
      <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-3 text-xs">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[
            '□ 訓練機關（構）名稱。',
            '□ 課程名稱。',
            '□ 訓練期間。',
            '□ 預定課程表。',
            '□ 授課方式（□ 實體　□ 視訊）。',
            '□ 訓練場地。',
            '□ 訓練總時數。',
            '□ 訓練所需費用。',
          ].map((item, i) => (
            <div key={i} className="text-slate-700 dark:text-slate-300">{item}</div>
          ))}
        </div>
      </div>

      {/* 申請人切結 */}
      <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-4 space-y-3">
        <div className="flex items-start gap-1.5 text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            本次申請備案，本人已詳閱相關規定，且依規定辦理，並簽名確認負責，如有不實，依法處理。
          </p>
        </div>
        <div className="flex flex-wrap justify-between items-end gap-4 border-t border-dashed border-slate-300 pt-3">
          <div className="text-xs">
            申請人簽名：<span className="inline-block border-b border-slate-800 w-32 ml-1">&nbsp;</span>
          </div>
          <div className="text-xs font-mono">日期：　年　月　日</div>
        </div>
      </div>

      {/* 榮服處受理欄 */}
      <SectionLabel label="肆、榮民服務處受理欄" />
      <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-3 text-xs space-y-2">
        <div>受理日期：　年　月　日　　受理人員：___________</div>
        <div className="space-y-1">
          <div>審核結果：</div>
          <div className="pl-4 space-y-1">
            <div>□ 同意備案。</div>
            <div>□ 不予備案，有本辦法第五條第三項第　款之情形：（請說明）_______________</div>
            <div>□ 其他事項：_______________</div>
          </div>
        </div>
      </div>

      {/* 蓋章欄 */}
      <SectionLabel label="伍、審查蓋章欄" />
      <div className="border border-slate-800 dark:border-slate-300 border-t-0">
        <StampBox columns={['承辦人蓋章', '業務主管蓋章', '副首長核章', '機關首長（或其授權人員）']} />
      </div>

      {/* 注意事項 */}
      <div className="border-t-2 border-slate-800 dark:border-slate-300 px-4 py-3 bg-slate-50 dark:bg-slate-900 text-xs space-y-1 text-slate-600 dark:text-slate-400">
        <div className="font-bold text-slate-700 dark:text-slate-300">◎ 注意事項：</div>
        <div>一、參加職業訓練班，應於預定開始訓練日之七個工作日前，向榮服處申請備案，經榮服處同意備案者，於完成訓練翌日起算六個月內就業或完成訓練時已在職，且仍在就業中，得申請訓練費用補助。</div>
        <div>二、職業訓練課程以輔導會公告之職業訓練班次為限。</div>
        <div>三、結訓後，申請訓練費用補助檢附之收據或發票、結訓證明等文件，其開立機關(構)須與本表所載訓練機關(構)一致。</div>
      </div>
    </FormWrapper>
  );
};

// ─── 附件二：補助金申請表（甲表 — 未逾上限）────────────────────────────────
const Form補助: React.FC = () => (
  <FormWrapper>
    <FormHeader
      agency="國軍退除役官兵輔導委員會 ○○ 榮民服務處"
      title="退除役官兵職業訓練補助申請表－甲表（申請未逾補助總額度上限）"
      note="依據「國軍退除役官兵參加職業訓練補助辦法」第七條規定辦理"
    />

    <SectionLabel label="壹、申請資訊" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0">
      {/* 身分別 */}
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 9fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">身分別</div>
        <div className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300">□ 第一類退除役官兵　□ 第二類退除役官兵</div>
      </div>

      {/* 姓名 + 身分證 */}
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 3fr 3fr 3fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">姓名</div>
        <div className="px-3 py-2 text-xs border-r border-slate-800 dark:border-slate-300 text-slate-400 font-mono">〔請填寫〕</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">國民身分證統一編號</div>
        <div className="px-3 py-2 text-xs text-slate-400 font-mono">A123456789</div>
      </div>

      <Row2Col label="訓練機關（構）" value="〔填寫完整機構名稱〕" />

      {/* 聯絡方式 */}
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 9fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">聯絡方式</div>
        <div className="px-3 py-2 text-xs text-slate-500 space-y-0.5">
          <div>通訊地址：___________________________</div>
          <div>電話：_________　行動電話：_________　電子郵址：_________</div>
        </div>
      </div>

      <Row2Col label="課程名稱" value="〔填寫課程正式名稱〕" />

      {/* 開/結訓 */}
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 3fr 3fr 3fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">開訓日期</div>
        <div className="px-3 py-2 text-xs border-r border-slate-800 dark:border-slate-300 font-mono text-slate-400">　年　月　日</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">結訓日期</div>
        <div className="px-3 py-2 text-xs font-mono text-slate-400">　年　月　日</div>
      </div>

      {/* 繳費 + 申請金額 */}
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 3fr 3fr 3fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">繳費金額</div>
        <div className="px-3 py-2 text-xs border-r border-slate-800 dark:border-slate-300 font-bold text-slate-700 dark:text-slate-300">新臺幣________ 元</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">申請補助金額</div>
        <div className="px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">新臺幣________ 元</div>
      </div>
    </div>

    {/* 應檢附資料 */}
    <SectionLabel label="貳、應檢附資料（請勾選）" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-3 space-y-2">
      <CheckItem text="□ 本人國內金融機構存摺封面影本。" />
      <CheckItem text="□ 繳費收據或發票正本（訓練機構開立）。" />
      <CheckItem text="□ 結訓證明文件影本（訓練機構開立，且須載明職業訓練法施行細則第四條所定各項資訊）。" />
      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">□ 職業保險證明：</div>
      <div className="pl-4 space-y-1">
        <CheckItem text="□ 在保之相關職業保險證明影本。" />
        <CheckItem text="□ 投保職業工會者並檢附在職證明正本。" />
      </div>
    </div>

    {/* 切結 */}
    <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-3 space-y-3">
      <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        本項補助申請，本人已詳閱相關規定，且依規定辦理，並簽名確認負責，如有不實，同意繳回補助款項並依法處理。
      </p>
      <div className="flex flex-wrap justify-between items-end gap-4 border-t border-dashed border-slate-300 pt-3">
        <div className="text-xs">申請人簽名：<span className="inline-block border-b border-slate-800 w-32 ml-1">&nbsp;</span></div>
        <div className="text-xs font-mono">日期：　年　月　日</div>
      </div>
    </div>

    {/* 榮服處受理欄 */}
    <SectionLabel label="參、榮民服務處受理欄" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-3 text-xs space-y-2">
      <div>受理日期：　年　月　日　　受理人員：___________</div>
      <div className="space-y-1">
        <div>審核結果：</div>
        <div className="pl-4 space-y-1">
          <div>□ 符合補助：補助新臺幣________ 元。</div>
          <div>□ 不予補助：</div>
          <div className="pl-4 space-y-1">
            <div>□ 有本辦法第七條第二項不能補正或屆期未補正之情形。</div>
            <div>□ 有本辦法第九條第一項第　款之情形：（請敘明）_______________</div>
            <div>□ 其他：_______________</div>
          </div>
        </div>
      </div>
    </div>

    {/* 蓋章欄 */}
    <SectionLabel label="肆、審查蓋章欄" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0">
      <StampBox columns={['承辦人蓋章', '業務主管蓋章', '複審會計', '機關首長（或其授權人員）']} />
    </div>

    <div className="border-t-2 border-slate-800 dark:border-slate-300 px-4 py-2 bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-500 dark:text-slate-400 font-mono text-right">
      中華民國　年　月　日
    </div>
  </FormWrapper>
);

// ─── 附件三：補助金申請表（乙表 — 逾上限全額）──────────────────────────────
const Form全額: React.FC = () => (
  <FormWrapper>
    <FormHeader
      agency="國軍退除役官兵輔導委員會 ○○ 榮民服務處"
      title="退除役官兵職業訓練補助申請表－乙表（申請逾補助總額度上限金額）"
      note="依據「國軍退除役官兵參加職業訓練補助辦法」第八條規定辦理"
    />

    <SectionLabel label="壹、申請資訊" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0">
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 9fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">身分別</div>
        <div className="px-3 py-2 text-xs text-slate-700 dark:text-slate-300">□ 第一類退除役官兵　□ 第二類退除役官兵</div>
      </div>
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 3fr 3fr 3fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">姓名</div>
        <div className="px-3 py-2 text-xs border-r border-slate-800 dark:border-slate-300 text-slate-400 font-mono">〔請填寫〕</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">國民身分證統一編號</div>
        <div className="px-3 py-2 text-xs text-slate-400 font-mono">A123456789</div>
      </div>
      <Row2Col label="訓練機關（構）" value="〔填寫完整機構名稱〕" />
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 9fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">聯絡方式</div>
        <div className="px-3 py-2 text-xs text-slate-500 space-y-0.5">
          <div>通訊地址：___________________________</div>
          <div>電話：_________　行動電話：_________　電子郵址：_________</div>
        </div>
      </div>
      <Row2Col label="課程名稱" value="〔填寫課程正式名稱〕" />
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 3fr 3fr 3fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">開訓日期</div>
        <div className="px-3 py-2 text-xs border-r border-slate-800 dark:border-slate-300 font-mono text-slate-400">　年　月　日</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">結訓日期</div>
        <div className="px-3 py-2 text-xs font-mono text-slate-400">　年　月　日</div>
      </div>
    </div>

    {/* 就業現況 */}
    <SectionLabel label="貳、就業現況（申請全額補助者須填寫）" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0">
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 3fr 3fr 3fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">任職單位</div>
        <div className="px-3 py-2 text-xs border-r border-slate-800 dark:border-slate-300 text-slate-400">〔就業機構全名〕</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">到職日期</div>
        <div className="px-3 py-2 text-xs font-mono text-slate-400">　年　月　日</div>
      </div>
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 3fr 3fr 3fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">繳費金額</div>
        <div className="px-3 py-2 text-xs border-r border-slate-800 dark:border-slate-300 font-bold text-slate-700 dark:text-slate-300">新臺幣________ 元</div>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">申請補助金額</div>
        <div className="px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">新臺幣________ 元</div>
      </div>
      <div className="grid border-b border-slate-800 dark:border-slate-300" style={{ gridTemplateColumns: '3fr 9fr' }}>
        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold border-r border-slate-800 dark:border-slate-300">部門／職稱</div>
        <div className="px-3 py-2 text-xs text-slate-400">部門：____________　職稱：____________</div>
      </div>
    </div>

    {/* 應檢附資料 */}
    <SectionLabel label="參、應檢附資料（請勾選）" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-3 space-y-1.5">
      <CheckItem text="□ 繳費收據或發票正本（訓練機構開立）。" />
      <CheckItem text="□ 結訓證明文件影本（訓練機構開立，且須載明職業訓練法施行細則第四條所定各項資訊）。" />
      <CheckItem text="□ 實際訓練之課程表。" />
      <CheckItem text="□ 本人國內金融機構存摺封面影本。" />
      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">□ 職業保險證明：</div>
      <div className="pl-4 space-y-1">
        <CheckItem text="□ 在保之相關職業保險證明影本。" />
        <CheckItem text="□ 投保職業工會者並附在職證明正本。" />
      </div>
    </div>

    {/* 訓後佐證 */}
    <SectionLabel label="肆、訓後所從事行（職）業與職業訓練相關之佐證資料（請勾選身分及資料項目）" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-3 text-xs space-y-1.5">
      <div className="font-semibold text-slate-700 dark:text-slate-300">□ 受僱者：</div>
      <div className="pl-4 space-y-1">
        <div className="text-slate-600 dark:text-slate-400">□ 就業機構商工登記資料。</div>
        <div className="text-slate-600 dark:text-slate-400">□ 在職證明：載明工作部門、職務。</div>
      </div>
      <div className="font-semibold text-slate-700 dark:text-slate-300">□ 雇主或自營作業者：</div>
      <div className="pl-4">
        <div className="text-slate-600 dark:text-slate-400">□ 商工登記資料。</div>
      </div>
      <div className="text-amber-700 dark:text-amber-400 font-semibold">□ 參加農業相關訓練，且目前投保農民健康保險或農民職業災害保險者：免附。</div>
    </div>

    {/* 切結 */}
    <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-3 space-y-3">
      <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
        本項補助申請，本人已詳閱相關規定，且依規定辦理，並簽名確認負責，如有不實，同意繳回補助款項並依法處理。
      </p>
      <div className="flex flex-wrap justify-between items-end gap-4 border-t border-dashed border-slate-300 pt-3">
        <div className="text-xs">申請人簽名：<span className="inline-block border-b border-slate-800 w-32 ml-1">&nbsp;</span></div>
        <div className="text-xs font-mono">日期：　年　月　日</div>
      </div>
    </div>

    {/* 榮服處受理欄 */}
    <SectionLabel label="伍、榮民服務處受理欄" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-4 py-3 text-xs space-y-2">
      <div>受理日期：　年　月　日　　受理人員：___________</div>
      <div className="space-y-1">
        <div>審核結果：</div>
        <div className="pl-4 space-y-1">
          <div>□ 符合全額補助：補助新臺幣________ 元。</div>
          <div>□ 不符合全額補助，改於補助總額度內補助新臺幣________ 元。</div>
          <div>□ 不予補助：</div>
          <div className="pl-4 space-y-1">
            <div>□ 有本辦法第八條第三項不能補正或屆期未補正之情形。</div>
            <div>□ 有本辦法第九條第一項第　款之情形：（請敘明）_______________</div>
            <div>□ 其他：_______________</div>
          </div>
        </div>
      </div>
    </div>

    {/* 蓋章欄 */}
    <SectionLabel label="陸、審查蓋章欄" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0">
      <StampBox columns={['承辦人蓋章', '業務主管蓋章', '複審會計', '機關首長（或其授權人員）']} />
    </div>

    <div className="border-t-2 border-slate-800 dark:border-slate-300 px-4 py-2 bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-500 dark:text-slate-400 font-mono text-right">
      中華民國　年　月　日
    </div>
  </FormWrapper>
);

// ─── 眷屬切結書 ───────────────────────────────────────────────────────────────
const Form切結: React.FC = () => (
  <FormWrapper>
    <FormHeader
      agency="國軍退除役官兵輔導委員會"
      title="退除役官兵眷屬參加職業訓練補助切結書"
    />

    <div className="px-6 py-5 space-y-5 text-xs leading-relaxed">
      <div className="space-y-1">
        <p className="font-bold text-sm">立切結書人（退除役官兵本人）：</p>
        <div className="flex flex-wrap gap-4">
          <span>姓名：<span className="border-b border-slate-800 inline-block w-20">&nbsp;</span></span>
          <span>身分證字號：<span className="border-b border-slate-800 inline-block w-28 font-mono">&nbsp;</span></span>
        </div>
      </div>

      <p className="text-slate-700 dark:text-slate-300 leading-loose">
        茲同意本人眷屬（姓名：<span className="border-b border-slate-800 inline-block w-16">&nbsp;</span>，關係：□ 配偶　□ 子女）參加輔導會核認之職業訓練課程（課程名稱：<span className="border-b border-slate-800 inline-block w-28">&nbsp;</span>），並依「退除役官兵眷屬參加職業訓練補助實施計畫」規定申請訓練費用補助。
      </p>

      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded space-y-2">
        <div className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          具結同意事項：
        </div>
        <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
          眷屬獲核付之職業訓練補助金額與次數，將完全合併計入退除役官兵本人之個人職業訓練補助總額度（第一類：12 萬元／第二類：8 萬元）及每年 2 次上限內計算，絕無異議。
        </p>
      </div>

      <div className="border-t-2 border-slate-800 dark:border-slate-300 pt-5 flex flex-wrap justify-between items-end gap-6">
        <div className="space-y-3">
          <div className="text-sm">退除役官兵（立切結書人）簽章：<span className="border-b border-slate-800 inline-block w-24 ml-1">&nbsp;</span></div>
          <div className="text-sm">眷屬本人簽章：<span className="border-b border-slate-800 inline-block w-24 ml-1">&nbsp;</span></div>
        </div>
        <div className="font-mono text-sm">中華民國　年　月　日</div>
      </div>
    </div>
  </FormWrapper>
);

// ─── 通用官方表格 ──────────────────────────────────────────────────────────────
const FormGeneric: React.FC<{ rawTitle?: string; rawContent?: string }> = ({ rawTitle, rawContent }) => (
  <FormWrapper>
    <FormHeader
      agency="國軍退除役官兵輔導委員會 官方核發申辦表格"
      title={rawTitle || '官方指定申辦表單與檢附文件明細'}
    />

    <SectionLabel label="表單內文與欄位應載明事項" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0 px-5 py-4">
      <div className="whitespace-pre-wrap text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
        {rawContent || '（本附件暫無結構化內容，請參閱原始條文。）'}
      </div>
    </div>

    <SectionLabel label="機關首長審查與決行蓋章欄" />
    <div className="border border-slate-800 dark:border-slate-300 border-t-0">
      <StampBox columns={['承辦人簽章', '業務主管簽章', '機關首長決行章']} />
    </div>
  </FormWrapper>
);

// ─── Main Export ──────────────────────────────────────────────────────────────
export const OfficialFormContainer: React.FC<OfficialFormContainerProps> = ({
  formType,
  rawTitle,
  rawContent,
}) => {
  switch (formType) {
    case 'training_备案':
      return <Form備案 />;
    case 'training_補助':
      return <Form補助 />;
    case 'training_全額':
      return <Form全額 />;
    case 'family_切結':
      return <Form切結 />;
    default:
      return <FormGeneric rawTitle={rawTitle} rawContent={rawContent} />;
  }
};
