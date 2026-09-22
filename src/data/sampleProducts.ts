import { ProductItem, RFQMetadata } from '../types';

export const INITIAL_METADATA: RFQMetadata = {
  rfqNumber: 'RFQ-2026-CN088',
  projectName: 'Q3 Sourcing - Kitchen & Lifestyle Line',
  buyerCompany: 'Apex Global Brands Inc.',
  buyerContact: 'Andrew Andre',
  buyerEmail: 'sourcing@apexbrands.com',
  supplierName: 'Zhejiang / Guangdong OEM Factory Partner',
  supplierContact: 'Sales Manager (外贸业务部)',
  targetCurrency: 'RMB (¥)',
  tradeTerm: 'FOB',
  destinationPort: 'Los Angeles / Long Beach (USA)',
  departurePortPreference: 'Ningbo / Shenzhen / Shanghai',
  inquiryDate: new Date().toISOString().split('T')[0],
  deadlineDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  instructionsEn: 'Please quote your best FOB Ningbo/Shenzhen prices in RMB (¥) based on target quantities. Include complete master carton packing specs (dimensions, gross weight, units/carton) and lead times.',
  instructionsZh: '尊敬的供应商：请根据预计采购量报出最优惠的人民币 (¥ RMB) 离岸价及出厂价，并详细填写装箱数、外箱尺寸、单箱毛重和大货交期。',
  enableExchangeRate: true,
  exchangeRateUsdToCny: 7.25,
  exchangeRateUsdToEur: 0.92,
  addConvertedCurrencyColumns: true,
};

