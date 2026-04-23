import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Filter, Search as SearchIcon, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { encodeId } from '../../../utils/url';

// --- CONSTANTS & MAPPING ---
const MENU_DATA = [
  {
    main: "Vợt Cầu Lông",
    subs: ["Vợt cầu lông Yonex", "Vợt cầu lông Victor", "Vợt cầu lông Lining", "Vợt Cầu Lông VS", "Vợt Cầu Lông Mizuno", "Vợt Cầu Lông Apacs", "Vợt Cầu Lông VNB", "Vợt cầu lông Proace", "Vợt cầu lông Forza", "Vợt Cầu Lông FlyPower"],
  },
  {
    main: "Giày Cầu Lông",
    subs: ["Giày cầu lông Yonex", "Giày cầu lông Victor", "Giày cầu lông Lining", "Giày cầu lông VS", "Giày cầu lông Kawasaki", "Giày Cầu Lông Mizuno", "Giày Cầu Lông Kumpoo", "Giày Cầu Lông Promax", "Giày cầu lông Babolat", "Giày Cầu Lông Sunbatta"],
  },
  {
    main: "Áo Cầu Lông",
    subs: ["Áo cầu lông Yonex", "Áo cầu lông VNB", "Áo cầu lông Kamito", "Áo cầu lông VS", "Áo cầu lông Victor", "Áo cầu lông Lining", "Áo cầu lông DonexPro", "Áo Cầu Lông Alien Armour", "Áo thể thao SFD", "Áo cầu lông Kawasaki"],
  },
  {
    main: "Váy Cầu Lông",
    subs: ["Váy cầu lông Yonex", "Váy cầu lông Victec", "Váy cầu lông Lining", "Váy Cầu Lông Donex Pro", "Váy cầu lông Victor", "Váy cầu lông Kamito", "Váy cầu lông Taro"],
  },
  {
    main: "Quần Cầu Lông",
    subs: ["Quần cầu lông Yonex", "Quần cầu lông Victor", "Quần cầu lông Lining", "Quần cầu lông VNB", "Quần Cầu Lông SFD", "Quần cầu lông Donex Pro", "Quần Cầu Lông Apacs", "QUẦN CẦU LÔNG ALIEN AMOUR", "Quần cầu lông Mizuno", "Quần cầu lông Kawasaki"],
  },
  {
    main: "Túi Vợt Cầu Lông",
    subs: ["Túi vợt cầu lông Yonex", "Túi đựng giày", "Túi vợt cầu lông VS", "Túi vợt cầu lông Victor", "Túi vợt cầu lông Lining", "Túi vợt cầu lông Kason", "Túi vợt cầu lông Kawasaki", "Túi vợt cầu lông Forza", "Túi Vợt Cầu Lông Apacs", "Túi vợt cầu lông Mizuno"],
  },
  {
    main: "Balo Cầu Lông",
    subs: ["Balo Cầu Lông Yonex", "Balo cầu lông VS", "Balo cầu lông Victor", "Balo cầu lông Kawasaki", "Balo cầu lông Flypower", "Balo cầu lông Mizuno", "Balo cầu lông VNB", "Balo cầu lông Adonex", "Balo cầu lông Forza", "Balo cầu lông Lining"],
  },
  {
    main: "Phụ Kiện Cầu Lông",
    subs: ["Vớ Cầu Lông", "Cước đan vợt cầu lông", "Quả cầu lông", "Banh Power Ball", "Bình nước cầu lông", "Băng bó cơ", "Móc khóa cầu lông", "Quấn cán cầu lông", "Lót giày cầu lông", "Băng chặn mồ hôi"],
  },
  {
    main: "Vợt Pickleball",
    subs: ["Vợt PickleBall Head", "Vợt PickleBall Joola", "Vợt Pickleball Prokennex", "Vợt Pickleball Passion", "Vợt Pickleball Beesoul", "Vợt Pickleball Selkirk", "Vợt Pickleball Babolat", "Vợt Pickleball Wilson", "Vợt Pickleball Gamma", "Vợt Pickleball Amakirk"],
  },
  {
    main: "Giày Pickleball",
    subs: ["Giày Pickleball Jogarbola", "Giày Pickleball Asics", "Giày Pickleball Nike", "Giày Pickleball Joola", "Giày Pickleball Diadem", "Giày Pickleball Kamito", "Giày Pickleball Promax", "Giày Pickleball Kaiwin", "Giày Pickleball Lining", "Giày Pickleball Zocker"],
  },
  {
    main: "Túi Pickleball",
    subs: ["Túi Pickleball Joola", "Túi Pickleball Kamito", "Túi Pickleball Proton", "Túi Pickleball Spikopoll", "Túi Pickleball Wilson", "Túi Pickleball CRBN"],
  },
  {
    main: "Áo Pickleball",
    subs: ["Áo Pickleball Babolat", "Áo Pickleball Joola", "Áo Pickleball Kaiwin", "Áo Pickleball Kamito", "Áo Pickleball Selkirk", "Áo Pickleball Skechers"],
  },
  {
    main: "Quần Pickleball",
    subs: ["Quần Pickleball Babolat", "Quần Pickleball Joola", "Quần Pickleball Kaiwin", "Quần Pickleball Kamito"],
  },
  {
    main: "Bóng Pickleball",
    subs: ["Bóng Pickleball Joola", "Bóng Pickleball Bamboo", "Bóng Pickleball Diadem", "Bóng Pickleball Facolos", "Bóng Pickleball Franklin", "Bóng Pickleball Gamicy", "Bóng Pickleball Gamma", "Bóng Pickleball Kaiwin", "Bóng Pickleball Kamito", "Bóng Pickleball Lining"],
  },
  {
    main: "Váy Pickleball",
    subs: ["Váy Pickleball Kamito"],
  },
  {
    main: "Phụ Kiện Pickleball",
    subs: ["Lưới pickleball", "Quấn Cán Vợt Pickleball", "Bảo vệ khung vợt Pickleball", "Tẩy mặt vợt Pickleball", "Túi đơn đựng vợt Pickleball", "Túi bọc đầu vợt Pickleball"],
  },
  {
    main: "Balo Pickleball",
    subs: ["Balo Pickleball Joola", "Balo Pickleball Selkirk", "Balo Pickleball Wilson", "Balo Pickleball Arronax", "Balo Pickleball CRBN", "Balo Pickleball Kaiwin", "Balo Pickleball Kumpoo", "Balo Pickleball Gamicy", "Balo Pickleball Zocker", "Balo Pickleball Facolos"],
  },
  {
    main: "Vợt Tennis",
    subs: ["Vợt Tennis Wilson", "Vợt Tennis Babolat", "Vợt Tennis Yonex", "Vợt Tennis Head", "Vợt Tennis Prince", "Vợt Tennis Tecnifibre"],
  },
  {
    main: "Giày Tennis",
    subs: ["Giày Tennis Asics", "Giày Tennis Yonex", "Giày Tennis Adidas", "Giày Tennis Nike", "Giày Tennis Mizuno", "Giày Tennis Prince", "Giày Tennis Babolat", "Giày tennis Jogarbola", "Giày tennis Wilson", "Giày tennis Head"],
  },
  {
    main: "Balo Tennis",
    subs: ["Balo Tennis Wilson", "Balo Tennis Babolat", "Balo Tennis Prince", "Balo Tennis Head"],
  },
  {
    main: "Túi Tennis",
    subs: ["Túi Tennis Wilson", "Túi Tennis Babolat", "Túi Tennis Nike", "Túi Tennis Head", "Túi Tennis Adidas", "Túi Tennis Tecnifibre", "Túi tennis Prince", "Túi Tennis Kumpoo", "Túi Tennis Hundred"],
  },
  {
    main: "Chân Váy Tennis",
    subs: ["Váy tennis Babolat"],
  },
  {
    main: "Áo Tennis",
    subs: ["Áo tennis Adidas", "Áo tennis Babolat", "Áo tennis Donex Pro", "Áo tennis Nike", "Áo tennis Uniqlo", "Áo tennis Vina Authentic", "Áo tennis Wilson"],
  },
  {
    main: "Quần Tennis",
    subs: ["Quần tennis Adidas", "Quần tennis Babolat", "Quần Tennis Donex Pro MSC-2030 Đen Phối Trắng Chính Hãng", "Quần tennis Nike", "Quần tennis Uniqlo", "Quần tennis Wilson"],
  },
  {
    main: "Phụ Kiện Tennis",
    subs: ["Cước Tennis (dây đan vợt tennis)", "Băng chặn mồ hôi Tennis", "Quấn Cán Vợt Tennis", "Khăn lau mồ hôi tennis"],
  },
  {
    main: "Máy Đan và Thảm Cầu Lông",
    subs: ["Máy Đan Vợt Cầu Lông", "Thảm Sân Cầu Lông", "Thảm cầu lông Mini"],
  },
  {
    main: "Giày Running",
    subs: ["Giày chạy bộ Yonex Running SAFERUN 350 Đỏ chính hãng", "Giày chạy bộ Yonex Running SAFERUN 350 Trắng chính hãng", "Giày chạy bộ Yonex Running SAFERUN 350 Xanh Đen chính hãng", "Giày Running Victor 701CR-2018 Đỏ", "Giày Running Victor 701CR-2018 Xanh"],
  },
  {
    main: "Ghế Massage",
    subs: ["Ghế Massage Giá Rẻ", "Ghế Massage Trung Cấp", "Ghế Massage Thương Gia", "Ghế massage Kingsport", "Ghế massage Queen Crown", "Ghế massage Tokuyo", "Ghế massage Kagawa", "Ghế massage KLC", "Ghế massage Okasa", "Ghế massage Toshiko"],
  },
  {
    main: "Máy Massage",
    subs: ["Máy Massage Mắt Azaki E191 Plus chính hãng", "Máy Massage Cổ Azaki N109 Plus chính hãng", "Máy Massage Lưng & Bụng Azaki W122 chính hãng", "Máy Massage Bụng Azaki Slim Beauty A150 chính hãng", "Máy (Súng) Massage Cầm Tay Azaki G188 chính hãng"],
  },
  {
    main: "Máy Chạy Bộ, Xe Đạp Tập",
    subs: ["Máy chạy bộ Azaki Helios H8500 chính hãng", "Máy chạy bộ Azaki Hercules H6000 chính hãng", "Máy chạy bộ Azaki Mercury M1000 chính hãng", "Máy chạy bộ Azaki TH666 chính hãng", "Máy chạy bộ Azaki Zeus Z9100 chính hãng", "Xe đạp tập Azaki Apollo SB380 chính hãng", "Xe đạp tập Azaki Olympus SB450 chính hãng"],
  },
  {
    main: "Mũ",
    subs: ["Mũ Bucket Victoc OnePiece Limited", "Mũ lưỡi trai Victor OnePiece Limited", "Mũ cầu lông Victor Hello Kitty", "Mũ cầu lông Victor Hello Kitty VC-KT213 I Hồng"],
  },
  {
    main: "Phụ Kiện Sưu Tầm",
    subs: ["Túi", "Túi bút", "Bút"],
  }
];

