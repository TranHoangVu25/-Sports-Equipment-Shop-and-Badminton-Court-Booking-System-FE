import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronRight, 
  Minus, 
  Plus, 
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Truck
} from 'lucide-react';

// Dữ liệu danh mục ở cột bên phải theo ảnh thiết kế
const CATEGORIES_SIDEBAR = [
  "Vợt Cầu Lông", "Giày Cầu Lông", "Áo Cầu Lông", "Váy cầu lông", "Quần Cầu Lông",
  "Túi Vợt Cầu Lông", "Balo Cầu Lông", "Phụ Kiện Cầu Lông", "Vợt PickleBall", 
  "Giày Pickleball", "Túi Pickleball", "Áo Pickleball", "Quần Pickleball", 
  "Bóng Pickleball", "Váy Pickleball", "Vợt Tennis", "Giày Tennis", 
  "Balo tennis", "Túi Tennis"
];

const formatPrice = (price) => {
  return price ? Number(price).toLocaleString('vi-VN') + ' ₫' : '0 ₫';
};

const ProductDetailPage = () => {
  // Lấy ID sản phẩm từ URL (Bắt buộc route phải khai báo là /product-detail/:id)
  const { id } = useParams(); 
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null); 
  const [quantity, setQuantity] = useState(1);

  // FETCH DỮ LIỆU TỪ API
  useEffect(() => {
    const fetchProductDetail = async () => {
      // 1. Kiểm tra ID truyền vào từ URL
      if (!id) {
        setError('Không tìm thấy ID sản phẩm trên đường dẫn.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // 2. Gọi API sử dụng chính xác ID từ Params (đã bỏ ID mặc định)
        const response = await fetch(`http://localhost:8086/api/v1/products/detail/${id}`);
        const data = await response.json();

        if (response.ok && data.code === 200 && data.result) {
          const productData = data.result;
          setProduct(productData);
          
          // Gán ảnh mặc định một cách an toàn
          if (productData?.images && productData.images.length > 0) {
            setSelectedImage(productData.images[0]);
          }

          // Gán biến thể mặc định (ưu tiên chọn cái đầu tiên còn hàng)
          if (productData?.variants && productData.variants.length > 0) {
            const availableVariant = productData.variants.find(v => v.quantity > 0) || productData.variants[0];
            setSelectedVariant(availableVariant);
          }
        } else {
          setError(data.message || 'Không tìm thấy thông tin sản phẩm.');
        }
      } catch (err) {
        console.error("Lỗi fetch chi tiết sản phẩm:", err);
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng hoặc API.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
    window.scrollTo(0, 0); // Cuộn lên đầu khi vào trang
  }, [id]);

  const handleQuantityChange = (delta) => {
    // Không cho phép vượt quá số lượng tồn kho của biến thể đang chọn
    const maxQty = selectedVariant ? selectedVariant.quantity : 1;
    setQuantity(prev => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (newQty > maxQty) return maxQty;
      return newQty;
    });
  };

  // Khi đổi biến thể, reset số lượng về 1
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={48} className="animate-spin text-[#eb5322]" />
      </div>
    );
  }

  // Error State (Xử lý khi lỗi hoặc không có dữ liệu)
  if (error || !product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ối! Có lỗi xảy ra</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">{error || 'Sản phẩm này không tồn tại hoặc đã bị xóa.'}</p>
        <Link to="/" className="px-6 py-2 bg-[#eb5322] hover:bg-[#d04316] transition-colors text-white rounded-sm no-underline font-bold uppercase tracking-wider border-none cursor-pointer">
          Về trang chủ
        </Link>
      </div>
    );
  }

  // Xử lý an toàn các thuộc tính string để tránh lỗi
  const productNameSafe = String(product?.name || '').toLowerCase();
  const productCategorySafe = String(product?.mainCategory || '').toLowerCase();
  const productStatusSafe = String(product?.status || '').toLowerCase();
  
  // Phân loại nhóm có "tên size đặc thù"
  const isRacket = productNameSafe.includes('vợt') || productCategorySafe.includes('vợt');
  const isShoeApparel = productNameSafe.includes('giày') || productNameSafe.includes('áo') || productNameSafe.includes('quần') || productNameSafe.includes('váy') || productCategorySafe.includes('giày') || productCategorySafe.includes('áo') || productCategorySafe.includes('quần') || productCategorySafe.includes('váy');
  
  const isSpecificSize = isRacket || isShoeApparel;
  const isOutOfStock = productStatusSafe === 'hết hàng';

  let variantTitle = 'Chọn Phân Loại:';
  if (isRacket) variantTitle = 'Chọn Trọng lượng / Chu vi cán:';
  else if (isShoeApparel) variantTitle = 'Chọn Kích cỡ (Size):';

  // Kiểm tra xem sản phẩm có size hợp lệ không (khác "Default")
  const hasValidSizes = product?.variants?.some(v => v.size && String(v.size).toLowerCase() !== 'default');

  const mockOldPrice = (product?.price || 0) * 1.2;

  return (
    <div className="w-full min-h-screen bg-white pb-20 font-sans">
      
      {/* 1. BREADCRUMB */}
      <div className="bg-gray-50/50 border-b border-gray-100 py-2.5 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center flex-wrap text-[13px] text-gray-500 gap-y-2">
          <Link to="/" className="hover:text-[#eb5322] transition-colors no-underline">Trang chủ</Link>
          
          {product?.mainCategory && (
            <>
              <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
              <Link to={`/search?mainCategory=${encodeURIComponent(product.mainCategory)}`} className="hover:text-[#eb5322] transition-colors no-underline">
                {product.mainCategory}
              </Link>
            </>
          )}

          {product?.subCategory && (
            <>
              <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
              <Link to={`/search?mainCategory=${encodeURIComponent(product.mainCategory || '')}&subCategory=${encodeURIComponent(product.subCategory)}`} className="hover:text-[#eb5322] transition-colors no-underline">
                {product.subCategory}
              </Link>
            </>
          )}

          {/* Backup Breadcrumb nếu không có category nhưng có Brand */}
          {!product?.mainCategory && product?.brand && (
            <>
              <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
              <Link to={`/search?name=${encodeURIComponent(product.brand)}`} className="hover:text-[#eb5322] transition-colors no-underline">
                {product.brand}
              </Link>
            </>
          )}

          <ChevronRight size={14} className="mx-2 text-gray-400 flex-shrink-0" />
          <span className="text-[#eb5322]">{product?.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* ============================================================== */}
          {/* CỘT 1: HÌNH ẢNH SẢN PHẨM (Col-span: 4) */}
          {/* ============================================================== */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="w-full aspect-square border border-gray-200 rounded-sm mb-4 flex items-center justify-center p-4 relative overflow-hidden bg-white">
              <img 
                src={selectedImage || 'https://via.placeholder.com/500x500?text=No+Image'} 
                alt={product?.name} 
                className="w-full h-full object-contain transition-opacity duration-300"
              />
            </div>
            
            <div className="flex gap-3 overflow-x-auto hide-scroll py-1">
              {product?.images?.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 flex-shrink-0 border cursor-pointer p-1 transition-all rounded-sm ${
                    selectedImage === img ? 'border-[#eb5322] shadow-sm' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================== */}
          {/* CỘT 2: THÔNG TIN & HÀNH ĐỘNG MUA (Col-span: 5) */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 flex flex-col">
            <h1 className="text-[22px] font-bold text-gray-800 leading-snug mb-3">
              {product?.name}
            </h1>
            
            <div className="flex items-center flex-wrap text-[14px] text-gray-600 mb-4 gap-y-2 gap-x-6">
              <p>Mã: <span className="text-[#eb5322] font-medium">{product?.productId}</span></p>
              <p>Thương hiệu: <span className="text-[#eb5322] font-medium">{product?.brand || 'Đang cập nhật'}</span></p>
              <div className="flex items-center gap-1.5">Tình trạng: 
                {!isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                    <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span></span>
                    {product?.status || 'Còn hàng'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    <span className="relative flex h-1.5 w-1.5 bg-gray-400 rounded-full"></span>
                    {product?.status || 'Hết hàng'}
                  </span>
                )}
              </div>
            </div>

            {/* Khối Giá */}
            <div className="flex items-end gap-4 mb-6">
              <span className="text-[28px] font-extrabold text-[#eb5322] leading-none tracking-tight">
                {formatPrice(product?.price)}
              </span>
              {mockOldPrice > (product?.price || 0) && (
                <span className="text-[15px] text-gray-400 line-through mb-1">
                  Giá niêm yết: {formatPrice(mockOldPrice)}
                </span>
              )}
            </div>

            {/* --- KHỐI RENDER SIZE / VARIANTS ĐỘNG TỪ API --- */}
            {hasValidSizes && (
              <div className="mb-8">
                <div className="flex items-end justify-between mb-3">
                  <h3 className="text-[14px] font-bold text-gray-800">{variantTitle}</h3>
                  {selectedVariant && (
                    <span className="text-[12px] text-gray-500">
                      Kho: <strong className="text-[#eb5322]">{selectedVariant.quantity}</strong> sản phẩm
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                  {product?.variants?.map((v) => {
                    // Bỏ qua không render nếu size là 'default'
                    if (!v.size || String(v.size).toLowerCase() === 'default') return null;

                    const isSelected = selectedVariant?.sku === v.sku;
                    const isVariantOutOfStock = v.quantity === 0;
                    
                    const displaySize = v.size ? String(v.size).replace('-', '.') : 'N/A';

                    return (
                      <div 
                        key={v.sku}
                        onClick={() => !isVariantOutOfStock && setSelectedVariant(v)}
                        className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[40px] px-3 py-1.5 border cursor-pointer transition-all select-none rounded-sm
                          ${isSelected 
                            ? 'border-[#eb5322] bg-orange-50 text-[#eb5322] shadow-[0_0_0_1px_#eb5322]' 
                            : 'border-gray-200 hover:border-[#eb5322] text-gray-700 hover:text-[#eb5322]'
                          }
                          ${isVariantOutOfStock ? 'opacity-40 cursor-not-allowed bg-gray-50 hover:border-gray-200 hover:text-gray-700' : ''}
                        `}
                        title={isVariantOutOfStock ? 'Hết hàng' : `Còn ${v.quantity} sản phẩm`}
                      >
                        <span className="text-[14px] font-bold leading-none mb-0.5">{displaySize}</span>
                        
                        {/* Hiển thị số lượng/Trạng thái dưới ô chọn cho các loại KHÔNG CÓ tên size đặc thù */}
                        {!isSpecificSize && (
                          <span className="text-[10px] font-medium leading-none opacity-80 mt-1">
                            {isVariantOutOfStock ? 'Hết hàng' : `Còn: ${v.quantity}`}
                          </span>
                        )}
                        
                        {/* Dấu tích Vàng khi chọn */}
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-white rounded-full">
                            <CheckCircle2 size={16} className="text-[#eb5322] fill-orange-100" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[14px] font-bold text-gray-800">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={isOutOfStock || !selectedVariant || selectedVariant.quantity === 0}
                    className="w-10 h-10 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} strokeWidth={2.5} />
                  </button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    className="w-12 h-10 border-x border-gray-300 text-center text-[15px] font-bold text-gray-800 outline-none disabled:opacity-50"
                    disabled={isOutOfStock}
                  />
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    disabled={isOutOfStock || !selectedVariant || selectedVariant.quantity === 0}
                    className="w-10 h-10 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
                
                {/* Hiển thị Kho hàng ở đây nếu sản phẩm KHÔNG CÓ bảng size (Size = Default) */}
                {!hasValidSizes && selectedVariant && (
                  <span className="text-[12px] text-gray-500 ml-2">
                    Kho: <strong className="text-[#eb5322]">{selectedVariant.quantity}</strong> sản phẩm
                  </span>
                )}
              </div>

              {/* Nút Call To Action */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button 
                  disabled={isOutOfStock || !selectedVariant || selectedVariant.quantity === 0}
                  className="w-full bg-[#fbad18] hover:bg-[#e59b12] text-white font-bold py-3.5 px-2 uppercase text-[15px] rounded-sm transition-colors border-none cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mua ngay
                </button>
                <button 
                  disabled={isOutOfStock || !selectedVariant || selectedVariant.quantity === 0}
                  className="w-full bg-[#dd4b39] hover:bg-[#c93e2d] text-white font-bold py-3.5 px-2 uppercase text-[15px] rounded-sm transition-colors border-none cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>

              {/* Nút thanh toán phụ */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button 
                  disabled={isOutOfStock}
                  className="w-full bg-[#e3001b] hover:bg-[#cc0018] text-white py-2 rounded-sm transition-colors border-none cursor-pointer flex flex-col items-center justify-center h-14 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-bold text-[13px] uppercase">Thanh toán qua thẻ</span>
                  <span className="text-[10px] font-normal mt-0.5">Visa, Master, JCB</span>
                </button>
                <button 
                  disabled={isOutOfStock}
                  className="w-full bg-[#2084d9] hover:bg-[#1b75c2] text-white py-2 rounded-sm transition-colors border-none cursor-pointer flex flex-col items-center justify-center h-14 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-bold text-[13px] uppercase">Trả góp qua thẻ</span>
                  <span className="text-[10px] font-normal mt-0.5">Visa, Master, JCB</span>
                </button>
              </div>
              
              <button 
                disabled={isOutOfStock}
                className="w-full bg-[#fae30c] hover:bg-[#f0d908] text-gray-900 py-2 rounded-sm transition-colors border-none cursor-pointer flex flex-col items-center justify-center h-14 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-bold text-[13px] uppercase tracking-wide">Mua ngay - Trả sau</span>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[#e3001b] font-extrabold text-[10px] italic">HOME<br/>PayLater</span>
                   <span className="text-[#00c9a7] font-extrabold text-[11px]">Fundiin<br/><span className="text-[8px] font-normal text-gray-600 block leading-[0.5]">Pay Later</span></span>
                </div>
              </button>
            </div>

            {/* Đoạn Mô tả ngắn (Description) */}
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm text-sm text-gray-700 leading-relaxed">
               <h4 className="font-bold text-gray-800 uppercase mb-2 text-[13px]">Mô tả sản phẩm:</h4>
               <p>{product?.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
            </div>

          </div>

          {/* ============================================================== */}
          {/* CỘT 3: DANH MỤC SẢN PHẨM (Col-span: 3) */}
          {/* ============================================================== */}
          <div className="lg:col-span-3">
            
            {/* Cam kết bán hàng */}
            <div className="mb-6 bg-white border border-[#eb5322] rounded-sm p-4 text-sm">
              <h3 className="font-bold text-[#eb5322] uppercase border-b border-[#eb5322] pb-2 mb-3">VNB CAM KẾT</h3>
              <ul className="space-y-3 text-gray-700 m-0 p-0 list-none">
                <li className="flex items-start gap-2">
                  <ShieldCheck size={18} className="text-[#eb5322] flex-shrink-0" />
                  <span>Sản phẩm chính hãng 100%</span>
                </li>
                <li className="flex items-start gap-2">
                  <Truck size={18} className="text-[#eb5322] flex-shrink-0" />
                  <span>Giao hàng toàn quốc nhanh chóng</span>
                </li>
              </ul>
            </div>

            {/* Danh mục menu dọc */}
            <div className="border border-gray-200 rounded-sm bg-white overflow-hidden shadow-sm">
              <div className="py-4 text-center border-b border-gray-200 bg-gray-50/50">
                <h3 className="text-[15px] font-semibold text-gray-700 uppercase tracking-wide m-0">
                  Danh mục sản phẩm
                </h3>
              </div>
              <div className="flex flex-col">
                {CATEGORIES_SIDEBAR.map((cat, index) => (
                  <Link
                    key={index}
                    to={`/search?mainCategory=${encodeURIComponent(cat)}`}
                    className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 last:border-b-0 hover:text-[#eb5322] text-gray-700 group no-underline transition-colors"
                  >
                    <span className="text-[14px] font-medium">{cat}</span>
                    <Plus size={16} className="text-gray-400 group-hover:text-[#eb5322] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;