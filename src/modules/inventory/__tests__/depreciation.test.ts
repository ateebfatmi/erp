import { describe, it, expect } from 'vitest';
import {
  calculateDepreciationSchedule,
  getCurrentBookValue,
  analyzeStockHealth,
  SchoolAsset,
  StockItem,
} from '../depreciation';

describe('VidyaOS Inventory & Asset Depreciation Engine', () => {
  const sampleProjector: SchoolAsset = {
    id: 'ast-1',
    name: 'Smart Classroom 4K Interactive Flat Panel',
    category: 'IT_EQUIPMENT',
    purchaseDate: '2023-04-01',
    purchaseCost: 150000,
    residualValue: 7500, // 5% scrap
    usefulLifeYears: 3,
    depreciationMethod: 'WDV',
    wdvRatePercent: 40,
    location: 'Senior Wing Computer Lab',
  };

  const sampleBench: SchoolAsset = {
    id: 'ast-2',
    name: 'Dual Ergonomic Teakwood Student Desks (Batch of 50)',
    category: 'FURNITURE',
    purchaseDate: '2022-04-01',
    purchaseCost: 200000,
    residualValue: 10000,
    usefulLifeYears: 10,
    depreciationMethod: 'SLM',
    wdvRatePercent: 10,
    location: 'Middle School Classrooms',
  };

  it('calculates Written Down Value (WDV) depreciation correctly year over year', () => {
    const schedule = calculateDepreciationSchedule(sampleProjector, 3);
    expect(schedule).toHaveLength(3);

    // Year 1: Opening 150,000, 40% dep = 60,000, Closing = 90,000
    expect(schedule[0].openingBookValue).toBe(150000);
    expect(schedule[0].depreciationAmount).toBe(60000);
    expect(schedule[0].closingBookValue).toBe(90000);

    // Year 2: Opening 90,000, 40% dep = 36,000, Closing = 54,000
    expect(schedule[1].openingBookValue).toBe(90000);
    expect(schedule[1].depreciationAmount).toBe(36000);
    expect(schedule[1].closingBookValue).toBe(54000);

    // Year 3: Opening 54,000, 40% dep = 21,600, Closing = 32,400
    expect(schedule[2].openingBookValue).toBe(54000);
    expect(schedule[2].depreciationAmount).toBe(21600);
    expect(schedule[2].closingBookValue).toBe(32400);
  });

  it('calculates Straight Line Method (SLM) depreciation accurately', () => {
    const schedule = calculateDepreciationSchedule(sampleBench, 3);
    // Cost = 200,000, Scrap = 10,000, Depreciable = 190,000 / 10 = 19,000/yr
    expect(schedule[0].depreciationAmount).toBe(19000);
    expect(schedule[0].closingBookValue).toBe(181000);
    expect(schedule[1].depreciationAmount).toBe(19000);
    expect(schedule[1].closingBookValue).toBe(162000);
  });

  it('evaluates consumable stock levels and alerts on critical thresholds', () => {
    const examAnswerSheets: StockItem = {
      id: 'stk-1',
      name: 'A4 Examination Answer Booklets (16p)',
      category: 'Stationery',
      currentStock: 450, // Low stock
      unit: 'booklets',
      avgDailyUsage: 100,
      leadTimeDays: 7, // lead demand = 700
      safetyStock: 300, // ROP = 700 + 300 = 1000
      maxStockLevel: 5000,
      unitCostRupees: 12,
    };

    const analysis = analyzeStockHealth(examAnswerSheets);
    expect(analysis.reorderPoint).toBe(1000);
    expect(analysis.healthStatus).toBe('REORDER_NEEDED');
    expect(analysis.suggestedReorderQuantity).toBe(4550); // 5000 - 450
    expect(analysis.estimatedReorderCost).toBe(4550 * 12);
    expect(analysis.urgencyDaysRemaining).toBe(4); // 450 / 100 = 4 days
  });

  it('flags stock as CRITICAL when below safety buffer', () => {
    const chemistryBeakers: StockItem = {
      id: 'stk-2',
      name: 'Borosil 250ml Glass Beakers',
      category: 'Lab Glassware',
      currentStock: 15, // Below safety stock of 25
      unit: 'pieces',
      avgDailyUsage: 5,
      leadTimeDays: 5,
      safetyStock: 25,
      maxStockLevel: 200,
      unitCostRupees: 85,
    };

    const analysis = analyzeStockHealth(chemistryBeakers);
    expect(analysis.healthStatus).toBe('CRITICAL');
    expect(analysis.urgencyDaysRemaining).toBe(3);
  });
});
