import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, MapPin, Clock, Phone, Loader2, Info, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { decodeId } from '../../../utils/url';

// =======================================================================
// COMPONENT CUSTOM DATEPICKER (CHỈ CHO CHỌN THÁNG NÀY VÀ THÁNG SAU)
// =======================================================================
const CustomDatePickerModal = ({ isOpen, initialDate, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const [viewDate, setViewDate] = useState(new Date(initialDate));
  const [tempDate, setTempDate] = useState(initialDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Tính toán giới hạn ngày (Max Date: Ngày cuối cùng của tháng sau)
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  // Kiểm tra vô hiệu hóa nút chuyển tháng
  const isPrevMonthDisabled = viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();
  const isNextMonthDisabled = viewDate.getFullYear() === maxDate.getFullYear() && viewDate.getMonth() === maxDate.getMonth();

  const handlePrevMonth = () => {
    if (!isPrevMonthDisabled) {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (!isNextMonthDisabled) {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  
  // Lấy thứ của ngày đầu tiên trong tháng (Chuyển đổi: T2=0, T3=1, ..., CN=6)
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDayOffset = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  const formatToYYYYMMDD = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateDisabled = (year, month, day) => {
    const dateToCheck = new Date(year, month, day);
    return dateToCheck < today || dateToCheck > maxDate;
  };

  const renderDays = () => {
    const days = [];
    // Các ô trống đầu tháng
    for (let i = 0; i < firstDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Các ngày trong tháng
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = formatToYYYYMMDD(viewDate.getFullYear(), viewDate.getMonth(), i);
      const disabled = isDateDisabled(viewDate.getFullYear(), viewDate.getMonth(), i);
      const isSelected = tempDate === dateStr;

      days.push(
        <div key={i} className="flex justify-center items-center">
          <button
            disabled={disabled}
            onClick={() => setTempDate(dateStr)}
            className={`w-8 h-8 flex items-center justify-center rounded-sm text-[14px] transition-colors border-none
              ${disabled ? 'text-gray-300 cursor-not-allowed bg-transparent' : 
                isSelected ? 'bg-[#eb5322] text-white font-bold shadow-sm' : 
                'text-gray-700 hover:bg-orange-50 cursor-pointer bg-transparent'
              }
            `}
          >
            {i}
          </button>
        </div>
      );
    }
    return days;
  };

  const monthNames = ["tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6", "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"];

  return (
    <div className="fixed inset-0 z-[100005] bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
      <div className="bg-white rounded-md shadow-2xl p-5 w-[340px] animate-fade-in font-sans">
        
        {/* Header Calendar */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={handlePrevMonth} 
            disabled={isPrevMonthDisabled}
            className={`p-1.5 rounded-sm border-none bg-transparent transition-colors ${isPrevMonthDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-[#eb5322] hover:bg-orange-50 cursor-pointer'}`}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="font-bold text-[15px] text-gray-800">
            {monthNames[viewDate.getMonth()]} năm {viewDate.getFullYear()}
          </div>
          <button 
            onClick={handleNextMonth} 
            disabled={isNextMonthDisabled}
            className={`p-1.5 rounded-sm border-none bg-transparent transition-colors ${isNextMonthDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-[#eb5322] hover:bg-orange-50 cursor-pointer'}`}
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center text-[12px] font-medium text-gray-500 mb-3">
          <div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div><div>CN</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-2 gap-x-1">
          {renderDays()}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-[14px] font-bold text-[#eb5322] hover:bg-orange-50 rounded-sm transition-colors border-none bg-transparent cursor-pointer"
          >
            Hủy
          </button>
          <button 
            onClick={() => onConfirm(tempDate)}
            className="px-5 py-2 text-[14px] font-bold text-white bg-[#eb5322] hover:bg-[#d04316] rounded-sm shadow-sm transition-colors border-none cursor-pointer"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// =======================================================================
// COMPONENT ĐẶT LỊCH TRỰC QUAN (TIMELINE BOOKING - FULL SCREEN)
// =======================================================================
const BookingTimeline = ({ court, onBack }) => {
  // Tiện ích lấy chuỗi ngày hiện tại (YYYY-MM-DD) theo giờ local
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // Trạng thái mở Custom DatePicker
  
  const [cellWidth, setCellWidth] = useState(70); // Zoom level mặc định to hơn chút để dễ nhìn chữ
  const [selectedSlots, setSelectedSlots] = useState([]); // [{ courtId, time, price }]
  
  // State quản lý dữ liệu chi tiết của ngày được chọn
  const [timelineData, setTimelineData] = useState(null);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

  // Trạng thái popup xem bảng giá
  const [showPricingModal, setShowPricingModal] = useState(false);
  
  // Trạng thái kéo thả để cuộn (Drag to scroll)
  const timelineRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  // 1. LẤY DỮ LIỆU ĐỘNG TỪ API KHI MỞ HOẶC KHI ĐỔI NGÀY
  useEffect(() => {
    const fetchTimelineData = async () => {
      setIsLoadingTimeline(true);
      try {
        // Có thể bổ sung query param ?date=${selectedDate} nếu API BE hỗ trợ lấy theo ngày
        const response = await fetch(`http://localhost:8086/api/v1/court-centers/detail/${court.id}`);
        const data = await response.json();
        
        if (response.ok && data.status === 200 && data.data) {
          setTimelineData(data.data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu khung giờ:", err);
      } finally {
        setIsLoadingTimeline(false);
      }
    };

    fetchTimelineData();
    // Xóa danh sách slot đã chọn nếu người dùng chuyển sang ngày khác
    setSelectedSlots([]);
  }, [court.id, selectedDate]);

  // 2. TÍNH TOÁN THỨ TRONG TUẦN (Từ 2 đến 8 cho T2 - CN)
  const getDayOfWeekVN = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay(); // 0 (Sun) to 6 (Sat)
    return day === 0 ? 8 : day + 1; // 2 (Mon) to 8 (Sun)
  };

  const currentDow = getDayOfWeekVN(selectedDate);

  // 3. Sinh danh sách các khung giờ tĩnh (Bắt đầu từ 5:30)
  const timeSlots = [];
  timeSlots.push('05:30'); 
  for (let h = 6; h < 24; h++) {
    const hourStr = h.toString().padStart(2, '0');
    timeSlots.push(`${hourStr}:00`);
    timeSlots.push(`${hourStr}:30`);
  }
  timeSlots.push(`24:00`);

  const formatTimeSlot = (timeStr) => {
    if (!timeStr) return '';
    if (timeStr === '23:59:00' || timeStr === '24:00:00') return '24h';
    return timeStr.substring(0, 5).replace(/^0/, '').replace(':00', 'h');
  };

  // 4. Tính giá tiền cho 1 ô 30 phút dựa vào rules trả về từ API
  const getPriceForHalfHour = (timeStr) => {
    if (!timelineData || !timelineData.pricingRules) return 50000; 
    
    const formattedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    
    // Lọc các rule áp dụng cho ngày hôm nay (Ưu tiên specificDate, sau đó đến dayOfWeek)
    const rulesToday = timelineData.pricingRules.filter(rule => {
      if (rule.specificDate) {
        return new Date(rule.specificDate).toISOString().split('T')[0] === selectedDate;
      }
      return rule.dayOfWeek === currentDow && rule.active;
    });

    // Sắp xếp độ ưu tiên (Priority giảm dần)
    rulesToday.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Tìm rule khớp với khung giờ
    const matchedRule = rulesToday.find(rule => {
      return formattedTime >= rule.startTime && formattedTime < rule.endTime;
    });

    if (matchedRule) {
      return matchedRule.pricePerHour / 2; // Chia đôi vì 1 ô là 30 phút
    }
    return 50000; 
  };

  // 5. Xác định trạng thái của Slot: Trống, Khóa hay Đã đặt
  const checkSlotStatus = (courtId, timeStr) => {
    if (!timelineData || !timelineData.slots) return 'LOCKED'; // Chưa có data thì khóa hết

    const formattedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;

    // Tìm xem khung giờ này có nằm trong slot hoạt động của ngày hôm nay không
    const activeSlotsToday = timelineData.slots.filter(s => s.dayOfWeek === currentDow && s.status === 'ACTIVE');

    // Nếu không có slot nào cấu hình cho ngày này -> Khoá (Màu xám)
    if (activeSlotsToday.length === 0) return 'LOCKED';

    // Kiểm tra xem thời gian có nằm trong giờ mở cửa không
    const isWithinOperatingHours = activeSlotsToday.some(slot => {
      return formattedTime >= slot.startTime && formattedTime < slot.endTime;
    });

    if (!isWithinOperatingHours) return 'LOCKED';

    // GIẢ LẬP: Một số khung giờ đã bị đặt (Màu đỏ). Trong thực tế sẽ map với trường bookings từ API
    if (courtId === 13 && (timeStr === '18:00' || timeStr === '18:30' || timeStr === '19:00')) return 'BOOKED';
    if (courtId === 14 && (timeStr === '17:30' || timeStr === '18:00' || timeStr === '18:30')) return 'BOOKED';

    return 'AVAILABLE';
  };

  // 6. Xử lý Logic Kéo Thả (Drag to Scroll)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragDistance(0);
    setStartX(e.pageX - timelineRef.current.offsetLeft);
    setScrollLeft(timelineRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - timelineRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    timelineRef.current.scrollLeft = scrollLeft - walk;
    setDragDistance(Math.abs(walk));
  };

  // 7. Xử lý chọn ô giờ
  const handleSlotClick = (courtId, timeStr, status) => {
    if (dragDistance > 5) return;
    if (status !== 'AVAILABLE') return;

    const slotKey = `${courtId}-${timeStr}`;
    const existingIndex = selectedSlots.findIndex(s => `${s.courtId}-${s.timeStr}` === slotKey);

    if (existingIndex >= 0) {
      const newSlots = [...selectedSlots];
      newSlots.splice(existingIndex, 1);
      setSelectedSlots(newSlots);
    } else {
      const price = getPriceForHalfHour(timeStr);
      setSelectedSlots([...selectedSlots, { courtId, timeStr, price }]);
    }
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN') + ' đ';
  
  const totalAmount = selectedSlots.reduce((acc, slot) => acc + slot.price, 0);
  const totalHours = Math.floor(selectedSlots.length / 2);
  const totalMins = (selectedSlots.length % 2) * 30;

  const displayDate = new Date(selectedDate).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  // Sử dụng danh sách sân con từ timelineData nếu có, nếu không thì dùng court ban đầu
  const courtsToRender = timelineData?.courts || court.courts || [];

  // HÀM RENDER BẢNG GIÁ DÀNH CHO MODAL XEM BẢNG GIÁ ĐỘC LẬP
  const renderPricingModalTable = () => {
    const rulesToUse = timelineData?.pricingRules || court.pricingRules;

    if (!rulesToUse || rulesToUse.length === 0) {
      return <div className="bg-white text-gray-800 p-4 rounded text-center">Chưa có thông tin bảng giá.</div>;
    }

    const daysMap = {};
    rulesToUse.forEach(rule => {
      if (!daysMap[rule.dayOfWeek]) daysMap[rule.dayOfWeek] = [];
      daysMap[rule.dayOfWeek].push(rule);
    });

    const signatureMap = {};
    Object.keys(daysMap).forEach(day => {
      const rules = daysMap[day].sort((a,b) => a.startTime.localeCompare(b.startTime));
      const signature = rules.map(r => `${r.startTime}-${r.endTime}-${r.pricePerHour}`).join('|');
      if (!signatureMap[signature]) {
        signatureMap[signature] = { days: [], rules: rules };
      }
      signatureMap[signature].days.push(parseInt(day));
    });

    const finalGroups = Object.values(signatureMap).map(sig => {
      const sortedDays = sig.days.sort((a,b) => a-b);
      let dayLabel = '';
      const isT2toT6 = [2,3,4,5,6].every(d => sortedDays.includes(d)) && sortedDays.length === 5;
      const isT7CN = sortedDays.includes(7) && (sortedDays.includes(8) || sortedDays.includes(1)) && sortedDays.length === 2;
      
      if (isT2toT6) dayLabel = 'T2 - T6';
      else if (isT7CN) dayLabel = 'T7 - CN';
      else if (sortedDays.length === 7) dayLabel = 'T2 - CN';
      else dayLabel = sortedDays.map(d => (d === 8 || d === 1) ? 'CN' : `T${d}`).join(', ');
      
      return { dayLabel, rules: sig.rules };
    });

    return (
      <div className="overflow-x-auto w-full bg-white rounded-sm shadow-lg text-gray-800">
        <table className="w-full text-center border-collapse text-[14px]">
          <thead>
            <tr>
              <th colSpan="3" className="py-3 px-4 font-bold text-[#eb5322] border border-[#eb5322] uppercase tracking-wide bg-white">
                {court.category}
              </th>
            </tr>
            <tr>
              <th colSpan="3" className="py-3 px-4 font-bold text-[#eb5322] border border-[#eb5322] tracking-wide bg-white">
                Khách hàng
              </th>
            </tr>
            <tr className="bg-white">
              <th className="py-3 px-4 font-bold text-[#eb5322] border border-[#eb5322]">Thứ</th>
              <th className="py-3 px-4 font-bold text-[#eb5322] border border-[#eb5322]">Khung giờ</th>
              <th className="py-3 px-4 font-bold text-[#eb5322] border border-[#eb5322]">Giá</th>
            </tr>
          </thead>
          <tbody>
            {finalGroups.map((g, gIdx) => {
              return g.rules.map((rule, rIdx) => (
                <tr key={`${g.dayLabel}-${rIdx}`} className="bg-white text-gray-800">
                  {rIdx === 0 && (
                    <td rowSpan={g.rules.length} className="py-3 px-4 border border-[#eb5322] align-middle whitespace-nowrap font-medium">
                      {g.dayLabel}
                    </td>
                  )}
                  <td className="py-3 px-4 border border-[#eb5322] whitespace-nowrap">
                    {formatTimeSlot(rule.startTime)} - {formatTimeSlot(rule.endTime)}
                  </td>
                  <td className="py-3 px-4 border border-[#eb5322] whitespace-nowrap">
                    {formatPrice(rule.pricePerHour)}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-[#f0f4f8] flex flex-col font-sans overflow-hidden">
        
        {/* Header màu cam đồng bộ MATHMORE */}
        <div className="bg-[#eb5322] text-white px-4 py-4 flex items-center justify-between relative shadow-md z-10">
          <button onClick={onBack} className="text-white hover:text-gray-200 bg-transparent border-none cursor-pointer p-1">
            <ChevronLeft size={28} strokeWidth={2.5} />
          </button>
          <h1 className="text-[18px] md:text-[22px] font-bold m-0 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap tracking-wide">
            Đặt lịch ngày trực quan
          </h1>
          
          {/* Nút bật Custom DatePicker */}
          <div 
            onClick={() => setIsDatePickerOpen(true)}
            className="flex items-center bg-white/20 rounded-sm px-3 py-2 cursor-pointer border border-white/30 hover:bg-white/30 transition-colors"
          >
            <span className="mr-2 text-[14px] font-medium tracking-wide">{displayDate}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
        </div>

        {/* Legend (Chú giải) màu cam đậm */}
        <div className="bg-[#d04316] px-4 py-3 text-[14px] flex items-center gap-6 text-white overflow-x-auto whitespace-nowrap shadow-inner border-t border-white/10 z-10">
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-white rounded-sm border border-gray-300"></div> Trống</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#ff4d4f] rounded-sm"></div> Đã đặt</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#9e9e9e] rounded-sm"></div> Khoá</div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 bg-[#d946ef] rounded-sm text-white font-bold text-[12px] flex items-center justify-center shadow-inner">!</div> Sự kiện</div>
          <div 
            onClick={() => setShowPricingModal(true)}
            className="flex items-center gap-2 font-bold underline cursor-pointer ml-auto hover:text-yellow-300 transition-colors text-yellow-400"
          >
            Xem sân & bảng giá
          </div>
        </div>

        {/* Lưu ý */}
        <div className="text-center py-2.5 text-[15px] text-gray-700 bg-orange-50 border-b border-orange-100 shadow-sm z-10">
          <span className="text-[#eb5322] font-semibold">Lưu ý:</span> Nếu bạn cần đặt lịch cố định vui lòng liên hệ: <span className="font-bold">{court.phone}</span> để được hỗ trợ
        </div>

        {/* KHU VỰC GRID TIMELINE */}
        <div className="relative flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Overlay Loading khi đang gọi API lấy dữ liệu ngày mới */}
          {isLoadingTimeline && (
            <div className="absolute inset-0 z-[60] bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
              <Loader2 size={48} className="animate-spin text-[#eb5322]" />
            </div>
          )}

          <div 
            ref={timelineRef}
            className="flex-1 overflow-auto cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <div className="inline-block min-w-full pb-20 pt-2 px-2 relative">
              {/* Dòng Header thời gian (Ghim top) */}
              <div className="flex sticky top-0 z-[40] w-max shadow-sm rounded-t-md bg-white">
                {/* Góc trống giao nhau (Ghim left và top) */}
                <div className="w-24 flex-shrink-0 bg-orange-50 border-r border-b border-gray-300 sticky left-0 z-[50]"></div>
                
                {timeSlots.map((time, idx) => {
                  // Cắt chuỗi để lấy dạng H:mm (VD: 05:30 -> 5:30)
                  const displayTime = time.startsWith('0') ? time.substring(1, 5) : time.substring(0, 5);
                  return (
                    <div key={idx} style={{ minWidth: `${cellWidth}px` }} className="text-center py-2 border-r border-b border-gray-300 bg-orange-50 text-[#eb5322] text-[13px] font-bold flex-shrink-0">
                      {displayTime}
                    </div>
                  );
                })}
              </div>

              {/* Các dòng Sân */}
              {courtsToRender.map((c, index) => (
                <div key={c.courtId} className="flex w-max border-b border-gray-300">
                  {/* Tên sân (Ghim left) */}
                  <div className="w-24 flex-shrink-0 bg-white border-r border-gray-300 sticky left-0 z-[30] flex items-center justify-center text-[13px] font-bold text-gray-700 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-center px-1">
                    {c.name || `${court.category} ${index + 1}`}
                  </div>
                  
                  {/* Các ô thời gian của sân */}
                  {timeSlots.slice(0, -1).map((time, idx) => {
                    const status = checkSlotStatus(c.courtId, time);
                    const isSelected = selectedSlots.some(s => s.courtId === c.courtId && s.timeStr === time);
                    
                    let bgColor = 'bg-white hover:bg-orange-50/50';
                    if (status === 'BOOKED') bgColor = 'bg-[#ff4d4f]'; // Đỏ nhạt
                    else if (status === 'LOCKED') bgColor = 'bg-[#9e9e9e]'; // Xám
                    else if (isSelected) bgColor = 'bg-orange-100 border-2 border-[#eb5322] scale-y-105 z-10 shadow-sm'; // Cam nhạt khi chọn

                    return (
                      <div 
                        key={`${c.courtId}-${idx}`} 
                        style={{ minWidth: `${cellWidth}px` }} 
                        className={`h-[52px] border-r border-gray-300 flex-shrink-0 transition-all ${bgColor} ${status === 'AVAILABLE' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => handleSlotClick(c.courtId, time, status)}
                      >
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Zoom Control Slider */}
          <div className="absolute right-6 bottom-6 bg-white p-3 rounded-full shadow-xl border border-gray-200 flex items-center gap-3 z-20">
            <div className="w-4 h-4 rounded-full bg-[#eb5322] shadow-sm"></div>
            <input 
              type="range" 
              min="40" 
              max="120" 
              value={cellWidth} 
              onChange={(e) => setCellWidth(Number(e.target.value))}
              className="w-32 accent-[#eb5322]"
            />
          </div>
        </div>

        {/* Thanh Bottom: Tổng tiền và Nút Tiếp Theo */}
        <div className="bg-[#eb5322] text-white px-6 py-5 flex flex-col items-center gap-4 mt-auto shadow-[0_-4px_10px_rgba(0,0,0,0.1)] relative z-[60]">
          <div className="w-full max-w-4xl flex items-center justify-between font-medium">
            <div className="text-[16px] md:text-[18px] font-bold">
              Tổng giờ: {totalHours}h{totalMins > 0 ? totalMins : '00'}
            </div>
            <div className="text-[16px] md:text-[18px] font-bold">
              Tổng tiền: {formatPrice(totalAmount)}
            </div>
          </div>
          <button 
            disabled={selectedSlots.length === 0}
            className="w-full max-w-4xl bg-[#fbad18] hover:bg-[#e59b12] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-sm text-[16px] border-none cursor-pointer transition-colors shadow-md uppercase tracking-wider"
          >
            Tiếp theo
          </button>
        </div>
      </div>

      {/* POPUP FULLSCREEN XEM BẢNG GIÁ (MÀU CAM ĐỒNG BỘ VNB) */}
      {showPricingModal && (
        <div className="fixed inset-0 z-[100000] bg-[#eb5322] flex flex-col font-sans overflow-hidden text-white">
          <div className="px-4 py-4 flex items-center justify-between relative shadow-sm border-b border-white/20">
            <button onClick={() => setShowPricingModal(false)} className="text-white hover:text-gray-200 bg-transparent border-none cursor-pointer p-1">
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>
            <h1 className="text-[18px] md:text-[22px] font-bold m-0 absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap tracking-wide">
              Xem sân và bảng giá
            </h1>
            <div className="w-8"></div> {/* Spacer to maintain absolute center */}
          </div>

          <div className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-bold mb-4">Bảng giá sân</h2>
              {renderPricingModalTable()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHỌN NGÀY TÙY CHỈNH */}
      <CustomDatePickerModal 
        isOpen={isDatePickerOpen}
        initialDate={selectedDate}
        onClose={() => setIsDatePickerOpen(false)}
        onConfirm={(dateStr) => {
          setSelectedDate(dateStr);
          setIsDatePickerOpen(false);
        }}
      />
    </>
  );
};


// =======================================================================
// TRANG CHI TIẾT SÂN CHÍNH
// =======================================================================
const CourtDetailPage = () => {
  const { id: encodedId } = useParams();
  const id = decodeId(encodedId);
  const [court, setCourt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('Dịch vụ'); 
  const TABS = ['Thông tin', 'Dịch vụ', 'Hình ảnh', 'Điều khoản & quy định', 'Đánh giá'];

  // --- STATE QUẢN LÝ VIỆC HIỂN THỊ MÀN HÌNH BOOKING ---
  const [showBookingTimeline, setShowBookingTimeline] = useState(false);

  const formatPrice = (price) => {
    return price ? Number(price).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  const getDayName = (dayOfWeek) => {
    if (dayOfWeek === 8 || dayOfWeek === 1) return 'Chủ nhật';
    return `Thứ ${dayOfWeek}`;
  };

  const formatTimeSlot = (timeStr) => {
    if (!timeStr) return '';
    if (timeStr === '23:59:00' || timeStr === '24:00:00') return '24h';
    return timeStr.substring(0, 5).replace(/^0/, '').replace(':00', 'h');
  };

  useEffect(() => {
    const fetchCourtDetail = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:8086/api/v1/court-centers/detail/${id}`);
        const data = await response.json();

        if (response.ok && data.status === 200 && data.data) {
          const result = data.data;

          const extractedImages = result.images?.map(img => img.imageUrl).filter(url => url) || [];
          const coverImg = extractedImages.length > 0 
            ? extractedImages[0] 
            : "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80";

          let minTime = "05:00";
          let maxTime = "23:00";
          if (result.slots && result.slots.length > 0) {
            minTime = result.slots[0].startTime ? result.slots[0].startTime.substring(0, 5) : "05:00";
            maxTime = result.slots[0].endTime ? result.slots[0].endTime.substring(0, 5) : "23:00";
          }

          setCourt({
            id: result.courtCenterId,
            name: result.name || "Sân cầu lông chưa rõ tên",
            rating: 4.6, 
            reviews: 9,  
            category: "Cầu lông", 
            address: result.locationDetail || "Đang cập nhật địa chỉ",
            time: `${minTime} - ${maxTime}`,
            phone: result.phoneNumber || "Đang cập nhật",
            coverImage: coverImg,
            logo: "https://via.placeholder.com/150x150/eb5322/ffffff?text=VNB", 
            description: `Hệ thống ${result.name} bao gồm ${result.courts?.length || 0} sân đạt chuẩn chất lượng cao. Địa chỉ tọa lạc tại ${result.locationDetail}. Trang bị mặt thảm chống trơn trượt, hệ thống đèn led hiện đại và không gian thoáng đãng. Phù hợp cho cả tập luyện chuyên nghiệp và giao lưu phong trào.`,
            services: ["Wifi miễn phí", "Bãi đỗ xe ô tô/xe máy rộng rãi", "Phòng thay đồ/Tắm nóng lạnh", "Căn tin/Giải khát", "Cho thuê vợt/giày"],
            images: extractedImages.length > 0 ? extractedImages : ["https://via.placeholder.com/600x400?text=Chua+co+anh"],
            rules: "1. Vui lòng mang giày thể thao đế mềm (không đinh) khi vào sân.\n2. Không hút thuốc, ăn uống trên mặt sân thảm.\n3. Nhận sân đúng giờ, trả sân đúng giờ quy định.",
            pricingRules: result.pricingRules || [],
            courts: result.courts || [] // Lưu danh sách sân nhỏ
          });
        } else {
          setError(data.message || "Không thể lấy thông tin sân.");
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết sân:", err);
        setError("Không thể tải thông tin sân. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourtDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const renderPricingTable = () => {
    if (!court.pricingRules || court.pricingRules.length === 0) return null;

    const dateGroups = {};
    court.pricingRules.forEach(rule => {
      const dKey = rule.specificDate ? new Date(rule.specificDate).toLocaleDateString('vi-VN') : '01/12 - 31/12'; 
      if (!dateGroups[dKey]) dateGroups[dKey] = {};
      if (!dateGroups[dKey][rule.dayOfWeek]) dateGroups[dKey][rule.dayOfWeek] = [];
      dateGroups[dKey][rule.dayOfWeek].push(rule);
    });

    const finalGroups = {};
    Object.keys(dateGroups).forEach(dKey => {
      const daysMap = dateGroups[dKey];
      const signatureMap = {};

      Object.keys(daysMap).forEach(day => {
        const rules = daysMap[day].sort((a,b) => a.startTime.localeCompare(b.startTime));
        const signature = rules.map(r => `${r.startTime}-${r.endTime}-${r.pricePerHour}`).join('|');
        if (!signatureMap[signature]) {
          signatureMap[signature] = { days: [], rules: rules };
        }
        signatureMap[signature].days.push(parseInt(day));
      });

      finalGroups[dKey] = Object.values(signatureMap).map(sig => {
        const sortedDays = sig.days.sort((a,b) => a-b);
        let dayLabel = '';
        const isT2toT6 = [2,3,4,5,6].every(d => sortedDays.includes(d)) && sortedDays.length === 5;
        const isT7CN = sortedDays.includes(7) && (sortedDays.includes(8) || sortedDays.includes(1)) && sortedDays.length === 2;
        
        if (isT2toT6) dayLabel = 'T2 - T6';
        else if (isT7CN) dayLabel = 'T7 - CN';
        else if (sortedDays.length === 7) dayLabel = 'T2 - CN';
        else dayLabel = sortedDays.map(d => (d === 8 || d === 1) ? 'CN' : `T${d}`).join(', ');
        
        return { dayLabel, rules: sig.rules };
      });
    });

    return (
      <div className="overflow-x-auto w-full mb-8">
        <table className="w-full text-center border-collapse border border-[#eb5322] text-[14px]">
          <thead>
            <tr>
              <th colSpan="3" className="py-3 px-4 font-bold text-[#eb5322] border border-[#eb5322] uppercase tracking-wide bg-white">
                {court.category}
              </th>
            </tr>
            <tr className="bg-white">
              <th className="py-3 px-4 font-bold text-[#eb5322] border border-[#eb5322]">Thứ</th>
              <th className="py-3 px-4 font-bold text-[#eb5322] border border-[#eb5322]">Khung giờ</th>
              <th className="py-3 px-4 font-bold text-[#eb5322] border border-[#eb5322]">Giá</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(finalGroups).map((dKey) => {
              const dayGroups = finalGroups[dKey];
              return dayGroups.map((g, gIdx) => {
                return g.rules.map((rule, rIdx) => (
                  <tr key={`${dKey}-${g.dayLabel}-${rIdx}`} className="bg-white text-gray-800">
                    {rIdx === 0 && (
                      <td rowSpan={g.rules.length} className="py-3 px-4 border border-[#eb5322] align-middle whitespace-nowrap font-medium">
                        {g.dayLabel}
                      </td>
                    )}
                    <td className="py-3 px-4 border border-[#eb5322] whitespace-nowrap">
                      {formatTimeSlot(rule.startTime)} - {formatTimeSlot(rule.endTime)}
                    </td>
                    <td className="py-3 px-4 border border-[#eb5322] whitespace-nowrap">
                      {formatPrice(rule.pricePerHour)}
                    </td>
                  </tr>
                ));
              });
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!court) return null;

    switch (activeTab) {
      case 'Thông tin':
        return (
          <div className="space-y-6 animate-fade-in text-gray-700 text-[14px] leading-relaxed">
            <div>
              <h3 className="font-bold text-[16px] text-gray-800 mb-2">Giới thiệu chung</h3>
              <p>{court.description}</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-sm">
              <p className="font-medium text-[#eb5322] flex items-center gap-2 mb-2">
                <Info size={16} /> Lưu ý:
              </p>
              <p className="text-sm text-gray-600">Vui lòng liên hệ trực tiếp số điện thoại chủ sân để xác nhận chính xác các khung giờ trống hiện tại.</p>
            </div>
          </div>
        );
      case 'Dịch vụ':
        return (
          <div className="animate-fade-in">
             {renderPricingTable()}
             <h3 className="font-bold text-[16px] text-gray-800 mb-4 mt-6">Tiện ích tại sân</h3>
             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {court.services.map((service, index) => (
                 <li key={index} className="flex items-center gap-3 text-[14px] text-gray-700 bg-gray-50 p-3 rounded-sm border border-gray-100">
                   <div className="text-[#eb5322]"><CheckCircleIcon /></div>
                   {service}
                 </li>
               ))}
             </ul>
          </div>
        );
      case 'Hình ảnh':
        return (
          <div className="animate-fade-in grid grid-cols-2 sm:grid-cols-3 gap-3">
            {court.images.map((img, index) => (
              <div key={index} className="aspect-video bg-gray-200 rounded-sm overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
                <img src={img} alt={`Hình ảnh sân ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        );
      case 'Điều khoản & quy định':
        return (
          <div className="animate-fade-in text-[14px] text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-5 rounded-sm border border-gray-200">
            <h3 className="font-bold text-[16px] text-[#eb5322] mb-3">Nội quy sân bãi</h3>
            {court.rules}
          </div>
        );
      case 'Đánh giá':
        return (
          <div className="animate-fade-in text-center py-10">
            <Star size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Chưa có đánh giá chi tiết nào cho sân này.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={40} className="animate-spin text-[#eb5322]" />
      </div>
    );
  }

  if (error || !court) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">{error || "Sân không tồn tại."}</p>
        <Link to="/courts" className="px-6 py-2 bg-[#eb5322] text-white rounded-sm no-underline font-medium hover:bg-[#d04316] transition-colors">
          Quay lại hệ thống sân
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* NẾU SHOW BOOKING TIMELINE = TRUE THÌ RENDER MÀN HÌNH FULL SCREEN */}
      {showBookingTimeline && (
        <BookingTimeline court={court} onBack={() => setShowBookingTimeline(false)} />
      )}

      {/* MÀN HÌNH CHI TIẾT SÂN SẼ BỊ ẨN ĐI NẾU ĐANG BẬT MÀN BOOKING ĐỂ GIỮ STATE VÀ VỊ TRÍ SCROLL */}
      <div className={`bg-gray-100 min-h-screen font-sans pb-20 ${showBookingTimeline ? 'hidden' : 'block'}`}>
        
        {/* BANNER & HEADER */}
        <div className="h-[280px] relative bg-gray-300">
          <img src={court.coverImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10">
            <Link to="/courts" className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-sm transition-colors cursor-pointer">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </Link>
            <div className="flex gap-3">
              <button className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-sm transition-colors border-none cursor-pointer">
                <Heart size={20} strokeWidth={2.5} className="hover:text-red-500 transition-colors" />
              </button>
              <button className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-2.5 shadow-sm transition-colors border-none cursor-pointer">
                <Share2 size={20} strokeWidth={2.5} className="hover:text-blue-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 relative z-10 -mt-24 mb-6">
          
          {/* INFO CARD */}
          <div className="bg-white rounded-sm shadow-md p-6 pt-12 relative border border-gray-100">
            <div className="absolute -top-12 left-6 w-24 h-24 bg-white rounded-sm border-4 border-white shadow-sm overflow-hidden flex items-center justify-center p-1">
              <img src={court.logo} alt="Logo" className="w-full h-full object-contain rounded-sm" />
            </div>

            <div className="absolute -top-4 left-[135px] bg-[#eb5322] text-white px-3 py-1 rounded-sm text-[12px] font-bold flex items-center shadow-sm">
              <Star size={12} fill="currentColor" className="mr-1.5" /> 
              {court.rating} ({court.reviews} đánh giá)
            </div>

            <div className="absolute top-4 right-4 md:top-6 md:right-6 hidden sm:block">
              <button 
                onClick={() => setShowBookingTimeline(true)}
                className="bg-[#f0ad4e] hover:bg-[#e09d3e] text-white font-bold py-2.5 px-8 rounded-sm transition-colors shadow-sm text-[14px] border-none cursor-pointer"
              >
                ĐẶT LỊCH
              </button>
            </div>

            <div className="pr-0 sm:pr-40">
              <h1 className="text-[20px] md:text-[22px] font-bold text-gray-800 mt-2 mb-2 leading-snug">
                {court.name}
              </h1>
              
              <div className="inline-flex items-center px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-600 rounded-sm text-[12px] font-medium mb-5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1.5">
                  <path d="M12 22v-5"></path><path d="M9 7l3 10 3-10"></path><path d="M14 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path><path d="M10 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path><path d="M6 7l6 10"></path><path d="M18 7l-6 10"></path>
                </svg>
                {court.category}
              </div>

              <div className="space-y-3.5 text-[14px] text-gray-600 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="text-[#eb5322] mt-0.5 flex-shrink-0" size={18} strokeWidth={2.5} />
                  <span className="leading-snug">{court.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-[#eb5322] mt-0.5 flex-shrink-0" size={18} strokeWidth={2.5} />
                  <span>{court.time}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-[#eb5322] mt-0.5 flex-shrink-0" size={18} strokeWidth={2.5} />
                  <div className="flex flex-col">
                    <a href={`tel:${court.phone}`} className="text-[#eb5322] font-semibold hover:underline no-underline block">{court.phone}</a>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 block sm:hidden">
                <button 
                  onClick={() => setShowBookingTimeline(true)}
                  className="w-full bg-[#f0ad4e] hover:bg-[#e09d3e] text-white font-bold py-3 rounded-sm transition-colors shadow-sm text-[14px] border-none cursor-pointer"
                >
                  ĐẶT LỊCH NGAY
                </button>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-gray-200 mt-8 scrollbar-thin scrollbar-thumb-gray-300 w-full pb-0.5">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-3.5 px-6 font-bold text-[14px] transition-colors bg-transparent cursor-pointer border-t-0 border-l-0 border-r-0 border-b-[3px] outline-none ${
                    activeTab === tab 
                      ? 'border-[#eb5322] text-[#eb5322]'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="bg-white mt-4 rounded-sm shadow-sm p-6 border border-gray-100 min-h-[300px]">
            {renderTabContent()}
          </div>

        </div>
      </div>
    </>
  );
};

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default CourtDetailPage;
