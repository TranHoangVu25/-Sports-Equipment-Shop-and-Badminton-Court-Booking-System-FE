import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TABS = ['Tất cả', 'Vợt Cầu Lông', 'Giày Cầu Lông', 'Áo Cầu Lông', 'Váy cầu lông', 'Quần Cầu Lông'];

// COMPONENT HIỂN THỊ SẢN PHẨM TRÊN TRANG CHỦ KẾT NỐI API
const ProductTabsSection = () => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const sliderRef = useRef(null);

  // Hàm cuộn slider sang trái/phải
  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      // Cuộn đúng bằng chiều rộng hiển thị hiện tại để sang "trang" tiếp theo
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Gọi API mỗi khi activeTab thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Ánh xạ "Tất cả" thành "Vợt Cầu Lông" theo đúng logic backend
        let category = activeTab;
        if (activeTab === 'Tất cả') {
          category = 'Vợt Cầu Lông';
        }

        const response = await fetch(`http://localhost:8086/api/v1/home-page/home-products?mainCategory=${encodeURIComponent(category)}`);
        const data = await response.json();
        
        if (data.code === 1000) {
          setProducts(data.result || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi fetch products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
        // Reset cuộn về đầu mỗi khi đổi tab và có dữ liệu mới
        if (sliderRef.current) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    };

    fetchProducts();
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      {/* Tiêu đề */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold !text-[#eb5322] uppercase inline-block relative font-sans">
          Sản phẩm mới
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 !bg-[#eb5322] rounded-full"></span>
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex w-full overflow-x-auto hide-scroll border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[120px] text-center whitespace-nowrap py-3 px-2 md:px-4 font-semibold text-sm transition-colors border-none cursor-pointer focus:outline-none font-sans ${
              activeTab === tab
                ? '!bg-[#eb5322] !text-white'
                : '!bg-white !text-gray-600 hover:!text-[#eb5322]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Slider (Khung viền cam) */}
      <div className="relative border-4 !border-[#f6a800] bg-white group min-h-[300px]">
        
        {/* Nút Left */}
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 !bg-white border !border-gray-200 p-2 rounded-full shadow-md text-gray-500 hover:!text-[#eb5322] focus:outline-none cursor-pointer hidden md:block opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white/80 z-20">
            <Loader2 className="animate-spin !text-[#eb5322]" size={40} />
          </div>
        )}

        {/* Danh sách sản phẩm trả về từ API */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto hide-scroll snap-x snap-mandatory scroll-smooth"
        >
          {products.map((product) => (
            <div 
              key={product.productId} 
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 flex-shrink-0 snap-start p-3"
            >
              <div className="bg-white border border-transparent hover:border-gray-200 rounded-sm hover:shadow-lg transition-all h-full flex flex-col p-2 cursor-pointer group/item">
                <div className="relative mb-3 aspect-square overflow-hidden flex items-center justify-center">
                  <img 
                    src={product.imgUrl} 
                    alt={product.name} 
                    className="w-full h-auto object-contain group-hover/item:scale-105 transition-transform duration-300" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                  />
                </div>
                <h3 className="text-sm font-medium !text-gray-800 line-clamp-2 mb-2 group-hover/item:!text-[#eb5322] transition-colors font-sans" title={product.name}>
                  {product.name}
                </h3>
                <div className="mt-auto">
                  <span className="text-sm font-bold !text-red-500 font-sans">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Layout trống nếu API không có sản phẩm */}
          {!isLoading && products.length === 0 && (
             <div className="w-full py-20 text-center text-gray-500 italic font-sans flex flex-col items-center justify-center">
               <ShoppingBag size={48} className="mb-4 text-gray-300" />
               Không có sản phẩm nào trong danh mục này.
             </div>
          )}
        </div>

        {/* Nút Right */}
        <button 
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 !bg-white border !border-gray-200 p-2 rounded-full shadow-md text-gray-500 hover:!text-[#eb5322] focus:outline-none cursor-pointer hidden md:block opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProductTabsSection; 