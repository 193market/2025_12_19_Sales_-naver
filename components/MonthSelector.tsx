import React from 'react';
import { MONTHS } from '../types';

interface MonthSelectorProps {
  selectedMonth: number | null;
  onSelect: (month: number) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onSelect }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
      {MONTHS.map((m) => (
        <button
          key={m}
          onClick={() => onSelect(m)}
          className={`
            h-20 text-xl font-bold rounded-2xl border-2 transition-all duration-200
            flex items-center justify-center shadow-sm
            ${selectedMonth === m 
              ? 'bg-blue-600 border-blue-600 text-white scale-105 shadow-lg' 
              : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
            }
          `}
        >
          {m}월
        </button>
      ))}
    </div>
  );
};

export default MonthSelector;