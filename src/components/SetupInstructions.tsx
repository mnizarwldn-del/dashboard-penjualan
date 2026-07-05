import { useState } from "react";
import { Copy, Check, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface SetupInstructionsProps {
  isDarkMode?: boolean;
}

export default function SetupInstructions({ isDarkMode = false }: SetupInstructionsProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const appsScriptCode = `function doGet(e) {
  // CORS header configuration
  var corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var range = sheet.getDataRange();
    var values = range.getValues();
    
    if (values.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "Sheet is empty" 
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = values[0].map(function(h) { 
      return String(h).trim().toLowerCase(); 
    });
    
    var data = [];
    for (var i = 1; i < values.length; i++) {
      var row = {};
      var hasData = false;
      
      for (var j = 0; j < headers.length; j++) {
        var value = values[i][j];
        if (value !== "") {
          hasData = true;
        }
        
        // Map header names to exact expected properties
        var header = headers[j];
        if (header === "price_per_unit" || header === "total_price" || header === "quantity" || header === "id") {
          row[header] = Number(value) || 0;
        } else if (header === "date" && value instanceof Date) {
          // Format date as YYYY-MM-DD
          var yyyy = value.getFullYear();
          var mm = String(value.getMonth() + 1).padStart(2, '0');
          var dd = String(value.getDate()).padStart(2, '0');
          row[header] = yyyy + "-" + mm + "-" + dd;
        } else {
          row[header] = value;
        }
      }
      
      if (hasData) {
        data.push(row);
      }
    }
    
    var response = {
      status: "success",
      count: data.length,
      data: data
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: err.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="setup-instructions-container" 
      className={`border rounded-2xl shadow-sm overflow-hidden mb-6 transition-all duration-200 ${
        isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
      }`}
    >
      <button
        id="toggle-instructions-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-5 transition-colors text-left ${
          isDarkMode ? "bg-slate-900/60 hover:bg-slate-800/60" : "bg-slate-50/70 hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-semibold text-sm md:text-base ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>
              Panduan Hubungkan Google Sheet via Apps Script
            </h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Ikuti langkah mudah ini untuk menampilkan data dari spreadsheet pribadi Anda
            </p>
          </div>
        </div>
        <div>
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-gray-400 rotate-180 transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 transition-transform" />
          )}
        </div>
      </button>

      {isOpen && (
        <div 
          id="instructions-content" 
          className={`p-6 border-t text-sm space-y-6 ${
            isDarkMode ? "border-slate-800 text-slate-300" : "border-gray-100 text-gray-600"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className={`font-semibold text-xs uppercase tracking-wider ${isDarkMode ? "text-slate-200" : "text-gray-800"}`}>
                Langkah-Langkah:
              </h4>
              <ol className="space-y-3 list-decimal list-inside text-xs leading-relaxed">
                <li>
                  Buka file <strong className={isDarkMode ? "text-slate-200" : "text-gray-800"}>Google Sheet</strong> Anda (pastikan struktur kolom baris pertama sama persis seperti gambar: <code className={`px-1 py-0.5 rounded text-[11px] ${isDarkMode ? "bg-slate-800 text-emerald-400" : "bg-gray-100 text-gray-800"}`}>id</code>, <code className={`px-1 py-0.5 rounded text-[11px] ${isDarkMode ? "bg-slate-800 text-emerald-400" : "bg-gray-100 text-gray-800"}`}>date</code>, <code className={`px-1 py-0.5 rounded text-[11px] ${isDarkMode ? "bg-slate-800 text-emerald-400" : "bg-gray-100 text-gray-800"}`}>channel</code>, <code className={`px-1 py-0.5 rounded text-[11px] ${isDarkMode ? "bg-slate-800 text-emerald-400" : "bg-gray-100 text-gray-800"}`}>order_id</code>, <code className={`px-1 py-0.5 rounded text-[11px] ${isDarkMode ? "bg-slate-800 text-emerald-400" : "bg-gray-100 text-gray-800"}`}>product</code>, <code className={`px-1 py-0.5 rounded text-[11px] ${isDarkMode ? "bg-slate-800 text-emerald-400" : "bg-gray-100 text-gray-800"}`}>category</code>, <code className={`px-1 py-0.5 rounded text-[11px] ${isDarkMode ? "bg-slate-800 text-emerald-400" : "bg-gray-100 text-gray-800"}`}>quantity</code>, dll).
                </li>
                <li>
                  Pada menu bagian atas, pilih <strong className={isDarkMode ? "text-slate-200" : "text-gray-800"}>Ekstensi</strong> (Extensions) &gt; <strong className={isDarkMode ? "text-slate-200" : "text-gray-800"}>Apps Script</strong>.
                </li>
                <li>
                  Hapus semua kode bawaan di editor, lalu <strong className={isDarkMode ? "text-slate-200" : "text-gray-800"}>Salin dan Tempel (Paste)</strong> kode Apps Script di samping kanan.
                </li>
                <li>
                  Klik tombol <strong className={isDarkMode ? "text-slate-200" : "text-gray-800"}>Terapkan</strong> (Deploy) di kanan atas &gt; pilih <strong className={isDarkMode ? "text-slate-200" : "text-gray-800"}>Penerapan Baru</strong> (New Deployment).
                </li>
                <li>
                  Klik ikon gerigi jenis konfigurasi, pilih <strong className="text-emerald-500 font-semibold">Aplikasi Web</strong> (Web App).
                </li>
                <li>
                  Isi deskripsi bebas. Di bagian <strong className={isDarkMode ? "text-slate-200" : "text-gray-800"}>Yang memiliki akses</strong> (Who has access), pilih <strong className="text-emerald-500 font-bold">Siapa saja (Anyone)</strong>. Ini wajib agar dashboard bisa membaca datanya.
                </li>
                <li>
                  Klik <strong className={isDarkMode ? "text-slate-200" : "text-gray-800"}>Terapkan</strong>, berikan izin akses (Authorize) menggunakan akun Google Anda jika diminta.
                </li>
                <li className="text-emerald-500 font-semibold">
                  Salin URL Aplikasi Web yang dihasilkan, lalu masukkan ke kolom input koneksi di atas dashboard ini!
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-xs uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                  Kode Google Apps Script:
                </span>
                <button
                  id="copy-script-btn"
                  onClick={copyToClipboard}
                  className={`flex items-center space-x-1.5 text-xs font-medium transition-colors px-2.5 py-1.5 rounded-lg ${
                    isDarkMode ? "bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <pre className={`text-xs p-4 rounded-xl overflow-x-auto max-h-[320px] font-mono leading-relaxed border shadow-inner ${
                  isDarkMode ? "bg-slate-950 text-emerald-400 border-slate-800" : "bg-gray-950 text-emerald-400 border-gray-800"
                }`}>
                  {appsScriptCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
