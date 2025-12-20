import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MonthSelector from './components/MonthSelector';
import ResultCard from './components/ResultCard';
import { fetchMarketAnalysis } from './services/geminiService';
import { MonthlyAnalysis, CATEGORIES, AppState } from './types';
import { Search, Loader2, ArrowLeft, Info, CheckCircle2, Globe, ShieldCheck, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [analysisResult, setAnalysisResult] = useState<MonthlyAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Separate function for fetching data to reuse in both initial analyze and category switch
  const performAnalysis = async (month: number, category: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchMarketAnalysis(month, category);
      setAnalysisResult(data);
      setAppState(AppState.RESULTS);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      let errorMessage = "데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.";
      
      // 사용자에게 더 명확한 에러 메시지 제공
      // 'API 키' 관련 에러라면, 서비스에서 던진 상세 메시지를 그대로 보여줍니다.
      if (err.message && (err.message.includes("API 키") || err.message.includes("API Key") || err.message.includes("환경변수"))) {
        errorMessage = err.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setAppState(AppState.HOME); // 에러 발생 시 홈으로 돌아가서 에러 메시지 표시
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!selectedMonth) return;
    setAppState(AppState.ANALYZING);
    await performAnalysis(selectedMonth, selectedCategory);
  }, [selectedMonth, selectedCategory]);

  const handleCategorySwitchInResults = async (category: string) => {
    if (!selectedMonth || isLoading || category === selectedCategory) return;
    setSelectedCategory(category);
    // Reset result temporarily to show local loading state or just keep old and show spinner overlay?
    // Let's clear result to show a clean loading skeleton or message
    setAnalysisResult(null); 
    await performAnalysis(selectedMonth, category);
  };

  const handleReset = () => {
    setAppState(AppState.HOME);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-8">
        {/* State: HOME - Selection Screen */}
        {appState === AppState.HOME && (
          <div className="space-y-8 animate-fade-in">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                11번가 아마존에서 무엇을 소싱할까요?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                복잡한 서류가 필요한 <strong className="text-red-500">식품/화장품은 제외</strong>하고,<br/>
                누구나 쉽게 팔 수 있는 <strong className="text-blue-600">안전한 제품</strong>만 추천해드립니다.
              </p>
              
              <div className="text-left mb-4 px-2">
                 <label className="text-lg font-bold text-slate-700 block mb-2">1. 판매 준비 월 선택</label>
              </div>
              <MonthSelector selectedMonth={selectedMonth} onSelect={setSelectedMonth} />

              <div className="text-left mb-6 px-2">
                 <label className="text-lg font-bold text-slate-700 block mb-2">2. 카테고리 (인증 불필요 품목 위주)</label>
                 <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-lg border transition-colors ${
                                selectedCategory === cat 
                                ? 'bg-slate-800 text-white border-slate-800 font-bold'
                                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                 </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedMonth || isLoading}
                  className={`
                    w-full sm:w-auto px-12 py-5 rounded-full text-2xl font-bold flex items-center justify-center gap-3 mx-auto transition-all
                    ${!selectedMonth 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1'
                    }
                  `}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={28} />
                      분석중...
                    </>
                  ) : (
                    <>
                      <Search size={28} />
                      안전한 소싱 아이템 찾기
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                  <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-base font-medium flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-2 mb-1 font-bold">
                        <Info size={24} /> 오류 발생
                      </div>
                      <div className="whitespace-pre-wrap">{error}</div>
                  </div>
              )}
            </section>
            
            {/* Info Section for Beginners */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
               <div className="flex items-center gap-2 mb-3">
                  <div className="bg-green-100 p-2 rounded-full shadow-sm text-green-700">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">사장님을 위한 '안전 소싱' 원칙</h3>
               </div>
               
               <div className="space-y-4 text-slate-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-600 shrink-0 mt-1" size={20} />
                    <div>
                      <strong className="block text-lg mb-1">먹고 바르는 건 NO!</strong>
                      <p className="leading-relaxed">
                        영양제, 간식, 화장품은 수입식품법/화장품법 등 까다로운 인증 절차가 필요합니다. 초보 사장님을 위해 이런 제품은 <strong>자동으로 제외</strong>했습니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-blue-600 shrink-0 mt-1" size={20} />
                    <div>
                      <strong className="block text-lg mb-1">공산품 위주로 시작하세요</strong>
                      <p className="leading-relaxed">
                        패션 잡화(모자, 가방), PC 부품, 캠핑 용품, 공구 등은 비교적 통관이 쉽고 바로 판매가 가능합니다. 
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* State: ANALYZING - Loading Screen */}
        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
             <div className="relative">
                <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white p-6 rounded-full shadow-lg">
                    <Loader2 size={64} className="text-red-500 animate-spin" />
                </div>
             </div>
             <h2 className="text-3xl font-bold text-slate-800 mt-8 mb-4">
                {selectedMonth}월 '안전 소싱' 아이템 발굴 중...
             </h2>
             <p className="text-xl text-slate-500 max-w-lg mx-auto leading-relaxed">
                통관 걱정 없는 제품 중에서<br/>
                네이버 검색량이 높고 아마존 가격이 좋은 물건을 찾고 있어요.
             </p>
          </div>
        )}

        {/* State: RESULTS - List Screen */}
        {appState === AppState.RESULTS && (
          <div className="animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-lg font-medium px-4 py-2 hover:bg-slate-100 rounded-lg order-2 sm:order-1"
                >
                    <ArrowLeft size={24} />
                    처음으로
                </button>
                <div className="text-right order-1 sm:order-2">
                    <span className="text-slate-500 text-lg">판매 목표 월</span>
                    <h2 className="text-3xl font-bold text-blue-700">{selectedMonth}월</h2>
                </div>
            </div>

            {/* Category Switcher in Results */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
               <div className="flex space-x-2 min-w-max p-1">
                 {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => handleCategorySwitchInResults(cat)}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                            selectedCategory === cat 
                            ? 'bg-slate-800 text-white shadow-md'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {cat === selectedCategory && <CheckCircle2 size={14} />}
                        {cat}
                    </button>
                 ))}
               </div>
            </div>

            {!analysisResult && isLoading ? (
                 <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
                    <p className="text-lg text-slate-500">{selectedCategory} 카테고리 분석 중...</p>
                 </div>
            ) : analysisResult ? (
              <>
                <div className="bg-gradient-to-r from-red-600 to-slate-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                       <Globe size={120} />
                    </div>
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-2 backdrop-blur-sm">
                            {selectedCategory}
                        </span>
                        <h3 className="text-2xl font-bold mb-3">🌏 글로벌 소싱 전략</h3>
                        <p className="text-lg leading-relaxed text-slate-100">
                            {analysisResult.summary}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-800 pl-2 border-l-4 border-red-500 flex items-center justify-between">
                        <span>추천 아이템 BEST {analysisResult.recommendations.length}</span>
                        <span className="text-sm font-normal text-slate-500 flex items-center gap-1">
                            <LayoutGrid size={16}/> {selectedCategory}
                        </span>
                    </h3>
                    {analysisResult.recommendations.map((item, idx) => (
                        <ResultCard key={idx} item={item} />
                    ))}
                </div>
              </>
            ) : null}

             {analysisResult && (
                 <div className="bg-slate-100 p-8 rounded-2xl text-center mt-12">
                    <h4 className="text-xl font-bold text-slate-800 mb-2">더 많은 제품이 궁금하신가요?</h4>
                    <p className="text-slate-600 text-lg mb-6">
                       11번가 아마존 메인 페이지에서<br/> 
                       <span className="text-red-600 font-bold">'실시간 베스트'</span> 탭을 확인해보는 것도 좋은 방법입니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                          onClick={handleReset}
                          className="bg-white border border-slate-300 text-slate-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-slate-50 transition-colors"
                        >
                            다른 달 검색하기
                        </button>
                        <a 
                          href="https://www.11st.co.kr/amazon/main"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-700 transition-colors shadow-lg flex items-center gap-2 justify-center"
                        >
                            11번가 아마존 바로가기 <Globe size={20}/>
                        </a>
                    </div>
                 </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;