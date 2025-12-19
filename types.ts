export interface DetailedPageContent {
  prologue: string;
  points: { title: string; content: string }[];
  spec: string;
  faq: { q: string; a: string }[];
}

export interface TrademarkCheck {
  status: '안전' | '주의' | '위험';
  riskLevel: number; // 0-100 (High is risky)
  brandDetected: string;
  riskReason: string; // Explanation (e.g., "Generic term", "Parallel import allowed but receipt needed")
}

export interface ProductRecommendation {
  productName: string;
  englishKeyword: string;
  category: string;
  reason: string;
  difficulty: '하' | '중' | '상';
  searchVolume: number;
  competitionLevel: number;
  targetAudience: string;
  salesTip: string;
  // Pricing fields
  naverAveragePrice: number;
  amazonSourcingPrice: number;
  suggestedSellingPrice: number;
  estimatedProfit: number;
  // Marketing fields
  seoTitle: string; // Optimized title for Naver Smart Store
  hashtags: string[]; // 5-7 keywords
  marketingCopy: string; // One-line hook
  // Detailed Page Content
  detailedPage: DetailedPageContent;
  // Trademark Check
  trademarkCheck: TrademarkCheck;
}

export interface MonthlyAnalysis {
  month: number;
  summary: string;
  recommendations: ProductRecommendation[];
}

export enum AppState {
  HOME,
  ANALYZING,
  RESULTS
}

export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const CATEGORIES = [
  "전체",
  "디지털/PC/가전",
  "스포츠/레저/캠핑",
  "패션의류/잡화",
  "홈/인테리어/주방",
  "공구/취미/자동차",
];