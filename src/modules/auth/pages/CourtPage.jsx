import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  SlidersHorizontal, 
  MapPin, 
  XCircle, 
  Heart, 
  Navigation, 
  Clock, 
  Star, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

const CourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  // State cho Tìm kiếm và Phân trang
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // State lưu vị trí của người dùng
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

  // Lấy vị trí người dùng khi mới vào trang (Kèm dự phòng Fallback)
  useEffect(() => {
    const defaultLocation = {
      lat: 21.0285, // Mặc định Hà Nội
      lng: 105.8542
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Không thể lấy vị trí người dùng hoặc bị từ chối:", error);
          setUserLocation(defaultLocation);
        },
        { timeout: 10000 }
      );
    } else {
      console.warn("Trình duyệt không hỗ trợ Geolocation.");
      setUserLocation(defaultLocation);
    }
  }, []);

  // Lấy danh sách sân từ API (Sử dụng useCallback để tránh re-create liên tục)
  const fetchCourts = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);

    try {
      // Backend đếm page từ 0
      const pageIndex = currentPage - 1;
      const params = new URLSearchParams();
      params.append('page', pageIndex);
      params.append('size', itemsPerPage);
      
      if (appliedSearchQuery.trim()) {
        params.append('name', appliedSearchQuery.trim());
      }

      // Đưa thêm thông tin tọa độ nếu có
      if (userLocation.lat !== null && userLocation.lng !== null) {
        params.append('userLat', userLocation.lat);
        params.append('userLng', userLocation.lng);
      }

      const response = await fetch(`http://localhost:8086/api/v1/court-centers/search?${params.toString()}`, {
        method: 'POST', // Đã chuyển sang sử dụng POST
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();

      if (response.ok && data.status === 200 && data.data) {
        setCourts(data.data.content || []);
        setTotalPages(data.data.totalPages || 1);
      } else {
        if (!isSilent) showToast('error', data.message || 'Không thể lấy danh sách sân.');
        setCourts([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sân:", err);
      if (!isSilent) {
        showToast('error', 'Không thể kết nối đến máy chủ.');
        setCourts([]);
      }
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, appliedSearchQuery, userLocation.lat, userLocation.lng]);

  // Gọi API khi current page hoặc appliedSearchQuery thay đổi (bỏ debounce)
  useEffect(() => {
    fetchCourts(false);
  }, [fetchCourts, appliedSearchQuery, currentPage]);

  // Tự động gọi lại API (Polling) ngầm mỗi 15 giây
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchCourts(true); // Fetch ngầm, không kích hoạt loading
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchCourts]);

  // Xử lý khi nhấn nút Tìm kiếm
  const handleSearchSubmit = () => {
    setAppliedSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setAppliedSearchQuery(''); // Cập nhật lại appliedSearchQuery để trigger gọi lại API
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper render mảng phân trang
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10 relative">
      
      {/* Toast Notification */}
      {toast.show && (
        <ToastNotification 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))} 
        />
      )}

      {/* HEADER MÀU CAM */}
      <div className="bg-[#eb5322] text-white pt-4 pb-12 px-4 relative overflow-hidden">
        {/* Họa tiết nền mờ ảo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)' }}>
        </div>

        <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
          <Link to="/" className="text-white hover:text-gray-200 transition-colors cursor-pointer">
            <ChevronLeft size={28} strokeWidth={2.5} />
          </Link>
          <h1 className="text-xl font-medium tracking-wide m-0">Hệ thống Sân</h1>
          <button className="text-white hover:text-gray-200 transition-colors bg-transparent border-none cursor-pointer p-0">
            <SlidersHorizontal size={24} />
          </button>
        </div>
      </div>

      {/* THANH TÌM KIẾM NỔI */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-sm shadow-md flex items-center p-2 border border-gray-100 focus-within:ring-2 focus-within:ring-orange-200 transition-shadow">
          <MapPin className="text-[#eb5322] ml-2 mr-3 flex-shrink-0" size={22} strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Tìm kiếm hệ thống sân..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearchSubmit();
            }}
            className="flex-1 bg-transparent border-none outline-none text-gray-700 text-base font-medium truncate py-2"
          />
          {searchQuery && (
            <button 
              onClick={handleClearSearch}
              className="bg-transparent border-none cursor-pointer flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors mx-1"
              title="Xóa tìm kiếm"
            >
              <XCircle size={18} />
            </button>
          )}
          <button
            onClick={handleSearchSubmit}
            className="bg-[#eb5322] hover:bg-[#d04316] text-white px-5 py-2.5 rounded-sm font-medium transition-colors border-none cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Search size={16} /> <span className="hidden sm:inline">Tìm kiếm</span>
          </button>
        </div>
      </div>

      {/* DANH SÁCH SÂN (GRID) */}
      <div className="max-w-6xl mx-auto px-4 mt-8 relative min-h-[300px]">
        {isLoading ? (
          <div className="absolute inset-0 flex justify-center items-start pt-20 z-10">
             <Loader2 size={40} className="animate-spin text-[#eb5322]" />
          </div>
        ) : courts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-sm border border-gray-200 shadow-sm flex flex-col items-center">
            <MapPin size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Không có sân nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courts.map((court) => {
              // Xử lý dữ liệu trả về và fallback
              const imageUrl = court.imgUrl || "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80";
              const distance = court.distance != null ? `${Number(court.distance).toFixed(1)} km` : "Gần bạn";
              const time = "05:00 - 23:00"; // Fallback khung giờ hoạt động
              const tags = ["Đơn ngày", "Sự kiện"]; // Fallback tags

              return (
                <Link 
                  to={`/court-detail/${court.courtCenterId}`}
                  key={court.courtCenterId} 
                  className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-md transition-shadow !no-underline"
                >
                  
                  {/* Nửa trên: Hình ảnh & Tag */}
                  <div className="h-44 md:h-52 relative overflow-hidden bg-gray-200">
                    <img 
                      src={imageUrl} 
                      alt={court.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/600x300?text=San+Cau+Long'; }}
                    />
                    
                    {/* Tag "Đơn ngày", "Sự kiện" */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {tags.includes("Đơn ngày") && (
                        <span className="bg-[#1bd1a5] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm flex items-center gap-1 shadow-sm">
                          <Star size={10} fill="currentColor" /> Đơn ngày
                        </span>
                      )}
                      {tags.includes("Sự kiện") && (
                        <span className="bg-[#bd53db] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm shadow-sm">
                          Sự kiện
                        </span>
                      )}
                    </div>

                    {/* Các nút tương tác góc phải */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button 
                        onClick={(e) => e.preventDefault()} // Ngăn chặn chuyển trang khi bấm tym
                        className="bg-white rounded-sm p-2 shadow-sm text-gray-600 hover:text-red-500 transition-colors border-none cursor-pointer flex items-center justify-center"
                        title="Yêu thích"
                      >
                        <Heart size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); // Ngăn chặn chuyển trang khi bấm chỉ đường
                          if (court.mapUrl) {
                            window.open(court.mapUrl, '_blank');
                          }
                        }}
                        className="bg-white rounded-sm p-2 shadow-sm text-gray-600 hover:text-blue-500 transition-colors border-none cursor-pointer flex items-center justify-center"
                        title="Chỉ đường"
                      >
                        <Navigation size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Nửa dưới: Nội dung chi tiết */}
                  <div className="p-4 flex gap-4 relative flex-1">
                    
                    {/* Biểu tượng quả cầu/Avatar sân */}
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-white border border-gray-100 rounded-sm shadow-sm p-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-gray-700">
                        <path d="M12 22v-5"></path>
                        <path d="M9 7l3 10 3-10"></path>
                        <path d="M14 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                        <path d="M10 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                        <path d="M6 7l6 10"></path>
                        <path d="M18 7l-6 10"></path>
                      </svg>
                    </div>
                    
                    {/* Thông পুরা Text */}
                    <div className="flex-1 min-w-0 pb-10 text-gray-800">
                      <h3 className="font-bold text-[16px] leading-tight mb-1 truncate group-hover:text-[#eb5322] transition-colors" title={court.name}>
                        {court.name}
                      </h3>
                      
                      <p className="text-[13px] text-gray-600 mt-1.5 leading-snug line-clamp-2" title={court.locationDetail}>
                        <span className="text-[#eb5322] font-medium mr-1">({distance})</span> 
                        {court.locationDetail}
                      </p>
                      
                      <p className="text-[13px] text-gray-500 mt-2 flex items-center gap-1.5 font-medium">
                        <Clock size={14} className="text-gray-400" /> {time}
                      </p>
                    </div>

                    {/* Góc dưới bên phải: Nút Đặt lịch */}
                    <div className="absolute bottom-4 right-4 flex flex-col items-end">
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); // Tránh kích hoạt Link
                          // Chuyển hướng hoặc xử lý đặt lịch nhanh
                        }}
                        className="bg-[#f0ad4e] hover:bg-[#e09d3e] text-white font-bold py-2 px-5 rounded-sm text-[13px] border-none cursor-pointer transition-colors shadow-sm relative z-20"
                      >
                        ĐẶT LỊCH
                      </button>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* PHÂN TRANG */}
        {totalPages > 1 && !isLoading && (
          <div className="mt-8 mb-4 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              &laquo;
            </button>
            
            {getPageNumbers().map((page, idx) => (
              page === '...' ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-400 font-medium">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-sm text-[14px] font-medium transition-colors border cursor-pointer ${
                    currentPage === page 
                      ? 'bg-[#eb5322] text-white border-[#eb5322] shadow-sm' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#eb5322] hover:text-[#eb5322]'
                  }`}
                >
                  {page}
                </button>
              )
            ))}

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              &raquo;
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default CourtPage;