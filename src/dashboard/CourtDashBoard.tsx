import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  MapPin,
  Phone,
  Layout,
  X,
  Save,
  Image as ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
  CheckCircle,
  XCircle,
  Map,
  Clock,
  DollarSign,
  ExternalLink,
  CalendarDays
} from "lucide-react";
import { Link } from 'react-router-dom';

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
  const Icon = type === 'success' ? CheckCircle : XCircle;
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className={`fixed top-4 right-4 z-[9999] flex items-center p-4 mb-4 rounded-lg border shadow-lg transform transition-all duration-500 ease-in-out animate-in slide-in-from-top-5 ${bgColor}`}>
      <Icon className={`w-5 h-5 mr-3 ${iconColor}`} />
      <div className={`text-sm font-medium ${textColor}`}>{message}</div>
      <button onClick={onClose} className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${textColor} hover:bg-white/50 transition-colors border-none cursor-pointer bg-transparent`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// --- Court Detail Modal ---
const CourtDetailModal = ({ isOpen, onClose, court }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isOpen && court && court.images && court.images.length > 0) {
      setSelectedImage(court.images[0]);
    } else {
      setSelectedImage(null);
    }
  }, [isOpen, court]);

  if (!isOpen || !court) return null;

  const displayImage = selectedImage || (court.images && court.images.length > 0 ? court.images[0] : null);
  const isDeleted = court.deleted === 1;

  // Trích xuất giờ hoạt động từ slots (Lấy mẫu ngày đầu tiên nếu có)
  const opHours = court.slots && court.slots.length > 0 
    ? `${court.slots[0].startTime.substring(0,5)} - ${court.slots[0].endTime.substring(0,5)}` 
    : "Chưa cập nhật";

  // Hàm nhóm các rule giá theo ngày nếu có chung mức giá và khung giờ
  const renderGroupedPricingRules = () => {
    if (!court.pricingRules || court.pricingRules.length === 0) {
        return <div className="text-sm text-gray-500 italic p-2">Chưa có thông tin bảng giá.</div>;
    }

    const daysMap = {};
    court.pricingRules.forEach(rule => {
      if (!daysMap[rule.dayOfWeek]) daysMap[rule.dayOfWeek] = [];
      daysMap[rule.dayOfWeek].push(rule);
    });

    const signatureMap = {};
    Object.keys(daysMap).forEach(day => {
      const rules = daysMap[day].sort((a,b) => a.startTime.localeCompare(b.startTime));
      // Tạo chuỗi signature để nhóm các ngày có cấu hình giống hệt nhau
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
      const isT7CN = sortedDays.includes(7) && (sortedDays.includes(1) || sortedDays.includes(8)) && sortedDays.length === 2;
      
      if (isT2toT6) dayLabel = 'T2 - T6';
      else if (isT7CN) dayLabel = 'T7 - CN';
      else if (sortedDays.length === 7) dayLabel = 'T2 - CN';
      else dayLabel = sortedDays.map(d => (d === 1 || d === 8) ? 'CN' : `T${d}`).join(', ');

      return { dayLabel, rules: sig.rules };
    });

    return (
      <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden max-h-48 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="p-2.5 font-bold uppercase tracking-wide">Ngày áp dụng</th>
              <th className="p-2.5 font-bold uppercase tracking-wide">Khung giờ</th>
              <th className="p-2.5 font-bold uppercase tracking-wide text-right">Giá (₫/h)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {finalGroups.map((g, gIdx) => (
              g.rules.map((rule, rIdx) => (
                <tr key={`${g.dayLabel}-${rIdx}`} className="hover:bg-slate-100/50 transition-colors">
                  {rIdx === 0 && (
                      <td rowSpan={g.rules.length} className="p-2.5 font-medium align-middle border-r border-slate-100 bg-white/50">
                          {g.dayLabel}
                      </td>
                  )}
                  <td className="p-2.5 font-medium">
                      {rule.startTime.substring(0,5)} - {rule.endTime.substring(0,5)}
                  </td>
                  <td className="p-2.5 text-right font-bold text-[#eb5322]">
                      {rule.pricePerHour.toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Map className="mr-2 text-indigo-600" size={20} /> 
            Chi tiết Hệ thống sân
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images Section */}
                <div className="space-y-4">
                    <div className={`aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 relative group p-2 ${isDeleted ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                        {displayImage ? (
                            <img src={displayImage} alt={court.name} className="w-full h-full object-cover rounded-md" />
                        ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                                <ImageIcon size={48} className="opacity-50 mb-2"/>
                                <span className="text-sm">Chưa có ảnh</span>
                            </div>
                        )}
                        <div className="absolute top-3 right-3">
                             {isDeleted && (
                               <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide border shadow-sm bg-gray-100 text-gray-500 border-gray-200">
                                   Đã xóa
                               </span>
                             )}
                        </div>
                    </div>
                    {court.images && court.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                             {court.images.map((img, idx) => (
                                 <div 
                                    key={idx} 
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-16 p-1 bg-white flex-shrink-0 border rounded-md overflow-hidden cursor-pointer transition-all ${selectedImage === img ? 'ring-2 ring-indigo-500 ring-offset-1 border-indigo-500' : 'border-slate-200 hover:border-indigo-300'}`}
                                 >
                                     <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded-sm" />
                                 </div>
                             ))}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className={`space-y-6 ${isDeleted ? 'opacity-70' : ''}`}>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                          {court.name} {isDeleted && <span className="text-sm font-medium text-red-500 ml-2">(Đã xóa)</span>}
                        </h2>
                        <div className="flex flex-col gap-2.5 text-sm text-slate-600">
                            <div className="flex items-start gap-2">
                                <MapPin size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                                <div className="flex-1 leading-snug">
                                  {court.address}
                                  {court.googleMapUrl && (
                                    <a href={court.googleMapUrl} target="_blank" rel="noreferrer" className="block text-indigo-500 hover:text-indigo-700 hover:underline mt-1 text-xs flex items-center">
                                      <ExternalLink size={12} className="mr-1"/> Xem trên bản đồ
                                    </a>
                                  )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={18} className="text-indigo-600 shrink-0" />
                                <span className="font-semibold">{court.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-indigo-600 shrink-0" />
                                <span className="font-medium">{opHours}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center"><DollarSign size={16} className="mr-1 text-green-600"/> Bảng giá dịch vụ</h4>
                        {renderGroupedPricingRules()}
                    </div>
                </div>
            </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50 rounded-b-xl shrink-0">
           <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all shadow-sm border-none cursor-pointer">
              Đóng
           </button>
        </div>
      </div>
    </div>
  );
};

// --- PROGRESS MODAL ---
const ProcessProgressModal = ({ isOpen, courtName, actionType = 'saving' }) => {
  if (!isOpen) return null;

  const isDeleting = actionType === 'deleting';
  const colorClass = isDeleting ? 'text-red-600' : 'text-indigo-600';
  const bgClass = isDeleting ? 'bg-red-50' : 'bg-indigo-50';
  const barClass = isDeleting ? 'bg-red-600' : 'bg-indigo-600';
  const title = isDeleting ? 'Đang xóa sân' : 'Đang lưu sân';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className={`w-16 h-16 ${bgClass} rounded-full flex items-center justify-center mb-4`}>
           <Loader2 className={`w-8 h-8 ${colorClass} animate-spin`} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-center mb-6">
          Đang xử lý dữ liệu cho <span className={`font-bold ${colorClass}`}>"{courtName}"</span>...
        </p>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full w-1/2 ${barClass} animate-pulse rounded-full`}></div>
        </div>
      </div>
    </div>
  );
};

// --- CONFIRM DELETE MODAL ---
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, courtName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
          <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa Hệ Thống Sân?</h3>
              <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa sân <span className="font-bold text-gray-900">"{courtName}"</span>?
                  <br />Hành động này không thể hoàn tác.
              </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50/50">
              <button onClick={onClose} className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all cursor-pointer border-none">Hủy</button>
              <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm border-none cursor-pointer">Xóa</button>
          </div>
      </div>
    </div>
  );
};

