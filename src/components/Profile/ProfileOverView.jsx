import { Loader2, MapPin, Phone, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { encodeId } from '../../utils/url';

const ProfileOverView = ({ userData, onEdit }) => {
  const nameDisplay = userData?.fullName || 'Chưa cập nhật';
  const phoneDisplay = userData?.phoneNumber || 'Chưa cập nhật';
  const locationDetailDisplay = userData?.location || 'Chưa cập nhật';

  // State Quản lý Tab: 'orders' hoặc 'bookings'
  const [activeTab, setActiveTab] = useState('orders');

  // State quản lý danh sách đơn hàng & phân trang
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State quản lý danh sách đặt sân & phân trang
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [currentBookingPage, setCurrentBookingPage] = useState(1);
  const [totalBookingPages, setTotalBookingPages] = useState(1);

  // GỌI API LẤY DANH SÁCH ĐƠN HÀNG (PRODUCTS)
  useEffect(() => {
    if (activeTab !== 'orders') return;

    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoadingOrders(false);
        return;
      }
      setIsLoadingOrders(true);
      try {
        const response = await fetch(`http://localhost:8086/api/v1/orders/get-user-list-order?page=${currentPage - 1}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.code === 0 && data.result) {
          setOrders(data.result.content || []);
          setTotalPages(data.result.totalPages || 1);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [currentPage, activeTab]);

  // GỌI API LẤY DANH SÁCH ĐẶT SÂN (BOOKINGS) - CÓ PHÂN TRANG
  useEffect(() => {
    if (activeTab !== 'bookings') return;

    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoadingBookings(false);
        return;
      }
      setIsLoadingBookings(true);
      try {
        const response = await fetch(`http://localhost:8086/api/v1/bookings/get-user-booking-list?page=${currentBookingPage - 1}&size=10`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.status === 200 && data.data) {
          // Lấy mảng dữ liệu content và tổng số trang từ API
          setBookings(data.data.content || []);
          setTotalBookingPages(data.data.totalPages || 1);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đặt sân:", error);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [currentBookingPage, activeTab]);


  // Helper functions
  const formatPrice = (price) => {
    return price ? Number(price).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const translateStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'paid':
      case 'confirmed':
        return <span className="text-gray-800">Thành công</span>;
      case 'process':
      case 'processing': 
        return <span className="text-gray-800">Đang xử lý</span>;
      case 'failure':
      case 'failed':
      case 'cancelled': 
        return <span className="text-gray-800">Thất bại</span>;
      case 'pending': 
        return <span className="text-gray-800">Chờ xử lý</span>;
      case 'shipped': 
        return <span className="text-gray-800">Đang giao</span>;
      case 'delivered': 
        return <span className="text-gray-800">Đã giao</span>;
      default: 
        if (!status) return null;
        const capitalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        return <span className="text-gray-800">{capitalized}</span>;
    }
  };

  const getOrderId = (rawId) => {
    const strId = String(rawId);
    return strId.includes('_') ? strId.split('_').pop() : strId;
  };

  const getPageNumbers = (current, total) => {
    const pages = [];
    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, '...', total);
      } else if (current >= total - 2) {
        pages.push(1, '...', total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 w-full bg-white">
      <h1 className="text-xl font-bold uppercase !text-gray-900 mb-1 font-sans">THÔNG TIN TÀI KHOẢN</h1>
      <p className="italic text-sm !text-gray-600 mb-10 font-sans">
        Xin chào, <span className="!text-[#eb5322] font-semibold not-italic">{nameDisplay}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CỘT THÔNG TIN KHÁCH HÀNG */}
        <div className="lg:col-span-1">
          <h2 className="text-base font-normal uppercase !text-gray-800 mb-5 tracking-wide border-b pb-2 font-sans">THÔNG TIN KHÁCH HÀNG</h2>
          <div className="space-y-4 text-sm !text-gray-800 mt-4 font-sans">
            <div className="flex items-start">
              <User size={16} className="!text-[#eb5322] mr-3 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <div><span className="font-bold">Họ tên:</span> {nameDisplay}</div>
            </div>
            <div className="flex items-start">
              <Phone size={16} className="!text-[#eb5322] mr-3 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <div><span className="font-bold">Số ĐT:</span> {phoneDisplay}</div>
            </div>
            <div className="flex items-start">
              <MapPin size={16} className="!text-[#eb5322] mr-3 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
              <div><span className="font-bold">Địa chỉ:</span> {locationDetailDisplay}</div>
            </div>
          </div>
          <button 
            onClick={onEdit}
            className="mt-8 w-full !bg-[#eb5322] hover:!bg-[#d04316] !text-white py-3 text-sm transition-colors border-none cursor-pointer uppercase rounded-sm font-bold tracking-wider font-sans shadow-sm"
          >
            Sửa thông tin
          </button>
        </div>

        {/* CỘT DANH SÁCH BÊN PHẢI (Tabs + Tables) */}
        <div className="lg:col-span-2">
          
          {/* TABS SWITCHER */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2.5 px-6 font-bold text-[14px] uppercase transition-colors border-b-[3px] bg-transparent cursor-pointer outline-none ${
                activeTab === 'orders' 
                  ? 'border-[#eb5322] text-[#eb5322]' 
                  : 'border-transparent text-gray-500 hover:text-[#eb5322]'
              }`}
            >
              ĐƠN HÀNG SẢN PHẨM
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2.5 px-6 font-bold text-[14px] uppercase transition-colors border-b-[3px] bg-transparent cursor-pointer outline-none ${
                activeTab === 'bookings' 
                  ? 'border-[#eb5322] text-[#eb5322]' 
                  : 'border-transparent text-gray-500 hover:text-[#eb5322]'
              }`}
            >
              LỊCH SỬ ĐẶT SÂN
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-sm shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              
              {/* === BẢNG 1: ĐƠN HÀNG SẢN PHẨM === */}
              {activeTab === 'orders' && (
                <table className="w-full text-sm border-collapse min-w-[650px] font-sans">
                  <thead>
                    <tr className="!bg-[#eb5322] !text-white text-center font-bold">
                      <th className="py-3 px-3 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider">Mã ĐH</th>
                      <th className="py-3 px-3 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider">Ngày đặt</th>
                      <th className="py-3 px-4 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider text-left">Địa chỉ giao</th>
                      <th className="py-3 px-3 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider text-right">Tổng tiền</th>
                      <th className="py-3 px-3 font-bold whitespace-nowrap uppercase text-xs tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {isLoadingOrders ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <Loader2 size={30} className="animate-spin text-[#eb5322] mx-auto mb-3" />
                          <span className="text-gray-500 italic">Đang tải dữ liệu...</span>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center !text-gray-500 italic bg-gray-50/50">
                          Bạn chưa có đơn hàng nào.
                        </td>
                      </tr>
                    ) : (
                      orders.map(order => {
                        const realOrderId = getOrderId(order.orderId);
                        return (
                          <tr key={order.orderId} className="hover:bg-orange-50/30 transition-colors cursor-default">
                            <td className="py-3.5 px-3 border-r border-gray-100 text-center font-medium">
                              <Link 
                                to={`/order-detail/${realOrderId}`} 
                                className="text-[#eb5322] font-bold hover:underline hover:text-[#d04316] transition-colors !no-underline"
                              >
                                #{realOrderId}
                              </Link>
                            </td>
                            <td className="py-3.5 px-3 border-r border-gray-100 text-center text-gray-600">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="py-3.5 px-4 border-r border-gray-100 text-gray-600 max-w-[220px] truncate" title={order.locationDetail}>
                              {order.locationDetail || 'Không có địa chỉ'}
                            </td>
                            <td className="py-3.5 px-3 border-r border-gray-100 text-right font-bold text-[#eb5322]">
                              {formatPrice(order.totalAmount)}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              {translateStatus(order.status)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}

              {/* === BẢNG 2: LỊCH SỬ ĐẶT SÂN === */}
              {activeTab === 'bookings' && (
                <table className="w-full text-sm border-collapse min-w-[650px] font-sans">
                  <thead>
                    <tr className="!bg-[#eb5322] !text-white text-center font-bold">
                      <th className="py-3 px-3 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider">Mã ĐH</th>
                      <th className="py-3 px-3 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider">Ngày đặt</th>
                      <th className="py-3 px-4 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider text-left">Tên sân</th>
                      <th className="py-3 px-3 border-r border-white/20 font-bold whitespace-nowrap uppercase text-xs tracking-wider text-right">Tổng tiền</th>
                      <th className="py-3 px-3 font-bold whitespace-nowrap uppercase text-xs tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {isLoadingBookings ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <Loader2 size={30} className="animate-spin text-[#eb5322] mx-auto mb-3" />
                          <span className="text-gray-500 italic">Đang tải dữ liệu...</span>
                        </td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center !text-gray-500 italic bg-gray-50/50">
                          Bạn chưa có lịch sử đặt sân nào.
                        </td>
                      </tr>
                    ) : (
                      bookings.map(booking => {
                        return (
                          <tr key={booking.bookingId} className="hover:bg-orange-50/30 transition-colors cursor-default">
                            <td className="py-3.5 px-3 border-r border-gray-100 text-center font-medium">
                              <Link 
                                to={`/booking-detail/${booking.bookingId}`} 
                                className="text-[#eb5322] font-bold hover:underline hover:text-[#d04316] transition-colors !no-underline"
                              >
                                #{booking.bookingId}
                              </Link>
                            </td>
                            <td className="py-3.5 px-3 border-r border-gray-100 text-center text-gray-600">
                              {formatDate(booking.bookingDate || booking.createdAt)}
                            </td>
                            <td className="py-3.5 px-4 border-r border-gray-100 text-gray-600 max-w-[220px] truncate" title={booking.courtCenterName}>
                              {booking.courtCenterName || 'Chưa cập nhật tên sân'}
                            </td>
                            <td className="py-3.5 px-3 border-r border-gray-100 text-right font-bold text-[#eb5322]">
                              {formatPrice(booking.totalAmount)}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              {translateStatus(booking.status)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}

            </div>
          </div>

          {/* Phân trang (Hiển thị chung cho cả 2 tab) */}
          {((activeTab === 'orders' && totalPages > 1 && !isLoadingOrders) || 
            (activeTab === 'bookings' && totalBookingPages > 1 && !isLoadingBookings)) && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => activeTab === 'orders' ? setCurrentPage(prev => Math.max(prev - 1, 1)) : setCurrentBookingPage(prev => Math.max(prev - 1, 1))}
                disabled={(activeTab === 'orders' ? currentPage : currentBookingPage) === 1}
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                &laquo;
              </button>
              
              {getPageNumbers(
                activeTab === 'orders' ? currentPage : currentBookingPage,
                activeTab === 'orders' ? totalPages : totalBookingPages
              ).map((page, idx) => (
                page === '...' ? (
                  <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => activeTab === 'orders' ? setCurrentPage(page) : setCurrentBookingPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm transition-colors border cursor-pointer ${
                      (activeTab === 'orders' ? currentPage : currentBookingPage) === page 
                        ? 'bg-[#eb5322] text-white border-[#eb5322] font-bold' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-[#eb5322]'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => activeTab === 'orders' ? setCurrentPage(prev => Math.min(prev + 1, totalPages)) : setCurrentBookingPage(prev => Math.min(prev + 1, totalBookingPages))}
                disabled={(activeTab === 'orders' ? currentPage : currentBookingPage) === (activeTab === 'orders' ? totalPages : totalBookingPages)}
                className="w-8 h-8 flex items-center justify-center rounded-sm border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                &raquo;
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};


export default ProfileOverView;
