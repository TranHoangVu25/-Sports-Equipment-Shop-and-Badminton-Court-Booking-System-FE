import React, { useState, useEffect, useRef } from "react";
import { 
  Filter, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCcw,
  Check,
  X,
  Loader2,
  Package,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Search
} from "lucide-react";
import { MainLayout } from "../dashboard/layouts/main-layout"; 

// --- Toast Notification Component ---
const ToastNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-emerald-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className={`fixed top-24 right-5 z-[9999] flex items-center p-4 mb-4 rounded-lg border shadow-xl transform transition-all duration-500 ease-in-out animate-in slide-in-from-top-5 ${bgColor}`}>
      <Icon className={`w-5 h-5 mr-3 ${iconColor}`} />
      <div className={`text-sm font-medium ${textColor}`}>{message}</div>
      <button onClick={onClose} className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${textColor} hover:bg-white/50 transition-colors border-none cursor-pointer bg-transparent`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// --- Order Detail Modal ---
const OrderDetailModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900 font-sans flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <h3 className="text-lg font-bold text-slate-800">Chi tiết đơn hàng</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Section 1: Order Info */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Thông tin chung</h4>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 md:col-span-1">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Mã đơn hàng:</p>
                <p className="text-sm font-bold text-[#eb5322] truncate" title={order.id}>#{order.id}</p>
              </div>
              <div className="col-span-1">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Ngày đặt:</p>
                <p className="text-sm font-medium text-slate-900">{order.date}</p>
              </div>
              <div className="col-span-3 md:col-span-1">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Trạng thái:</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Section 2: Customer Info */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4">Thông tin giao hàng</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Người nhận:</p>
                <p className="text-sm font-medium text-slate-900">{order.customer}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Số điện thoại:</p>
                <p className="text-sm font-medium text-slate-900">{order.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Địa chỉ giao hàng:</p>
                <p className="text-sm font-medium text-slate-700">{order.location}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Section 3: Product Details */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span>Danh sách sản phẩm</span>
              <span className="text-xs font-medium text-slate-500">Tổng SL: {order.quantity}</span>
            </h4>
            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-200">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex gap-4 bg-white items-center">
                    <div className="w-16 h-16 rounded-md border border-slate-200 bg-white p-1 flex-shrink-0">
                      <img 
                        src={item.imgUrl || "https://via.placeholder.com/100x100?text=No+Image"} 
                        alt={item.productName} 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=Error'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 mb-1">{item.productName}</p>
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        {item.size && item.size.toLowerCase() !== 'default' && (
                          <span>Size: <span className="font-medium text-slate-700">{item.size}</span></span>
                        )}
                        <span>SL: <span className="font-medium text-slate-700">{item.quantity}</span></span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-slate-800">{formatVND(item.price * item.quantity)}</p>
                      <p className="text-xs text-slate-400">({formatVND(item.price)}/sp)</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 italic text-sm">Không có chi tiết sản phẩm.</div>
              )}
              
              {/* Giá trị Tạm tính và Giảm giá (nếu có) */}
              {order.discount && (
                <>
                  <div className="px-4 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-200">
                    <span className="font-semibold text-slate-600 uppercase tracking-wide text-xs">Giá gốc:</span>
                    <span className="text-sm font-bold text-slate-800">{order.subtotal}</span>
                  </div>
                  <div className="px-4 pb-3 bg-slate-50 flex items-center justify-between">
                    <span className="font-semibold text-slate-600 uppercase tracking-wide text-xs">Giảm giá:</span>
                    <span className="text-sm font-bold text-red-500">-{order.discount}</span>
                  </div>
                </>
              )}

              {/* Tổng tiền thanh toán */}
              <div className="p-4 bg-white flex items-center justify-between border-t border-slate-200">
                <span className="font-bold text-slate-700 uppercase tracking-wide text-sm">Tổng thanh toán:</span>
                <span className="text-xl font-extrabold text-[#eb5322]">{order.total}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer border-none">
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};

export const OrderDashBoard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Toast Notification
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  // State Tìm kiếm (Input value vs Applied value)
  const [searchRecipient, setSearchRecipient] = useState("");
  const [appliedSearchRecipient, setAppliedSearchRecipient] = useState("");

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  // Pagination State API Backend
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // --- API CONNECTION LẤY ĐƠN HÀNG CÓ PHÂN TRANG VÀ LỌC ---
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const pageIndex = currentPage - 1; 
      const params = new URLSearchParams();
      params.append('page', pageIndex);
      params.append('size', itemsPerPage);
      
      if (appliedSearchRecipient) params.append('recipient', appliedSearchRecipient);

      const response = await fetch(`http://localhost:8086/api/v1/orders/get-all-list-order?${params.toString()}`, {
          method: 'GET',
          headers: {
              "Content-Type": "application/json",
              ...getAuthHeader()
          }
      });

      if (!response.ok) {
          throw new Error("Lỗi khi tải danh sách đơn hàng.");
      }

      const data = await response.json();

      if (data.code === 0 && data.result) {
          const content = data.result.content || [];
          setTotalPages(data.result.totalPages || 1);
          setTotalElements(data.result.totalElements || 0);

          const mappedOrders = content.map(o => {
              const orderItems = o.orderItems || [];
              const quantity = orderItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
              
              const firstItem = orderItems.length > 0 ? orderItems[0] : null;
              const productNameDisplay = orderItems.length > 0 
                  ? (orderItems.length > 1 ? `${firstItem.productName} (+${orderItems.length - 1} sp khác)` : firstItem.productName) 
                  : "Không có sản phẩm";

              let displayStatus = o.status;
              let statusColor = "bg-gray-100 text-gray-700";
              const rawStatus = o.status?.toLowerCase();
              
              switch (rawStatus) {
                  case 'success':
                  case 'delivered':
                      displayStatus = 'Thành công';
                      statusColor = 'bg-emerald-100 text-emerald-700 border border-emerald-200';
                      break;
                  case 'pending':
                      displayStatus = 'Chờ xử lý';
                      statusColor = 'bg-amber-100 text-amber-700 border border-amber-200';
                      break;
                  case 'processing':
                      displayStatus = 'Đang xử lý';
                      statusColor = 'bg-blue-100 text-blue-700 border border-blue-200';
                      break;
                  case 'shipped':
                      displayStatus = 'Đang giao';
                      statusColor = 'bg-indigo-100 text-indigo-700 border border-indigo-200';
                      break;
                  case 'cancelled':
                  case 'failed':
                      displayStatus = 'Đã hủy / Lỗi';
                      statusColor = 'bg-red-100 text-red-700 border border-red-200';
                      break;
                  default:
                      displayStatus = o.status;
              }

              const displayId = o.orderId.includes('_') ? o.orderId.split('_').pop() : o.orderId;

              return {
                  id: displayId,
                  rawId: o.orderId,
                  rawStatus: rawStatus, 
                  customer: o.recipient || `Khách hàng`,
                  phone: o.phoneNumber || "N/A",
                  location: o.locationDetail || "N/A",
                  productName: productNameDisplay,
                  items: orderItems,
                  quantity: quantity,
                  totalAmountRaw: o.totalAmount,
                  total: formatVND(o.totalAmount),
                  status: displayStatus,
                  statusColor: statusColor,
                  date: o.createdAt ? new Date(o.createdAt).toLocaleString('vi-VN', {
                    hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric'
                  }) : "N/A",
              };
          });
          setOrders(mappedOrders);
      } else {
          console.error("Lỗi format response API:", data);
          setOrders([]);
          setTotalElements(0);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
      setOrders([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  // Chỉ gọi API khi appliedSearchRecipient, currentPage, hoặc itemsPerPage thay đổi
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedSearchRecipient, currentPage, itemsPerPage]);

  // --- API GỌI XEM CHI TIẾT ĐƠN HÀNG ---
  const handleViewDetail = async (order) => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`http://localhost:8086/api/v1/orders/get-order-detail/${order.id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      const data = await response.json();
      
      if (response.ok && data.code === 0 && data.result) {
        const result = data.result;
        const detailedOrder = {
           ...order,
           subtotal: result.subtotal ? formatVND(result.subtotal) : null,
           discount: result.discount ? formatVND(result.discount) : null,
           items: result.orderItems || [],
        };
        setSelectedOrder(detailedOrder);
        setIsModalOpen(true);
      } else {
        showToast('error', data.message || 'Không thể lấy chi tiết đơn hàng.');
      }
    } catch (err) {
      console.error("Lỗi lấy chi tiết đơn hàng:", err);
      showToast('error', 'Lỗi kết nối đến máy chủ.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // --- API THAY ĐỔI TRẠNG THÁI (XÁC NHẬN / HỦY) ---
  const handleUpdateStatus = async (order, isConfirm) => {
    setIsActionLoading(true);
    try {
      const response = await fetch(`http://localhost:8086/api/v1/orders/change-order-status/${order.id}?isConfirm=${isConfirm}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      const data = await response.json();
      
      if (response.ok && data.code === 0) {
         if (data.message && data.message.includes("không thể thay đổi trạng thái")) {
            showToast('error', data.message);
         } else {
            showToast('success', `Đã ${isConfirm === 1 ? 'xác nhận' : 'hủy'} đơn hàng thành công.`);
            fetchOrders(); 
         }
      } else {
         showToast('error', data.message || 'Có lỗi xảy ra, không thể thực hiện thao tác này.');
      }
    } catch (err) {
      console.error("Lỗi thay đổi trạng thái:", err);
      showToast('error', 'Lỗi kết nối đến máy chủ.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  const handleSearchSubmit = () => {
    setAppliedSearchRecipient(searchRecipient);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSearchRecipient('');
    setAppliedSearchRecipient('');
    setCurrentPage(1);
  };

  const indexOfFirstItem = totalElements === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalElements);

  const renderPagination = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) { start = 2; end = 4; }
      if (currentPage >= totalPages - 2) { start = totalPages - 3; end = totalPages - 1; }

      for (let i = start; i <= end; i++) { pages.push(i); }

      if (currentPage < totalPages - 2) pages.push('...');
      if (totalPages > 1 && pages[pages.length - 1] !== totalPages) {
         pages.push(totalPages);
      }
    }
    
    return pages.map((page, index) => {
        if (page === '...') {
            return <span key={`ellipsis-${index}`} className="px-2 text-slate-400">...</span>;
        }
        return (
          <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer border-none ${currentPage === page ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
              {page}
          </button>
        );
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-in fade-in duration-500 p-4 md:p-6 bg-slate-50 min-h-screen relative">
        
        {/* Loading Overlay khi gọi Action */}
        {isActionLoading && (
          <div className="fixed inset-0 z-[9999] bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 size={48} className="animate-spin text-[#eb5322]" />
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <ToastNotification 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(prev => ({ ...prev, show: false }))} 
          />
        )}

        {/* --- HEADER SECTION --- */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Quản lý Đơn hàng</h1>
            <p className="text-slate-500 mt-1 text-sm">Theo dõi và xử lý toàn bộ đơn hàng hệ thống</p>
          </div>
        </div>

        {/* --- FILTER & SEARCH --- */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full max-w-md">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Tìm theo khách hàng</label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                value={searchRecipient}
                onChange={(e) => setSearchRecipient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                placeholder="Nhập tên khách hàng..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSearchSubmit} 
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm border-none cursor-pointer flex items-center h-[38px]"
            >
              <Search size={16} className="mr-2" /> Tìm kiếm
            </button>
            <button 
              onClick={handleResetFilter} 
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer flex items-center h-[38px]"
            >
              <RefreshCcw size={16} className="mr-2" /> Làm mới
            </button>
          </div>
        </div>

        {/* --- LIST SECTION --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
          {/* List Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 rounded-t-xl shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-slate-800 text-lg">Danh sách đơn hàng</h3>
              <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 border border-indigo-100 rounded-md shadow-sm">
                    Tổng: {totalElements}
                  </span>
              </div>
            </div>

            {/* Show Per Page Control */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
               <span className="text-slate-500 font-medium">Hiển thị:</span>
               <div className="relative">
                  <select 
                     value={itemsPerPage}
                     onChange={handleItemsPerPageChange}
                     className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:border-indigo-400 transition-colors"
                  >
                     <option value={6}>6</option>
                     <option value={10}>10</option>
                     <option value={20}>20</option>
                     <option value={50}>50</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
               </div>
               <span className="text-slate-500">/ trang</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto flex-1 max-h-[60vh]">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
                    <p>Đang tải dữ liệu...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 text-red-500">
                    <AlertCircle className="w-10 h-10 mb-3" />
                    <p>{error}</p>
                </div>
            ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 z-20 bg-slate-50 shadow-[0_1px_0_0_#e2e8f0]">
                <tr className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                  <th className="px-6 py-4 w-12 text-center">STT</th>
                  <th className="px-6 py-4">Mã ĐH</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4 text-center">Tổng SL</th>
                  <th className="px-6 py-4 text-right">Tổng Tiền</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4">Ngày đặt</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-center font-medium text-slate-400">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#eb5322] cursor-pointer hover:underline max-w-[120px] truncate" title={order.rawId}>
                      <span onClick={() => handleViewDetail(order)}>#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-800 font-bold m-0 leading-tight">{order.customer}</p>
                      <p className="text-slate-500 text-xs mt-1">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 max-w-[280px]">
                        {order.items && order.items.length > 0 ? (
                           <img src={order.items[0].imgUrl} alt="Thumb" className="w-10 h-10 rounded border border-slate-200 object-contain p-0.5 bg-white shrink-0" onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40?text=IMG'; }}/>
                        ) : (
                           <div className="w-10 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 text-slate-300"><Package size={18}/></div>
                        )}
                        <p className="text-slate-700 font-medium text-sm truncate" title={order.productName}>{order.productName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700">{order.quantity}</td>
                    <td className="px-6 py-4 text-right font-extrabold text-slate-800">{order.total}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">{order.date}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleViewDetail(order)} 
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border-none cursor-pointer" 
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(order, 1)} 
                          disabled={order.rawStatus !== 'pending'} 
                          className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400" 
                          title="Xác nhận đơn"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(order, 2)} 
                          disabled={order.rawStatus === 'cancelled' || order.rawStatus === 'failed'} 
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400" 
                          title="Hủy đơn"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
            
            {/* Empty State */}
            {!loading && orders.length === 0 && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Search className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm font-medium">Không tìm thấy đơn hàng nào.</p>
                </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 rounded-b-xl">
              <div className="text-sm text-slate-500 font-medium">
                Đang hiển thị <span className="text-slate-900 font-bold">{indexOfFirstItem}</span> - <span className="text-slate-900 font-bold">{indexOfLastItem}</span> trong tổng số <span className="text-slate-900 font-bold">{totalElements}</span> đơn hàng
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white border-none shadow-[0_0_2px_rgba(0,0,0,0.2)]"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {renderPagination()}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white border-none shadow-[0_0_2px_rgba(0,0,0,0.2)]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}
      <OrderDetailModal 
        order={selectedOrder} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </MainLayout>
  );
};