import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Package, 
  Trash2, 
  AlertTriangle,
  Copy,
  Clock,
  TrendingUp,
  Layout,
  Menu, 
  Bell, 
  LogOut,
  X,
  Save,
  Image as ImageIcon,
  Tag,
  Layers,
  Smile,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Check,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";
import { MainLayout } from "../dashboard/layouts/main-layout"; 

// --- CONSTANTS DATA (VNB SPORTS) ---
const MENU_DATA = [
  { main: "Vợt Cầu Lông", subs: ["Vợt cầu lông Yonex", "Vợt cầu lông Victor", "Vợt cầu lông Lining", "Vợt Cầu Lông VS", "Vợt Cầu Lông Mizuno", "Vợt Cầu Lông Apacs", "Vợt Cầu Lông VNB", "Vợt cầu lông Proace", "Vợt cầu lông Forza", "Vợt Cầu Lông FlyPower"] },
  { main: "Giày Cầu Lông", subs: ["Giày cầu lông Yonex", "Giày cầu lông Victor", "Giày cầu lông Lining", "Giày cầu lông VS", "Giày cầu lông Kawasaki", "Giày Cầu Lông Mizuno", "Giày Cầu Lông Kumpoo", "Giày Cầu Lông Promax", "Giày cầu lông Babolat", "Giày Cầu Lông Sunbatta"] },
  { main: "Áo Cầu Lông", subs: ["Áo cầu lông Yonex", "Áo cầu lông VNB", "Áo cầu lông Kamito", "Áo cầu lông VS", "Áo cầu lông Victor", "Áo cầu lông Lining", "Áo cầu lông DonexPro", "Áo Cầu Lông Alien Armour", "Áo thể thao SFD", "Áo cầu lông Kawasaki"] },
  { main: "Váy Cầu Lông", subs: ["Váy cầu lông Yonex", "Váy cầu lông Victec", "Váy cầu lông Lining", "Váy Cầu Lông Donex Pro", "Váy cầu lông Victor", "Váy cầu lông Kamito", "Váy cầu lông Taro"] },
  { main: "Quần Cầu Lông", subs: ["Quần cầu lông Yonex", "Quần cầu lông Victor", "Quần cầu lông Lining", "Quần cầu lông VNB", "Quần Cầu Lông SFD", "Quần cầu lông Donex Pro", "Quần Cầu Lông Apacs", "QUẦN CẦU LÔNG ALIEN AMOUR", "Quần cầu lông Mizuno", "Quần cầu lông Kawasaki"] },
  { main: "Túi Vợt Cầu Lông", subs: ["Túi vợt cầu lông Yonex", "Túi đựng giày", "Túi vợt cầu lông VS", "Túi vợt cầu lông Victor", "Túi vợt cầu lông Lining", "Túi vợt cầu lông Kason", "Túi vợt cầu lông Kawasaki", "Túi vợt cầu lông Forza", "Túi Vợt Cầu Lông Apacs", "Túi vợt cầu lông Mizuno"] },
  { main: "Balo Cầu Lông", subs: ["Balo Cầu Lông Yonex", "Balo cầu lông VS", "Balo cầu lông Victor", "Balo cầu lông Kawasaki", "Balo cầu lông Flypower", "Balo cầu lông Mizuno", "Balo cầu lông VNB", "Balo cầu lông Adonex", "Balo cầu lông Forza", "Balo cầu lông Lining"] },
  { main: "Phụ Kiện Cầu Lông", subs: ["Vớ Cầu Lông", "Cước đan vợt cầu lông", "Quả cầu lông", "Banh Power Ball", "Bình nước cầu lông", "Băng bó cơ", "Móc khóa cầu lông", "Quấn cán cầu lông", "Lót giày cầu lông", "Băng chặn mồ hôi"] },
  { main: "Vợt Pickleball", subs: ["Vợt PickleBall Head", "Vợt PickleBall Joola", "Vợt Pickleball Prokennex", "Vợt Pickleball Passion", "Vợt Pickleball Beesoul", "Vợt Pickleball Selkirk", "Vợt Pickleball Babolat", "Vợt Pickleball Wilson", "Vợt Pickleball Gamma", "Vợt Pickleball Amakirk"] },
  { main: "Giày Pickleball", subs: ["Giày Pickleball Jogarbola", "Giày Pickleball Asics", "Giày Pickleball Nike", "Giày Pickleball Joola", "Giày Pickleball Diadem", "Giày Pickleball Kamito", "Giày Pickleball Promax", "Giày Pickleball Kaiwin", "Giày Pickleball Lining", "Giày Pickleball Zocker"] },
  { main: "Túi Pickleball", subs: ["Túi Pickleball Joola", "Túi Pickleball Kamito", "Túi Pickleball Proton", "Túi Pickleball Spikopoll", "Túi Pickleball Wilson", "Túi Pickleball CRBN"] },
  { main: "Áo Pickleball", subs: ["Áo Pickleball Babolat", "Áo Pickleball Joola", "Áo Pickleball Kaiwin", "Áo Pickleball Kamito", "Áo Pickleball Selkirk", "Áo Pickleball Skechers"] },
  { main: "Quần Pickleball", subs: ["Quần Pickleball Babolat", "Quần Pickleball Joola", "Quần Pickleball Kaiwin", "Quần Pickleball Kamito"] },
  { main: "Bóng Pickleball", subs: ["Bóng Pickleball Joola", "Bóng Pickleball Bamboo", "Bóng Pickleball Diadem", "Bóng Pickleball Facolos", "Bóng Pickleball Franklin", "Bóng Pickleball Gamicy", "Bóng Pickleball Gamma", "Bóng Pickleball Kaiwin", "Bóng Pickleball Kamito", "Bóng Pickleball Lining"] },
  { main: "Váy Pickleball", subs: ["Váy Pickleball Kamito"] },
  { main: "Phụ Kiện Pickleball", subs: ["Lưới pickleball", "Quấn Cán Vợt Pickleball", "Bảo vệ khung vợt Pickleball", "Tẩy mặt vợt Pickleball", "Túi đơn đựng vợt Pickleball", "Túi bọc đầu vợt Pickleball"] },
  { main: "Balo Pickleball", subs: ["Balo Pickleball Joola", "Balo Pickleball Selkirk", "Balo Pickleball Wilson", "Balo Pickleball Arronax", "Balo Pickleball CRBN", "Balo Pickleball Kaiwin", "Balo Pickleball Kumpoo", "Balo Pickleball Gamicy", "Balo Pickleball Zocker", "Balo Pickleball Facolos"] },
  { main: "Vợt Tennis", subs: ["Vợt Tennis Wilson", "Vợt Tennis Babolat", "Vợt Tennis Yonex", "Vợt Tennis Head", "Vợt Tennis Prince", "Vợt Tennis Tecnifibre"] },
  { main: "Giày Tennis", subs: ["Giày Tennis Asics", "Giày Tennis Yonex", "Giày Tennis Adidas", "Giày Tennis Nike", "Giày Tennis Mizuno", "Giày Tennis Prince", "Giày Tennis Babolat", "Giày tennis Jogarbola", "Giày tennis Wilson", "Giày tennis Head"] },
  { main: "Balo Tennis", subs: ["Balo Tennis Wilson", "Balo Tennis Babolat", "Balo Tennis Prince", "Balo Tennis Head"] },
  { main: "Túi Tennis", subs: ["Túi Tennis Wilson", "Túi Tennis Babolat", "Túi Tennis Nike", "Túi Tennis Head", "Túi Tennis Adidas", "Túi Tennis Tecnifibre", "Túi tennis Prince", "Túi Tennis Kumpoo", "Túi Tennis Hundred"] },
  { main: "Chân Váy Tennis", subs: ["Váy tennis Babolat"] },
  { main: "Áo Tennis", subs: ["Áo tennis Adidas", "Áo tennis Babolat", "Áo tennis Donex Pro", "Áo tennis Nike", "Áo tennis Uniqlo", "Áo tennis Vina Authentic", "Áo tennis Wilson"] },
  { main: "Quần Tennis", subs: ["Quần tennis Adidas", "Quần tennis Babolat", "Quần Tennis Donex Pro MSC-2030 Đen Phối Trắng Chính Hãng", "Quần tennis Nike", "Quần tennis Uniqlo", "Quần tennis Wilson"] },
  { main: "Phụ Kiện Tennis", subs: ["Cước Tennis (dây đan vợt tennis)", "Băng chặn mồ hôi Tennis", "Quấn Cán Vợt Tennis", "Khăn lau mồ hôi tennis"] },
  { main: "Máy Đan và Thảm Cầu Lông", subs: ["Máy Đan Vợt Cầu Lông", "Thảm Sân Cầu Lông", "Thảm cầu lông Mini"] },
  { main: "Giày Running", subs: ["Giày chạy bộ Yonex Running SAFERUN 350 Đỏ chính hãng", "Giày chạy bộ Yonex Running SAFERUN 350 Trắng chính hãng", "Giày chạy bộ Yonex Running SAFERUN 350 Xanh Đen chính hãng", "Giày Running Victor 701CR-2018 Đỏ", "Giày Running Victor 701CR-2018 Xanh"] },
  { main: "Ghế Massage", subs: ["Ghế Massage Giá Rẻ", "Ghế Massage Trung Cấp", "Ghế Massage Thương Gia", "Ghế massage Kingsport", "Ghế massage Queen Crown", "Ghế massage Tokuyo", "Ghế massage Kagawa", "Ghế massage KLC", "Ghế massage Okasa", "Ghế massage Toshiko"] },
  { main: "Máy Massage", subs: ["Máy Massage Mắt Azaki E191 Plus chính hãng", "Máy Massage Cổ Azaki N109 Plus chính hãng", "Máy Massage Lưng & Bụng Azaki W122 chính hãng", "Máy Massage Bụng Azaki Slim Beauty A150 chính hãng", "Máy (Súng) Massage Cầm Tay Azaki G188 chính hãng"] },
  { main: "Máy Chạy Bộ, Xe Đạp Tập", subs: ["Máy chạy bộ Azaki Helios H8500 chính hãng", "Máy chạy bộ Azaki Hercules H6000 chính hãng", "Máy chạy bộ Azaki Mercury M1000 chính hãng", "Máy chạy bộ Azaki TH666 chính hãng", "Máy chạy bộ Azaki Zeus Z9100 chính hãng", "Xe đạp tập Azaki Apollo SB380 chính hãng", "Xe đạp tập Azaki Olympus SB450 chính hãng"] },
  { main: "Mũ", subs: ["Mũ Bucket Victoc OnePiece Limited", "Mũ lưỡi trai Victor OnePiece Limited", "Mũ cầu lông Victor Hello Kitty", "Mũ cầu lông Victor Hello Kitty VC-KT213 I Hồng"] },
  { main: "Phụ Kiện Sưu Tầm", subs: ["Túi", "Túi bút", "Bút"] }
];

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