// Create clean, distinctive SVG product graphic data-URLs
function createProductSvg(title: string, category: string, primaryColor: string, secondaryColor: string, iconShape: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#F8FAFC" rx="24"/>
    <rect x="20" y="20" width="360" height="360" fill="#FFFFFF" rx="16" stroke="#E2E8F0" stroke-width="2"/>
    <circle cx="200" cy="180" r="100" fill="${primaryColor}" fill-opacity="0.1"/>
    ${iconShape}
    <text x="200" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#1E293B" text-anchor="middle">${title}</text>
    <text x="200" y="345" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="${secondaryColor}" text-anchor="middle">${category}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-001',
    sku: 'APX-TB-40OZ',
    name: '40oz Insulated Stainless Steel Tumbler with Handle',
    nameZh: '40盎司不锈钢双层真空带手柄保温杯',
    image: createProductSvg(
      '40oz Insulated Tumbler',
      'KITCHENWARE / 保温杯',
      '#0284C7',
      '#0369A1',
      `<path d="M165 110 h70 l-10 130 h-50 z" fill="#0284C7" stroke="#0369A1" stroke-width="4"/>
       <rect x="160" y="95" width="80" height="15" rx="4" fill="#0369A1"/>
       <path d="M230 130 h25 a15 15 0 0 1 15 15 v40 a15 15 0 0 1 -15 15 h-22" fill="none" stroke="#0284C7" stroke-width="8" stroke-linecap="round"/>
       <line x1="200" y1="80" x2="200" y2="95" stroke="#64748B" stroke-width="6" stroke-linecap="round"/>`
    ),
    targetQty: 3000,
    buyerSpecs: '304 Stainless Steel inner, 201 outer, laser engraved logo, custom color box packaging.',
    values: {
      fobPrice: 24.50,
      exwPrice: 22.00,
      moq: 1000,
      unitsPerCarton: 24,
      boxLength: 48,
      boxWidth: 36,
      boxHeight: 32,
      boxWeight: 14.5,
      cartons: 125,
      cbm: 6.91,
      leadTime: 30,
      portOfLoading: 'Ningbo',
      sampleCost: '¥200 (5 days)',
      customNotes: 'BPA free lid, FDA & LFGB compliant certificate available.',
    },
    createdAt: Date.now() - 100000,
  },
  {
    id: 'prod-002',
    sku: 'APX-BB-ECO',
    name: 'Bamboo Fiber Bento Lunch Box with Cutlery Set',
    nameZh: '环保竹纤维双层便当盒 (带餐具及绑带)',
    image: createProductSvg(
      'Bamboo Bento Box',
      'ECO PRODUCTS / 竹纤维餐盒',
      '#16A34A',
      '#15803D',
      `<rect x="130" y="130" width="140" height="90" rx="14" fill="#86EFAC" stroke="#16A34A" stroke-width="4"/>
       <rect x="125" y="115" width="150" height="20" rx="6" fill="#15803D"/>
       <rect x="185" y="110" width="30" height="115" rx="4" fill="#F59E0B"/>
       <line x1="150" y1="170" x2="170" y2="170" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>`
    ),
    targetQty: 5000,
    buyerSpecs: 'Biodegradable bamboo fiber, silicone seal ring, elastic strap, customized pantone color.',
    values: {
      fobPrice: 15.20,
      exwPrice: 13.50,
      moq: 2000,
      unitsPerCarton: 48,
      boxLength: 52,
      boxWidth: 42,
      boxHeight: 38,
      boxWeight: 18.2,
      cartons: 105,
      cbm: 8.72,
      leadTime: 25,
      portOfLoading: 'Shenzhen',
      sampleCost: '免费样板 Free sample (3 days)',
      customNotes: 'Dishwasher safe, microwave friendly (under 120°C).',
    },
    createdAt: Date.now() - 80000,
  },
  {
    id: 'prod-003',
    sku: 'APX-EAR-ANC',
    name: 'Wireless ANC Bluetooth 5.4 Earbuds (ENC Mic)',
    nameZh: '无线降噪蓝牙5.4耳机 (ENC四麦通话)',
    image: createProductSvg(
      'ANC Wireless Earbuds',
      'ELECTRONICS / 蓝牙耳机',
      '#8B5CF6',
      '#6D28D9',
      `<rect x="140" y="130" width="120" height="85" rx="30" fill="#DDD6FE" stroke="#7C3AED" stroke-width="4"/>
       <circle cx="175" cy="170" r="14" fill="#7C3AED"/>
       <circle cx="225" cy="170" r="14" fill="#7C3AED"/>
       <line x1="140" y1="160" x2="260" y2="160" stroke="#7C3AED" stroke-width="2"/>`
    ),
    targetQty: 2000,
    buyerSpecs: '40dB active noise cancellation, type-C fast charging, custom gift box with magnetic lid.',
    values: {
      fobPrice: 63.80,
      exwPrice: 59.50,
      moq: 1000,
      unitsPerCarton: 100,
      boxLength: 45,
      boxWidth: 35,
      boxHeight: 28,
      boxWeight: 11.0,
      cartons: 20,
      cbm: 0.88,
      leadTime: 35,
      portOfLoading: 'Shenzhen',
      sampleCost: '¥300 带LOGO激光 (7 days)',
      customNotes: 'CE, FCC, RoHS, MSDS and UN38.3 battery reports included.',
    },
    createdAt: Date.now() - 60000,
  },
  {
    id: 'prod-004',
    sku: 'APX-PLW-MEM',
    name: 'Ergonomic Memory Foam Travel Neck Pillow with Velvet Cover',
    nameZh: '慢回弹记忆棉U型护颈旅行枕 (磁布天鹅绒套)',
    image: createProductSvg(
      'Memory Foam U-Pillow',
      'TEXTILE / 记忆棉U型枕',
      '#EA580C',
      '#C2410C',
      `<path d="M140 180 c0 -50 40 -80 60 -80 s60 30 60 80 c0 35 -15 60 -30 60 c-15 0 -20 -25 -30 -25 s-15 25 -30 25 c-15 0 -30 -25 -30 -60 z" fill="#FFEDD5" stroke="#EA580C" stroke-width="4"/>
       <circle cx="170" cy="225" r="5" fill="#EA580C"/>
       <circle cx="230" cy="225" r="5" fill="#EA580C"/>`
    ),
    targetQty: 4000,
    buyerSpecs: 'High density memory foam 50D, removable machine washable plush cover, storage pouch.',
    values: {
      fobPrice: 26.80,
      exwPrice: 23.50,
      moq: 1000,
      unitsPerCarton: 20,
      boxLength: 60,
      boxWidth: 50,
      boxHeight: 45,
      boxWeight: 9.5,
      cartons: 200,
      cbm: 27.0,
      leadTime: 28,
      portOfLoading: 'Shanghai',
      sampleCost: '¥150 (5 days)',
      customNotes: 'Vacuum compressed packaging to save 60% freight volume.',
    },
    createdAt: Date.now() - 40000,
  },
];
