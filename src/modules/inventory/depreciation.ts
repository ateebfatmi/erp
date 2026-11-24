/**
 * VidyaOS Inventory & Asset Management Engine
 * Straight-Line (SLM) & Written Down Value (WDV) Depreciation & Reorder Logic
 * Compliant with Indian Accounting Standard (Ind AS 16) & IT Rules Schedule II
 */

export type AssetCategory = 'IT_EQUIPMENT' | 'LAB_APPARATUS' | 'FURNITURE' | 'FLEET_VEHICLE' | 'STATIONERY';

export interface SchoolAsset {
  id: string;
  name: string;
  category: AssetCategory;
  purchaseDate: string; // ISO format YYYY-MM-DD
  purchaseCost: number;
  residualValue: number; // salvage value (typically 5% of cost)
  usefulLifeYears: number;
  depreciationMethod: 'SLM' | 'WDV';
  wdvRatePercent: number; // e.g. 40 for IT, 15 for Lab, 10 for Furniture, 30 for Fleet
  location: string;
}

export interface DepreciationYearSummary {
  yearIndex: number;
  financialYear: string;
  openingBookValue: number;
  depreciationAmount: number;
  closingBookValue: number;
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  avgDailyUsage: number;
  leadTimeDays: number;
  safetyStock: number;
  maxStockLevel: number;
  unitCostRupees: number;
}

export type StockHealthStatus = 'CRITICAL' | 'REORDER_NEEDED' | 'OPTIMAL' | 'OVERSTOCKED';

export interface ReorderAnalysis {
  itemId: string;
  itemName: string;
  currentStock: number;
  reorderPoint: number;
  healthStatus: StockHealthStatus;
  suggestedReorderQuantity: number;
  estimatedReorderCost: number;
  urgencyDaysRemaining: number;
}

/**
 * Standard Indian Statutory Depreciation Rates (Schedule II / IT Rules)
 */
export const STATUTORY_DEPRECIATION_RATES: Record<AssetCategory, { wdvRate: number; defaultLifeYears: number }> = {
  IT_EQUIPMENT: { wdvRate: 40, defaultLifeYears: 3 },
  LAB_APPARATUS: { wdvRate: 15, defaultLifeYears: 10 },
  FURNITURE: { wdvRate: 10, defaultLifeYears: 10 },
  FLEET_VEHICLE: { wdvRate: 30, defaultLifeYears: 8 },
  STATIONERY: { wdvRate: 0, defaultLifeYears: 1 }, // Consumables expensed immediately
};

/**
 * Computes multi-year depreciation schedule for a school fixed asset
 */
export function calculateDepreciationSchedule(
  asset: SchoolAsset,
  targetYears: number = 5
): DepreciationYearSummary[] {
  const schedule: DepreciationYearSummary[] = [];
  let currentBookValue = asset.purchaseCost;
  const startYear = new Date(asset.purchaseDate).getFullYear();

  for (let i = 1; i <= targetYears; i++) {
    const fyLabel = `FY ${startYear + i - 1}-${(startYear + i).toString().slice(-2)}`;
    let depAmount = 0;

    if (asset.depreciationMethod === 'SLM') {
      const annualSLM = (asset.purchaseCost - asset.residualValue) / asset.usefulLifeYears;
      depAmount = Math.min(annualSLM, Math.max(0, currentBookValue - asset.residualValue));
    } else {
      // WDV Method: Opening * Rate%
      depAmount = (currentBookValue * asset.wdvRatePercent) / 100;
      if (currentBookValue - depAmount < asset.residualValue) {
        depAmount = Math.max(0, currentBookValue - asset.residualValue);
      }
    }

    depAmount = Math.round(depAmount * 100) / 100;
    const closingValue = Math.max(asset.residualValue, Math.round((currentBookValue - depAmount) * 100) / 100);

    schedule.push({
      yearIndex: i,
      financialYear: fyLabel,
      openingBookValue: Math.round(currentBookValue * 100) / 100,
      depreciationAmount: depAmount,
      closingBookValue: closingValue,
    });

    currentBookValue = closingValue;
    if (currentBookValue <= asset.residualValue) {
      break;
    }
  }

  return schedule;
}

/**
 * Calculates current book value of an asset as of a specific evaluation date
 */
export function getCurrentBookValue(asset: SchoolAsset, evaluationDate: Date = new Date()): number {
  const purchase = new Date(asset.purchaseDate);
  const diffDays = Math.max(0, Math.floor((evaluationDate.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24)));
  const elapsedYears = diffDays / 365.25;

  if (elapsedYears <= 0) return asset.purchaseCost;

  if (asset.depreciationMethod === 'SLM') {
    const annualDep = (asset.purchaseCost - asset.residualValue) / asset.usefulLifeYears;
    const totalDep = annualDep * elapsedYears;
    return Math.max(asset.residualValue, Math.round((asset.purchaseCost - totalDep) * 100) / 100);
  } else {
    // WDV: Cost * (1 - r)^t
    const rateDecimal = asset.wdvRatePercent / 100;
    const currentVal = asset.purchaseCost * Math.pow(1 - rateDecimal, elapsedYears);
    return Math.max(asset.residualValue, Math.round(currentVal * 100) / 100);
  }
}

/**
 * Evaluates consumable stock items against Reorder Point (ROP) = (Daily Usage * Lead Time) + Safety Stock
 */
export function analyzeStockHealth(item: StockItem): ReorderAnalysis {
  const reorderPoint = item.avgDailyUsage * item.leadTimeDays + item.safetyStock;
  const daysRemaining = item.avgDailyUsage > 0 
    ? Math.floor(item.currentStock / item.avgDailyUsage) 
    : 999;

  let healthStatus: StockHealthStatus = 'OPTIMAL';
  if (item.currentStock <= item.safetyStock) {
    healthStatus = 'CRITICAL';
  } else if (item.currentStock <= reorderPoint) {
    healthStatus = 'REORDER_NEEDED';
  } else if (item.currentStock > item.maxStockLevel) {
    healthStatus = 'OVERSTOCKED';
  }

  const suggestedReorderQuantity = item.currentStock < reorderPoint 
    ? Math.max(0, item.maxStockLevel - item.currentStock) 
    : 0;

  const estimatedReorderCost = suggestedReorderQuantity * item.unitCostRupees;

  return {
    itemId: item.id,
    itemName: item.name,
    currentStock: item.currentStock,
    reorderPoint,
    healthStatus,
    suggestedReorderQuantity,
    estimatedReorderCost,
    urgencyDaysRemaining: daysRemaining,
  };
}
