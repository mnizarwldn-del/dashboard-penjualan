import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { SaleRecord } from "../types";

interface SalesChartsProps {
  data: SaleRecord[];
  isDarkMode?: boolean;
}

export default function SalesCharts({ data, isDarkMode = false }: SalesChartsProps) {
  // 1. Trend Bulanan
  const monthlyData = useMemo(() => {
    const monthlyMap: Record<string, { month: string; revenue: number; transactions: number }> = {};
    
    // Process records
    data.forEach((record) => {
      if (!record.date) return;
      const dateParts = record.date.split("-");
      if (dateParts.length < 2) return;
      
      const yearMonth = `${dateParts[0]}-${dateParts[1]}`; // YYYY-MM
      
      // Convert to human readable month name in Indonesian
      const dateObj = new Date(record.date);
      const monthName = dateObj.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });

      if (!monthlyMap[yearMonth]) {
        monthlyMap[yearMonth] = {
          month: monthName,
          revenue: 0,
          transactions: 0
        };
      }
      monthlyMap[yearMonth].revenue += record.total_price;
      monthlyMap[yearMonth].transactions += 1;
    });

    // Sort by key (YYYY-MM)
    return Object.keys(monthlyMap)
      .sort()
      .map((key) => monthlyMap[key]);
  }, [data]);

  // 2. Kategori Produk
  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    data.forEach((record) => {
      const cat = record.category || "Lainnya";
      categoryMap[cat] = (categoryMap[cat] || 0) + record.total_price;
    });

    return Object.keys(categoryMap).map((cat) => ({
      name: cat,
      value: categoryMap[cat]
    })).sort((a, b) => b.value - a.value);
  }, [data]);

  // 3. Saluran Penjualan (Channels)
  const channelData = useMemo(() => {
    const channelMap: Record<string, { name: string; revenue: number; volume: number }> = {};
    data.forEach((record) => {
      const ch = record.channel || "Lainnya";
      if (!channelMap[ch]) {
        channelMap[ch] = { name: ch, revenue: 0, volume: 0 };
      }
      channelMap[ch].revenue += record.total_price;
      channelMap[ch].volume += record.quantity;
    });

    return Object.values(channelMap).sort((a, b) => b.revenue - a.revenue);
  }, [data]);

  // 4. Kinerja Kota (Cities)
  const cityData = useMemo(() => {
    const cityMap: Record<string, number> = {};
    data.forEach((record) => {
      const city = record.city || "Lainnya";
      cityMap[city] = (cityMap[city] || 0) + record.total_price;
    });

    return Object.keys(cityMap).map((city) => ({
      name: city,
      value: cityMap[city]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5 cities
  }, [data]);

  // Colors for charts
  const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6", "#14b8a6"];

  const formatRupiah = (value: number) => {
    if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
    }
    if (value >= 1_000) {
      return `Rp ${(value / 1_000).toFixed(0)}rb`;
    }
    return `Rp ${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-800 text-xs font-sans">
          <p className="font-semibold mb-1 text-slate-300">{label}</p>
          <p className="text-emerald-400 font-medium">
            Pendapatan: Rp {payload[0].value.toLocaleString("id-ID")}
          </p>
          {payload[1] && (
            <p className="text-indigo-300">
              Transaksi: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const SimpleTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-800 text-xs font-sans">
          <p className="font-semibold text-slate-300 mb-0.5">{payload[0].name}</p>
          <p className="text-emerald-400 font-semibold">
            Rp {payload[0].value.toLocaleString("id-ID")}
          </p>
        </div>
      );
    }
    return null;
  };

  // Reusable theme values for chart elements
  const gridStroke = isDarkMode ? "#334155" : "#f3f4f6";
  const axisColor = isDarkMode ? "#94a3b8" : "#9ca3af";
  const cityYAxisColor = isDarkMode ? "#cbd5e1" : "#4b5563";

  return (
    <div id="sales-charts-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Chart 1: Tren Pendapatan Bulanan */}
      <div 
        id="monthly-trend-chart-card" 
        className={`p-5 rounded-2xl border shadow-sm flex flex-col h-[350px] transition-colors duration-200 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-100 text-slate-800"
        }`}
      >
        <div className="mb-4">
          <h4 className={`font-bold text-base ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>Tren Pendapatan Bulanan</h4>
          <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Total penjualan historis per bulan</p>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatRupiah} tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Kontribusi Kategori Produk */}
      <div 
        id="category-contribution-chart-card" 
        className={`p-5 rounded-2xl border shadow-sm flex flex-col h-[350px] transition-colors duration-200 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-100 text-slate-800"
        }`}
      >
        <div className="mb-4">
          <h4 className={`font-bold text-base ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>Proporsi Pendapatan Kategori</h4>
          <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Share penjualan berdasarkan kategori produk</p>
        </div>
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<SimpleTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 pl-4 flex flex-col justify-center space-y-2">
            {categoryData.slice(0, 5).map((item, index) => {
              const total = categoryData.reduce((acc, curr) => acc + curr.value, 0);
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
              return (
                <div key={item.name} className="flex items-start space-x-2">
                  <div className="w-3 h-3 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isDarkMode ? "text-slate-200" : "text-gray-700"}`}>{item.name}</p>
                    <p className={`text-[10px] font-medium ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>
                      {percentage}% ({formatRupiah(item.value)})
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chart 3: Saluran Penjualan */}
      <div 
        id="channel-performance-chart-card" 
        className={`p-5 rounded-2xl border shadow-sm flex flex-col h-[350px] transition-colors duration-200 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-100 text-slate-800"
        }`}
      >
        <div className="mb-4">
          <h4 className={`font-bold text-base ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>Kinerja Saluran Penjualan (Channel)</h4>
          <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Total nilai penjualan dari setiap channel</p>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatRupiah} tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<SimpleTooltip />} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Kota Teratas */}
      <div 
        id="city-performance-chart-card" 
        className={`p-5 rounded-2xl border shadow-sm flex flex-col h-[350px] transition-colors duration-200 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-gray-100 text-slate-800"
        }`}
      >
        <div className="mb-4">
          <h4 className={`font-bold text-base ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>Top 5 Wilayah / Kota</h4>
          <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-400"}`}>Distribusi omzet berdasarkan kota pemesan</p>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
              <XAxis type="number" tickFormatter={formatRupiah} tick={{ fontSize: 9, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: cityYAxisColor, fontWeight: 500 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<SimpleTooltip />} />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={16}>
                {cityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
