import { ProductItem } from '../types';

export function calculateCartons(targetQty?: number, unitsPerCarton?: number): number {
  if (!targetQty || !unitsPerCarton || unitsPerCarton <= 0) return 0;
  return Math.ceil(targetQty / unitsPerCarton);
}

export function calculateSingleCbm(length?: number, width?: number, height?: number): number {
  if (!length || !width || !height) return 0;
  // (L * W * H in cm) / 1,000,000 => CBM
  return parseFloat(((length * width * height) / 1000000).toFixed(4));
}

export function calculateTotalCbm(
  targetQty?: number,
  unitsPerCarton?: number,
  cartonsVal?: number,
  length?: number,
  width?: number,
  height?: number
): number {
  const singleCbm = calculateSingleCbm(length, width, height);
  if (singleCbm <= 0) return 0;

  const totalCartons = cartonsVal && cartonsVal > 0 
    ? cartonsVal 
    : calculateCartons(targetQty, unitsPerCarton);

  if (totalCartons <= 0) return 0;
  return parseFloat((singleCbm * totalCartons).toFixed(3));
}

export function calculateTotalGrossWeight(
  targetQty?: number,
  unitsPerCarton?: number,
  cartonsVal?: number,
  boxWeight?: number
): number {
  if (!boxWeight || boxWeight <= 0) return 0;
  const totalCartons = cartonsVal && cartonsVal > 0 
    ? cartonsVal 
    : calculateCartons(targetQty, unitsPerCarton);
  if (totalCartons <= 0) return 0;
  return parseFloat((totalCartons * boxWeight).toFixed(1));
}

export function getProjectSummaryStats(products: ProductItem[]) {
  let totalTargetQty = 0;
  let totalEstimatedCartons = 0;
  let totalCbm = 0;
  let totalWeightKg = 0;
  let totalEstimatedValueFob = 0;

  products.forEach(p => {
    const qty = Number(p.targetQty) || 0;
    const unitsPerCtn = Number(p.values.unitsPerCarton) || 0;
    const userCartons = Number(p.values.cartons);
    const cartons = userCartons > 0 ? userCartons : calculateCartons(qty, unitsPerCtn);
    const boxLength = Number(p.values.boxLength) || 0;
    const boxWidth = Number(p.values.boxWidth) || 0;
    const boxHeight = Number(p.values.boxHeight) || 0;
    const boxWeight = Number(p.values.boxWeight) || 0;
    const fob = Number(p.values.fobPrice) || 0;

    totalTargetQty += qty;
    totalEstimatedCartons += cartons;
    totalCbm += calculateTotalCbm(qty, unitsPerCtn, userCartons, boxLength, boxWidth, boxHeight);
    totalWeightKg += calculateTotalGrossWeight(qty, unitsPerCtn, userCartons, boxWeight);
    totalEstimatedValueFob += qty * fob;
  });

  const c20gpPercent = Math.min(100, Math.round((totalCbm / 28) * 100));
  const c40hqPercent = Math.min(100, Math.round((totalCbm / 68) * 100));

  return {
    totalItems: products.length,
    totalTargetQty,
    totalEstimatedCartons,
    totalCbm: parseFloat(totalCbm.toFixed(2)),
    totalWeightKg: parseFloat(totalWeightKg.toFixed(1)),
    totalEstimatedValueFob: parseFloat(totalEstimatedValueFob.toFixed(2)),
    c20gpPercent,
    c40hqPercent,
  };
}