const PRICE_RANGES = [
  { id: 'under_500', label: 'Giá dưới 500.000đ', min: 0, max: 500000 },
  { id: '500_1m', label: '500.000đ - 1 triệu', min: 500000, max: 1000000 },
  { id: '1m_2m', label: '1 - 2 triệu', min: 1000000, max: 2000000 },
  { id: '2m_3m', label: '2 - 3 triệu', min: 2000000, max: 3000000 },
  { id: 'above_3m', label: 'Giá trên 3 triệu', min: 3000000, max: 999999999 }
];

const WEIGHTS = [
  { val: '2U', label: '2U: 90 - 94g' },
  { val: '3U', label: '3U: 85 - 89g' },
  { val: '4U', label: '4U: 80 - 84g' },
  { val: '5U', label: '5U: 75 - 79g' },
  { val: 'F', label: 'F: 70 - 74g' }
];

const APPAREL_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
const SHOE_SIZES = ['39.5', '40', '40.5', '41', '41.5', '42', '42.5', '43', '43.5', '44', '45', '45.5', '46', '47', '48'];

const formatPrice = (price) => {
  return price ? price.toLocaleString('vi-VN') + ' đ' : '0 đ';
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Params từ Header
  const mainCategory = searchParams.get('mainCategory') || '';
  const subCategoryQuery = searchParams.get('subCategory') || '';
  const searchQuery = searchParams.get('name') || '';

  // Nhận biết loại sản phẩm để hiển thị Size tương ứng
  const isRacket = mainCategory.toLowerCase().includes('vợt');
  const isShoe = mainCategory.toLowerCase().includes('giày');
  const isApparel = mainCategory.toLowerCase().includes('áo') || mainCategory.toLowerCase().includes('quần') || mainCategory.toLowerCase().includes('váy');

  // Lấy danh sách sub-category cho main category hiện tại
  const currentMainData = MENU_DATA.find(item => item.main.toLowerCase() === mainCategory.toLowerCase());
  const availableSubs = currentMainData ? currentMainData.subs : [];

  // States Dữ liệu API
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // States Bộ lọc
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [status, setStatus] = useState('ALL'); 
  const [sortOrder, setSortOrder] = useState('DEFAULT'); 
  
  // State Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');

  const hasFilters = selectedSubs.length > 0 || selectedPrices.length > 0 || selectedSizes.length > 0;

  // 1. ĐỒNG BỘ URL QUERY PARAMS VÀO STATE
  useEffect(() => {
    // Reset các bộ lọc khi chuyển sang danh mục mới từ URL
    setSelectedPrices([]);
    setSelectedSizes([]);
    setStatus('ALL');
    setSortOrder('DEFAULT');

    // Nạp subCategory từ URL vào state selectedSubs
    const subs = subCategoryQuery ? subCategoryQuery.split(',') : [];
    setSelectedSubs(subs);
    setCurrentPage(1);
  }, [searchParams]);

  // Reset trang về 1 mỗi khi đổi filter
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubs, selectedPrices, selectedSizes, status, sortOrder]);

  // 2. GỌI API LẤY DANH SÁCH SẢN PHẨM
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        if (searchQuery) params.append('name', searchQuery);
        if (mainCategory) params.append('mainCategory', mainCategory);

        // Nối các filter mảng
        if (selectedSubs.length > 0) params.append('subCategory', selectedSubs.join(','));
        
        // Truyền vào 'sizes' theo chuẩn backend
        if (selectedSizes.length > 0) params.append('sizes', selectedSizes.join(','));

        params.append('page', currentPage);
        params.append('limit', 12); 

        // Sắp xếp
        if (sortOrder === 'NEWEST') {
          params.append('sortBy', 'createdAt');
          params.append('sortOrder', 'desc');
        } else if (sortOrder === 'PRICE_ASC') {
          params.append('sortBy', 'price');
          params.append('sortOrder', 'asc');
        } else if (sortOrder === 'PRICE_DESC') {
          params.append('sortBy', 'price');
          params.append('sortOrder', 'desc');
        }

        // Tính Min Price và Max Price
        if (selectedPrices.length > 0) {
          let globalMin = Number.MAX_SAFE_INTEGER;
          let globalMax = 0;
          selectedPrices.forEach(pid => {
            const range = PRICE_RANGES.find(r => r.id === pid);
            if (range) {
              if (range.min < globalMin) globalMin = range.min;
              if (range.max > globalMax) globalMax = range.max;
            }
          });
          params.append('minPrice', globalMin);
          params.append('maxPrice', globalMax);
        }

        // Trạng thái (Status)
        if (status === 'IN_STOCK') {
          params.append('status', 'còn hàng');
        } else if (status === 'OUT_OF_STOCK') {
          params.append('status', 'hết hàng');
        }

        // Thực thi API
        const response = await fetch(`http://localhost:8086/api/v1/search?${params.toString()}`);
        const data = await response.json();

        setProducts(data.results || []);
        setTotalItems(data.total || 0);
        
        // Tính tổng số trang
        const limit = data.limit || 12;
        setTotalPages(Math.ceil((data.total || 0) / limit) || 1);

      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
        setProducts([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(debounceFetch);

  }, [mainCategory, searchQuery, selectedSubs, selectedPrices, selectedSizes, status, sortOrder, currentPage]);


  // CÁC HÀM XỬ LÝ SỰ KIỆN CLICK BỘ LỌC
  const handleSubChange = (sub) => {
    setSelectedSubs(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handlePriceChange = (priceId) => {
    setSelectedPrices(prev => 
      prev.includes(priceId) ? prev.filter(p => p !== priceId) : [...prev, priceId]
    );
  };

  const handleSizeChange = (val) => {
    setSelectedSizes(prev => 
      prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]
    );
  };

  const removeFilter = (setter, val) => {
    setter(prev => prev.filter(v => v !== val));
  };

  // Nút Hủy tất cả bộ lọc
  const clearAllFilters = () => {
    setSelectedSubs([]);
    setSelectedPrices([]);
    setSelectedSizes([]);
    setStatus('ALL');
    setSortOrder('DEFAULT');
    // Nếu có query name hoặc subCategory trong URL, ta có thể navigate về chỉ có mainCategory
    if (mainCategory) {
      navigate(`/search?mainCategory=${encodeURIComponent(mainCategory)}`);
    } else {
      navigate('/search');
    }
  };

  // Phân trang
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="w-full min-h-screen !bg-[#f5f5f5] pb-20 font-sans">
      
      {/* Breadcrumb Động */}
      <div className="!bg-white border-b border-gray-100 py-3 mb-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center flex-wrap text-[13px] !text-gray-600 gap-y-2">
          <Link to="/" className="hover:!text-[#eb5322] transition-colors !text-gray-500 !no-underline whitespace-nowrap">Trang chủ</Link>
          
          {mainCategory && (
            <>
              <ChevronRight size={14} className="mx-2 !text-gray-300 flex-shrink-0" />
              <Link to={`/search?mainCategory=${encodeURIComponent(mainCategory)}`} className={`${subCategoryQuery ? 'hover:!text-[#eb5322] !text-gray-500' : '!text-[#eb5322] font-medium'} transition-colors !no-underline whitespace-nowrap`}>
                {mainCategory}
              </Link>
            </>
          )}
          
          {subCategoryQuery && (
            <>
              <ChevronRight size={14} className="mx-2 !text-gray-300 flex-shrink-0" />
              <span className="!text-[#eb5322] font-medium whitespace-nowrap">{subCategoryQuery}</span>
            </>
          )}

          {!mainCategory && !subCategoryQuery && (
            <>
              <ChevronRight size={14} className="mx-2 !text-gray-300 flex-shrink-0" />
              <span className="!text-[#eb5322] font-medium whitespace-nowrap">
                {searchQuery ? `Tìm kiếm: "${searchQuery}"` : "Tất cả sản phẩm"}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* ============================================================== */}
        {/* CỘT TRÁI: SIDEBAR BỘ LỌC */}
        {/* ============================================================== */}
        <div className="w-full lg:w-[280px] flex-shrink-0">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5 sticky top-24">
            
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
              <h2 className="text-[15px] font-bold uppercase tracking-tight !text-gray-800 flex items-center">
                <Filter size={18} className="mr-2 !text-[#eb5322]" />
                Bộ lọc tìm kiếm
              </h2>
            </div>

            {/* HIỂN THỊ CÁC BỘ LỌC ĐÃ CHỌN */}
            {hasFilters && (
              <div className="mb-6 border-b border-gray-100 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-bold uppercase !text-[#eb5322]">Bạn chọn</h3>
                  <button 
                    onClick={clearAllFilters}
                    className="text-[13px] font-medium !text-gray-600 hover:!text-gray-900 flex items-center bg-transparent border-none cursor-pointer transition-colors"
                  >
                    Bỏ hết <X size={14} className="ml-1" strokeWidth={2.5} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPrices.map(priceId => {
                    const priceLabel = PRICE_RANGES.find(p => p.id === priceId)?.label;
                    return (
                      <button key={priceId} onClick={() => removeFilter(setSelectedPrices, priceId)} className="flex items-center px-2 py-1.5 !bg-[#eb5322] hover:!bg-[#d04316] !text-white text-[13px] rounded-sm transition-colors border-none cursor-pointer">
                        <X size={14} className="mr-1.5" strokeWidth={2.5} /> {priceLabel}
                      </button>
                    );
                  })}
                  {selectedSubs.map(sub => (
                    <button key={sub} onClick={() => removeFilter(setSelectedSubs, sub)} className="flex items-center px-2 py-1.5 !bg-[#eb5322] hover:!bg-[#d04316] !text-white text-[13px] rounded-sm transition-colors border-none cursor-pointer">
                      <X size={14} className="mr-1.5" strokeWidth={2.5} /> {sub}
                    </button>
                  ))}
                  {selectedSizes.map(sz => (
                    <button key={sz} onClick={() => removeFilter(setSelectedSizes, sz)} className="flex items-center px-2 py-1.5 !bg-[#eb5322] hover:!bg-[#d04316] !text-white text-[13px] rounded-sm transition-colors border-none cursor-pointer">
                      <X size={14} className="mr-1.5" strokeWidth={2.5} /> Size {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 1. CHỌN MỨC GIÁ */}
            <div className="mb-6">
              <h3 className="text-[14px] font-bold uppercase !text-gray-800 mb-4">CHỌN MỨC GIÁ</h3>
              <div className="space-y-3.5">
                {PRICE_RANGES.map((range) => (
                  <label key={range.id} className="flex items-center space-x-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-[#eb5322] cursor-pointer rounded-sm border-gray-300 flex-shrink-0"
                      checked={selectedPrices.includes(range.id)}
                      onChange={() => handlePriceChange(range.id)}
                    />
                    <span className="text-[14px] !text-gray-700 group-hover:!text-[#eb5322] transition-colors select-none">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. LỌC THEO KÍCH CỠ ĐỘNG */}
            {isRacket && (
              <div className="mb-6 border-t border-gray-100 pt-6">
                <h3 className="text-[14px] font-bold uppercase !text-gray-800 mb-4">TRỌNG LƯỢNG</h3>
                <div className="space-y-3.5">
                  {WEIGHTS.map(w => (
                    <label key={w.val} className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-[#eb5322] cursor-pointer rounded-sm border-gray-300 flex-shrink-0"
                        checked={selectedSizes.includes(w.val)}
                        onChange={() => handleSizeChange(w.val)}
                      />
                      <span className="text-[14px] !text-gray-700 group-hover:!text-[#eb5322] transition-colors select-none">
                        {w.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {(isShoe || isApparel) && (
              <div className="mb-6 border-t border-gray-100 pt-6">
                <h3 className="text-[14px] font-bold uppercase !text-gray-800 mb-4">LỌC THEO SIZE</h3>
                {/* Đã thêm max-h và scrollbar cho size giày */}
                <div className="max-h-[140px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
                  <div className="grid grid-cols-3 gap-3">
                    {(isShoe ? SHOE_SIZES : APPAREL_SIZES).map(s => (
                      <label key={s} className="flex items-center space-x-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 accent-[#eb5322] cursor-pointer rounded-sm border-gray-300 flex-shrink-0"
                          checked={selectedSizes.includes(s)}
                          onChange={() => handleSizeChange(s)}
                        />
                        <span className={`text-[14px] transition-colors select-none ${selectedSizes.includes(s) ? '!text-[#eb5322] font-medium' : '!text-gray-700 group-hover:!text-[#eb5322]'}`}>
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. LỌC THEO TRẠNG THÁI (STATUS) */}
            <div className="border-t border-gray-100 pt-6 pb-2">
              <h3 className="text-[14px] font-bold uppercase !text-gray-800 mb-4">TRẠNG THÁI</h3>
              <div className="space-y-3.5">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="status" 
                    value="ALL"
                    checked={status === 'ALL'}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-4 h-4 accent-[#eb5322] cursor-pointer flex-shrink-0" 
                  />
                  <span className="text-[14px] !text-gray-700 group-hover:!text-[#eb5322] transition-colors select-none">Tất cả sản phẩm</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="status" 
                    value="IN_STOCK"
                    checked={status === 'IN_STOCK'}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-4 h-4 accent-[#eb5322] cursor-pointer flex-shrink-0" 
                  />
                  <span className="text-[14px] !text-gray-700 group-hover:!text-[#eb5322] transition-colors select-none">Còn hàng</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="status" 
                    value="OUT_OF_STOCK"
                    checked={status === 'OUT_OF_STOCK'}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-4 h-4 accent-[#eb5322] cursor-pointer flex-shrink-0" 
                  />
                  <span className="text-[14px] !text-gray-700 group-hover:!text-[#eb5322] transition-colors select-none">Hết hàng</span>
                </label>
              </div>
            </div>

            {/* 4. SUB-CATEGORIES (Nằm ở dưới cùng) */}
            {availableSubs.length > 0 && (
              <div className="border-t border-gray-100 pt-6 mt-4">
                <h3 className="text-[14px] font-bold uppercase !text-gray-800 mb-4">LOẠI SẢN PHẨM</h3>
                <div className="max-h-[220px] overflow-y-auto pr-2 space-y-3.5 scrollbar-thin scrollbar-thumb-gray-300">
                  {availableSubs.map((sub, idx) => (
                    <label key={idx} className="flex items-start space-x-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-0.5 w-4 h-4 accent-[#eb5322] cursor-pointer rounded-sm border-gray-300 flex-shrink-0"
                        checked={selectedSubs.includes(sub)}
                        onChange={() => handleSubChange(sub)}
                      />
                      <span className="text-[14px] !text-gray-700 group-hover:!text-[#eb5322] transition-colors leading-tight select-none">
                        {sub}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>


        {/* ============================================================== */}
        {/* CỘT PHẢI: KẾT QUẢ SẢN PHẨM */}
        {/* ============================================================== */}
        <div className="flex-1 min-w-0">

          {/* Title & Sorting */}
          <div className="pb-3 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#eb5322]">
            <h1 className="text-[20px] font-bold uppercase !text-gray-800 m-0">
              {searchQuery ? `Kết quả cho: "${searchQuery}"` : (mainCategory || 'Tất cả sản phẩm')}
              <span className="text-[14px] font-normal text-gray-500 lowercase ml-2">({totalItems} sản phẩm)</span>
            </h1>
            
            <div className="flex items-center space-x-3">
              <span className="text-[13px] !text-gray-600 flex items-center whitespace-nowrap">
                <SlidersHorizontal size={14} className="mr-1.5" /> Sắp xếp:
              </span>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-300 py-1.5 px-3 text-[13px] font-medium rounded-sm outline-none focus:border-[#eb5322] cursor-pointer"
              >
                <option value="DEFAULT">Mặc định</option>
                <option value="NEWEST">Hàng mới nhất</option>
                <option value="PRICE_ASC">Giá tăng dần</option>
                <option value="PRICE_DESC">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 relative min-h-[300px]">
            {isLoading ? (
              <div className="absolute inset-0 flex justify-center items-start pt-20 bg-white/50 z-10">
                 <Loader2 size={40} className="animate-spin !text-[#eb5322]" />
              </div>
            ) : products.length > 0 ? (
              products.map((product) => {
                const imageUrl = product.imageUrls && product.imageUrls.length > 0 
                                 ? product.imageUrls[0] 
                                 : 'https://via.placeholder.com/300x300?text=No+Image';
                const isPremium = product.price > 1000000;
                
                // Cờ kiểm tra tình trạng hết hàng để làm xám giao diện
                const isOutOfStock = product.status && product.status.toLowerCase() === 'hết hàng';

                return (
                  <Link to={`/product-detail/${encodeId(product.productId)}`} key={product.productId} className="!no-underline block">
                    <div className="bg-white border border-gray-100 rounded-sm hover:shadow-xl transition-shadow h-full flex flex-col p-3 relative group">
                      
                      {/* Tag Premium */}
                      {isPremium && (
                        <div className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide ${isOutOfStock ? '!bg-gray-400 !text-white' : '!bg-[#eb5322] !text-white'}`}>
                          Premium
                        </div>
                      )}
                      
                      {/* Ảnh sản phẩm mờ đi và xám màu nếu hết hàng */}
                      <div className="relative mb-4 mt-6 aspect-square overflow-hidden flex items-center justify-center p-2">
                        <img 
                          src={imageUrl} 
                          alt={product.name} 
                          className={`w-full h-auto object-contain transition-all duration-500 ${isOutOfStock ? 'opacity-60 grayscale-[0.4]' : 'group-hover:scale-105'}`} 
                        />
                      </div>

                      <div className="flex flex-col flex-1">
                        <h3 className={`text-[13px] font-medium line-clamp-2 mb-2 leading-snug transition-colors ${isOutOfStock ? '!text-gray-500' : '!text-gray-800 group-hover:!text-[#eb5322]'}`} title={product.name}>
                          {product.name}
                        </h3>
                        <div className="mt-auto pt-2 flex flex-col items-start">
                          <span className={`text-[15px] font-bold ${isOutOfStock ? '!text-gray-400' : '!text-[#eb5322]'}`}>
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                 <SearchIcon size={48} className="!text-gray-300 mb-4" />
                 <p className="text-gray-500 italic">Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn.</p>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* PHÂN TRANG (PAGINATION) */}
          {/* ============================================================== */}
          {totalPages > 1 && !isLoading && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-sm text-[16px] font-medium !bg-white !text-gray-700 hover:!text-[#eb5322] hover:border-[#eb5322] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
              >
                &laquo;
              </button>

              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`dots-${index}`} className="w-9 h-9 flex items-end justify-center text-gray-500 font-medium tracking-widest pb-1">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center border rounded-sm text-[14px] font-medium transition-colors cursor-pointer select-none
                      ${currentPage === page 
                        ? '!bg-[#eb5322] border-[#eb5322] !text-white' 
                        : '!bg-white border-gray-300 !text-gray-700 hover:!text-[#eb5322] hover:border-[#eb5322]'
                      }
                    `}
                  >
                    {page}
                  </button>
                )
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-sm text-[16px] font-medium !bg-white !text-gray-700 hover:!text-[#eb5322] hover:border-[#eb5322] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
              >
                &raquo;
              </button>

              <div className="flex items-center ml-2 sm:ml-4 gap-2">
                <input 
                  type="number" 
                  min="1" 
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const p = parseInt(pageInput, 10);
                      if (p >= 1 && p <= totalPages) {
                        setCurrentPage(p);
                        setPageInput('');
                      }
                    }
                  }}
                  placeholder="Trang"
                  className="w-16 h-9 border border-gray-300 rounded-sm px-2 text-center text-[13px] outline-none focus:border-[#eb5322] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button 
                  onClick={() => {
                    const p = parseInt(pageInput, 10);
                    if (p >= 1 && p <= totalPages) {
                      setCurrentPage(p);
                      setPageInput('');
                    }
                  }}
                  className="h-9 px-3 !bg-gray-800 hover:!bg-[#eb5322] !text-white text-[13px] font-medium rounded-sm transition-colors border-none cursor-pointer"
                >
                  Đi
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchPage;
