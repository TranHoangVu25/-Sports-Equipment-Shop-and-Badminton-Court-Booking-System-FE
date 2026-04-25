import React, { useState, useEffect } from 'react';
import { ChevronLeft, SlidersHorizontal, MapPin, XCircle, Heart, Share2, Clock, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8086/api/v1/court-centers/search');
        const data = await response.json();

        if (response.ok && data.status === 200) {
          setCourts(data.data || []);
        } else {
          setError(data.message || 'Không thể lấy danh sách sân.');
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách sân:", err);
        setError('Không thể kết nối đến máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourts();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      
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
          <h1 className="text-xl font-medium tracking-wide m-0">Tìm kiếm</h1>
          <button className="text-white hover:text-gray-200 transition-colors bg-transparent border-none cursor-pointer p-0">
            <SlidersHorizontal size={24} />
          </button>
        </div>
      </div>

      {/* THANH TÌM KIẾM NỔI */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-sm shadow-md flex items-center px-4 py-3 border border-gray-100">
          <MapPin className="text-[#eb5322] mr-3 flex-shrink-0" size={22} strokeWidth={2.5} />
          <input 
            type="text" 
            value="hà nội ,cầu lông" 
            className="flex-1 bg-transparent border-none outline-none text-gray-700 text-base font-medium truncate"
            readOnly 
          />
          <button className="bg-transparent border-none cursor-pointer flex-shrink-0 p-0 text-[#eb5322] hover:text-[#d04316] transition-colors">
            <XCircle size={22} />
          </button>
        </div>
      </div>

      {/* DANH SÁCH SÂN (GRID) */}
      <div className="max-w-6xl mx-auto px-4 mt-8 relative min-h-[300px]">
        {isLoading ? (
          <div className="absolute inset-0 flex justify-center items-start pt-20 z-10">
             <Loader2 size={40} className="animate-spin text-[#eb5322]" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-gray-500">
            <p>{error}</p>
          </div>
        ) : courts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 italic">
            Không tìm thấy hệ thống sân nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courts.map((court) => {
              // Xử lý fallback cho các trường API chưa trả về
              const imageUrl = court.imgUrl || "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80";
              const distance = "5.0km"; // Fallback vì API chưa có
              const time = "05:00 - 23:00"; // Fallback vì API chưa có
              const tags = ["Đơn ngày", "Sự kiện"]; // Fallback giả lập

              return (
                // Bọc toàn bộ Card bằng Link để chuyển sang trang chi tiết
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
                      >
                        <Heart size={16} />
                      </button>
                      <button 
                        onClick={(e) => e.preventDefault()} // Ngăn chặn chuyển trang khi bấm share
                        className="bg-white rounded-sm p-2 shadow-sm text-gray-600 hover:text-blue-500 transition-colors border-none cursor-pointer flex items-center justify-center"
                      >
                        <Share2 size={16} />
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
                    
                    {/* Thông tin Text */}
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
                          // Nếu muốn logic đặc biệt khi click đặt lịch ngay thì xử lý ở đây
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
      </div>

    </div>
  );
};

export default CourtPage;
