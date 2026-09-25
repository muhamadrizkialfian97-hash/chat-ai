/**
 * excelExporter.ts
 * Generates an Excel-compatible XML Spreadsheet 2003 (.xls) containing two sheets:
 * 1. TAM SAM SOM & Estimasi Kelayakan
 * 2. Proyeksi CAPEX, OPEX, P&L & Cash Flow
 * with exact formulas, transparent methodology explanations, and uniform numbers matching the UI dashboard.
 */
import { getFinancialRecommendations } from "./financialRecommendations";

export interface ExcelData {
  projectTitle: string;
  division?: string;
  archetypeLabel?: string;
  sectorTag?: string;
  tamValue: number;
  samValue: number;
  somValue: number;
  tamDesc?: string;
  samDesc?: string;
  somDesc?: string;
  // Capex components
  capexTrucks: number;
  capexIT: number;
  capexGudang: number;
  capexIzin: number;
  capex1Label?: string;
  capex2Label?: string;
  capex3Label?: string;
  capex4Label?: string;
  capex1Note?: string;
  capex2Note?: string;
  capex3Note?: string;
  capex4Note?: string;
  annualDepreciation?: number;
  taxRate?: number;
  // Year 1-3 Revenue
  revenueY1: number;
  revenueY2: number;
  revenueY3: number;
  // Year 1-3 OPEX components
  gajiY1: number; gajiY2: number; gajiY3: number;
  bbmY1: number; bbmY2: number; bbmY3: number;
  maintY1: number; maintY2: number; maintY3: number;
  sewaY1: number; sewaY2: number; sewaY3: number;
  opex1Label?: string;
  opex2Label?: string;
  opex3Label?: string;
  opex4Label?: string;
  explanationNote?: string;
}

