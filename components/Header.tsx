import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white p-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-lg">
          <ShoppingBag size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">나의 스마트 스토어 비서</h1>
          <p className="text-slate-300 text-sm mt-1">데이터로 찾는 대박 아이템</p>
        </div>
      </div>
    </header>
  );
};

export default Header;