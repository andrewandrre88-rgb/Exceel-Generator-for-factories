import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ColumnDefinition, ProductItem, RFQMetadata } from '../types';
import { calculateCartons, calculateTotalCbm } from './calculations';
import { compressImage } from './imageUtils';

export async function exportToChinaSupplierExcel(
  products: ProductItem[],
  columns: ColumnDefinition[],
  metadata: RFQMetadata,
  onProgress?: (msg: string) => void
) {
  if (onProgress) onProgress('Initializing Excel Workbook...');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = metadata.buyerCompany || 'China Sourcing Pro';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Factory RFQ 询价单', {
    views: [{ showGridLines: true }],
  });

  // Enabled columns sorted by order
  const activeCols = columns
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order);

  // Palette constants
  const NAVY = '1E3A8A';
  const LIGHT_BLUE = 'DBEAFE';
  const STEEL = '334155';
  const SUPPLIER_YELLOW_HEADER = 'FEF08A';
  const SUPPLIER_YELLOW_CELL = 'FEF9C3';
  const BUYER_HEADER = 'E2E8F0';
  const BORDER_COLOR = 'CBD5E1';

  // 1. Title Banner
  worksheet.mergeCells('A1', `${getColLetter(activeCols.length + 2)}1`);
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `FACTORY INQUIRY SHEET / 工厂采购询价单 - ${metadata.projectName || 'Product Sourcing'}`;
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: NAVY },
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 40;

  // 2. Metadata Block (Rows 2 to 4)
  worksheet.getCell('A2').value = 'RFQ Number / 询价编号:';
  worksheet.getCell('B2').value = metadata.rfqNumber || 'RFQ-2026-001';
  worksheet.getCell('C2').value = 'Inquiry Date / 询盘日期:';
  worksheet.getCell('D2').value = metadata.inquiryDate || new Date().toISOString().split('T')[0];
  worksheet.getCell('E2').value = 'Trade Term / 贸易条款:';
  worksheet.getCell('F2').value = `${metadata.tradeTerm} (${metadata.destinationPort || 'Standard Port'})`;

  worksheet.getCell('A3').value = 'Buyer / 采购方:';
  worksheet.getCell('B3').value = `${metadata.buyerCompany || 'Global Buyer'} (${metadata.buyerContact || ''})`;
  worksheet.getCell('C3').value = 'Buyer Email / 邮箱:';
  worksheet.getCell('D3').value = metadata.buyerEmail || '';
  worksheet.getCell('E3').value = 'Currency / 结算币种:';
  worksheet.getCell('F3').value = metadata.targetCurrency || 'USD';

  worksheet.getCell('A4').value = 'Target Supplier / 工厂:';
  worksheet.getCell('B4').value = metadata.supplierName || 'Factory Representative / 供应商销售经理';
  worksheet.getCell('C4').value = 'Quote Deadline / 报价截止:';
  worksheet.getCell('D4').value = metadata.deadlineDate || 'ASAP';
  worksheet.getCell('E4').value = 'Port of Loading / 起运港:';
  worksheet.getCell('F4').value = metadata.departurePortPreference || 'Ningbo / Shenzhen / Shanghai';

  // Format Metadata rows 2-4
  for (let r = 2; r <= 4; r++) {
    worksheet.getRow(r).height = 22;
    for (let c = 1; c <= Math.max(6, activeCols.length + 2); c++) {
      const cell = worksheet.getRow(r).getCell(c);
      cell.font = { name: 'Calibri', size: 10 };
      cell.alignment = { vertical: 'middle' };
      if (c % 2 === 1 && c <= 5) {
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: STEEL } };
      }
    }
  }

  // 3. Supplier Instruction Notice (Row 5)
  worksheet.mergeCells('A5', `${getColLetter(activeCols.length + 2)}5`);
  const noteCell = worksheet.getCell('A5');
  noteCell.value = `★ 【供应商须知 / SUPPLIER INSTRUCTION】: 请在黄色区域填写贵司单价(FOB/EXW)、装箱数(PCS/CTN)、外箱尺寸(长宽高cm)、单箱毛重(KG)及生产交期。Please fill in factory prices, carton packing specs, and lead time in the YELLOW cells.`;
  noteCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: '92400E' } };
  noteCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: SUPPLIER_YELLOW_CELL },
  };
  noteCell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
  worksheet.getRow(5).height = 32;

  // Empty row 6
  worksheet.getRow(6).height = 10;

  // 4. Group Category Header (Row 7)
  worksheet.getRow(7).height = 24;
  worksheet.getCell('A7').value = '#';
  worksheet.getCell('B7').value = 'PRODUCT PHOTO / 产品图片';
  worksheet.getCell('A7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BUYER_HEADER } };
  worksheet.getCell('B7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BUYER_HEADER } };
  worksheet.getCell('A7').font = { bold: true, size: 9, color: { argb: STEEL } };
  worksheet.getCell('B7').font = { bold: true, size: 9, color: { argb: STEEL } };
  worksheet.getCell('A7').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('B7').alignment = { horizontal: 'center', vertical: 'middle' };

  activeCols.forEach((col, idx) => {
    const colIndex = idx + 3;
    const cell = worksheet.getRow(7).getCell(colIndex);
    const isSupplier = col.filledBy === 'supplier';
    cell.value = isSupplier ? 'FACTORY QUOTATION (工厂填写)' : 'BUYER SPECIFICATION (采购要求)';
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: isSupplier ? SUPPLIER_YELLOW_HEADER : BUYER_HEADER },
    };
    cell.font = {
      bold: true,
      size: 9,
      color: { argb: isSupplier ? '78350F' : STEEL },
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // 5. Detailed Column Headers (Row 8)
  worksheet.getRow(8).height = 42;
  
  // Col 1: Index
  const colIndexCell = worksheet.getCell('A8');
  colIndexCell.value = 'Item\n序号';
  colIndexCell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
  colIndexCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: STEEL } };
  colIndexCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  worksheet.getColumn(1).width = 7;

  // Col 2: Image
  const colImgCell = worksheet.getCell('B8');
  colImgCell.value = 'Product Image\n产品实物/参考图';
  colImgCell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
  colImgCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: STEEL } };
  colImgCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  worksheet.getColumn(2).width = 18; // approx 120-130px

  // Dynamic columns
  activeCols.forEach((col, idx) => {
    const colIndex = idx + 3;
    const headerCell = worksheet.getRow(8).getCell(colIndex);
    headerCell.value = `${col.labelEn}\n${col.labelZh}${col.unit ? ` (${col.unit})` : ''}`;
    const isSupplier = col.filledBy === 'supplier';

    headerCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: isSupplier ? 'FEF08A' : '475569' },
    };
    headerCell.font = {
      bold: true,
      size: 10,
      color: { argb: isSupplier ? '78350F' : 'FFFFFFFF' },
    };
    headerCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Column width
    const suggestedWidth = Math.max(13, Math.round((col.width || 120) / 7.5));
    worksheet.getColumn(colIndex).width = suggestedWidth;
  });

  // Borders for header
  for (let c = 1; c <= activeCols.length + 2; c++) {
    const c7 = worksheet.getRow(7).getCell(c);
    const c8 = worksheet.getRow(8).getCell(c);
    const thinBorder: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: BORDER_COLOR } },
      left: { style: 'thin', color: { argb: BORDER_COLOR } },
      bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
      right: { style: 'thin', color: { argb: BORDER_COLOR } },
    };
    c7.border = thinBorder;
    c8.border = thinBorder;
  }

  // 6. Data Rows
  let currentRow = 9;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    if (onProgress) {
      onProgress(`Processing item ${i + 1}/${products.length}: ${product.name}...`);
    }

    const row = worksheet.getRow(currentRow);
    row.height = 75; // sufficient height for 80x80px photo thumbnail

    // Col 1: Index #
    const indexCell = row.getCell(1);
    indexCell.value = i + 1;
    indexCell.font = { bold: true, size: 11, color: { argb: STEEL } };
    indexCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Col 2: Image
    const imgCell = row.getCell(2);
    imgCell.alignment = { horizontal: 'center', vertical: 'middle' };

    if (product.image && product.image.trim()) {
      try {
        const { base64, extension } = await compressImage(product.image, 300);
        const imageId = workbook.addImage({
          base64,
          extension,
        });

        // In ExcelJS, cell coordinates for image:
        // tl: { col: 1 (for col B), row: currentRow - 1 }
        worksheet.addImage(imageId, {
          tl: { col: 1.15, row: currentRow - 1 + 0.08 },
          ext: { width: 90, height: 90 },
          editAs: 'oneCell',
        });
      } catch (err) {
        console.warn('Could not embed image for product', product.sku, err);
        imgCell.value = '[Image Attached]';
      }
    } else {
      imgCell.value = '(No image)';
      imgCell.font = { italic: true, size: 9, color: { argb: '94A3B8' } };
    }

    // Dynamic columns for this row
    activeCols.forEach((col, colIdx) => {
      const colNum = colIdx + 3;
      const cell = row.getCell(colNum);
      const isSupplier = col.filledBy === 'supplier';

      let cellValue: any = '';

      if (col.id === 'sku') {
        cellValue = product.sku || '';
      } else if (col.id === 'name') {
        cellValue = product.name || '';
      } else if (col.id === 'buyerSpecs') {
        cellValue = product.buyerSpecs || '';
      } else if (col.id === 'targetQty') {
        cellValue = product.targetQty !== undefined ? Number(product.targetQty) : '';
      } else if (col.id === 'cartons') {
        // If supplier/user entered a specific cartons value, use it, else calculate from targetQty and unitsPerCarton
        const manualCartons = product.values.cartons;
        if (manualCartons !== undefined && manualCartons !== '') {
          cellValue = Number(manualCartons);
        } else {
          // Automatic formula or calculated value
          const autoCartons = calculateCartons(product.targetQty, product.values.unitsPerCarton);
          cellValue = autoCartons > 0 ? autoCartons : '';
        }
      } else if (col.id === 'cbm') {
        const manualCbm = product.values.cbm;
        if (manualCbm !== undefined && manualCbm !== '') {
          cellValue = Number(manualCbm);
        } else {
          const autoCbm = calculateTotalCbm(
            product.targetQty,
            product.values.unitsPerCarton,
            product.values.cartons,
            product.values.boxLength,
            product.values.boxWidth,
            product.values.boxHeight
          );
          cellValue = autoCbm > 0 ? autoCbm : '';
        }
      } else {
        const raw = product.values[col.id];
        if (raw !== undefined && raw !== null && raw !== '') {
          if (col.type === 'number' || col.type === 'currency_usd' || col.type === 'currency_cny') {
            cellValue = isNaN(Number(raw)) ? raw : Number(raw);
          } else {
            cellValue = raw;
          }
        }
      }

      cell.value = cellValue;

      // Formatting
      if (col.type === 'currency_usd') {
        cell.numFmt = '$#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (col.type === 'currency_cny') {
        cell.numFmt = '¥#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (col.type === 'number') {
        cell.numFmt = '#,##0.##';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else {
        cell.alignment = {
          horizontal: col.id === 'sku' ? 'center' : 'left',
          vertical: 'middle',
          wrapText: true,
        };
      }

      // Fill styling
      if (isSupplier) {
        // Highlighting for supplier fields so they can fill easily
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: SUPPLIER_YELLOW_CELL },
        };
        cell.font = { name: 'Calibri', size: 10, bold: col.requiredBySupplier };
      } else {
        cell.font = { name: 'Calibri', size: 10 };
      }
    });

    // Row borders
    for (let c = 1; c <= activeCols.length + 2; c++) {
      const cCell = row.getCell(c);
      cCell.border = {
        top: { style: 'thin', color: { argb: BORDER_COLOR } },
        left: { style: 'thin', color: { argb: BORDER_COLOR } },
        bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
        right: { style: 'thin', color: { argb: BORDER_COLOR } },
      };
    }

    currentRow++;
  }

  // 7. Total Summary Row
  const totalRowIndex = currentRow;
  const totalRow = worksheet.getRow(totalRowIndex);
  totalRow.height = 28;

  worksheet.mergeCells(`A${totalRowIndex}`, `B${totalRowIndex}`);
  const totalLabelCell = worksheet.getCell(`A${totalRowIndex}`);
  totalLabelCell.value = 'TOTALS / 合计:';
  totalLabelCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  totalLabelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: STEEL } };
  totalLabelCell.alignment = { horizontal: 'center', vertical: 'middle' };

  activeCols.forEach((col, colIdx) => {
    const colNum = colIdx + 3;
    const colLetter = getColLetter(colNum);
    const cell = totalRow.getCell(colNum);

    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BUYER_HEADER } };
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: STEEL } };

    if (col.id === 'targetQty' || col.id === 'cartons') {
      cell.value = {
        formula: `SUM(${colLetter}9:${colLetter}${totalRowIndex - 1})`,
      };
      cell.numFmt = '#,##0';
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    } else if (col.id === 'cbm') {
      cell.value = {
        formula: `SUM(${colLetter}9:${colLetter}${totalRowIndex - 1})`,
      };
      cell.numFmt = '#,##0.00';
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    } else {
      cell.value = '';
    }

    cell.border = {
      top: { style: 'medium', color: { argb: STEEL } },
      left: { style: 'thin', color: { argb: BORDER_COLOR } },
      bottom: { style: 'double', color: { argb: STEEL } },
      right: { style: 'thin', color: { argb: BORDER_COLOR } },
    };
  });

  // Finish and trigger browser download
  if (onProgress) onProgress('Compiling Excel file...');
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const safeProjectName = (metadata.projectName || 'China_Factory_RFQ')
    .replace(/[^a-zA-Z0-9_\u4e00-\u9fa5-]/g, '_')
    .substring(0, 30);
  const fileName = `${safeProjectName}_${metadata.rfqNumber || 'RFQ'}_${new Date().toISOString().split('T')[0]}.xlsx`;

  saveAs(blob, fileName);
}

function getColLetter(colIndex: number): string {
  let letter = '';
  while (colIndex > 0) {
    const mod = (colIndex - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    colIndex = Math.floor((colIndex - mod) / 26);
  }
  return letter;
}