// --- COURT FORM MODAL ---
const CourtFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const DAYS_OF_WEEK = [
    { value: 1, label: 'T2' },
    { value: 2, label: 'T3' },
    { value: 3, label: 'T4' },
    { value: 4, label: 'T5' },
    { value: 5, label: 'T6' },
    { value: 6, label: 'T7' },
    { value: 7, label: 'CN' },
  ];

  const [formData, setFormData] = useState({
    name: "", address: "", phone: "", description: "",
    numberOfCourts: 1,
    openTime: "05:00",
    closeTime: "23:00"
  });
  
  const [images, setImages] = useState([""]);
  const [pricingRules, setPricingRules] = useState([
    { id: Date.now(), days: [1,2,3,4,5,6,7], startTime: "05:00", endTime: "23:00", pricePerHour: 100000 }
  ]);
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    if (isOpen) {
      setErrors({}); 
      if (initialData) {
        // Parse time from slots if available
        let oTime = "05:00";
        let cTime = "23:00";
        if (initialData.slots && initialData.slots.length > 0) {
            oTime = initialData.slots[0].startTime ? initialData.slots[0].startTime.substring(0, 5) : "05:00";
            cTime = initialData.slots[0].endTime ? initialData.slots[0].endTime.substring(0, 5) : "23:00";
        }

        setFormData({
          name: initialData.name,
          address: initialData.address || "",
          phone: initialData.phone || "",
          description: initialData.description || "",
          numberOfCourts: initialData.courts ? initialData.courts.length : 1,
          openTime: oTime,
          closeTime: cTime
        });
        setImages(initialData.images && initialData.images.length > 0 ? initialData.images : [""]);

        // Gộp Pricing Rules dựa vào sự tương đồng để hiển thị lên UI
        if (initialData.pricingRules && initialData.pricingRules.length > 0) {
           const grouped = {};
           initialData.pricingRules.forEach(r => {
             // Không còn field ruleType nên key gộp chỉ dựa vào thời gian và giá
             const key = `${r.startTime}-${r.endTime}-${r.pricePerHour}`;
             if (!grouped[key]) {
               grouped[key] = {
                 id: Math.random(),
                 days: [],
                 startTime: r.startTime.substring(0, 5),
                 endTime: r.endTime.substring(0, 5),
                 pricePerHour: r.pricePerHour
               };
             }
             if (!grouped[key].days.includes(r.dayOfWeek)) {
               grouped[key].days.push(r.dayOfWeek);
             }
           });
           setPricingRules(Object.values(grouped));
        } else {
           setPricingRules([{ id: Date.now(), days: [1,2,3,4,5,6,7], startTime: oTime, endTime: cTime, pricePerHour: 100000 }]);
        }

      } else {
        setFormData({ name: "", address: "", phone: "", description: "", numberOfCourts: 1, openTime: "05:00", closeTime: "23:00" });
        setImages([""]); 
        setPricingRules([{ id: Date.now(), days: [1,2,3,4,5,6,7], startTime: "05:00", endTime: "23:00", pricePerHour: 100000 }]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // Xử lý Danh sách Hình ảnh
  const handleSimpleListChange = (index, value) => {
    const newList = [...images];
    newList[index] = value;
    setImages(newList);
    if (value && errors.images) setErrors({...errors, images: null});
  };
  
  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (index) => {
    const newList = [...images];
    newList.splice(index, 1);
    setImages(newList);
  };

  // Xử lý Bảng giá (Pricing Rules)
  const handleRuleChange = (index, field, value) => {
    const newRules = [...pricingRules];
    newRules[index] = { ...newRules[index], [field]: value };
    setPricingRules(newRules);
  };

  const toggleRuleDay = (index, dayValue) => {
    const newRules = [...pricingRules];
    const rule = newRules[index];
    if (rule.days.includes(dayValue)) {
      rule.days = rule.days.filter(d => d !== dayValue);
    } else {
      rule.days = [...rule.days, dayValue];
    }
    setPricingRules(newRules);
  };

  const addPricingRule = () => {
    setPricingRules([
      ...pricingRules, 
      { id: Date.now(), days: [], startTime: formData.openTime, endTime: formData.closeTime, pricePerHour: 100000 }
    ]);
  };

  const removePricingRule = (index) => {
    const newRules = [...pricingRules];
    newRules.splice(index, 1);
    setPricingRules(newRules);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên hệ thống sân";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (formData.numberOfCourts < 1) newErrors.numberOfCourts = "Số lượng sân phải lớn hơn 0";
    
    const hasValidImage = images.some(img => img.trim() !== "");
    if (!hasValidImage) newErrors.images = "Cần ít nhất 1 đường dẫn hình ảnh";

    if (pricingRules.length === 0) {
      newErrors.pricing = "Vui lòng cấu hình ít nhất 1 bảng giá";
    } else {
      const invalidRule = pricingRules.find(r => r.days.length === 0 || !r.startTime || !r.endTime || !r.pricePerHour);
      if (invalidRule) newErrors.pricing = "Vui lòng điền đầy đủ thông tin cho các bảng giá (chọn ngày, giờ, giá)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
        // 1. Tạo mảng courts theo số lượng khai báo
        const courtsPayload = Array.from({ length: formData.numberOfCourts }).map((_, i) => ({
            name: `Sân ${i + 1}`,
            type: "BADMINTON",
            status: 1
        }));

        // 2. Tạo mảng slots hoạt động 7 ngày trong tuần
        const slotsPayload = [1, 2, 3, 4, 5, 6, 7].map(day => ({
            dayOfWeek: day,
            startTime: `${formData.openTime}:00`,
            endTime: `${formData.closeTime}:00`,
            status: "OPEN"
        }));

        // 3. Phân tách Pricing Rules từ UI thành Array tiêu chuẩn
        // Không lưu ruleType và priority nữa
        const pricingRulesPayload = [];
        pricingRules.forEach(rule => {
            rule.days.forEach(day => {
                pricingRulesPayload.push({
                    dayOfWeek: day,
                    startTime: `${rule.startTime}:00`,
                    endTime: `${rule.endTime}:00`,
                    pricePerHour: Number(rule.pricePerHour)
                });
            });
        });

        // 4. Tổng hợp
        const fullData = {
            name: formData.name,
            locationDetail: formData.address,
            phoneNumber: formData.phone,
            description: formData.description,
            courts: courtsPayload,
            slots: slotsPayload,
            pricingRules: pricingRulesPayload,
            images: images.filter(img => img.trim() !== "").map((img, idx) => ({
                imageUrl: img,
                isThumbnail: idx === 0
            }))
        };

        onSave(fullData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Map className="mr-2 text-indigo-600" size={20} /> 
            {initialData ? "Sửa Hệ Thống Sân" : "Thêm Hệ Thống Sân Mới"}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex flex-col gap-1 text-red-700 text-sm animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2 font-bold"><AlertTriangle size={16} /> Vui lòng kiểm tra lại các thông tin sau:</div>
              <ul className="list-disc pl-8 m-0 mt-1 space-y-1">
                {Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- CỘT TRÁI: THÔNG TIN CƠ BẢN --- */}
            <div className="lg:col-span-5 space-y-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Thông tin chung</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tên hệ thống sân <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => { setFormData({...formData, name: e.target.value}); if(e.target.value) setErrors({...errors, name: null}); }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`} 
                    placeholder="VD: Sân Cầu Lông An Huy..." 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => { setFormData({...formData, address: e.target.value}); if(e.target.value) setErrors({...errors, address: null}); }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.address ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`} 
                    placeholder="VD: 123 Đường ABC, Quận XYZ..." 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => { setFormData({...formData, phone: e.target.value}); if(e.target.value) setErrors({...errors, phone: null}); }}
                      className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`} 
                      placeholder="0912345678" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Số lượng sân nhỏ <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      min="1"
                      value={formData.numberOfCourts}
                      onChange={(e) => { setFormData({...formData, numberOfCourts: parseInt(e.target.value) || 1}); if(e.target.value > 0) setErrors({...errors, numberOfCourts: null}); }}
                      className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.numberOfCourts ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Giờ mở cửa chung <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-3">
                     <input type="time" value={formData.openTime} onChange={e => setFormData({...formData, openTime: e.target.value})} className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                     <span className="text-slate-400 font-bold">-</span>
                     <input type="time" value={formData.closeTime} onChange={e => setFormData({...formData, closeTime: e.target.value})} className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả chi tiết</label>
                  <textarea 
                    rows={3} 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none custom-scrollbar" 
                    placeholder="Quy định, tiện ích sân bãi..." 
                  />
                </div>
              </div>
            </div>

            {/* --- CỘT PHẢI: BẢNG GIÁ & HÌNH ẢNH --- */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* KHỐI CẤU HÌNH BẢNG GIÁ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
                     <DollarSign size={16} className="mr-2 text-green-500"/> Cấu hình Giá & Khung giờ
                   </h4>
                   <button type="button" onClick={addPricingRule} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center bg-transparent border-none cursor-pointer">
                      <Plus size={14} className="mr-1"/> Thêm Khung Giờ
                   </button>
                </div>
                
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                   {pricingRules.map((rule, index) => (
                      <div key={rule.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative group">
                        {pricingRules.length > 1 && (
                          <button onClick={() => removePricingRule(index)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-1">
                            <Trash2 size={16}/>
                          </button>
                        )}
                        
                        <div className="mb-4">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Áp dụng cho ngày</label>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {DAYS_OF_WEEK.map(d => {
                               const isActive = rule.days.includes(d.value);
                               return (
                                 <button
                                   key={d.value} type="button"
                                   onClick={() => toggleRuleDay(index, d.value)}
                                   className={`w-9 h-8 rounded-md text-xs font-bold transition-all border-none cursor-pointer ${isActive ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-200' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'}`}
                                 >
                                   {d.label}
                                 </button>
                               );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                           <div>
                              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Khung giờ</label>
                              <div className="flex items-center gap-2 mt-1">
                                <input type="time" value={rule.startTime} onChange={e => handleRuleChange(index, "startTime", e.target.value)} className="w-full px-2 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-indigo-500" />
                                <span className="text-slate-400 font-bold">-</span>
                                <input type="time" value={rule.endTime} onChange={e => handleRuleChange(index, "endTime", e.target.value)} className="w-full px-2 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-indigo-500" />
                              </div>
                           </div>
                           <div>
                              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Giá tiền (VNĐ/h)</label>
                              <input type="number" min="0" value={rule.pricePerHour} onChange={e => handleRuleChange(index, "pricePerHour", e.target.value)} className="w-full px-3 py-2 mt-1 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:border-indigo-500" placeholder="Ví dụ: 100000" />
                           </div>
                        </div>
                      </div>
                   ))}
                </div>
              </div>

              {/* KHỐI HÌNH ẢNH */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                   <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
                     <ImageIcon size={16} className="mr-2 text-pink-500"/> Hình ảnh minh họa (URL)
                   </h4>
                   {errors.images && <span className="text-xs text-red-500">{errors.images}</span>}
                </div>
                <div className="space-y-2">
                  {images.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleSimpleListChange(index, e.target.value)}
                        placeholder={`https://link-anh-san-${index + 1}.jpg`}
                        className={`flex-1 px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.images && index === 0 && !item ? 'border-red-300' : 'border-slate-300 focus:ring-indigo-500'}`}
                      />
                      <button 
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors bg-transparent border-none cursor-pointer"
                      >
                         <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addImageField} className="flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors bg-transparent border-none cursor-pointer">
                  <Plus size={14} className="mr-1" /> Thêm đường dẫn ảnh
                </button>
              </div>

            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-xl shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer border-none">
            Hủy
          </button>
          <button onClick={handleSubmit} className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow border-none cursor-pointer">
            <Save size={16} className="mr-2" /> Lưu Hệ Thống Sân
          </button>
        </div>

      </div>
    </div>
  );
};

export const CourtDashBoard = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Dùng 8 để xếp grid đẹp

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false); 
  const [processAction, setProcessAction] = useState('saving'); 
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isViewLoading, setIsViewLoading] = useState(false); 

  const [selectedCourt, setSelectedCourt] = useState(null); 
  const [processCourtName, setProcessCourtName] = useState("");

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");

  // Toast
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // API LẤY DANH SÁCH SÂN
  const fetchCourts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const pageIndex = currentPage - 1;
      const params = new URLSearchParams();
      params.append('page', pageIndex);
      params.append('size', itemsPerPage);
      if (appliedSearchQuery.trim()) {
        params.append('name', appliedSearchQuery.trim());
      }

      const response = await fetch(`http://localhost:8086/api/v1/court-centers/search?${params.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
        },
      });

      if (!response.ok) throw new Error("Tải danh sách sân thất bại");

      const data = await response.json();
      
      if (data.status === 200 && data.data) {
        const content = data.data.content || [];
        setTotalPages(data.data.totalPages || 1);
        setTotalItems(data.data.totalElements || content.length);
        
        const mappedCourts = content.map(c => ({
          id: c.courtCenterId,
          name: c.name,
          address: c.locationDetail,
          phone: c.phoneNumber || "Không có",
          deleted: c.deleted || 0,
          images: c.imgUrl ? [c.imgUrl] : [],
          description: "Chi tiết hệ thống sân..." 
        }));
        setCourts(mappedCourts);
      } else {
        setCourts([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu sân:", err);
      setError(err.message);
      setCourts([]);
    } finally {
      setLoading(false);
    }
  }, [appliedSearchQuery, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleSearchSubmit = () => {
    setAppliedSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  // HANDLERS
  const handleDeleteClick = (court) => {
    setSelectedCourt(court);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = async (court) => {
    // Để có đầy đủ dữ liệu khi Edit, gọi API Detail trước
    setIsProcessing(true);
    setProcessAction('saving');
    try {
      const response = await fetch(`http://localhost:8086/api/v1/court-centers/detail/${court.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      const data = await response.json();
      
      if (response.ok && data.status === 200 && data.data) {
        const detail = data.data;
        setSelectedCourt({
          id: detail.courtCenterId,
          name: detail.name,
          address: detail.locationDetail,
          phone: detail.phoneNumber,
          deleted: detail.deleted,
          images: detail.images?.map(img => img.imageUrl) || [],
          description: detail.description,
          courts: detail.courts || [],
          slots: detail.slots || [],
          pricingRules: detail.pricingRules || []
        });
        setIsFormModalOpen(true);
      } else {
        showNotification("Không thể tải chi tiết để sửa", "error");
      }
    } catch (e) {
      showNotification("Lỗi kết nối", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedCourt(null); 
    setIsFormModalOpen(true);
  };

  const handleViewClick = async (court) => {
    setIsViewLoading(true);
    try {
      const response = await fetch(`http://localhost:8086/api/v1/court-centers/detail/${court.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      const data = await response.json();
      
      if (response.ok && data.status === 200 && data.data) {
        const detail = data.data;
        setSelectedCourt({
          ...court,
          name: detail.name || court.name,
          address: detail.locationDetail || court.address,
          phone: detail.phoneNumber || court.phone,
          deleted: detail.deleted !== undefined ? detail.deleted : court.deleted,
          images: detail.images && detail.images.length > 0 ? detail.images.map(img => img.imageUrl) : court.images,
          googleMapUrl: detail.googleMapUrl,
          slots: detail.slots || [],
          pricingRules: detail.pricingRules || []
        });
        setIsViewModalOpen(true);
      } else {
        showNotification("Không thể lấy chi tiết sân", "error");
      }
    } catch (e) {
      console.error("Lỗi khi tải chi tiết sân:", e);
      showNotification("Lỗi kết nối", "error");
    } finally {
      setIsViewLoading(false);
    }
  };

  // API XÓA
  const handleConfirmDelete = async () => {
    const name = selectedCourt?.name;
    setIsDeleteModalOpen(false);
    setProcessCourtName(name);
    setProcessAction('deleting');
    setIsProcessing(true);

    try {
        const response = await fetch(`http://localhost:8086/api/v1/court-centers/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify([selectedCourt.id])
        });

        if (response.ok) {
            fetchCourts();
            showNotification("Xóa sân thành công", "success");
        } else {
            showNotification("Xóa sân thất bại", "error");
        }
    } catch (e) {
        showNotification("Đã có lỗi kết nối", "error");
    } finally {
        setIsProcessing(false);
        setSelectedCourt(null);
    }
  };

  // API LƯU THÔNG TIN (TẠO MỚI / SỬA)
  const handleSaveCourt = async (fullDataPayload) => {
    setIsFormModalOpen(false);
    setProcessCourtName(fullDataPayload.name);
    setProcessAction('saving');
    setIsProcessing(true);

    try {
        let response;
        if (selectedCourt) {
            // SỬA
            const updatePayload = {
                name: fullDataPayload.name,
                locationDetail: fullDataPayload.address,
                phoneNumber: fullDataPayload.phone,
                imgUrl: fullDataPayload.images[0]?.imageUrl || "",
                status: "ACTIVE" 
            };
            response = await fetch(`http://localhost:8086/api/v1/court-centers/update/${selectedCourt.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(updatePayload)
            });
        } else {
            // TẠO MỚI
            response = await fetch("http://localhost:8086/api/v1/court-centers/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(fullDataPayload)
            });
        }

        if (response.ok) {
            showNotification("Lưu hệ thống sân thành công!", "success");
            fetchCourts(); 
        } else {
            showNotification("Lưu thất bại. Vui lòng kiểm tra lại", "error");
        }
    } catch (e) {
        showNotification("Lỗi kết nối. Vui lòng thử lại sau.", "error");
    } finally {
        setIsProcessing(false);
        setSelectedCourt(null);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === i ? 'bg-indigo-600 text-white shadow-sm border-none' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
            >
              {i}
            </button>
        );
    }
    return pages;
  };

  return (
    <MainLayout>
    <div className="space-y-6 animate-fade-in pb-10 p-6 min-h-screen bg-gray-50 relative">
      
      {/* Loading Overlay khi View Detail */}
      {isViewLoading && (
        <div className="fixed inset-0 z-[9999] bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
          <Loader2 size={48} className="animate-spin text-indigo-600" />
        </div>
      )}

      {notification && (
        <ToastNotification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hệ thống Sân</h1>
          <p className="text-slate-500 mt-1">Quản lý và điều hành các điểm sân cầu lông</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleCreateClick} className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer border-none">
            <Plus size={16} className="mr-2" /> Thêm Hệ thống
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tên hệ thống sân..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
            />
        </div>
        <button onClick={handleSearchSubmit} className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm border-none cursor-pointer">
            <Search size={16} className="mr-2 hidden sm:block" /> Tìm kiếm
        </button>
      </div>

      {/* COURT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
                <p>Đang tải danh sách sân...</p>
             </div>
        ) : (
        <>
        {courts.map((court) => {
            const isDeleted = court.deleted === 1;
            const imageUrl = court.images.length > 0 ? court.images[0] : 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80';
            
            return (
          <div key={court.id} className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col ${isDeleted ? 'opacity-60 grayscale-[0.5]' : ''}`}>
            
            {/* Ảnh Cover */}
            <div className="h-44 relative bg-gray-200 overflow-hidden">
              <img src={imageUrl} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://via.placeholder.com/600x300?text=San+Cau+Long'; }}/>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>

              {/* Status Badge */}
              {isDeleted && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border shadow-sm bg-gray-100 text-gray-500 border-gray-200">
                      Đã xóa
                  </span>
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleViewClick(court)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-600 hover:text-white transition-all border-none cursor-pointer" title="Xem chi tiết">
                  <Eye size={14} />
                </button>
                <button onClick={() => handleEditClick(court)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white transition-all border-none cursor-pointer" title="Sửa thông tin">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDeleteClick(court)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-600 shadow-sm hover:bg-red-600 hover:text-white transition-all border-none cursor-pointer" title="Xóa sân">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Thông tin */}
            <div className="p-4 pb-6 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 mb-2" title={court.name}>
                {court.name} {isDeleted && <span className="text-sm text-red-500 font-medium ml-1">(Đã xóa)</span>}
              </h3>
              <div className="space-y-1.5 text-xs text-slate-600 mb-2">
                  <div className="flex items-start gap-1.5 line-clamp-2" title={court.address}>
                      <MapPin size={14} className="text-indigo-500 shrink-0 mt-0.5"/>
                      <span>{court.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-indigo-500 shrink-0"/>
                      <span className="font-medium">{court.phone}</span>
                  </div>
              </div>
            </div>
          </div>
        )})}
        {courts.length === 0 && !error && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Map size={32} />
             </div>
             <p className="text-lg font-medium text-slate-600">Không có hệ thống sân nào</p>
             {appliedSearchQuery && (
                 <button onClick={() => { setSearchQuery(""); setAppliedSearchQuery(""); setCurrentPage(1); }} className="mt-4 text-indigo-600 hover:underline text-sm border-none bg-transparent cursor-pointer">
                    Xóa tìm kiếm
                 </button>
             )}
          </div>
        )}
        </>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
           <button 
             onClick={() => handlePageChange(currentPage - 1)}
             disabled={currentPage === 1}
             className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
           >
             <ChevronLeft size={20} />
           </button>
           <div className="flex items-center gap-1">{renderPagination()}</div>
           <button 
             onClick={() => handlePageChange(currentPage + 1)}
             disabled={currentPage === totalPages}
             className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors cursor-pointer"
           >
             <ChevronRight size={20} />
           </button>
        </div>
      )}

      {/* MODALS */}
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} courtName={selectedCourt?.name} />
      <CourtFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={handleSaveCourt} initialData={selectedCourt} />
      <CourtDetailModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} court={selectedCourt} />
      <ProcessProgressModal isOpen={isProcessing} courtName={processCourtName} actionType={processAction} />

    </div>
    </MainLayout>
  );
};

export default CourtDashBoard;