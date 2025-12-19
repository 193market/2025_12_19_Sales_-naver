import React, { useState } from 'react';
import { ProductRecommendation } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, Lightbulb, ShoppingCart, Coins, Copy, Check, FileText, BarChart2, FileEdit, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface ResultCardProps {
  item: ProductRecommendation;
}

const ResultCard: React.FC<ResultCardProps> = ({ item }) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'marketing' | 'detail'>('analysis');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const chartData = [
    { name: '네이버검색', value: item.searchVolume, color: '#03C75A' }, // Naver Green
    { name: '경쟁강도', value: item.competitionLevel, color: '#f59e0b' }, // Amber
  ];

  const handleAmazonSearch = () => {
    const query = encodeURIComponent(item.englishKeyword || item.productName);
    window.open(`https://search.11st.co.kr/Search.tmall?kwd=${query}`, '_blank');
  };

  const handleNaverSearch = () => {
    const query = encodeURIComponent(item.productName);
    window.open(`https://search.shopping.naver.com/search/all?query=${query}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getDetailedPageText = () => {
    const { detailedPage } = item;
    return `[프롤로그]\n${detailedPage.prologue}\n\n` +
           `[핵심 포인트 3가지]\n${detailedPage.points.map((p, i) => `${i+1}. ${p.title}\n${p.content}`).join('\n\n')}\n\n` +
           `[제품 스펙]\n${detailedPage.spec}\n\n` +
           `[자주 묻는 질문 (FAQ)]\n${detailedPage.faq.map(f => `Q. ${f.q}\nA. ${f.a}`).join('\n\n')}`;
  };

  const renderTrademarkBadge = () => {
    const { status } = item.trademarkCheck;
    let bgColor, textColor, icon, label;

    switch (status) {
      case '안전':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        icon = <ShieldCheck size={16} />;
        label = '상표권 안전';
        break;
      case '주의':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        icon = <AlertTriangle size={16} />;
        label = '정품소명 주의';
        break;
      case '위험':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        icon = <ShieldAlert size={16} />;
        label = '상표권 위험';
        break;
      default:
        bgColor = 'bg-slate-100';
        textColor = 'text-slate-800';
        icon = <ShieldCheck size={16} />;
        label = '확인 필요';
    }

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${bgColor} ${textColor} border border-transparent`}>
        {icon}
        {label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
              {item.category}
            </span>
            {renderTrademarkBadge()}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {item.productName}
            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              {item.englishKeyword}
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
           <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold border ${
             item.difficulty === '하' ? 'bg-green-50 text-green-700 border-green-200' :
             item.difficulty === '중' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
             'bg-red-50 text-red-700 border-red-200'
           }`}>
             소싱난이도: {item.difficulty}
           </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'analysis' 
              ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
        >
          <BarChart2 size={18} />
          <span className="hidden sm:inline">분석/안전</span>
          <span className="sm:hidden">분석</span>
        </button>
        <button
          onClick={() => setActiveTab('marketing')}
          className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'marketing' 
              ? 'bg-white text-purple-600 border-b-2 border-purple-600' 
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
        >
          <FileText size={18} />
          <span className="hidden sm:inline">마케팅 (SEO)</span>
          <span className="sm:hidden">SEO</span>
        </button>
        <button
          onClick={() => setActiveTab('detail')}
          className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'detail' 
              ? 'bg-white text-green-600 border-b-2 border-green-600' 
              : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
        >
          <FileEdit size={18} />
          <span className="hidden sm:inline">상세페이지</span>
          <span className="sm:hidden">상세</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-grow">
        {activeTab === 'analysis' && (
          <div className="animate-fade-in">
             {/* Pricing Analysis */}
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Coins className="text-blue-600" size={24} />
                    <h4 className="text-lg font-bold text-slate-800">💰 예상 수익 분석</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                        <p className="text-xs text-slate-500 mb-1">네이버 시세</p>
                        <p className="text-base font-bold text-slate-700">{formatPrice(item.naverAveragePrice)}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                        <p className="text-xs text-slate-500 mb-1">11번가 소싱가</p>
                        <p className="text-base font-bold text-red-600">{formatPrice(item.amazonSourcingPrice)}</p>
                    </div>
                    <div className="bg-blue-600 p-3 rounded-xl shadow-lg text-center text-white relative overflow-hidden">
                         <div className="absolute inset-0 bg-white/10 skew-x-12 transform -translate-x-full animate-shimmer"></div>
                        <p className="text-xs text-blue-100 mb-1">예상 마진</p>
                        <p className="text-lg font-bold">+{formatPrice(item.estimatedProfit)}</p>
                    </div>
                </div>
            </div>

            {/* Trademark Warning Section */}
            {item.trademarkCheck.status !== '안전' && (
              <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${
                item.trademarkCheck.status === '위험' 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
              }`}>
                <div className="mt-1 shrink-0">
                  {item.trademarkCheck.status === '위험' ? <ShieldAlert size={20}/> : <AlertTriangle size={20}/>}
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">
                    {item.trademarkCheck.status === '위험' ? '⛔️ 상표권 침해 위험' : '⚠️ 정품 소명 준비 필요'}
                  </h4>
                  <p className="text-sm opacity-90">{item.trademarkCheck.riskReason}</p>
                  <p className="text-xs mt-2 opacity-75 font-medium">* 11번가(아마존) 구매 영수증을 반드시 보관하세요.</p>
                </div>
              </div>
            )}
            
            {/* Safe Trademark Section */}
            {item.trademarkCheck.status === '안전' && (
               <div className="p-4 rounded-xl border bg-green-50 border-green-200 text-green-800 mb-6 flex items-start gap-3">
                  <div className="mt-1 shrink-0"><ShieldCheck size={20}/></div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">✅ 상표권 안전 키워드</h4>
                    <p className="text-sm opacity-90">{item.trademarkCheck.riskReason}</p>
                  </div>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-slate-600 mb-1 font-medium">
                    <TrendingUp size={20} className="text-blue-600" />
                    <span>추천 이유</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed bg-white border border-slate-100 p-3 rounded-lg text-sm">
                    {item.reason}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-600 mb-1 font-medium">
                    <Lightbulb size={20} className="text-amber-500" />
                    <span>소싱 팁</span>
                  </div>
                  <p className="text-slate-800 bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400 text-sm">
                    {item.salesTip}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center bg-slate-50 rounded-xl p-4">
                 <h4 className="text-center font-bold text-slate-600 mb-2 text-sm">데이터 지표</h4>
                 <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={70} tick={{fontSize: 12, fill: '#475569', fontWeight: 'bold'}} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="animate-fade-in space-y-6">
             <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-2 flex items-center justify-between">
                    <span>👑 네이버 노출용 상품명 (SEO)</span>
                    <button 
                        onClick={() => copyToClipboard(item.seoTitle, 'title')}
                        className="text-xs bg-white border border-purple-200 px-2 py-1 rounded text-purple-700 hover:bg-purple-100 flex items-center gap-1"
                    >
                        {copiedField === 'title' ? <Check size={12}/> : <Copy size={12}/>}
                        {copiedField === 'title' ? '복사완료' : '복사하기'}
                    </button>
                </h4>
                <p className="text-lg font-bold text-slate-800 bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
                    {item.seoTitle}
                </p>
                <p className="text-xs text-purple-600 mt-2">
                   * 브랜드명, 모델명, 핵심 키워드가 모두 포함된 최적의 제목입니다.
                </p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center justify-between">
                        <span>🏷️ 필수 해시태그</span>
                        <button 
                            onClick={() => copyToClipboard(item.hashtags.map(t => `#${t}`).join(' '), 'tags')}
                            className="text-xs bg-white border border-slate-300 px-2 py-1 rounded text-slate-600 hover:bg-slate-100 flex items-center gap-1"
                        >
                            {copiedField === 'tags' ? <Check size={12}/> : <Copy size={12}/>} 복사
                        </button>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {item.hashtags.map((tag, i) => (
                            <span key={i} className="text-sm bg-white px-2 py-1 rounded text-slate-600 border border-slate-200">
                                #{tag}
                            </span>
                        ))}
                    </div>
                 </div>

                 <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center justify-between">
                        <span>🔥 상세페이지 후킹 멘트</span>
                        <button 
                             onClick={() => copyToClipboard(item.marketingCopy, 'copy')}
                             className="text-xs bg-white border border-amber-200 px-2 py-1 rounded text-amber-700 hover:bg-amber-100 flex items-center gap-1"
                        >
                             {copiedField === 'copy' ? <Check size={12}/> : <Copy size={12}/>} 복사
                        </button>
                    </h4>
                    <p className="text-slate-800 italic font-medium bg-white p-3 rounded-lg border border-amber-100">
                        "{item.marketingCopy}"
                    </p>
                 </div>
             </div>
          </div>
        )}

        {activeTab === 'detail' && (
          <div className="animate-fade-in space-y-6">
             <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-green-800 text-lg flex items-center gap-2">
                   <FileEdit size={20} />
                   AI 상세페이지 초안
                </h4>
                <button 
                     onClick={() => copyToClipboard(getDetailedPageText(), 'detailFull')}
                     className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-sm"
                >
                     {copiedField === 'detailFull' ? <Check size={16}/> : <Copy size={16}/>} 
                     {copiedField === 'detailFull' ? '전체 복사완료' : '전체 복사하기'}
                </button>
             </div>
             
             <div className="space-y-4 text-slate-800">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <h5 className="font-bold text-slate-600 mb-2 text-sm">01. 프롤로그</h5>
                   <p className="whitespace-pre-wrap leading-relaxed">{item.detailedPage.prologue}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <h5 className="font-bold text-slate-600 mb-2 text-sm">02. 핵심 포인트</h5>
                   <ul className="space-y-3">
                      {item.detailedPage.points.map((p, i) => (
                        <li key={i} className="flex gap-2">
                           <span className="bg-green-100 text-green-700 font-bold rounded w-6 h-6 flex items-center justify-center shrink-0 text-sm">{i+1}</span>
                           <div>
                              <strong className="block text-slate-900">{p.title}</strong>
                              <span className="text-slate-600 text-sm">{p.content}</span>
                           </div>
                        </li>
                      ))}
                   </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <h5 className="font-bold text-slate-600 mb-2 text-sm">03. 스펙 요약</h5>
                   <p className="whitespace-pre-wrap leading-relaxed text-sm">{item.detailedPage.spec}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <h5 className="font-bold text-slate-600 mb-2 text-sm">04. 자주 묻는 질문 (FAQ)</h5>
                   <div className="space-y-3">
                      {item.detailedPage.faq.map((f, i) => (
                        <div key={i} className="text-sm">
                           <p className="font-bold text-slate-800">Q. {f.q}</p>
                           <p className="text-slate-600 mt-1 pl-4 border-l-2 border-slate-300">A. {f.a}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
             <p className="text-center text-xs text-slate-400 mt-4">
                * 위 내용은 AI가 생성한 초안입니다. 실제 제품 정보와 다를 수 있으니 검토 후 사용하세요.
             </p>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
        <button 
            onClick={handleNaverSearch}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 py-3 rounded-xl font-bold transition-colors"
        >
            <SearchIcon />
            네이버 시세
        </button>
        <button 
            onClick={handleAmazonSearch}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-colors shadow-sm"
        >
            <ShoppingCart size={20} />
            11번가 구매하기
        </button>
      </div>
    </div>
  );
};

// Simple Search Icon Component for local use
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <span className="font-bold text-[10px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">N</span>
    </svg>
)

export default ResultCard;