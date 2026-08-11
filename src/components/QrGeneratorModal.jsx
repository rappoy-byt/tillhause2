import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Download, ExternalLink, Printer, CheckCircle2, Sparkles } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useCartStore } from '../store/useCartStore';

const PRESET_TABLES = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '15', '20'];

export default function QrGeneratorModal() {
  const { isQrModalOpen, setIsQrModalOpen, setTableNumber, initTableFromUrl } = useCartStore();
  const [selectedTable, setSelectedTable] = useState('05');
  const [customTable, setCustomTable] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  if (!isQrModalOpen) return null;

  const networkIp = '10.17.217.212';
  const rawHost = typeof window !== 'undefined' ? window.location.origin : `http://${networkIp}:5173`;
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const currentHost = isLocal 
    ? rawHost.replace('localhost', networkIp).replace('127.0.0.1', networkIp)
    : rawHost;
  const activeTableNum = customTable.trim() || selectedTable;
  const qrTargetUrl = `${currentHost}/?meja=${encodeURIComponent(activeTableNum)}`;

  // Download QR as PNG
  const downloadQrCode = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `QR-Meja-${activeTableNum}-TileHause.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Simulate scanning QR (Opens/sets table locally)
  const handleSimulateScan = () => {
    // Update browser URL without reload
    const newUrl = `${window.location.pathname}?meja=${encodeURIComponent(activeTableNum)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    // Call store initializer
    initTableFromUrl();
    setIsQrModalOpen(false);
  };

  // Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrTargetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print Table Standee Card
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    const qrDataUrl = canvas ? canvas.toDataURL('image/png') : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cetak QR Meja ${activeTableNum} - Tile Hause</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background-color: #f1f5f9;
            }
            .card {
              width: 320px;
              background: #ffffff;
              border-radius: 24px;
              padding: 32px 24px;
              text-align: center;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              border: 3px solid #ff5a00;
            }
            .logo {
              font-weight: 900;
              font-size: 20px;
              color: #121214;
              letter-spacing: -0.5px;
            }
            .tagline {
              font-size: 11px;
              color: #ff5a00;
              font-weight: 800;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .table-box {
              background: #fff5ee;
              border: 2px dashed #ff5a00;
              border-radius: 16px;
              padding: 10px;
              margin-bottom: 20px;
            }
            .table-label {
              font-size: 10px;
              color: #64748b;
              font-weight: 700;
              text-transform: uppercase;
            }
            .table-number {
              font-size: 32px;
              font-weight: 900;
              color: #ff5a00;
              line-height: 1;
            }
            .qr-wrapper {
              background: #ffffff;
              padding: 16px;
              border-radius: 16px;
              display: inline-block;
              box-shadow: 0 4px 12px rgba(0,0,0,0.06);
              border: 1px solid #e2e8f0;
            }
            .qr-wrapper img {
              width: 180px;
              height: 180px;
              display: block;
            }
            .instruction {
              font-size: 12px;
              font-weight: 800;
              color: #1e293b;
              margin-top: 16px;
            }
            .sub-instruction {
              font-size: 10px;
              color: #64748b;
              margin-top: 4px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo">Tile Hause</div>
            <div class="tagline">Direct Table Ordering</div>

            <div class="table-box">
              <div class="table-label">Nomor Meja</div>
              <div class="table-number">MEJA ${activeTableNum}</div>
            </div>

            <div class="qr-wrapper">
              <img src="${qrDataUrl}" alt="QR Meja ${activeTableNum}" />
            </div>

            <div class="instruction">SCAN QR UNTUK PESAN MENU</div>
            <div class="sub-instruction">Buka Kamera HP & arahkan ke QR Code di atas</div>
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsQrModalOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden max-h-[92vh] flex flex-col z-10 shadow-2xl text-slate-900 border border-slate-100"
        >
          {/* Top Handle */}
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />

          {/* Modal Header */}
          <div className="px-5 pt-3 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-[#FFF5EE] text-[#FF5A00] flex items-center justify-center border border-[#FF5A00]/20">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 font-display leading-tight">
                  QR Code Meja Generator
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Buat & test scan QR Meja secara langsung
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 space-y-5 overflow-y-auto flex-1 no-scrollbar bg-slate-50/50">
            {/* Select Table Number */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Pilih Nomor Meja
                </label>
                <span className="text-[10px] font-bold text-[#FF5A00] bg-[#FFF5EE] px-2 py-0.5 rounded-md border border-[#FF5A00]/20">
                  Meja Active: {activeTableNum}
                </span>
              </div>

              {/* Preset Table Buttons */}
              <div className="grid grid-cols-5 gap-1.5">
                {PRESET_TABLES.map((table) => {
                  const isSelected = selectedTable === table && !customTable;
                  return (
                    <button
                      key={table}
                      type="button"
                      onClick={() => {
                        setSelectedTable(table);
                        setCustomTable('');
                      }}
                      className={`py-2 rounded-xl text-xs font-extrabold text-center transition-all ${
                        isSelected
                          ? 'bg-[#FF5A00] text-white shadow-sm scale-[1.03]'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Meja {table}
                    </button>
                  );
                })}
              </div>

              {/* Custom Table Input */}
              <div className="pt-1">
                <input
                  type="text"
                  value={customTable}
                  onChange={(e) => setCustomTable(e.target.value)}
                  placeholder="Atau ketik nomor/nama meja khusus (misal: Outdoor-01)..."
                  className="w-full bg-white border border-slate-200 focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/20 rounded-2xl px-3.5 py-2 text-xs text-slate-900 outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            {/* QR Card Showcase Area */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md text-center space-y-3 relative overflow-hidden">
              <div className="inline-block bg-[#FFF5EE] border border-[#FF5A00]/30 px-3 py-1 rounded-full text-[11px] font-black text-[#FF5A00] uppercase tracking-wider">
                Meja {activeTableNum}
              </div>

              {/* Dynamic QR Canvas */}
              <div ref={qrRef} className="flex justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-xs w-fit mx-auto">
                <QRCodeCanvas
                  value={qrTargetUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: '/tilehause-logo-dark.png',
                    x: undefined,
                    y: undefined,
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-extrabold text-slate-800">
                  SCAN QR UNTUK PESAN
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  URL Target: <span className="font-mono text-[#FF5A00]">{qrTargetUrl}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2">
              {/* Simulate Scan Button */}
              <button
                type="button"
                onClick={handleSimulateScan}
                className="w-full bg-[#FF5A00] hover:bg-[#E55000] active:scale-[0.98] text-white font-black text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulasi Scan QR Meja Ini (Test HP / Lokal)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Download Button */}
                <button
                  type="button"
                  onClick={downloadQrCode}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-extrabold text-xs py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF5A00]" />
                  <span>Download PNG</span>
                </button>

                {/* Print Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-extrabold text-xs py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>Cetak Standee</span>
                </button>
              </div>

              {/* Copy URL Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-slate-800 py-1 flex items-center justify-center gap-1 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-extrabold">Link Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Salin Link URL Meja ini</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