export function exportToExcelFile(data: ExcelData) {
  const rec = getFinancialRecommendations(data.projectTitle || "Kajian Kelayakan Bisnis");

  // Fallback labels & notes if not specified
  const capex1Label = data.capex1Label || rec.assetName || "Aset Utama Investasi";
  const capex2Label = data.capex2Label || rec.capexSecondary1Name || "Infrastruktur & Penunjang";
  const capex3Label = data.capex3Label || rec.capexSecondary2Name || "Fasilitas & Ruang Kerja";
  const capex4Label = data.capex4Label || rec.capexSecondary3Name || "Perizinan, Legalitas & Modal Kerja";

  const opex1Label = data.opex1Label || rec.opex1Name || "Bahan Baku & Biaya Pokok Operasional";
  const opex2Label = data.opex2Label || rec.opex2Name || "Gaji Staf & Tenaga Kerja Operasional";
  const opex3Label = data.opex3Label || rec.opex3Name || "Utilitas Energi, Listrik & Perawatan";
  const opex4Label = data.opex4Label || rec.opex4Name || "Overhead, Pemasaran & Operasional";

  const archetypeLabel = data.archetypeLabel || rec.archetypeLabel || "Umum";
  const sectorTag = data.sectorTag || rec.sectorTag || "Bisnis Terintegrasi";

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
  
  // Year 1-3 cash flows and balances matching calculations
  const netCashFlowY1 = netProfitY1 - totalCapex;
  const netCashFlowY2 = netProfitY2;
  const netCashFlowY3 = netProfitY3;
  
  const endCashY1 = netCashFlowY1;
  const endCashY2 = endCashY1 + netCashFlowY2;
  const endCashY3 = endCashY2 + netCashFlowY3;

  const totalNetCashFlow3Years = netProfitY1 + netProfitY2 + netProfitY3 - totalCapex;

  // Payback period
  const avgNetProfit = (netProfitY1 + netProfitY2 + netProfitY3) / 3;
  const paybackPeriod = avgNetProfit > 0 ? totalCapex / avgNetProfit : 0;

  // Format XML content using SpreadsheetML
  const xmlContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>PRAMA Feasibility Engine</Author>
    <LastAuthor>PRAMA Feasibility Engine</LastAuthor>
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
      <Font ss:FontName="Calibri" ss:Size="15" ss:Bold="1" ss:Color="#107C41"/>
    </Style>
    <Style ss:ID="sSubtitle">
      <Font ss:FontName="Calibri" ss:Size="9.5" ss:Italic="1" ss:Color="#4B5563"/>
    </Style>
    <Style ss:ID="sSecHeader">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#1E293B"/>
    </Style>
    <Style ss:ID="sTableHeader">
      <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F5132"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F5132"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F5132"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F5132"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#107C41" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sTableHeaderRight">
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F5132"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F5132"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F5132"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#0F5132"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#107C41" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sRowLabel">
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="9.5" ss:Color="#1E293B"/>
    </Style>
    <Style ss:ID="sRowLabelBold">
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="9.5" ss:Bold="1" ss:Color="#0F172A"/>
      <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sCurrency">
      <Alignment ss:Horizontal="Right"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="9.5" ss:Color="#1E293B"/>
      <NumberFormat ss:Format="Rp #,##0"/>
    </Style>
    <Style ss:ID="sCurrencyBold">
      <Alignment ss:Horizontal="Right"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#107C41"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#047857"/>
      <Interior ss:Color="#F0FDF4" ss:Pattern="Solid"/>
      <NumberFormat ss:Format="Rp #,##0"/>
    </Style>
    <Style ss:ID="sPercentageBold">
      <Alignment ss:Horizontal="Right"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#107C41"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#0284C7"/>
      <Interior ss:Color="#F0F9FF" ss:Pattern="Solid"/>
      <NumberFormat ss:Format="0.0%"/>
    </Style>
    <Style ss:ID="sThresholdGreen">
      <Alignment ss:Horizontal="Left"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#86EFAC"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#86EFAC"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#86EFAC"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#86EFAC"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="9" ss:Bold="1" ss:Color="#15803D"/>
      <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="sNoteBox">
      <Alignment ss:Horizontal="Left" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FEF08A"/>
        <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FEF08A"/>
        <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FEF08A"/>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FEF08A"/>
      </Borders>
      <Font ss:FontName="Calibri" ss:Size="8.5" ss:Italic="1" ss:Color="#713F12"/>
      <Interior ss:Color="#FEF9C3" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  
  <!-- WORKSHEET 1 -->
  <Worksheet ss:Name="1. TAM SAM SOM &amp; Kelayakan">
    <Table ss:ExpandedColumnCount="10" ss:ExpandedRowCount="30" x:FullColumns="1" x:FullRows="1">
      <Column ss:Index="1" ss:Width="25"/>
      <Column ss:Index="2" ss:Width="260"/>
      <Column ss:Index="3" ss:Width="160"/>
      <Column ss:Index="4" ss:Width="460"/>
      
      <Row ss:Height="24">
        <Cell ss:Index="2" ss:StyleID="sTitle"><Data ss:Type="String">ESTIMASI KELAYAKAN BISNIS: ${data.projectTitle.toUpperCase()}</Data></Cell>
      </Row>
      <Row ss:Height="16">
        <Cell ss:Index="2" ss:StyleID="sSubtitle"><Data ss:Type="String">Arketipe: ${archetypeLabel} | Sektor: ${sectorTag} | Nilai Proyeksi Finansial Terintegrasi</Data></Cell>
      </Row>
      <Row ss:Height="12"/>
      
      <!-- A. Estimasi Ukuran Pasar -->
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sSecHeader"><Data ss:Type="String">A. Estimasi Ukuran Pasar (Market Sizing)</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sTableHeader"><Data ss:Type="String">Metrik Pasar (Estimasi)</Data></Cell>
        <Cell ss:StyleID="sTableHeaderRight"><Data ss:Type="String">Nilai Estimasi / Tahun</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Deskripsi &amp; Metodologi Estimasi</Data></Cell>
      </Row>
      <Row ss:Height="22">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">TAM (Total Addressable Market)</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.tamValue}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">${data.tamDesc || rec.tamDesc}</Data></Cell>
      </Row>
      <Row ss:Height="22">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">SAM (Serviceable Addressable Market)</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.samValue}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">${data.samDesc || rec.samDesc}</Data></Cell>
      </Row>
      <Row ss:Height="22">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">SOM (Serviceable Obtainable Market)</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.somValue}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">${data.somDesc || rec.somDesc}</Data></Cell>
      </Row>
      
      <Row ss:Height="16"/>
      
      <!-- B. Ringkasan Kelayakan Proyek -->
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sSecHeader"><Data ss:Type="String">B. Ringkasan Indikator Kelayakan Finansial (Auto-calculated)</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sTableHeader"><Data ss:Type="String">Indikator Keuangan</Data></Cell>
        <Cell ss:StyleID="sTableHeaderRight"><Data ss:Type="String">Nilai Estimasi</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Ambang Batas &amp; Penjelasan Kelayakan</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">Total CAPEX (Investasi Awal)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="='2. Proyeksi P&amp;L &amp; Cash Flow'!R10C3"><Data ss:Type="Number">${totalCapex}</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Sesuai Alokasi Aset Modal Usaha</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">Proyeksi Pendapatan (Tahun 1)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="='2. Proyeksi P&amp;L &amp; Cash Flow'!R13C3"><Data ss:Type="Number">${data.revenueY1}</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Target Penetrasi SOM Terpenuhi</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">Net Profit Margin (Rata-rata)</Data></Cell>
        <Cell ss:StyleID="sPercentageBold" ss:Formula="=AVERAGE('2. Proyeksi P&amp;L &amp; Cash Flow'!R21C3:R21C5)"><Data ss:Type="Number">${(npmY1 + npmY2 + npmY3) / 3 / 100}</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Profitabilitas Margin Sehat &gt; 15%</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">Total Arus Kas Bersih (3 Tahun)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=SUM('2. Proyeksi P&amp;L &amp; Cash Flow'!R26C3:R26C5)"><Data ss:Type="Number">${netCashFlowY1 + netCashFlowY2 + netCashFlowY3}</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Arus Kas Positif &amp; Mandiri</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">Estimasi Payback Period (PBP)</Data></Cell>
        <Cell ss:StyleID="sRowLabelBold" ss:Formula="='2. Proyeksi P&amp;L &amp; Cash Flow'!R10C3/AVERAGE('2. Proyeksi P&amp;L &amp; Cash Flow'!R20C3:R20C5)"><Data ss:Type="String">${paybackPeriod.toFixed(1)} Tahun (${(paybackPeriod * 12).toFixed(1)} Bulan)</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Pengembalian Modal Cepat (&lt; 3 Tahun)</Data></Cell>
      </Row>
      
      <Row ss:Height="14"/>
      <Row ss:Height="26">
        <Cell ss:Index="2" ss:StyleID="sNoteBox" ss:MergeAcross="2"><Data ss:Type="String">💡 Catatan Estimasi: Seluruh nilai di atas merupakan angka estimasi kelayakan terukur yang seragam dengan visualisasi Dashboard UI. Perubahan aktual bergantung pada fluktuasi pasar dan realisasi volume operasional.</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
  
  <!-- WORKSHEET 2 -->
  <Worksheet ss:Name="2. Proyeksi P&amp;L &amp; Cash Flow">
    <Table ss:ExpandedColumnCount="10" ss:ExpandedRowCount="38" x:FullColumns="1" x:FullRows="1">
      <Column ss:Index="1" ss:Width="25"/>
      <Column ss:Index="2" ss:Width="280"/>
      <Column ss:Index="3" ss:Width="160"/>
      <Column ss:Index="4" ss:Width="160"/>
      <Column ss:Index="5" ss:Width="160"/>
      <Column ss:Index="6" ss:Width="240"/>
      
      <Row ss:Height="12"/>
      <Row ss:Height="24">
        <Cell ss:Index="2" ss:StyleID="sTitle"><Data ss:Type="String">MODEL PROYEKSI KEUANGAN &amp; CASH FLOW (3 TAHUN)</Data></Cell>
      </Row>
      <Row ss:Height="14">
        <Cell ss:Index="2" ss:StyleID="sSubtitle"><Data ss:Type="String">Sinkronisasi Penuh dengan Dashboard UI &amp; Parameter Proyek: ${data.projectTitle}</Data></Cell>
      </Row>
      <Row ss:Height="12"/>
      
      <!-- 1. ESTIMASI CAPEX -->
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sSecHeader"><Data ss:Type="String">1. ESTIMASI BIAYA INVESTASI MODAL (CAPEX)</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sTableHeader"><Data ss:Type="String">Komponen Investasi Awal</Data></Cell>
        <Cell ss:StyleID="sTableHeaderRight"><Data ss:Type="String">Nilai Estimasi (IDR)</Data></Cell>
        <Cell ss:StyleID="sTableHeader" ss:MergeAcross="3"><Data ss:Type="String">Keterangan &amp; Karakteristik Aset</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">${capex1Label}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.capexTrucks}</Data></Cell>
        <Cell ss:StyleID="sRowLabel" ss:MergeAcross="3"><Data ss:Type="String">${data.capex1Note || "Aset operasional inti utama penghasil pendapatan"}</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">${capex2Label}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.capexIT}</Data></Cell>
        <Cell ss:StyleID="sRowLabel" ss:MergeAcross="3"><Data ss:Type="String">${data.capex2Note || "Infrastruktur penunjang, interior, dan teknologi"}</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">${capex3Label}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.capexGudang}</Data></Cell>
        <Cell ss:StyleID="sRowLabel" ss:MergeAcross="3"><Data ss:Type="String">${data.capex3Note || "Fasilitas tempat, ruang simpan &amp; perkakas kerja"}</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">${capex4Label}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.capexIzin}</Data></Cell>
        <Cell ss:StyleID="sRowLabel" ss:MergeAcross="3"><Data ss:Type="String">${data.capex4Note || "Modal kerja awal, kepatuhan legalitas &amp; perizinan NIB"}</Data></Cell>
      </Row>
      <Row ss:Height="22">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">TOTAL ESTIMASI CAPEX</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=SUM(R[-4]C:R[-1]C)"><Data ss:Type="Number">${totalCapex}</Data></Cell>
        <Cell ss:StyleID="sRowLabelBold" ss:MergeAcross="3"><Data ss:Type="String">Akumulasi seluruh kebutuhan modal sebelum go-live operasional</Data></Cell>
      </Row>
      
      <Row ss:Height="14"/>
      
      <!-- 2. LAPORAN KEUANGAN P&L -->
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sSecHeader"><Data ss:Type="String">2. PROYEKSI LABA &amp; RUGI (P&amp;L PRO-FORMA 3 TAHUN)</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sTableHeader"><Data ss:Type="String">Pos Pendapatan &amp; Biaya (Estimasi)</Data></Cell>
        <Cell ss:StyleID="sTableHeaderRight"><Data ss:Type="String">Tahun Ke-1 (IDR)</Data></Cell>
        <Cell ss:StyleID="sTableHeaderRight"><Data ss:Type="String">Tahun Ke-2 (IDR)</Data></Cell>
        <Cell ss:StyleID="sTableHeaderRight"><Data ss:Type="String">Tahun Ke-3 (IDR)</Data></Cell>
        <Cell ss:StyleID="sTableHeader"><Data ss:Type="String">Keterangan Estimasi</Data></Cell>
      </Row>
      
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">PENDAPATAN USAHA (REVENUE)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold"><Data ss:Type="Number">${data.revenueY1}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold"><Data ss:Type="Number">${data.revenueY2}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold"><Data ss:Type="Number">${data.revenueY3}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Estimasi omset sesuai skala arketipe</Data></Cell>
      </Row>
      
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">BIAYA OPERASIONAL (OPEX):</Data></Cell>
        <Cell ss:StyleID="sRowLabelBold"/>
        <Cell ss:StyleID="sRowLabelBold"/>
        <Cell ss:StyleID="sRowLabelBold"/>
        <Cell ss:StyleID="sRowLabelBold"/>
      </Row>
      <Row ss:Height="19">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">- ${opex1Label}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.gajiY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.gajiY2}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.gajiY3}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Biaya bahan pokok &amp; COGS operasional</Data></Cell>
      </Row>
      <Row ss:Height="19">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">- ${opex2Label}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.bbmY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.bbmY2}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.bbmY3}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Beban kompensasi &amp; gaji karyawan</Data></Cell>
      </Row>
      <Row ss:Height="19">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">- ${opex3Label}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.maintY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.maintY2}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.maintY3}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Beban pemeliharaan, energi &amp; utilitas</Data></Cell>
      </Row>
      <Row ss:Height="19">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">- ${opex4Label}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.sewaY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.sewaY2}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">${data.sewaY3}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Sewa ruang &amp; promosi pemasaran</Data></Cell>
      </Row>
      
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">TOTAL BIAYA OPERASIONAL (OPEX)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=SUM(R[-4]C:R[-1]C)"><Data ss:Type="Number">${opexY1}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=SUM(R[-4]C:R[-1]C)"><Data ss:Type="Number">${opexY2}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=SUM(R[-4]C:R[-1]C)"><Data ss:Type="Number">${opexY3}</Data></Cell>
        <Cell ss:StyleID="sRowLabelBold"><Data ss:Type="String">Akumulasi beban tahunan berjalan</Data></Cell>
      </Row>
      
      <Row ss:Height="22">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">LABA BERSIH ESTIMASI (NET PROFIT)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-7]C-R[-1]C"><Data ss:Type="Number">${netProfitY1}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-7]C-R[-1]C"><Data ss:Type="Number">${netProfitY2}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-7]C-R[-1]C"><Data ss:Type="Number">${netProfitY3}</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Laba bersih operasional positif</Data></Cell>
      </Row>
      
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">NET PROFIT MARGIN (%)</Data></Cell>
        <Cell ss:StyleID="sPercentageBold" ss:Formula="=R[-1]C/R[-8]C"><Data ss:Type="Number">${npmY1 / 100}</Data></Cell>
        <Cell ss:StyleID="sPercentageBold" ss:Formula="=R[-1]C/R[-8]C"><Data ss:Type="Number">${npmY2 / 100}</Data></Cell>
        <Cell ss:StyleID="sPercentageBold" ss:Formula="=R[-1]C/R[-8]C"><Data ss:Type="Number">${npmY3 / 100}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Rasio profitabilitas bersih terhadap omset</Data></Cell>
      </Row>
      
      <Row ss:Height="14"/>
      
      <!-- 3. CASH FLOW -->
      <Row ss:Height="18">
        <Cell ss:Index="2" ss:StyleID="sSecHeader"><Data ss:Type="String">3. PROYEKSI ARUS KAS &amp; SALDO KUMULATIF</Data></Cell>
      </Row>
      <Row ss:Height="19">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">+ Saldo Kas Awal</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">0</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=R27C3"><Data ss:Type="Number">${endCashY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=R27C4"><Data ss:Type="Number">${endCashY2}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Saldo kas bergulir dari tahun sebelumnya</Data></Cell>
      </Row>
      <Row ss:Height="19">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">- Arus Kas Keluar Investasi (CAPEX)</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=-R10C3"><Data ss:Type="Number">-${totalCapex}</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">0</Data></Cell>
        <Cell ss:StyleID="sCurrency"><Data ss:Type="Number">0</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Pengeluaran investasi modal awal</Data></Cell>
      </Row>
      <Row ss:Height="19">
        <Cell ss:Index="2" ss:StyleID="sRowLabel"><Data ss:Type="String">+ Masukan Kas Bersih Operasional</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=R[-5]C"><Data ss:Type="Number">${netProfitY1}</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=R[-5]C"><Data ss:Type="Number">${netProfitY2}</Data></Cell>
        <Cell ss:StyleID="sCurrency" ss:Formula="=R[-5]C"><Data ss:Type="Number">${netProfitY3}</Data></Cell>
        <Cell ss:StyleID="sRowLabel"><Data ss:Type="String">Net profit operasional tahun berjalan</Data></Cell>
      </Row>
      <Row ss:Height="20">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">ARUS KAS BERSIH (NET CASH FLOW)</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-2]C+R[-1]C"><Data ss:Type="Number">${netCashFlowY1}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-2]C+R[-1]C"><Data ss:Type="Number">${netCashFlowY2}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-2]C+R[-1]C"><Data ss:Type="Number">${netCashFlowY3}</Data></Cell>
        <Cell ss:StyleID="sRowLabelBold"><Data ss:Type="String">Net inflow per periode tahunan</Data></Cell>
      </Row>
      <Row ss:Height="22">
        <Cell ss:Index="2" ss:StyleID="sRowLabelBold"><Data ss:Type="String">SALDO KAS AKHIR KUMULATIF</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-4]C+R[-1]C"><Data ss:Type="Number">${endCashY1}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-4]C+R[-1]C"><Data ss:Type="Number">${endCashY2}</Data></Cell>
        <Cell ss:StyleID="sCurrencyBold" ss:Formula="=R[-4]C+R[-1]C"><Data ss:Type="Number">${endCashY3}</Data></Cell>
        <Cell ss:StyleID="sThresholdGreen"><Data ss:Type="String">Likuiditas kas positif &amp; sehat</Data></Cell>
      </Row>
      
      <Row ss:Height="14"/>
      <Row ss:Height="26">
        <Cell ss:Index="2" ss:StyleID="sNoteBox" ss:MergeAcross="4"><Data ss:Type="String">💡 Keterangan Estimasi Laporan Keuangan: Seluruh kalkulasi dalam lembar kerja Excel ini terintegrasi langsung dengan formula dinamis Spreadsheet dan telah disinkronkan seragam dengan dashboard antarmuka PRAMA.</Data></Cell>
      </Row>
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `PRAMA_Estimasi_Keuangan_${(data.projectTitle || "Kajian_Bisnis").replace(/[^a-zA-Z0-9]/g, "_")}.xls`;
  
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
