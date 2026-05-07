import {
    AlertTriangle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    Image as ImageIcon,
    Loader2,
    Map,
    MapPin,
    Phone,
    Plus,
    Save,
    Search,
    Trash2,
    X,
    XCircle
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  const isAvailable = court.status === 'Hoạt động';

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
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 relative group p-2">
                        {displayImage ? (
                            <img src={displayImage} alt={court.name} className="w-full h-full object-cover rounded-md" />
                        ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                                <ImageIcon size={48} className="opacity-50 mb-2"/>
                                <span className="text-sm">Chưa có ảnh</span>
                            </div>
                        )}
                        <div className="absolute top-3 right-3">
                             <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide border shadow-sm ${
                                 isAvailable ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'
                             }`}>
                                 {isAvailable ? 'Hoạt động' : 'Tạm đóng'}
                             </span>
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
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{court.name}</h2>
                        <div className="flex flex-col gap-2 text-sm text-slate-600">
                            <div className="flex items-start gap-2">
                                <MapPin size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                                <span className="leading-snug">{court.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={18} className="text-indigo-600 shrink-0" />
                                <span className="font-semibold">{court.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Mô tả hệ thống sân</h4>
                        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 max-h-40 overflow-y-auto custom-scrollbar">
                            {court.description || "Chưa có mô tả chi tiết."}
                        </div>
                    </div>

                    <div>
                         <h4 className="text-sm font-bold text-slate-900 mb-3">Thông số</h4>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Số lượng sân nhỏ</p>
                                 <p className="text-xl font-bold text-indigo-600">{court.subCourtsCount || 0}</p>
                             </div>
                             <div className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Mã (ID)</p>
                                 <p className="text-xl font-bold text-slate-800 font-mono">{court.id}</p>
                             </div>
                         </div>
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
  const [formData, setFormData] = useState({
    name: "", address: "", phone: "", description: "", status: "Hoạt động"
  });
  const [images, setImages] = useState([""]);
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    if (isOpen) {
      setErrors({}); 
      if (initialData) {
        setFormData({
          name: initialData.name,
          address: initialData.address || "",
          phone: initialData.phone || "",
          status: initialData.status,
          description: initialData.description || ""
        });
        setImages(initialData.images && initialData.images.length > 0 ? initialData.images : [""]);
      } else {
        setFormData({ name: "", address: "", phone: "", description: "", status: "Hoạt động" });
        setImages([""]); 
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSimpleListChange = (index, value, list, setList) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
    if (value && errors.images) setErrors({...errors, images: null});
  };
  
  const addSimpleField = (list, setList) => setList([...list, ""]);
  const removeSimpleField = (index, list, setList) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên sân";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    
    const hasValidImage = images.some(img => img.trim() !== "");
    if (!hasValidImage) newErrors.images = "Cần ít nhất 1 đường dẫn hình ảnh";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
        const fullData = {
            ...formData,
            images: images.filter(img => img.trim() !== "")
        };
      onSave(fullData);
    }
  };

  const renderSimpleListInput = (label, icon, list, setList, placeholder, error) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700 flex items-center justify-between">
        <div className="flex items-center">{icon} <span className="ml-2">{label}</span> <span className="text-red-500 ml-1">*</span></div>
        {error && <span className="text-xs text-red-500 font-normal">{error}</span>}
      </label>
      <div className="space-y-2">
        {list.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) => handleSimpleListChange(index, e.target.value, list, setList)}
              placeholder={`${placeholder} ${index + 1}`}
              className={`flex-1 px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${error && index === 0 && !item ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`}
            />
            <button 
              type="button"
              onClick={() => removeSimpleField(index, list, setList)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors bg-transparent border-none cursor-pointer"
            >
               <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => addSimpleField(list, setList)} className="flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors bg-transparent border-none cursor-pointer">
        <Plus size={14} className="mr-1" /> Thêm {label}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Map className="mr-2 text-indigo-600" size={20} /> 
            {initialData ? "Sửa Hệ Thống Sân" : "Thêm Hệ Thống Sân Mới"}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm animate-in slide-in-from-top-2">
              <AlertTriangle size={16} />
              <span>Vui lòng điền đầy đủ các trường bắt buộc (*)</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
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
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
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
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại liên hệ <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => { setFormData({...formData, phone: e.target.value}); if(e.target.value) setErrors({...errors, phone: null}); }}
                      className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`} 
                      placeholder="0912345678" 
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Trạng thái</label>
                    <select 
                      value={formData.status} 
                      onChange={(e) => setFormData({...formData, status: e.target.value})} 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Tạm đóng">Tạm đóng</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả chi tiết</label>
                  <textarea 
                    rows={4} 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none custom-scrollbar" 
                    placeholder="Quy định, tiện ích sân bãi..." 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {renderSimpleListInput("Hình ảnh (URL)", <ImageIcon size={16} className="text-pink-500"/>, images, setImages, "https://link-anh.jpg", errors.images)}
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
          status: c.status === "ACTIVE" ? "Hoạt động" : "Tạm đóng", // Map status
          images: c.imgUrl ? [c.imgUrl] : [],
          subCourtsCount: c.courts ? c.courts.length : 0,
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

  const handleEditClick = (court) => {
    setSelectedCourt(court);
    setIsFormModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedCourt(null); 
    setIsFormModalOpen(true);
  };

  const handleViewClick = (court) => {
    setSelectedCourt(court);
    setIsViewModalOpen(true);
  };

  // API XÓA
  const handleConfirmDelete = async () => {
    const name = selectedCourt?.name;
    setIsDeleteModalOpen(false);
    setProcessCourtName(name);
    setProcessAction('deleting');
    setIsProcessing(true);

    try {
        const response = await fetch(`http://localhost:8086/api/v1/court-centers/${selectedCourt.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
            }
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

  // API LƯU THÔNG TIN
  const handleSaveCourt = async (formData) => {
    setIsFormModalOpen(false);
    setProcessCourtName(formData.name);
    setProcessAction('saving');
    setIsProcessing(true);

    try {
        const payload = {
            name: formData.name,
            locationDetail: formData.address,
            phoneNumber: formData.phone,
            imgUrl: formData.images[0] || "",
            status: formData.status === "Hoạt động" ? "ACTIVE" : "INACTIVE"
        };

        let response;
        if (selectedCourt) {
            response = await fetch(`http://localhost:8086/api/v1/court-centers/update/${selectedCourt.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch("http://localhost:8086/api/v1/court-centers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(payload)
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
            const isAvailable = court.status === 'Hoạt động';
            const imageUrl = court.images.length > 0 ? court.images[0] : 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80';
            
            return (
          <div key={court.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col">
            
            {/* Ảnh Cover */}
            <div className="h-44 relative bg-gray-200 overflow-hidden">
              <img src={imageUrl} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.src = 'https://via.placeholder.com/600x300?text=San+Cau+Long'; }}/>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>

              {/* Status Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border shadow-sm ${
                    isAvailable ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'
                }`}>
                    {court.status}
                </span>
              </div>

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
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 mb-2" title={court.name}>{court.name}</h3>
              <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-start gap-1.5 line-clamp-2" title={court.address}>
                      <MapPin size={14} className="text-indigo-500 shrink-0 mt-0.5"/>
                      <span>{court.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-indigo-500 shrink-0"/>
                      <span className="font-medium">{court.phone}</span>
                  </div>
              </div>
              
              <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">ID: {court.id}</span>
                  <span className="text-sm font-bold text-indigo-600">{court.subCourtsCount} Sân nhỏ</span>
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