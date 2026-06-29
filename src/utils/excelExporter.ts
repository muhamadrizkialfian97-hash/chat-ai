/**
 * excelExporter.ts
 * Generates an Excel-compatible XML Spreadsheet 2003 (.xls) containing two sheets:
 * 1. TAM SAM SOM & Kelayakan
 * 2. P&L & Cash Flow
 * with exact formulas and beautiful styling matching the requested template.
 */

export interface ExcelData {
  projectTitle: string;
  division: string;
  tamValue: number;
  samValue: number;
  somValue: number;
  // Capex components
  capexTrucks: number;
  capexIT: number;
  capexGudang: number;
  capexIzin: number;
  // Year 1-3 Revenue
  revenueY1: number;
  revenueY2: number;
  revenueY3: number;
  // Year 1-3 OPEX components
  gajiY1: number; gajiY2: number; gajiY3: number;
  bbmY1: number; bbmY2: number; bbmY3: number;
  maintY1: number; maintY2: number; maintY3: number;
  sewaY1: number; sewaY2: number; sewaY3: number;
}

export function exportToExcelFile(data: ExcelData) {
  const totalCapex = data.capexTrucks + data.capexIT + data.capexGudang + data.capexIzin;
  
  // Year 1 calculation
  const opexY1 = data.gajiY1 + data.bbmY1 + data.maintY1 + data.sewaY1;
  const netProfitY1 = data.revenueY1 - opexY1;
  const npmY1 = data.revenueY1 > 0 ? (netProfitY1 / data.revenueY1) * 100 : 0;
  
  // Year 2 calculation
  const opexY2 = data.gajiY2 + data.bbmY2 + data.maintY2 + data.sewaY2;
  const netProfitY2 = data.revenueY2 - opexY2;
  const npmY2 = data.revenueY2 > 0 ? (netProfitY2 / data.revenueY2) * 100 : 0;
  
  // Year 3 calculation
  const opexY3 = data.gajiY3 + data.bbmY3 + data.maintY3 + data.sewaY3;
  const netProfitY3 = data.revenueY3 - opexY3;
  const npmY3 = data.revenueY3 > 0 ? (netProfitY3 / data.revenueY3) * 100 : 0;
  
  const avgNpm = (npmY1 + npmY2 + npmY3) / 3;
  const totalNetCashFlow3Years = netProfitY1 + netProfitY2 + netProfitY3 - totalCapex;
  const finalCashBalanceY3 = netProfitY1 + netProfitY2 + netProfitY3 - totalCapex; // matches cash accumulation

  // Payback period
  const avgNetProfit = (netProfitY1 + netProfitY2 + netProfitY3) / 3;
  const paybackPeriod = avgNetProfit > 0 ? totalCapex / avgNetProfit : 0;

  // Let's format XML content using SpreadsheetML
  const xmlContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>PRAMA System</Author>
    <LastAuthor>PRAMA System</LastAuthor>
    <Created>${new Date().toISOString()}</Created>
    <Version>16.00</Version>
  </DocumentProperties>
  <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
    <WindowHeight>9000</WindowHeight>
    <WindowWidth>15000</WindowWidth>
    <WindowTopX>0</WindowTopX>
    <WindowTopY>0</WindowTopY>
    <ProtectStructure>False</ProtectStructure>
    <ProtectWindows>False</ProtectWindows>
  </ExcelWorkbook>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Bottom"/>
      <Borders/>
      <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="sTitle">
      <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#1F4E78"/>
    </Style>
    <Style ss:ID="sSubtitle">
      <Font ss:FontName="Calibri" ss:Size="10" ss:Italic="1" ss:Color="#595959"/>
    </Style>
    <Style ss:ID="sSecHeader">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#1F4E78"/>
    </Style>
    <Style ss:ID="sTableHeader">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#1F4E78" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sTableSubHeader">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#000000"/>
      <Interior ss:Color="#F2F2F2" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sRowLabel">
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#000000"/>
    </Style>
    <Style ss:ID="sRowLabelBold">
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#000000"/>
    </Style>
    <Style ss:ID="sCurrency">
      <Alignment ss:Horizontal="Right"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#000000"/>
      <NumberFormat ss:Format="#,##0"/>
    </Style>
    <Style ss:ID="sCurrencyBold">
      <Alignment ss:Horizontal="Right"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#000000"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#000000"/>
      <NumberFormat ss:Format="#,##0"/>
    </Style>
    <Style ss:ID="sPercentage">
      <Alignment ss:Horizontal="Right"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D9D9D9"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Color="#000000"/>
      <NumberFormat ss:Format="0.0%"/>
    </Style>
    <Style ss:ID="sPercentageBold">
      <Alignment ss:Horizontal="Right"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#000000"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#000000"/>
      <NumberFormat ss:Format="0.0%"/>
    </Style>
    <Style ss:ID="sThresholdGreen">
      <Alignment ss:Horizontal="Left"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A6A6A6"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="9.5" ss:Color="#385723"/>
      <Interior ss:Color="#E2EFDA" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  
  <!-- WORKSHEET 1 -->
  <Worksheet ss:Name="1. TAM SAM SOM &amp; Kelayakan">
    <Table ss:ExpandedColumnCount="10" ss:ExpandedRowCount="25" x:FullColumns="1" x:FullRows="1">
      <Column ss:Index="1" ss:Width="30"/> <!-- Spacer Column A -->
      <Column ss:Index="2" ss:Width="250"/> <!-- B -->
      <Column ss:Index="3" ss:Width="450"/> <!-- C -->
      <Column ss:Index="4" ss:Width="160"/> <!-- D -->
      
      <Row ss:Height="25">
        <Cell ss:Index="2" ss:StyleID="sTitle"><Data ss:Type="String">ANALISIS KELAYAKAN PROYEK LOGISTIK</Data></Cell>
      </Row>
      <Row ss:Height="15">
        <Cell ss:Index="2" ss:StyleID="sSubtitle"><Data ss:Type="String">Estimasi Pasar (TAM SAM SOM) &amp; Ringkasan Metrik Finansial</Data></Cell>
      </Row>
      <Row ss:Height="15"/>
      
      <!-- A. Estimasi Ukuran Pasar -->
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sSecHeader"><Data ss:Type="String">A. Estimasi Ukuran Pasar (Market Sizing)</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sTableHeader"><Data ss:Type="String">Metrik</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Deskripsi / Cakupan</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Nilai Per Tahun (IDR)</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">TAM (Total Addressable Market)</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Total seluruh potensi pasar logistik di wilayah target (misal: Seluruh Indonesia/Provinsi)</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.tamValue}</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">SAM (Serviceable Addressable Market)</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Pangsa pasar TAM yang sesuai dengan model bisnis &amp; jangkauan armada Anda</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.samValue}</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">SOM (Serviceable Obtainable Market)</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Target nyata pangsa pasar yang sanggup dilayani oleh kapasitas operasional Anda saat ini</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.somValue}</Data></Cell>
      </Row>
      
      <Row ss:Height="18"/>
      
      <!-- B. Ringkasan Kelayakan Proyek -->
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sSecHeader"><Data ss:Type="String">B. Ringkasan Kelayakan Proyek (Auto-calculated)</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sTableHeader"><Data ss:Type="String">Indikator Keuangan</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Nilai</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Ambang Batas Kelayakan</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">Total CAPEX (Investasi Awal)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="='2. P&amp;L &amp; Cash Flow'!R10C3"><Data ss:Type="Number">${totalCapex}</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Berdasarkan Kebutuhan Aset</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">Proyeksi Pendapatan (Tahun 1)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="='2. P&amp;L &amp; Cash Flow'!R13C3"><Data ss:Type="Number">${data.revenueY1}</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Target SOM minimum terpenuhi</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">Net Profit Margin (Rata-rata)</Data></Cell>
        <Cell ss:StyleID="sPercentageBold" ss:Formula="=AVERAGE('2. P&amp;L &amp; Cash Flow'!R21C3:R21C5)"><Data ss:Type="Number">${avgNpm / 100}</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Positif (&gt; 10%)</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">Total Arus Kas Bersih (3 Tahun)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="='2. P&amp;L &amp; Cash Flow'!R27C5"><Data ss:Type="Number">${finalCashBalanceY3}</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Positif (Kumulatif)</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">Payback Period / ROI (Tahun)</Data></Cell>
        <Cell ss:StyleID="sRowLabelBold" ss:Formula="=IF(AVERAGE('2. P&amp;L &amp; Cash Flow'!R20C3:R20C5)&gt;0, RC[-2]/AVERAGE('2. P&amp;L &amp; Cash Flow'!R20C3:R20C5), 0)"><Data ss:Type="String">${paybackPeriod.toFixed(1)} Tahun</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Kurang dari 3 Tahun</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
  
  <!-- WORKSHEET 2 -->
  <Worksheet ss:Name="2. P&amp;L &amp; Cash Flow">
    <Table ss:ExpandedColumnCount="10" ss:ExpandedRowCount="35" x:FullColumns="1" x:FullRows="1">
      <Column ss:Index="1" ss:Width="30"/> <!-- Spacer A -->
      <Column ss:Index="2" ss:Width="250"/> <!-- B -->
      <Column ss:Index="3" ss:Width="160"/> <!-- C -->
      <Column ss:Index="4" ss:Width="160"/> <!-- D -->
      <Column ss:Index="5" ss:Width="160"/> <!-- E -->
      
      <Row ss:Height="25">
        <Cell ss:Index="2" ss:StyleID="sTitle"><Data ss:Type="String">MODEL PROYEKSI KEUANGAN PROYEK (3 TAHUN)</Data></Cell>
      </Row>
      <Row ss:Height="15"/>
      
      <!-- 1. ESTIMASI CAPEX -->
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sSecHeader"><Data ss:Type="String">1. ESTIMASI CAPEX (Capital Expenditure)</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sTableHeader"><Data ss:Type="String">Komponen Investasi Awal</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Nilai (IDR)</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Keterangan</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">Armada Truk Logistik (DP / Pembelian Cash)</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.capexTrucks}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Misal: 3 Unit Truk Engkel</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">Sistem IT / Transport Management System (TMS)</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.capexIT}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Lisensi &amp; Setup Awal</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">Peralatan Gudang &amp; Pallet</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.capexGudang}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Rak, Hand Pallet, Safety Tools</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">Perizinan &amp; Legalitas Proyek</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.capexIzin}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Sertifikasi &amp; izin jalan armada</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">TOTAL CAPEX</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=SUM(R[-4]C:R[-1]C)"><Data ss:Type="Number">${totalCapex}</Data></Cell>
        <Cell ss:StyleID="sRowLabelBold"/>
      </Row>
      
      <Row ss:Height="18"/>
      
      <!-- 2. LAPORAN KEUANGAN -->
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sTableHeader"><Data ss:Type="String">Item Laporan Keuangan</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Tahun 1 (IDR)</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Tahun 2 (IDR)</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Tahun 3 (IDR)</Data></Cell>
      </Row>
      
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">PENDAPATAN (REVENUE)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold"><Data ss:Type="Number">${data.revenueY1}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold"><Data ss:Type="Number">${data.revenueY2}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold"><Data ss:Type="Number">${data.revenueY3}</Data></Cell>
      </Row>
      
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">BIAYA OPERASIONAL (OPEX)</Data></Cell>
        <Cell ss:Index="3" ss:StyleID="sRowLabelBold"/>
        <Cell ss:StyleID="sRowLabelBold"/>
        <Cell ss:StyleID="sRowLabelBold"/>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">- Gaji Sopir &amp; Kru</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.gajiY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.gajiY2}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.gajiY3}</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">- BBM &amp; Tol</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.bbmY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.bbmY2}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.bbmY3}</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">- Maintenance &amp; Servis Armada</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.maintY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.maintY2}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.maintY3}</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">- Sewa Kantor/Gudang &amp; Admin</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.sewaY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.sewaY2}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.sewaY3}</Data></Cell>
      </Row>
      
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">TOTAL OPEX</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=SUM(R[-4]C:R[-1]C)"><Data ss:Type="Number">${opexY1}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=SUM(R[-4]C:R[-1]C)"><Data ss:Type="Number">${opexY2}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=SUM(R[-4]C:R[-1]C)"><Data ss:Type="Number">${opexY3}</Data></Cell>
      </Row>
      
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold" style="background-color: #E2EFDA;"><Data ss:Type="String">LABA BERSIH (NET PROFIT)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=RC[-1]-R[-1]C"><Data ss:Type="Number">${netProfitY1}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=RC[-1]-R[-1]C"><Data ss:Type="Number">${netProfitY2}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=RC[-1]-R[-1]C"><Data ss:Type="Number">${netProfitY3}</Data></Cell>
      </Row>
      
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">NET PROFIT MARGIN (%)</Data></Cell>
        <Cell ss:StyleID="sPercentageBold" ss:Formula="=R[-1]C/R[-8]C"><Data ss:Type="Number">${npmY1 / 100}</Data></Cell>
        <Cell ss:StyleID="sPercentageBold" ss:Formula="=R[-1]C/R[-8]C"><Data ss:Type="Number">${npmY2 / 100}</Data></Cell>
        <Cell ss:StyleID="sPercentageBold" ss:Formula="=R[-1]C/R[-8]C"><Data ss:Type="Number">${npmY3 / 100}</Data></Cell>
      </Row>
      
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">ARUS KAS (CASH FLOW)</Data></Cell>
        <Cell ss:Index="3" ss:StyleID="sRowLabelBold"/>
        <Cell ss:StyleID="sRowLabelBold"/>
        <Cell ss:StyleID="sRowLabelBold"/>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">+ Saldo Kas Awal</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">0</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=R[4]C[-1]"><Data ss:Type="Number">${netProfitY1 - totalCapex}</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=R[4]C[-1]"><Data ss:Type="Number">${netProfitY1 + netProfitY2 - totalCapex}</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">- Arus Kas Keluar Investasi (CAPEX)</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">-${totalCapex}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">0</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">0</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">+ Masukan Kas Operasional (Net Profit)</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=R[-5]C"><Data ss:Type="Number">${netProfitY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=R[-5]C"><Data ss:Type="Number">${netProfitY2}</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=R[-5]C"><Data ss:Type="Number">${netProfitY3}</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">ARUS KAS BERSIH (NET CASH FLOW)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-2]C+R[-1]C"><Data ss:Type="Number">${netProfitY1 - totalCapex}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-2]C+R[-1]C"><Data ss:Type="Number">${netProfitY2}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-2]C+R[-1]C"><Data ss:Type="Number">${netProfitY3}</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold" style="background-color: #D9E1F2;"><Data ss:Type="String">SALDO KAS AKHIR</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-4]C+R[-1]C"><Data ss:Type="Number">${netProfitY1 - totalCapex}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-4]C+R[-1]C"><Data ss:Type="Number">${netProfitY1 + netProfitY2 - totalCapex}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-4]C+R[-1]C"><Data ss:Type="Number">${finalCashBalanceY3}</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `PRAMA_Analisis_Keuangan_${data.projectTitle.replace(/[^a-zA-Z0-9]/g, "_")}.xls`;
  
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}
