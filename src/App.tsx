import { useState, useEffect, useMemo, FormEvent } from "react";
import {
  FileSpreadsheet,
  Link2,
  Link2Off,
  RefreshCw,
  AlertCircle,
  Database,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users2,
  CheckCircle2,
  Calendar,
  Filter,
  X,
  Sun,
  Moon
} from "lucide-react";
import { initialMockSales } from "./mockData";
import { SaleRecord } from "./types";
import SetupInstructions from "./components/SetupInstructions";
import MetricCard from "./components/MetricCard";
import SalesCharts from "./components/SalesCharts";
import DataTable from "./components/DataTable";

export default function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [connectedUrl, setConnectedUrl] = useState("");
  const [salesData, setSalesData] = useState<SaleRecord[]>(initialMockSales);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Global Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedChannel, setSelectedChannel] = useState("Semua");
  const [selectedCity, setSelectedCity] = useState("Semua");
  const [selectedSalesRep, setSelectedSalesRep] = useState("Semua");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Semua");

  // Load persisted URL & Theme on startup
  useEffect(() => {
    const savedUrl = localStorage.getItem("google_sheet_apps_script_url");
    if (savedUrl) {
      setInputUrl(savedUrl);
      fetchLiveSheetData(savedUrl);
    }
  }, []);

  // Set Theme Class on Document Element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#020617"; // Slate 950
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f8fafc"; // Slate 50
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const fetchLiveSheetData = async (url: string) => {
    if (!url.trim()) {
      setErrorMsg("Harap masukkan URL Google Apps Script yang valid.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch(url, { method: "GET", redirect: "follow" });
      
      if (!response.ok) {
        throw new Error(`Koneksi HTTP gagal: Status ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === "success" && Array.isArray(result.data)) {
        const formatted: SaleRecord[] = result.data.map((item: any, idx: number) => {
          const qty = Number(item.quantity) || 0;
          const price = Number(item.price_per_unit) || 0;
          const total = Number(item.total_price) || (qty * price) || 0;

          return {
            id: Number(item.id) || (idx + 1),
            date: item.date ? String(item.date) : new Date().toISOString().split("T")[0],
            channel: item.channel ? String(item.channel) : "Offline - Toko",
            order_id: item.order_id ? String(item.order_id) : `ORD-LIV-${1000 + idx}`,
            product: item.product ? String(item.product) : "Produk Umum",
            category: item.category ? String(item.category) : "Retail",
            quantity: qty,
            price_per_unit: price,
            total_price: total,
            customer_name: item.customer_name ? String(item.customer_name) : `Pelanggan #${idx + 1}`,
            city: item.city ? String(item.city) : "Jakarta",
            payment_method: item.payment_method ? String(item.payment_method) : "Cash",
            sales_rep: item.sales_rep ? String(item.sales_rep) : "Sales Team"
          };
        });

        if (formatted.length === 0) {
          throw new Error("Koneksi berhasil tetapi sheet Anda tidak memiliki baris data.");
        }

        const sorted = formatted.sort((a, b) => b.date.localeCompare(a.date));
        
        setSalesData(sorted);
        setConnectedUrl(url);
        setIsLive(true);
        localStorage.setItem("google_sheet_apps_script_url", url);
        setSuccessMsg(`Berhasil menghubungkan dan memuat ${formatted.length} baris data penjualan!`);
      } else {
        throw new Error(result.message || "Data sheet kosong atau format respon JSON salah.");
      }
    } catch (err: any) {
      console.error("Error fetching Google Sheet:", err);
      setErrorMsg(
        `Gagal terhubung ke Google Sheet. Periksa kembali langkah deploy Google Apps Script Anda. Pastikan akses disetel ke 'Anyone' (Siapa saja). Detail error: ${err.message || err}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (e: FormEvent) => {
    e.preventDefault();
    fetchLiveSheetData(inputUrl);
  };

  const handleDisconnect = () => {
    setSalesData(initialMockSales);
    setConnectedUrl("");
    setInputUrl("");
    setIsLive(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    resetAllFilters();
    localStorage.removeItem("google_sheet_apps_script_url");
  };

  const handleRefresh = () => {
    if (connectedUrl) {
      fetchLiveSheetData(connectedUrl);
    }
  };

  // Extract unique options dynamically from salesData
  const filterOptions = useMemo(() => {
    const categoriesSet = new Set<string>();
    const channelsSet = new Set<string>();
    const citiesSet = new Set<string>();
    const salesRepsSet = new Set<string>();
    const paymentMethodsSet = new Set<string>();

    salesData.forEach((row) => {
      if (row.category) categoriesSet.add(row.category);
      if (row.channel) channelsSet.add(row.channel);
      if (row.city) citiesSet.add(row.city);
      if (row.sales_rep) salesRepsSet.add(row.sales_rep);
      if (row.payment_method) paymentMethodsSet.add(row.payment_method);
    });

    return {
      categories: ["Semua", ...Array.from(categoriesSet).sort()],
      channels: ["Semua", ...Array.from(channelsSet).sort()],
      cities: ["Semua", ...Array.from(citiesSet).sort()],
      salesReps: ["Semua", ...Array.from(salesRepsSet).sort()],
      paymentMethods: ["Semua", ...Array.from(paymentMethodsSet).sort()],
    };
  }, [salesData]);

  // Apply Global Filters
  const filteredSalesData = useMemo(() => {
    return salesData.filter((row) => {
      // Tanggal Awal
      if (startDate && row.date) {
        if (row.date < startDate) return false;
      }
      // Tanggal Akhir
      if (endDate && row.date) {
        if (row.date > endDate) return false;
      }
      // Kategori
      if (selectedCategory !== "Semua" && row.category !== selectedCategory) {
        return false;
      }
      // Channel
      if (selectedChannel !== "Semua" && row.channel !== selectedChannel) {
        return false;
      }
      // Kota
      if (selectedCity !== "Semua" && row.city !== selectedCity) {
        return false;
      }
      // Sales Rep
      if (selectedSalesRep !== "Semua" && row.sales_rep !== selectedSalesRep) {
        return false;
      }
      // Metode Pembayaran
      if (selectedPaymentMethod !== "Semua" && row.payment_method !== selectedPaymentMethod) {
        return false;
      }
      return true;
    });
  }, [
    salesData,
    startDate,
    endDate,
    selectedCategory,
    selectedChannel,
    selectedCity,
    selectedSalesRep,
    selectedPaymentMethod
  ]);

  const resetAllFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCategory("Semua");
    setSelectedChannel("Semua");
    setSelectedCity("Semua");
    setSelectedSalesRep("Semua");
    setSelectedPaymentMethod("Semua");
  };

  const hasActiveFilters = useMemo(() => {
    return (
      startDate !== "" ||
      endDate !== "" ||
      selectedCategory !== "Semua" ||
      selectedChannel !== "Semua" ||
      selectedCity !== "Semua" ||
      selectedSalesRep !== "Semua" ||
      selectedPaymentMethod !== "Semua"
    );
  }, [startDate, endDate, selectedCategory, selectedChannel, selectedCity, selectedSalesRep, selectedPaymentMethod]);

  // Dynamically calculate KPIs based on filtered dataset
  const stats = useMemo(() => {
    const totalRevenue = filteredSalesData.reduce((sum, item) => sum + item.total_price, 0);
    const totalTransactions = filteredSalesData.length;
    const totalQuantity = filteredSalesData.reduce((sum, item) => sum + item.quantity, 0);
    const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      totalRevenue,
      totalTransactions,
      totalQuantity,
      averageOrderValue
    };
  }, [filteredSalesData]);

  // Format currency
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div 
      id="app-root-container" 
      className={`min-h-screen pb-16 antialiased transition-colors duration-200 ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* Top Header Panel */}
      <header 
        id="main-header" 
        className={`sticky top-0 z-40 transition-colors duration-200 border-b shadow-xs ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-lg font-extrabold tracking-tight ${isDarkMode ? "text-slate-100" : "text-slate-950"}`}>
                Dashboard Penjualan
              </h1>
              <p className={`text-[10px] font-medium ${isDarkMode ? "text-slate-400" : "text-slate-400"}`}>
                Google Sheets Live Analytics Engine
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Connection Status Badge */}
            <div className="hidden sm:block">
              {isLive ? (
                <span 
                  id="live-status-badge" 
                  className={`inline-flex items-center space-x-1.5 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border ${
                    isDarkMode 
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-400" 
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Mode (Sheet Terhubung)</span>
                </span>
              ) : (
                <span 
                  id="demo-status-badge" 
                  className={`inline-flex items-center space-x-1.5 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border ${
                    isDarkMode 
                      ? "bg-amber-950/40 border-amber-800 text-amber-400" 
                      : "bg-amber-50 border-amber-200 text-amber-800"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Demo Mode (Data Contoh)</span>
                </span>
              )}
            </div>

            {/* Dark Mode Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                isDarkMode 
                  ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300" 
                  : "bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200 hover:text-indigo-700"
              }`}
              title={isDarkMode ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Connection Setup Card */}
        <section 
          id="connector-control-card" 
          className={`p-6 rounded-2xl border shadow-sm transition-colors duration-200 ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-100 text-slate-800"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl space-y-1">
              <h3 className={`text-base font-bold flex items-center space-x-2 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                <Database className="w-4.5 h-4.5 text-emerald-500" />
                <span>Koneksi Sumber Data Google Sheet</span>
              </h3>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Gunakan Google Apps Script untuk menghubungkan file Google Sheet Anda secara real-time. Dashboard ini akan secara otomatis menarik data terbaru untuk dianalisis.
              </p>
            </div>

            {/* Connection Form */}
            <form id="connect-sheet-form" onSubmit={handleConnect} className="flex-1 w-full lg:max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Link2 className="w-4 h-4" />
                  </span>
                  <input
                    id="apps-script-url-input"
                    type="url"
                    placeholder="Masukkan URL Aplikasi Web Google Apps Script..."
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    disabled={isLoading}
                    required
                    className={`w-full text-xs pl-9 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all ${
                      isDarkMode 
                        ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500" 
                        : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    }`}
                  />
                </div>
                <div className="flex space-x-2">
                  {!isLive ? (
                    <button
                      id="connect-sheet-btn"
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 sm:flex-initial text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-emerald-900/10 disabled:opacity-50 flex items-center justify-center space-x-1.5"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Menghubungkan...</span>
                        </>
                      ) : (
                        <span>Hubungkan Sheet</span>
                      )}
                    </button>
                  ) : (
                    <>
                      <button
                        id="refresh-sheet-btn"
                        type="button"
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className={`p-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center ${
                          isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                        title="Perbarui Data"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                      </button>
                      <button
                        id="disconnect-sheet-btn"
                        type="button"
                        onClick={handleDisconnect}
                        className={`flex-1 sm:flex-initial text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-1 ${
                          isDarkMode ? "bg-red-950/40 hover:bg-red-900/40 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-700"
                        }`}
                      >
                        <Link2Off className="w-4 h-4" />
                        <span>Putuskan</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Error and Success States */}
          {errorMsg && (
            <div 
              id="connect-error-banner" 
              className={`mt-4 p-4 border rounded-xl text-xs flex items-start space-x-2 ${
                isDarkMode ? "bg-red-950/30 border-red-900/50 text-red-400" : "bg-red-50 border-red-100 text-red-700"
              }`}
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="leading-relaxed font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div 
              id="connect-success-banner" 
              className={`mt-4 p-4 border rounded-xl text-xs flex items-start space-x-2 ${
                isDarkMode ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400" : "bg-emerald-50 border-emerald-100 text-emerald-800"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
              <div className="leading-relaxed font-semibold">{successMsg}</div>
            </div>
          )}
        </section>

        {/* Setup Instructions Tutorial */}
        <SetupInstructions isDarkMode={isDarkMode} />

        {/* Global Filter Panel Card */}
        <section 
          id="global-filter-panel" 
          className={`p-6 rounded-2xl border shadow-sm space-y-4 transition-colors duration-200 ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-100 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold flex items-center space-x-2 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
              <Filter className="w-4.5 h-4.5 text-indigo-500" />
              <span>Filter Data Penjualan</span>
            </h3>
            {hasActiveFilters && (
              <button
                id="reset-all-filters-btn"
                onClick={resetAllFilters}
                className={`flex items-center space-x-1 text-xs font-semibold py-1.5 px-3 rounded-xl transition-all ${
                  isDarkMode ? "bg-red-950/40 hover:bg-red-900/40 text-red-400" : "bg-red-50 hover:bg-red-100/70 text-red-600"
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {/* Tanggal Awal */}
            <div className="space-y-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Tanggal Awal</span>
              </label>
              <input
                id="filter-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full text-xs py-2 px-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold ${
                  isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-200 text-gray-700"
                }`}
              />
            </div>

            {/* Tanggal Akhir */}
            <div className="space-y-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Tanggal Akhir</span>
              </label>
              <input
                id="filter-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full text-xs py-2 px-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold ${
                  isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-200 text-gray-700"
                }`}
              />
            </div>

            {/* Channel */}
            <div className="space-y-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Channel</label>
              <select
                id="filter-channel-global"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className={`w-full text-xs py-2 px-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold ${
                  isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                {filterOptions.channels.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Kategori */}
            <div className="space-y-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Kategori</label>
              <select
                id="filter-category-global"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full text-xs py-2 px-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold ${
                  isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                {filterOptions.categories.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Kota */}
            <div className="space-y-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Kota</label>
              <select
                id="filter-city-global"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={`w-full text-xs py-2 px-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold ${
                  isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                {filterOptions.cities.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Sales Rep */}
            <div className="space-y-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Sales Rep</label>
              <select
                id="filter-salesrep-global"
                value={selectedSalesRep}
                onChange={(e) => setSelectedSalesRep(e.target.value)}
                className={`w-full text-xs py-2 px-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold ${
                  isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                {filterOptions.salesReps.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Metode Pembayaran */}
            <div className="space-y-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider block ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Metode Bayar</label>
              <select
                id="filter-payment-global"
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className={`w-full text-xs py-2 px-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-semibold ${
                  isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                {filterOptions.paymentMethods.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Stats Metrics Panel */}
        <section id="metrics-panel-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            id="metric-revenue"
            title="Total Pendapatan"
            value={formatIDR(stats.totalRevenue)}
            subtext="Omzet keseluruhan transaksi"
            icon={DollarSign}
            iconBgColor={isDarkMode ? "bg-emerald-950/40" : "bg-emerald-50"}
            iconColor="text-emerald-500"
            isDarkMode={isDarkMode}
          />
          <MetricCard
            id="metric-transactions"
            title="Total Transaksi"
            value={`${stats.totalTransactions.toLocaleString("id-ID")} Transaksi`}
            subtext="Banyaknya order yang tercatat"
            icon={ShoppingBag}
            iconBgColor={isDarkMode ? "bg-indigo-950/40" : "bg-indigo-50"}
            iconColor="text-indigo-400"
            isDarkMode={isDarkMode}
          />
          <MetricCard
            id="metric-quantity"
            title="Total Unit Terjual"
            value={`${stats.totalQuantity.toLocaleString("id-ID")} Unit`}
            subtext="Akumulasi kuantitas produk"
            icon={TrendingUp}
            iconBgColor={isDarkMode ? "bg-amber-950/40" : "bg-amber-50"}
            iconColor="text-amber-500"
            isDarkMode={isDarkMode}
          />
          <MetricCard
            id="metric-aov"
            title="Rata-Rata Order (AOV)"
            value={formatIDR(stats.averageOrderValue)}
            subtext="Nilai transaksi per pesanan"
            icon={Users2}
            iconBgColor={isDarkMode ? "bg-blue-950/40" : "bg-blue-50"}
            iconColor="text-blue-400"
            isDarkMode={isDarkMode}
          />
        </section>

        {/* Analytical Charts */}
        <section id="charts-dashboard-section">
          <SalesCharts data={filteredSalesData} isDarkMode={isDarkMode} />
        </section>

        {/* Detailed Data Table */}
        <section id="data-table-dashboard-section">
          <DataTable data={filteredSalesData} isDarkMode={isDarkMode} />
        </section>
      </main>
    </div>
  );
}
