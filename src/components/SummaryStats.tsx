import React from 'react';
import { ProductItem } from '../types';
import { getProjectSummaryStats } from '../utils/calculations';
import { Boxes, PackageCheck, Weight, Container, DollarSign, Layers } from 'lucide-react';

interface SummaryStatsProps {
  products: ProductItem[];
  currency?: string;
  exchangeRateUsdToCny?: number;
  enableExchangeRate?: boolean;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ 
  products, 
  currency = 'RMB (¥)',
  exchangeRateUsdToCny = 7.25,
  enableExchangeRate = true,
}) => {
  const stats = getProjectSummaryStats(products);
  const isRmb = currency.includes('RMB') || currency.includes('¥') || currency.includes('CNY');
  
  // If price entered in table is in RMB:
  // Primary value is in RMB. Converted value is in USD.
  // If price entered is in USD:
  // Primary value is in USD. Converted value is in RMB.
  const primarySymbol = isRmb ? '¥' : '$';
  const convertedValue = isRmb
    ? (exchangeRateUsdToCny > 0 ? stats.totalEstimatedValueFob / exchangeRateUsdToCny : 0)
    : stats.totalEstimatedValueFob * exchangeRateUsdToCny;
  const convertedSymbol = isRmb ? '$' : '¥';
  const convertedCurrencyCode = isRmb ? 'USD' : 'RMB';

  return (
    <div id="summary-stats-bar" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4">
      {/* 1. Items */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Products</span>
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-bold text-slate-900">{stats.totalItems}</span>
          <span className="text-[10px] sm:text-xs text-slate-400">SKUs</span>
        </div>
      </div>

      {/* 2. Total Target PCS */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Target Qty</span>
          <PackageCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-bold text-slate-900">
            {stats.totalTargetQty.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400">PCS</span>
        </div>
      </div>

      {/* 3. Estimated Cartons */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Cartons</span>
          <Boxes className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-bold text-slate-900">
            {stats.totalEstimatedCartons.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400">CTNS</span>
        </div>
      </div>

      {/* 4. Volume (CBM) */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Total Volume</span>
          <Container className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-bold text-slate-900">{stats.totalCbm}</span>
          <span className="text-[10px] sm:text-xs text-slate-400">CBM (m³)</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
          <span>20'GP: {stats.c20gpPercent}%</span>
          <span>•</span>
          <span>40'HQ: {stats.c40hqPercent}%</span>
        </div>
      </div>

      {/* 5. Total Gross Weight */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Gross Weight</span>
          <Weight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-bold text-slate-900">
            {stats.totalWeightKg.toLocaleString()}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400">KG</span>
        </div>
      </div>

      {/* 6. Estimated FOB Value */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1 lg:col-span-1">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">Est. FOB Total</span>
          <span className="text-xs font-bold text-emerald-600 font-mono">{primarySymbol}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg sm:text-xl font-bold text-slate-900">
            {primarySymbol}{stats.totalEstimatedValueFob.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400">{currency}</span>
        </div>
        {enableExchangeRate && stats.totalEstimatedValueFob > 0 && (
          <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 flex-wrap">
            <span>≈ {convertedSymbol}{convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {convertedCurrencyCode}</span>
            <span className="text-emerald-500 font-normal">(@{exchangeRateUsdToCny})</span>
          </div>
        )}
      </div>
    </div>
  );
};
