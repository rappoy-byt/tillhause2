import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Printer, Download, ExternalLink, Check, Sparkles } from 'lucide-react';

const DEFAULT_TABLES = [
  '01', '02', '03', '04', '05',
  '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15',
  '16', '17', '18', '19', '20'
];

export default function AdminTableQR() {
  const [tableList, setTableList] = useState(DEFAULT_TABLES);
  const [newTableNum, setNewTableNum] = useState('');
  const [copiedTable, setCopiedTable] = useState(null);
  const containerRef = useRef(null);

  const networkIp = '10.17.217.212';
  const rawHost = typeof window !== 'undefined' ? window.location.origin : `http://${networkIp}:5173`;
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const currentHost = isLocal 
    ? rawHost.replace('localhost', networkIp).replace('127.0.0.1', networkIp)
    : rawHost;

  // Add custom table
  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTableNum.trim()) return;
    const formatted = newTableNum.trim();
    if (!tableList.includes(formatted)) {
      setTableList([...tableList, formatted]);
    }
    setNewTableNum('');
  };

  // Copy link helper
  const handleCopyLink = (tableNum) => {
    const url = `${currentHost}/?meja=${encodeURIComponent(tableNum)}`;
    navigator.clipboard.writeText(url);
    setCopiedTable(tableNum);
    setTimeout(() => setCopiedTable(null), 2000);
  };

  // Download individual QR
  const handleDownloadSingle = (tableNum) => {
    const canvas = document.getElementById(`qr-canvas-${tableNum}`);
    if (!canvas) return;

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `QR-Meja-${tableNum}-TileHause.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Print all selected table standees
  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cardsHtml = tableList.map((num) => {
      const canvas = document.getElementById(`qr-canvas-${num}`);
      const qrDataUrl = canvas ? canvas.toDataURL('image/png') : '';

      return `
        <div class="card">
          <div class="logo">Tile Hause</div>
          <div class="tagline">Direct Table Ordering</div>

          <div class="table-box">
            <div class="table-label">Nomor Meja</div>
            <div class="table-number">MEJA ${num}</div>
          </div>

          <div class="qr-wrapper">
            <img src="${qrDataUrl}" alt="QR Meja ${num}" />
          </div>

          <div class="instruction">SCAN QR UNTUK PESAN MENU</div>
          <div class="sub-instruction">Arahkan Kamera HP Anda ke QR Code di atas</div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak Semua QR Standee Meja - Tile Hause</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #ffffff;
            }
            .grid-container {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
            }
            .card {
              box-sizing: border-box;
              border: 3px solid #ff5a00;
              border-radius: 24px;
              padding: 24px 16px;
              text-align: center;
              background: #ffffff;
              page-break-inside: avoid;
            }
            .logo {
              font-weight: 900;
              font-size: 18px;
              color: #121214;
            }
            .tagline {
              font-size: 10px;
              color: #ff5a00;
              font-weight: 800;
              margin-bottom: 14px;
              text-transform: uppercase;
            }
            .table-box {
              background: #fff5ee;
              border: 2px dashed #ff5a00;
              border-radius: 14px;
              padding: 8px;
              margin-bottom: 14px;
            }
            .table-label {
              font-size: 9px;
              color: #64748b;
              font-weight: 700;
              text-transform: uppercase;
            }
            .table-number {
              font-size: 28px;
              font-weight: 900;
              color: #ff5a00;
              line-height: 1;
            }
            .qr-wrapper img {
              width: 150px;
              height: 150px;
              display: block;
              margin: 0 auto;
            }
            .instruction {
              font-size: 11px;
              font-weight: 800;
              color: #1e293b;
              margin-top: 12px;
            }
            .sub-instruction {
              font-size: 9px;
              color: #64748b;
              margin-top: 2px;
            }
          </style>
        </head>
        <body>
          <div class="grid-container">
            ${cardsHtml}
          </div>
          <script>
            window.onload = () => {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/80">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            Generator QR Meja
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Buat, unduh, dan cetak QR Code untuk setiap meja di restoran.
          </p>
        </div>
        
        <button
          onClick={handlePrintAll}
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Semua ({tableList.length})</span>
        </button>
      </div>

      {/* Info Banner & Add Form */}
      <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[11px]">
            <Sparkles className="w-4 h-4" />
            <span>Info Sistem</span>
          </div>
          <p className="text-zinc-300 text-xs">
            Pastikan pelanggan terhubung ke jaringan yang sama jika menggunakan IP lokal (<span className="font-mono text-emerald-400">{currentHost}</span>).
          </p>
        </div>

        {/* Add Custom Table Form */}
        <form onSubmit={handleAddTable} className="flex items-center gap-2 w-full lg:w-auto">
          <input
            type="text"
            value={newTableNum}
            onChange={(e) => setNewTableNum(e.target.value)}
            placeholder="+ Meja Baru (misal: 21)"
            className="bg-zinc-900 border border-zinc-700 text-white text-xs px-3 py-2 rounded-xl outline-none focus:border-emerald-500 w-full lg:w-48 transition-colors"
          />
          <button
            type="submit"
            className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-xs px-4 py-2 rounded-xl shrink-0 transition-colors"
          >
            Tambah
          </button>
        </form>
      </div>

      {/* QR Cards Grid */}
      <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tableList.map((tableNum) => {
          const tableTargetUrl = `${currentHost}/?meja=${encodeURIComponent(tableNum)}`;

          return (
            <div
              key={tableNum}
              className="bg-zinc-900 text-zinc-100 rounded-3xl p-5 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all"
            >
              {/* Standee Preview Header */}
              <div className="text-center space-y-1">
                <div className="font-black text-sm text-white tracking-tight">
                  Tile Hause
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl py-1 px-3 inline-block">
                  <span className="text-xs font-black text-emerald-400 tracking-wider uppercase">
                    MEJA {tableNum}
                  </span>
                </div>
              </div>

              {/* QR Canvas */}
              <div className="flex justify-center p-3 bg-white rounded-2xl">
                <QRCodeCanvas
                  id={`qr-canvas-${tableNum}`}
                  value={tableTargetUrl}
                  size={140}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: '/tilehause-logo-dark.png',
                    x: undefined,
                    y: undefined,
                    height: 28,
                    width: 28,
                    excavate: true,
                  }}
                />
              </div>

              {/* Instruction Footer */}
              <div className="text-center space-y-1">
                <div className="text-[11px] font-extrabold text-zinc-300 uppercase tracking-wide">
                  SCAN QR UNTUK PESAN
                </div>
                <p className="text-[9px] text-zinc-500 font-mono truncate px-1" title={tableTargetUrl}>
                  {tableTargetUrl}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-zinc-800 grid grid-cols-3 gap-2">
                {/* Test Open Link */}
                <a
                  href={tableTargetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                  title="Buka Link Meja di Tab Baru"
                >
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                  <span>Test</span>
                </a>

                {/* Download PNG */}
                <button
                  type="button"
                  onClick={() => handleDownloadSingle(tableNum)}
                  className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                  title="Download File Gambar PNG"
                >
                  <Download className="w-3 h-3 text-blue-400" />
                  <span>PNG</span>
                </button>

                {/* Copy Link */}
                <button
                  type="button"
                  onClick={() => handleCopyLink(tableNum)}
                  className="py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                  title="Salin URL Link"
                >
                  {copiedTable === tableNum ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <span>Copy</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
