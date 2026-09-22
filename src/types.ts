export type FieldType = 'text' | 'number' | 'currency_usd' | 'currency_cny' | 'dimension' | 'select' | 'boolean' | 'date';

export type ColumnCategory = 'product_info' | 'pricing' | 'packaging' | 'production' | 'custom';

export interface ColumnDefinition {
  id: string;
  labelEn: string;
  labelZh: string;
  category: ColumnCategory;
  type: FieldType;
  requiredBySupplier: boolean;
  filledBy: 'buyer' | 'supplier';
  enabled: boolean;
  order: number;
  width?: number; // width in pixels or excel chars
  placeholder?: string;
  placeholderZh?: string;
  options?: string[]; // for select type
  unit?: string;
  description?: string;
  isCustom?: boolean;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  nameZh?: string;
  image: string; // base64 or url
  targetQty?: number;
  referenceUrl?: string;
  buyerSpecs?: string; // Material, color, size requirements
  // Dynamic supplier inputs keyed by column id:
  // e.g. fobPrice, exwPrice, moq, unitsPerCarton, cartons, boxLength, boxWidth, boxHeight, cbm, boxWeight, leadTime, etc.
  values: Record<string, any>;
  createdAt: number;
}

export interface RFQMetadata {
  rfqNumber: string;
  projectName: string;
  buyerCompany: string;
  buyerContact: string;
  buyerEmail: string;
  supplierName?: string;
  supplierContact?: string;
  targetCurrency: 'USD' | 'RMB (¥)' | 'EUR';
  tradeTerm: 'FOB' | 'EXW' | 'CIF' | 'DDP';
  destinationPort: string;
  departurePortPreference?: string;
  inquiryDate: string;
  deadlineDate: string;
  instructionsEn: string;
  instructionsZh: string;
  // Currency Exchange settings for Excel Sheet and Quotation
  enableExchangeRate?: boolean;
  exchangeRateUsdToCny?: number; // e.g. 7.20 (1 USD = 7.20 RMB)
  exchangeRateUsdToEur?: number; // e.g. 0.92 (1 USD = 0.92 EUR)
  addConvertedCurrencyColumns?: boolean; // Whether to add auto-converted price columns in Excel sheet
}
