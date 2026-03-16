'use client';

import { type Symbol, SYMBOL_COLORS, SYMBOL_NAMES } from '@/types/pipeline';

const SYMBOLS: Symbol[] = ['AAPL', 'MSFT', 'JPM', 'GS'];

interface SymbolPickerProps {
  selected: Symbol;
  onSelect: (s: Symbol) => void;
}

export default function SymbolPicker({ selected, onSelect }: SymbolPickerProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-slate-800/60 p-1" role="tablist" aria-label="Stock symbol selector">
      {SYMBOLS.map((sym) => {
        const isActive = sym === selected;
        const color = SYMBOL_COLORS[sym];

        return (
          <button
            key={sym}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(sym)}
            className={`
              relative flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium
              transition-all duration-200 focus:outline-none focus-visible:ring-2
              focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              ${isActive
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }
            `}
          >
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="font-semibold">{sym}</span>
            <span className="hidden sm:inline text-xs text-slate-400">
              {SYMBOL_NAMES[sym]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
