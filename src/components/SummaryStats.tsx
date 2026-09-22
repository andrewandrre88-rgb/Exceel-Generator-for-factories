import React from 'react';
import { ProductItem } from '../types';
import { getProjectSummaryStats } from '../utils/calculations';
import { Boxes, PackageCheck, Weight, Container, DollarSign, Layers } from 'lucide-react';

interface SummaryStatsProps {
  products: ProductItem[];
  currency?: string;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ products, currency = 'USD' }) => {
  const stats = getProjectSummaryStats(products);

  return (
    <div id="summary-stats-bar" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
      {/* 1. Items */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Products</span>
          <Layers className="w-4 h-4 text-blue-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900">{stats.totalItems}</span>
          <span className="text-xs text-slate-400">SKUs</span>
        </div>
      </div>

      {/* 2. Total Target PCS */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Target Qty</span>
          <PackageCheck className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900">
            {stats.totalTargetQty.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">PCS</span>
        </div>
      </div>

      {/* 3. Estimated Cartons */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Cartons</span>
          <Boxes className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900">
            {stats.totalEstimatedCartons.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">CTNS</span>
        </div>
      </div>

      {/* 4. Volume (CBM) */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Total Volume</span>
          <Container className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900">{stats.totalCbm}</span>
          <span className="text-xs text-slate-400">CBM (m³)</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
          <span>20'GP: {stats.c20gpPercent}%</span>
          <span>•</span>
          <span>40'HQ: {stats.c40hqPercent}%</span>
        </div>
      </div>

      {/* 5. Total Gross Weight */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Gross Weight</span>
          <Weight className="w-4 h-4 text-rose-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900">
            {stats.totalWeightKg.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400">KG</span>
        </div>
      </div>

      {/* 6. Estimated FOB Value */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-500 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Est. FOB Total</span>
          <DollarSign className="w-4 h-4 text-teal-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-slate-900">
            ${stats.totalEstimatedValueFob.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-slate-400">{currency}</span>
        </div>
      </div>
    </div>
  );
};
