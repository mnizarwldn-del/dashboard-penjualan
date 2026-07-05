import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, X } from "lucide-react";
import { SaleRecord } from "../types";

interface DataTableProps {
  data: SaleRecord[];
  isDarkMode?: boolean;
}

type SortField = "id" | "date" | "order_id" | "product" | "quantity" | "price_per_unit" | "total_price" | "customer_name" | "city";
type SortOrder = "asc" | "desc";

export default function DataTable({ data, isDarkMode = false }: DataTableProps) {
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Handle Header Sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  // Filter & Sort Data
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.product?.toLowerCase().includes(term) ||
          r.order_id?.toLowerCase().includes(term) ||
          r.customer_name?.toLowerCase().includes(term) ||
          r.city?.toLowerCase().includes(term) ||
          r.sales_rep?.toLowerCase().includes(term)
      );
    }

    // Apply Sorting
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle null/undefined
      if (aVal === undefined || aVal === null) aVal = "";
      if (bVal === undefined || bVal === null) bVal = "";

      // Date comparison
      if (sortField === "date") {
        const timeA = new Date(aVal).getTime() || 0;
        const timeB = new Date(bVal).getTime() || 0;
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      }

      // Numeric comparison
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      // String comparison
      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      if (strA < strB) return sortOrder === "asc" ? -1 : 1;
      if (strA > strB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, searchTerm, sortField, sortOrder]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  // Total Pages
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize) || 1;

  // Format Helper
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Dynamic Badge Classes
  const getPaymentBadgeClass = (method: string) => {
    const upperMethod = method?.toUpperCase();
    if (isDarkMode) {
      switch (upperMethod) {
        case "QRIS":
          return "bg-teal-950/40 text-teal-300 border-teal-900/50";
        case "E-WALLET":
          return "bg-purple-950/40 text-purple-300 border-purple-900/50";
        case "COD":
          return "bg-amber-950/40 text-amber-300 border-amber-900/50";
        case "TRANSFER":
          return "bg-blue-950/40 text-blue-300 border-blue-900/50";
        case "CASH":
          return "bg-slate-800 text-slate-300 border-slate-700";
        default:
          return "bg-slate-800 text-slate-300 border-slate-700";
      }
    } else {
      switch (upperMethod) {
        case "QRIS":
          return "bg-teal-50 text-teal-700 border-teal-100";
        case "E-WALLET":
          return "bg-purple-50 text-purple-700 border-purple-100";
        case "COD":
          return "bg-amber-50 text-amber-700 border-amber-100";
        case "TRANSFER":
          return "bg-blue-50 text-blue-700 border-blue-100";
        case "CASH":
          return "bg-slate-50 text-slate-700 border-slate-100";
        default:
          return "bg-gray-50 text-gray-700 border-gray-100";
      }
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    const lowerCat = cat?.toLowerCase();
    if (isDarkMode) {
      switch (lowerCat) {
        case "retail":
          return "bg-sky-950/40 text-sky-300 border-sky-900/50";
        case "poultry":
          return "bg-orange-950/40 text-orange-300 border-orange-900/50";
        case "feed":
          return "bg-amber-950/40 text-amber-300 border-amber-900/50";
        case "equipment":
          return "bg-violet-950/40 text-violet-300 border-violet-900/50";
        case "supplement":
          return "bg-rose-950/40 text-rose-300 border-rose-900/50";
        default:
          return "bg-slate-800 text-slate-300 border-slate-700";
      }
    } else {
      switch (lowerCat) {
        case "retail":
          return "bg-sky-50 text-sky-700 border-sky-100";
        case "poultry":
          return "bg-orange-50 text-orange-700 border-orange-100";
        case "feed":
          return "bg-amber-100 text-amber-800 border-amber-200";
        case "equipment":
          return "bg-violet-50 text-violet-700 border-violet-100";
        case "supplement":
          return "bg-rose-50 text-rose-700 border-rose-100";
        default:
          return "bg-gray-50 text-gray-700 border-gray-100";
      }
    }
  };

  return (
    <div 
      id="data-table-section" 
      className={`rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all duration-200 ${
        isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-100 text-slate-800"
      }`}
    >
      {/* Table Header Controls */}
      <div className={`p-5 border-b transition-colors duration-200 ${isDarkMode ? "border-slate-800 bg-slate-900/60" : "border-gray-100 bg-slate-50/50"}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className={`font-bold text-base ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>Rincian Transaksi Penjualan</h4>
            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>
              Menampilkan {filteredAndSortedData.length} dari {data.length} transaksi terfilter
            </p>
          </div>
          <div className="flex items-center space-x-3 self-stretch md:self-auto">
            <div className="relative flex-1 md:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </span>
              <input
                id="table-search-input"
                type="text"
                placeholder="Cari produk, kota, rep..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full text-xs pl-9 pr-4 py-2 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDarkMode 
                    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500" 
                    : "bg-white border-gray-200 text-slate-800 placeholder-gray-400"
                }`}
              />
            </div>
            {searchTerm && (
              <button
                id="reset-filters-btn"
                onClick={resetFilters}
                className={`flex items-center space-x-1 text-xs font-semibold py-2 px-3 border rounded-xl transition-all ${
                  isDarkMode 
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700" 
                    : "bg-red-50 hover:bg-red-100/70 text-red-600 border-transparent"
                }`}
              >
                <span className="hidden sm:inline">Reset Cari</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Responsive Container */}
      <div className="overflow-x-auto">
        <table id="sales-records-table" className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${isDarkMode ? "bg-slate-800/40 border-slate-800" : "bg-slate-50 border-gray-100"}`}>
              <th 
                onClick={() => handleSort("id")} 
                className={`p-4 text-xs font-bold cursor-pointer select-none transition-colors ${
                  isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("date")} 
                className={`p-4 text-xs font-bold cursor-pointer select-none transition-colors ${
                  isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>Tanggal</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className={`p-4 text-xs font-bold select-none ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Channel</th>
              <th 
                onClick={() => handleSort("order_id")} 
                className={`p-4 text-xs font-bold cursor-pointer select-none transition-colors ${
                  isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>Order ID</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("product")} 
                className={`p-4 text-xs font-bold cursor-pointer select-none transition-colors ${
                  isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>Produk</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className={`p-4 text-xs font-bold select-none ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Kategori</th>
              <th 
                onClick={() => handleSort("quantity")} 
                className={`p-4 text-xs font-bold cursor-pointer select-none transition-colors text-right ${
                  isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Qty</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("price_per_unit")} 
                className={`p-4 text-xs font-bold cursor-pointer select-none transition-colors text-right ${
                  isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Harga Satuan</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("total_price")} 
                className={`p-4 text-xs font-bold cursor-pointer select-none transition-colors text-right ${
                  isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Total Harga</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("customer_name")} 
                className={`p-4 text-xs font-bold cursor-pointer select-none transition-colors ${
                  isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>Nama Pelanggan</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("city")} 
                className={`p-4 text-xs font-bold cursor-pointer select-none transition-colors ${
                  isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <span>Kota</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className={`p-4 text-xs font-bold select-none ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Pembayaran</th>
              <th className={`p-4 text-xs font-bold select-none ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Sales Rep</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={13} className={`p-8 text-center text-xs ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>
                  Tidak ada data penjualan ditemukan dengan filter aktif.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr 
                  key={row.id} 
                  className={`border-b transition-colors ${
                    isDarkMode ? "border-slate-800/80 hover:bg-slate-800/30" : "border-gray-100 hover:bg-slate-50/50"
                  }`}
                >
                  <td className={`p-4 text-xs font-mono font-medium ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>#{row.id}</td>
                  <td className={`p-4 text-xs whitespace-nowrap ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                    {new Date(row.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                  <td className="p-4 text-xs whitespace-nowrap">
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-md ${
                      isDarkMode ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"
                    }`}>
                      {row.channel}
                    </span>
                  </td>
                  <td className={`p-4 text-xs font-mono font-semibold whitespace-nowrap ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>{row.order_id}</td>
                  <td className={`p-4 text-xs font-semibold whitespace-nowrap ${isDarkMode ? "text-slate-200" : "text-gray-800"}`}>{row.product}</td>
                  <td className="p-4 text-xs whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(row.category)}`}>
                      {row.category}
                    </span>
                  </td>
                  <td className={`p-4 text-xs font-bold text-right ${isDarkMode ? "text-slate-100" : "text-gray-900"}`}>{row.quantity}</td>
                  <td className={`p-4 text-xs font-mono text-right ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>{formatIDR(row.price_per_unit)}</td>
                  <td className={`p-4 text-xs font-bold font-mono text-right ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>{formatIDR(row.total_price)}</td>
                  <td className={`p-4 text-xs whitespace-nowrap font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{row.customer_name}</td>
                  <td className={`p-4 text-xs whitespace-nowrap font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{row.city}</td>
                  <td className="p-4 text-xs whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getPaymentBadgeClass(row.payment_method)}`}>
                      {row.payment_method}
                    </span>
                  </td>
                  <td className="p-4 text-xs whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <div className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"
                      }`}>
                        {row.sales_rep?.charAt(0)}
                      </div>
                      <span className={`font-semibold text-[11px] ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{row.sales_rep}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDarkMode ? "border-slate-800 bg-slate-900/40" : "border-gray-100 bg-slate-50/30"
      }`}>
        <div className={`flex items-center space-x-2 text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
          <span>Tampilkan</span>
          <select
            id="table-page-size-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={`border rounded px-1.5 py-0.5 font-medium focus:outline-none ${
              isDarkMode ? "border-slate-700 bg-slate-800 text-slate-200" : "border-gray-200 bg-white"
            }`}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>baris per halaman</span>
        </div>

        <div className={`flex items-center space-x-3 text-xs ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
          <span>
            Halaman <strong className={isDarkMode ? "text-slate-200" : "text-gray-700"}>{currentPage}</strong> dari <strong className={isDarkMode ? "text-slate-200" : "text-gray-700"}>{totalPages}</strong>
          </span>
          <div className="flex items-center space-x-1">
            <button
              id="prev-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`p-1.5 border rounded-lg transition-all ${
                isDarkMode 
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-20" 
                  : "border-gray-200 text-gray-600 hover:bg-slate-100 disabled:opacity-40"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="next-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`p-1.5 border rounded-lg transition-all ${
                isDarkMode 
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-20" 
                  : "border-gray-200 text-gray-600 hover:bg-slate-100 disabled:opacity-40"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
