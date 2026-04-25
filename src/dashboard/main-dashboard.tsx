import React, { useState } from "react";
import { MainLayout } from "./layouts/main-layout"; 
import { 
  Layout, 
  Home, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  LogOut, 
  ChevronRight, 
  Search,
  Plus,
  ShoppingCart,
  BarChart2,
  RefreshCw,
  Package,
  Clock,
  TrendingUp,
  DollarSign
} from "lucide-react";

export const MainDashBoard = () => {
  const [timeRange, setTimeRange] = useState('Month');

  // Dữ liệu mẫu cho "Sản phẩm mới nhất" (Latest Products)
  const latestProducts = [
    { id: 1, name: "Chiikawa Plushie Limited", category: "Toys", date: "10/09/2025 04:26 PM", status: "New" },
    { id: 2, name: "Hachiware Keyring Set", category: "Accessories", date: "11/09/2025 10:10 PM", status: "New" },
    { id: 3, name: "Usagi T-Shirt Collection", category: "Apparel", date: "28/09/2025 03:45 PM", status: "Restock" },
    { id: 4, name: "Momonga Sticker Pack", category: "Stationery", date: "24/09/2025 04:56 PM", status: "New" },
    { id: 5, name: "Kurimanju Mug", category: "Home", date: "20/09/2025 09:15 AM", status: "Sale" }
  ];

  return (
    <MainLayout>
      <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-10">
        
        {/* Header: Dashboard Overview */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1">Welcome back to Chiikawa Management System</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-all shadow-sm">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Content Grid (Products & Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* LEFT: Latest Products */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                <h3 className="text-lg font-bold text-slate-800">Latest Products</h3>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View all</button>
              </div>
              <div className="p-2 flex-1">
                <div className="divide-y divide-slate-100">
                  {latestProducts.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                            <Package size={24} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-center">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 mr-2">{item.category}</span>
                              <Clock size={12} className="mr-1" /> {item.date}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          item.status === 'New' ? 'bg-green-50 text-green-700 border-green-100' :
                          item.status === 'Sale' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Quick Actions */}
          <div className="lg:col-span-2 flex flex-col gap-6">
             <h3 className="text-lg font-bold text-slate-800 px-1">Quick Actions</h3>

             {/* Create New Product */}
             <button className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center py-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Plus size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700">Create New Product</h4>
                  <p className="text-sm text-slate-500 mt-2">Add item to Chiikawa catalog</p>
                </div>
             </button>

             <div className="grid grid-cols-2 gap-4">
                {/* Process Orders */}
                <button className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-purple-300 transition-all group flex flex-col items-center justify-center h-40">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <ShoppingCart size={24} />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">Process Orders</span>
                </button>

                {/* View Reports */}
                <button className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col items-center justify-center h-40">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BarChart2 size={24} />
                  </div>
                  <span className="font-bold text-slate-800 text-sm">View Reports</span>
                </button>
             </div>
          </div>
        </div>

        {/* --- REVENUE CHART SECTION (New Added) --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <TrendingUp size={20} className="mr-2 text-indigo-600" />
              Revenue Analytics
            </h3>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {['Week', 'Month', 'Year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    timeRange === range
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Banner & Chart Area */}
          <div className="p-6">
            {/* Summary Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-center text-white mb-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-x-12"></div>
              <p className="relative z-10 text-indigo-100 font-medium mb-1">Total Revenue</p>
              <h2 className="relative z-10 text-4xl font-bold flex items-center justify-center">
                16,620,000 <span className="text-lg ml-2 opacity-80">VND</span>
              </h2>
            </div>

            {/* Simple SVG Line Chart */}
            <div className="relative h-64 w-full">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-400 w-24 pr-2 text-right">
                <span>16.000.000</span>
                <span>12.000.000</span>
                <span>8.000.000</span>
                <span>4.000.000</span>
                <span>0</span>
              </div>
              
              {/* Chart Area */}
              <div className="absolute left-24 right-0 top-3 bottom-8 border-l border-b border-slate-200">
                 {/* Grid Lines */}
                 {[0, 1, 2, 3].map(i => (
                   <div key={i} className="absolute w-full border-t border-slate-100" style={{ bottom: `${i * 25}%` }}></div>
                 ))}
                 
                 {/* The Line */}
                 <svg className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M0,220 L150,180 L300,120 L450,150 L600,80 L750,100 L900,20" 
                      fill="none" 
                      stroke="#6366f1" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M0,220 L150,180 L300,120 L450,150 L600,80 L750,100 L900,20 L900,220 L0,220 Z" 
                      fill="url(#gradient)" 
                      stroke="none"
                    />
                    {/* Data Points */}
                    {[
                      {x: 0, y: 220}, {x: 150, y: 180}, {x: 300, y: 120}, 
                      {x: 450, y: 150}, {x: 600, y: 80}, {x: 750, y: 100}, {x: 900, y: 20}
                    ].map((point, i) => (
                      <circle 
                        key={i} 
                        cx={point.x} 
                        cy={point.y} 
                        r="4" 
                        className="fill-white stroke-indigo-600 stroke-2 hover:r-6 transition-all cursor-pointer" 
                      />
                    ))}
                 </svg>
              </div>

              {/* X-Axis Labels */}
              <div className="absolute left-24 right-0 bottom-0 flex justify-between text-xs text-slate-400 pt-2">
                <span>Sep 01</span>
                <span>Sep 05</span>
                <span>Sep 10</span>
                <span>Sep 15</span>
                <span>Sep 20</span>
                <span>Sep 25</span>
                <span>Oct 01</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

