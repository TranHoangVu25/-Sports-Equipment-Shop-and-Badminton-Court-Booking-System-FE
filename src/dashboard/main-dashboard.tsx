import React, { useState, useEffect, useCallback } from "react";
import { 
  Package,
  Clock,
  TrendingUp,
  RefreshCw,
  Loader2,
  Plus,
  ShoppingCart,
  BarChart2,
  Minus,
  CalendarDays
} from "lucide-react";
import { Link } from 'react-router-dom';

 import { MainLayout } from "../dashboard/layouts/main-layout"; 

// --- COMPONENT BIỂU ĐỒ DOANH THU ĐỘC LẬP ---
const RevenueChart = ({ title, icon, apiBaseUrl, primaryColor = "#4f46e5" }) => {
  // Mỗi instance của component này sẽ có state riêng, không dùng chung
  const [timeRange, setTimeRange] = useState<any>('Tháng'); // 'Tháng' -> type=0, 'Năm' -> type=1
  const [selectedYear, setSelectedYear] = useState<any>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<any>(new Date().getMonth() + 1);
  
  const [revenueData, setRevenueData] = useState<any>([]);
  const [totalRevenue, setTotalRevenue] = useState<any>(0);
  const [isLoading, setIsLoading] = useState<any>(false);
  
  const [zoomLevel, setZoomLevel] = useState<any>(1);
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  const fetchRevenue = useCallback(async () => {
    setIsLoading(true);
    setHoveredPoint(null);
    try {
      const token = localStorage.getItem('token');
      const type = timeRange === 'Tháng' ? 0 : 1;
      // Tạo URL với các tham số từ state nội bộ của biểu đồ
      const url = `${apiBaseUrl}?type=${type}&year=${selectedYear}&month=${selectedMonth}`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await response.json();
      
      if (response.ok && data.code === 0 && data.result) {
        setRevenueData(data.result);
        const total = data.result.reduce((sum, item) => {
           const valNum = Number(item.value.replace(/,/g, ''));
           return sum + valNum;
        }, 0);
        setTotalRevenue(total);
      } else {
        setRevenueData([]);
        setTotalRevenue(0);
      }
    } catch (err) {
      console.error(`Lỗi fetch ${title}:`, err);
      setRevenueData([]);
      setTotalRevenue(0);
    } finally {
      setIsLoading(false);
    }
  }, [apiBaseUrl, timeRange, selectedYear, selectedMonth, title]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // Formatters
  const formatPrice = (price) => price.toLocaleString('vi-VN') + ' ₫';
  const formatYAxis = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + ' Tỷ';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + ' Tr';
    if (num >= 1000) return (num / 1000).toFixed(0) + ' K';
    return num;
  };

  // SVG Calculation logic
  const maxVal = Math.max(...revenueData.map(item => Number(item.value.replace(/,/g, ''))), 0);
  const yAxisMax = maxVal > 0 ? maxVal * 1.2 : 100;
  
  const points = revenueData.map((item, i) => {
    const val = Number(item.value.replace(/,/g, ''));
    const x = revenueData.length > 1 ? (i / (revenueData.length - 1)) * 900 : 450;
    const y = yAxisMax > 0 ? 200 - (val / yAxisMax) * 180 : 200;
    return { x, y, tooltip: item.tooltip, label: item.label, value: val };
  });

  const linePath = points.length > 0 ? points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') : "";
  const fillPath = points.length > 0 ? `${linePath} L900,220 L0,220 Z` : "";
  const yTicks = [4, 3, 2, 1, 0].map(i => (yAxisMax * (i / 4)));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Chart Header - Chứa các Select Box riêng biệt cho từng biểu đồ */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
        <h3 className="text-base font-bold text-slate-800 flex items-center shrink-0">
          {icon} <span className="ml-2">{title}</span>
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Chế độ xem: Tháng/Năm */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            {['Tháng', 'Năm'].map((range) => (
              <button
                key={range}
                onClick={() => { setTimeRange(range); setZoomLevel(1); }}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all border-none cursor-pointer ${
                  timeRange === range ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 bg-transparent'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Chọn Tháng/Năm cụ thể */}
          <div className="flex items-center gap-1.5 ml-auto">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              disabled={timeRange === 'Năm'}
              className="border border-slate-300 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-30 cursor-pointer bg-white"
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>Tháng {m}</option>)}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-slate-300 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer bg-white"
            >
              {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={y}>Năm {y}</option>)}
            </select>
          </div>

          <button onClick={fetchRevenue} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer hidden lg:block">
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Banner Doanh thu */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-5 text-center text-white mb-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 transform -skew-x-12"></div>
          <p className="relative z-10 text-indigo-100 font-medium mb-1 uppercase tracking-widest text-[9px]">
            {timeRange === 'Tháng' ? `Doanh thu tháng ${selectedMonth}/${selectedYear}` : `Tổng doanh thu năm ${selectedYear}`}
          </p>
          <h2 className="relative z-10 text-2xl font-extrabold m-0 tracking-tight">{formatPrice(totalRevenue)}</h2>
        </div>

        {/* Toolbar & SVG Area */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">
          <div className="flex justify-end p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
              <button onClick={() => setZoomLevel(z => Math.max(1, z - 0.5))} className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 border-none bg-transparent cursor-pointer" disabled={zoomLevel <= 1}><Minus size={14}/></button>
              <span className="text-[10px] font-bold w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
              <button onClick={() => setZoomLevel(z => Math.min(4, z + 0.5))} className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 border-none bg-transparent cursor-pointer" disabled={zoomLevel >= 4}><Plus size={14}/></button>
            </div>
          </div>

          <div className="flex h-[280px] w-full relative">
            {/* Y-Axis (Cố định) */}
            <div className="w-16 md:w-20 shrink-0 relative bg-white border-r border-slate-50 z-20">
              {yTicks.map((tick, i) => (
                <span key={i} className="absolute right-2 transform -translate-y-1/2 text-[10px] font-bold text-slate-400" style={{ top: `${((20 + (i * 180 / 4)) / 220) * 100}%` }}>
                  {formatYAxis(tick)}
                </span>
              ))}
            </div>

            {/* Scrollable SVG Area */}
            <div className="flex-1 overflow-x-auto relative select-none custom-scrollbar" onMouseLeave={() => setHoveredPoint(null)}>
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 z-30 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-indigo-500 mb-2" size={28} />
                  <span className="text-xs font-medium text-indigo-500 tracking-wider">Đang cập nhật...</span>
                </div>
              )}

              <div style={{ width: `${100 * zoomLevel}%`, minWidth: '100%', height: '100%', position: 'relative' }}>
                {/* Horizontal Grid */}
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="absolute w-full border-t border-slate-100 border-dashed pointer-events-none" style={{ top: `${((20 + (i * 180 / 4)) / 220) * 100}%` }}></div>
                ))}
                
                <svg viewBox="0 0 900 220" preserveAspectRatio="none" className="w-full h-full overflow-visible absolute top-0 left-0">
                  <defs>
                    <linearGradient id={`grad-${title.replace(/\s+/g, '-')}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
                      <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {!isLoading && points.length > 1 && (
                    <>
                      <path d={fillPath} fill={`url(#grad-${title.replace(/\s+/g, '-')})`} />
                      <path d={linePath} fill="none" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  )}
                  {!isLoading && points.map((point, i) => (
                    <g key={i} onMouseEnter={() => setHoveredPoint(point)}>
                      <circle cx={point.x} cy={point.y} r="15" fill="transparent" className="cursor-pointer" />
                      <circle cx={point.x} cy={point.y} r={hoveredPoint === point ? 6 : 4} className={`fill-white stroke-[3px] transition-all ${hoveredPoint === point ? 'stroke-indigo-700 shadow-lg' : 'stroke-indigo-500'}`} />
                    </g>
                  ))}
                </svg>

                {/* Custom Interactive Tooltip */}
                {hoveredPoint && (
                  <div 
                    className="absolute z-50 bg-slate-900 text-white p-2.5 rounded-lg shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
                    style={{ left: `${(hoveredPoint.x / 900) * 100}%`, top: `${(hoveredPoint.y / 220) * 100}%` }}
                  >
                    <p className="text-[10px] font-bold border-b border-white/20 pb-1 mb-1 whitespace-nowrap uppercase tracking-wider">{hoveredPoint.label}</p>
                    <p className="text-[12px] font-bold text-indigo-300 m-0">{hoveredPoint.tooltip}</p>
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                  </div>
                )}

                {/* X-Axis Labels */}
                <div className="absolute left-0 right-0 bottom-0 h-8 flex items-center">
                  {revenueData.map((item, i) => {
                    const skip = Math.ceil(revenueData.length / (6 * zoomLevel));
                    if (i % skip !== 0 && i !== revenueData.length - 1) return null;
                    
                    let label = item.label;
                    if (timeRange === 'Tháng' && label.includes('-')) {
                        const parts = label.split('-');
                        label = `${parts[2]}/${parts[1]}`;
                    }
                    
                    return (
                      <span key={i} className="absolute text-[10px] font-bold text-slate-400 transform -translate-x-1/2" style={{ left: `${(i / (revenueData.length - 1)) * 100}%` }}>
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export const MainDashBoard = () => {
  // Dữ liệu mẫu trang chủ
  const latestProducts = [
    { id: 1, name: "Vợt Cầu Lông Yonex Astrox 100ZZ", category: "Vợt cầu lông", date: "07/05/2026 09:26 AM", status: "Mới" },
    { id: 2, name: "Giày Cầu Lông Victor P9200", category: "Giày cầu lông", date: "06/05/2026 10:10 AM", status: "Mới" },
    { id: 3, name: "Áo Cầu Lông Lining AAYR", category: "Áo cầu lông", date: "05/05/2026 03:45 PM", status: "Về hàng" }
  ];

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in max-w-screen-2xl mx-auto">
        
        {/* Header Dashboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tổng Quan Hệ Thống</h1>
            <p className="text-slate-500 text-sm mt-1">Phân tích kinh doanh và quản lý vận hành thời gian thực</p>
          </div>
          <button onClick={() => window.location.reload()} className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-100 border-none cursor-pointer">
            <RefreshCw size={18} className="mr-2" /> Làm mới hệ thống
          </button>
        </div>

        {/* Top Content: Latest products and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Sản phẩm mới cập nhật</h3>
              <Link to="/dashboard/products" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 no-underline px-3 py-1 bg-indigo-50 rounded-full">Xem tất cả</Link>
            </div>
            <div className="p-2 flex-1">
              <div className="divide-y divide-slate-100">
                {latestProducts.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors rounded-xl flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0"><Package size={22} /></div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 mr-2 font-bold uppercase tracking-tighter">{item.category}</span>
                          <Clock size={12} className="mr-1" /> {item.date}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border ${item.status === 'Mới' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <h3 className="text-sm font-bold text-slate-800 px-1 uppercase tracking-wider">Lối tắt</h3>
             <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer h-[140px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 opacity-50" />
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner"><Plus size={28} /></div>
                <h4 className="text-sm font-bold text-slate-900 m-0">Đăng Sản Phẩm</h4>
             </div>
             <div className="grid grid-cols-2 gap-4 flex-1 min-h-[140px]">
                <Link to="/dashboard/orders" className="no-underline bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center group cursor-pointer">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-2 group-hover:bg-purple-600 group-hover:text-white transition-all"><ShoppingCart size={20} /></div>
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-tighter">Đơn Hàng</span>
                </Link>
                <Link to="/dashboard/bookings" className="no-underline bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center group cursor-pointer">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-2 group-hover:bg-blue-600 group-hover:text-white transition-all"><CalendarDays size={20} /></div>
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-tighter">Đặt Sân</span>
                </Link>
             </div>
          </div>
        </div>

        {/* Charts Section: Two independent charts stacked vertically */}
        <div className="grid grid-cols-1 gap-8">
            <RevenueChart 
              title="Doanh Thu Đơn Hàng" 
              icon={<TrendingUp size={20} className="text-indigo-600" />} 
              apiBaseUrl="http://localhost:8086/api/v1/reports/revenue" 
              primaryColor="#4f46e5" 
            />
            <RevenueChart 
              title="Doanh Thu Đặt Sân" 
              icon={<BarChart2 size={20} className="text-blue-600" />} 
              apiBaseUrl="http://localhost:8086/api/v1/reports/revenue/booking" 
              primaryColor="#2563eb" 
            />
        </div>
      </div>
    </MainLayout>
  );
};

export default MainDashBoard;