// --- Product Detail Modal ---
const ProductDetailModal = ({ isOpen, onClose, product }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isOpen && product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else {
      setSelectedImage(null);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const formatPrice = (amount) => {
    return amount ? Number(amount).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  const displayImage = selectedImage || (product.images && product.images.length > 0 ? product.images[0] : null);
  const isAvailable = product.status.toLowerCase() === 'còn hàng' || product.stock > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Package className="mr-2 text-indigo-600" size={20} /> 
            Chi tiết sản phẩm
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images Section */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 relative group p-4">
                        {displayImage ? (
                            <img src={displayImage} alt={product.name} className="w-full h-full object-contain" />
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
                                 {isAvailable ? 'Còn hàng' : 'Hết hàng'}
                             </span>
                        </div>
                    </div>
                    {/* Thumbnail list */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                             {product.images.map((img, idx) => (
                                 <div 
                                    key={idx} 
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-20 p-1 bg-white flex-shrink-0 border rounded-md overflow-hidden cursor-pointer transition-all ${selectedImage === img ? 'ring-2 ring-indigo-500 ring-offset-1 border-indigo-500' : 'border-slate-200 hover:border-indigo-300'}`}
                                 >
                                     <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                                 </div>
                             ))}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h2>
                        <div className="flex flex-wrap gap-2 text-sm">
                             <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium border border-indigo-100 flex items-center">
                                <Layers size={14} className="mr-1.5"/>
                                {product.mainCategory}
                             </span>
                             <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium border border-slate-200 flex items-center">
                                <Tag size={14} className="mr-1.5"/>
                                {product.subCategory}
                             </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 border-y border-slate-100 py-6">
                         <div>
                             <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Giá bán</p>
                             <p className="text-2xl font-bold text-indigo-600">{formatPrice(product.price_raw)}</p>
                         </div>
                         <div className="h-10 w-px bg-slate-200"></div>
                         <div>
                             <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Đã bán</p>
                             <p className="text-2xl font-bold text-slate-900">{product.sold}</p>
                         </div>
                         <div className="h-10 w-px bg-slate-200"></div>
                         <div>
                             <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Tồn kho</p>
                             <p className="text-2xl font-bold text-slate-900">{product.stock}</p>
                         </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Mô tả sản phẩm</h4>
                        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 max-h-40 overflow-y-auto custom-scrollbar">
                            {product.description || "Chưa có mô tả cho sản phẩm này."}
                        </div>
                    </div>

                    <div>
                         <h4 className="text-sm font-bold text-slate-900 mb-3">Thông tin thêm</h4>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white border border-slate-200 rounded-lg p-3">
                                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Thương hiệu</p>
                                 <p className="text-sm font-medium text-slate-800">{product.brand || 'Khác'}</p>
                             </div>
                             <div className="bg-white border border-slate-200 rounded-lg p-3">
                                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Mã SP (ID)</p>
                                 <p className="text-sm font-medium text-slate-800 font-mono">{product.id}</p>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50 rounded-b-xl shrink-0">
           <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all shadow-sm border-none cursor-pointer">
              Đóng
           </button>
        </div>
      </div>
    </div>
  );
};

/**
 * --- PROGRESS MODAL (Used for Save & Delete) ---
 */
const ProcessProgressModal = ({ isOpen, productName, actionType = 'saving' }) => {
  if (!isOpen) return null;

  const isDeleting = actionType === 'deleting';
  const colorClass = isDeleting ? 'text-red-600' : 'text-indigo-600';
  const bgClass = isDeleting ? 'bg-red-50' : 'bg-indigo-50';
  const barClass = isDeleting ? 'bg-red-600' : 'bg-indigo-600';
  const title = isDeleting ? 'Đang xóa sản phẩm' : 'Đang lưu sản phẩm';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className={`w-16 h-16 ${bgClass} rounded-full flex items-center justify-center mb-4`}>
           <Loader2 className={`w-8 h-8 ${colorClass} animate-spin`} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-center mb-6">
          Đang xử lý dữ liệu cho <span className={`font-bold ${colorClass}`}>"{productName}"</span>...
        </p>
        
        {/* Loading Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${barClass} animate-progress-indeterminate rounded-full`}></div>
        </div>
      </div>
    </div>
  );
};

/**
 * --- CONFIRM DELETE MODAL ---
 */
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
          <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Xóa sản phẩm?</h3>
              <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa <span className="font-bold text-gray-900">"{productName}"</span>?
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

/**
 * --- PRODUCT FORM MODAL (Create & Edit) ---
 */
const ProductFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", status: "Còn hàng", brand: "", mainCategory: "", subCategory: ""
  });

  const [images, setImages] = useState([""]);
  const [variants, setVariants] = useState([{ sku: "", size: "Default", quantity: 10 }]);
  const [errors, setErrors] = useState({}); 

  // Lọc ra SubCategory tương ứng với MainCategory được chọn
  const availableSubs = formData.mainCategory 
    ? MENU_DATA.find(x => x.main === formData.mainCategory)?.subs || [] 
    : [];

  useEffect(() => {
    if (isOpen) {
      setErrors({}); 
      if (initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description || "",
          price: initialData.price_raw || "0", 
          status: initialData.status === "Hết hàng" ? "Hết hàng" : "Còn hàng",
          brand: initialData.brand || "",
          mainCategory: initialData.mainCategory || "",
          subCategory: initialData.subCategory || ""
        });
        setImages(initialData.images && initialData.images.length > 0 ? initialData.images : [""]);
        
        // Hỗ trợ cả 2 định dạng trả về là 'variants' hoặc 'size'
        const initialVariants = (initialData.variants?.length > 0) 
            ? initialData.variants 
            : ((initialData.size?.length > 0) ? initialData.size : [{ sku: "", size: "Default", quantity: 10 }]);
        
        setVariants(initialVariants);
      } else {
        setFormData({ name: "", description: "", price: "", status: "Còn hàng", brand: "", mainCategory: "", subCategory: "" });
        setImages([""]); 
        setVariants([{ sku: "", size: "Default", quantity: 10 }]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // --- Handlers ---
  const handleSimpleListChange = (index, value, list, setList) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
    if (value && errors.images) setErrors({...errors, images: null});
  };
  
  const addSimpleField = (list, setList) => {
    setList([...list, ""]);
  };

  const removeSimpleField = (index, list, setList) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleVariantChange = (index, field, value) => {
    const newList = [...variants];
    newList[index] = { ...newList[index], [field]: value };
    setVariants(newList);
  };
  
  const addVariant = () => {
    setVariants([...variants, { sku: "", size: "", quantity: 0 }]);
  };

  const removeVariant = (index) => {
    const newList = [...variants];
    newList.splice(index, 1);
    setVariants(newList);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên sản phẩm";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = "Vui lòng nhập giá hợp lệ";
    }
    const hasValidImage = images.some(img => img.trim() !== "");
    if (!hasValidImage) newErrors.images = "Cần ít nhất 1 đường dẫn hình ảnh";
    if (!formData.mainCategory) newErrors.mainCategory = "Vui lòng chọn Danh mục chính";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
        const fullData = {
            ...formData,
            images: images.filter(img => img.trim() !== ""),
            variants: variants.map(v => ({ ...v, quantity: parseInt(v.quantity) || 0 }))
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
              title="Xóa"
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl shrink-0">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Package className="mr-2 text-indigo-600" size={20} /> 
            {initialData ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if(e.target.value) setErrors({...errors, name: null});
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`} 
                    placeholder="VD: Vợt Cầu Lông Yonex..." 
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Danh mục chính <span className="text-red-500">*</span></label>
                        <select 
                            value={formData.mainCategory} 
                            onChange={(e) => {
                                setFormData({...formData, mainCategory: e.target.value, subCategory: ""});
                                if(e.target.value) setErrors({...errors, mainCategory: null});
                            }} 
                            className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 cursor-pointer ${errors.mainCategory ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {MENU_DATA.map(cat => <option key={cat.main} value={cat.main}>{cat.main}</option>)}
                        </select>
                        {errors.mainCategory && <p className="text-xs text-red-500 mt-1">{errors.mainCategory}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Danh mục phụ</label>
                        <select 
                            value={formData.subCategory} 
                            onChange={(e) => setFormData({...formData, subCategory: e.target.value})} 
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                            disabled={!formData.mainCategory}
                        >
                            <option value="">-- Chọn loại --</option>
                            {availableSubs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Giá bán <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => {
                         setFormData({...formData, price: e.target.value});
                         if(e.target.value) setErrors({...errors, price: null});
                      }}
                      className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.price ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`} 
                      placeholder="0" 
                    />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Thương hiệu</label>
                    <input type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Yonex, Lining..." />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Trạng thái</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    <option value="Còn hàng">Còn hàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                    <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mô tả sản phẩm</label>
                  <textarea rows={4} value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none custom-scrollbar" placeholder="Thông tin chi tiết..." />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {renderSimpleListInput("Hình ảnh (URL)", <ImageIcon size={16} className="text-pink-500"/>, images, setImages, "https://link-anh.jpg", errors.images)}
              
              <div className="space-y-3">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
                       <Layers size={16} className="mr-2 text-blue-500"/> Phân loại (Variants)
                    </label>
                    <button onClick={addVariant} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center bg-transparent border-none cursor-pointer">
                       <Plus size={14} className="mr-1"/> Thêm Phân loại
                    </button>
                 </div>
                 <div className="space-y-3">
                    {variants.map((item, index) => (
                       <div key={index} className="flex gap-2 items-start bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <div className="grid grid-cols-3 gap-2 flex-1">
                            <input type="text" value={item.sku} onChange={(e) => handleVariantChange(index, "sku", e.target.value)} placeholder="Mã SKU (Tùy chọn)" className="px-2 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            <input type="text" value={item.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)} placeholder="Size / Trọng lượng" className="px-2 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            <input type="number" value={item.quantity} onChange={(e) => handleVariantChange(index, "quantity", e.target.value)} placeholder="Số lượng" className="px-2 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                          </div>
                          <button 
                            onClick={() => removeVariant(index)}
                            className="p-1.5 mt-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors bg-transparent border-none cursor-pointer"
                            title="Xóa Phân loại"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-xl shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer border-none">
            Hủy
          </button>
          <button onClick={handleSubmit} className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow border-none cursor-pointer">
            <Save size={16} className="mr-2" /> Lưu Sản Phẩm
          </button>
        </div>

      </div>
    </div>
  );
};

export const ProductDashBoard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States Pagination & Info API
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false); 
  const [processAction, setProcessAction] = useState('saving'); 
  
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [processProductName, setProcessProductName] = useState("");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  // Bộ lọc
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMainCategory, setFilterMainCategory] = useState(""); 
  const [filterSubCategory, setFilterSubCategory] = useState(""); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Toast Notification State
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Gọi API lấy dữ liệu từ Backend theo params
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('name', searchQuery);
      if (filterMainCategory) params.append('mainCategory', filterMainCategory);
      if (filterSubCategory) params.append('subCategory', filterSubCategory);
      
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);

      const response = await fetch(`http://localhost:8086/api/v1/search?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
        },
      });

      if (!response.ok) {
        throw new Error("Tải danh sách sản phẩm thất bại");
      }

      const data = await response.json();

      const resultsArray = data.results || [];
      setTotalItems(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage) || 1);

      if (Array.isArray(resultsArray)) {
        const mappedProducts = resultsArray.map(p => {
          // Xử lý linh hoạt trường size hoặc variants trả về
          const variantsList = p.variants || p.size || [];

          return {
            id: p.productId || p.id,
            name: p.name,
            mainCategory: p.mainCategory || "Chưa phân loại",
            subCategory: p.subCategory || "Chưa phân loại",
            brand: p.brand || "Khác",
            sold: p.sold || 0,
            stock: variantsList.reduce((acc, v) => acc + (v.quantity || 0), 0) || p.stock || p.quantity || 0,
            price_raw: p.price, 
            status: p.status || ((variantsList.reduce((acc, v) => acc + (v.quantity || 0), 0) || p.stock || p.quantity || 0) > 0 ? "Còn hàng" : "Hết hàng"), 
            imageColor: "bg-white", 
            images: p.imageUrls || p.images || [], 
            description: p.description,
            variants: variantsList
          };
        });
        setProducts(mappedProducts);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
      setError(err.message);
      setProducts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [searchQuery, filterMainCategory, filterSubCategory, currentPage]);

  const formatPrice = (amount) => {
    return amount ? Number(amount).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
  };

  const handleMainCategoryClick = (mainCat) => {
    if (filterMainCategory === mainCat) {
      setFilterMainCategory("");
      setFilterSubCategory("");
    } else {
      setFilterMainCategory(mainCat);
      setFilterSubCategory("");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedProduct(null); 
    setIsFormModalOpen(true);
  };

  const handleViewClick = (product) => {
    setViewProduct(product);
    setIsViewModalOpen(true);
  };

  // GỌI API XÓA SẢN PHẨM
  const handleConfirmDelete = async () => {
    const name = selectedProduct?.name;
    setIsDeleteModalOpen(false);
    setProcessProductName(name);
    setProcessAction('deleting');
    setIsProcessing(true);

    try {
        const response = await fetch(`http://localhost:8086/api/v1/products/${selectedProduct.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        if (response.ok) {
            fetchProducts();
            showNotification("Xóa sản phẩm thành công", "success");
        } else {
            console.error("Xóa sản phẩm thất bại");
            showNotification("Xóa sản phẩm thất bại", "error");
        }
    } catch (e) {
        console.error("Lỗi xóa sản phẩm:", e);
        showNotification("Đã có lỗi kết nối", "error");
    } finally {
        setIsProcessing(false);
        setSelectedProduct(null);
    }
  };

  // GỌI API LƯU SẢN PHẨM (THÊM / SỬA)
  const handleSaveProduct = async (formData) => {
    setIsFormModalOpen(false);
    setProcessProductName(formData.name);
    setProcessAction('saving');
    setIsProcessing(true);

    try {
        // Tính tổng quantity từ danh sách variants
        const totalQty = formData.variants.reduce((acc, v) => acc + (parseInt(v.quantity) || 0), 0);

        // Chuẩn bị Payload map khớp với DTO API Update
        const payload = {
            ...(selectedProduct && { id: selectedProduct.id }),
            name: formData.name,
            price: parseFloat(formData.price),
            priceCurrency: "VND", // Default
            description: formData.description,
            quantity: totalQty,
            status: formData.status,
            mainCategory: formData.mainCategory,
            subCategory: formData.subCategory,
            brand: formData.brand,
            images: formData.images,
            size: formData.variants.map(v => ({
                size: v.size,
                quantity: parseInt(v.quantity) || 0,
                // Gán Type tùy theo nhóm hàng, hoặc để DEFAULT nếu ko phân biệt dc
                sizeType: formData.mainCategory.toLowerCase().includes('giày') ? "SHOE" : "DEFAULT",
                sku: v.sku,
                status: "ACTIVE"
            })),
            colors: [],
            datePublished: new Date().toISOString().split('T')[0]
        };

        let response;
        if (selectedProduct) {
            // SỬA: Dùng Method PUT và URL có /update/
            response = await fetch(`http://localhost:8086/api/v1/products/update/${selectedProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(payload)
            });
        } else {
            // THÊM MỚI: POST
            response = await fetch("http://localhost:8086/api/v1/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(payload)
            });
        }

        if (response.ok) {
            showNotification("Lưu sản phẩm thành công!", "success");
            fetchProducts(); 
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.error("Lưu sản phẩm thất bại", errorData);
            showNotification(`Lưu sản phẩm thất bại: ${errorData.message || "Vui lòng kiểm tra lại thông tin"}`, "error");
        }
    } catch (e) {
        console.error("Lỗi khi lưu sản phẩm:", e);
        showNotification("Lỗi kết nối. Vui lòng thử lại sau.", "error");
    } finally {
        setIsProcessing(false);
        setSelectedProduct(null);
    }
  };

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
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === page ? 'bg-indigo-600 text-white shadow-sm border-none' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
              {page}
          </button>
        );
    });
  };

  const availableSubsFilter = filterMainCategory 
    ? MENU_DATA.find(x => x.main === filterMainCategory)?.subs || [] 
    : [];

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = currentPage * itemsPerPage;

  return (
    <MainLayout>
    <div className="space-y-6 animate-fade-in pb-10 p-6 min-h-screen bg-gray-50 relative">
      
      {/* Toast Notification */}
      {notification && (
        <ToastNotification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Sản phẩm</h1>
          <p className="text-slate-500 mt-1">Quản lý danh sách sản phẩm hệ thống VNB Sports</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button onClick={handleCreateClick} className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm shadow-indigo-200 cursor-pointer border-none">
            <Plus size={16} className="mr-2" /> Thêm Sản Phẩm
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
            
            {/* Lọc theo Danh mục chính */}
            <div className="flex-1 min-w-0 bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <Layers size={14} className="mr-1.5 text-indigo-500"/> Lọc theo Danh mục chính
                    </span>
                </div>
                <div className="flex gap-3 overflow-x-auto p-2 custom-scrollbar snap-x">
                    <button 
                        onClick={() => { setFilterMainCategory(""); setFilterSubCategory(""); setCurrentPage(1); }}
                        className={`snap-start flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer border-none ${filterMainCategory === "" ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 ring-offset-1' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                    >
                        Tất cả
                    </button>
                    {MENU_DATA.map((cat) => {
                        const isSelected = filterMainCategory === cat.main;
                        return (
                          <button 
                              key={cat.main}
                              onClick={() => handleMainCategoryClick(cat.main)}
                              className={`snap-start flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer relative pr-8 border-none ${isSelected ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 ring-offset-1' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
                          >
                              {cat.main}
                              {isSelected && (
                                <div className="absolute top-1/2 -translate-y-1/2 right-2 bg-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center border border-white">
                                  <Check size={10} strokeWidth={3} />
                                </div>
                              )}
                          </button>
                        );
                    })}
                </div>
            </div>

            {/* Lọc theo Danh mục phụ */}
            <div className="w-full md:w-72 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <Tag size={14} className="mr-1.5 text-green-500"/> Lọc theo Danh mục phụ
                    </span>
                    {filterSubCategory && (
                        <button onClick={() => { setFilterSubCategory(""); setCurrentPage(1); }} className="text-xs text-red-500 hover:text-red-700 flex items-center font-medium bg-transparent border-none cursor-pointer">
                            <FilterX size={12} className="mr-1" /> Xóa lọc
                        </button>
                    )}
                </div>
                <div className="relative flex-1">
                    <select 
                        value={filterSubCategory}
                        onChange={(e) => { setFilterSubCategory(e.target.value); setCurrentPage(1); }}
                        className="w-full h-10 pl-3 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer disabled:opacity-50"
                        disabled={!filterMainCategory}
                    >
                        <option value="">Tất cả danh mục phụ</option>
                        {availableSubsFilter.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
                <div className="mt-3 text-xs text-slate-400">
                    Hiển thị {totalItems} kết quả
                </div>
            </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm theo tên..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                />
             </div>
             <button onClick={() => setCurrentPage(1)} className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm border-none cursor-pointer">
                <Search size={16} className="mr-2" /> Tìm kiếm
             </button>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
                <p>Đang tải sản phẩm...</p>
             </div>
        ) : (
        <>
        {products.map((product) => {
            const isAvailable = product.status.toLowerCase() === 'còn hàng' || product.stock > 0;
            return (
          <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col">
            <div className={`h-48 ${product.imageColor} relative flex items-center justify-center p-2 group-hover:opacity-95 transition-opacity`}>
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border shadow-sm ${
                    isAvailable 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                    : 'bg-red-100 text-red-700 border-red-200'
                }`}>
                    {isAvailable ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <button onClick={() => handleViewClick(product)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-600 hover:text-white transition-all transform hover:scale-105 border-none cursor-pointer" title="Xem chi tiết">
                  <Eye size={14} />
                </button>
                <button onClick={() => handleEditClick(product)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105 border-none cursor-pointer" title="Sửa sản phẩm">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDeleteClick(product)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-600 shadow-sm hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 border-none cursor-pointer" title="Xóa sản phẩm">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="text-slate-400 flex flex-col items-center h-full w-full">
                 {product.images && product.images.length > 0 && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain" />
                 ) : (
                    <Package size={48} className="opacity-50 mt-10" />
                 )}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-3">
                <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 mb-2" title={product.name}>{product.name}</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium border border-indigo-100">{product.mainCategory}</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">{product.subCategory}</span>
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                   <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Tồn kho</p>
                   <p className="text-sm font-semibold text-slate-700">{product.stock} <span className="text-slate-400 font-normal">sản phẩm</span></p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Giá bán</p>
                   <p className="text-sm font-bold text-[#eb5322]">{formatPrice(product.price_raw)}</p>
                </div>
              </div>
            </div>
          </div>
        )})}
        {products.length === 0 && !error && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search size={32} />
             </div>
             <p className="text-lg font-medium text-slate-600">Không tìm thấy sản phẩm</p>
             <p className="text-sm">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
             {(filterMainCategory || filterSubCategory || searchQuery) && (
                 <button 
                    onClick={() => { setFilterMainCategory(""); setFilterSubCategory(""); setSearchQuery(""); setCurrentPage(1); }}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm bg-transparent border-none cursor-pointer"
                 >
                    Xóa tất cả bộ lọc
                 </button>
             )}
          </div>
        )}
        </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
           <button 
             onClick={() => handlePageChange(currentPage - 1)}
             disabled={currentPage === 1}
             className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
           >
             <ChevronLeft size={20} />
           </button>
           
           <div className="flex items-center gap-1">
             {renderPagination()}
           </div>

           <button 
             onClick={() => handlePageChange(currentPage + 1)}
             disabled={currentPage === totalPages}
             className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
           >
             <ChevronRight size={20} />
           </button>
           <div className="ml-4 text-sm text-slate-500 hidden sm:block">
             Hiển thị {totalItems === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} trong tổng số {totalItems}
           </div>
        </div>
      )}

      {/* CÁC MODALS */}
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name}
      />
      
      <ProductFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={selectedProduct}
      />
      
      <ProductDetailModal
         isOpen={isViewModalOpen}
         onClose={() => setIsViewModalOpen(false)}
         product={viewProduct}
      />

      <ProcessProgressModal 
        isOpen={isProcessing} 
        productName={processProductName} 
        actionType={processAction}
      />

    </div>
    </MainLayout>
  );
};