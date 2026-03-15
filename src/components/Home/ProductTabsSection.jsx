import {
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TABS = ['Tất cả', 'Vợt Cầu Lông', 'Giày Cầu Lông', 'Áo Cầu Lông', 'Váy cầu lông', 'Quần Cầu Lông'];

const ProductTabsSection = () => {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const sliderRef = useRef(null);

  // Tạo mock data 10 sản phẩm cho tab hiện tại
  const mockProducts = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `Sản phẩm ${activeTab} demo ${i + 1} chính hãng VNB`,
    price: `${(i + 4) * 150}.000 ₫`,
    image: `https://via.placeholder.com/300x300?text=${activeTab.replace(/\s/g, '+')}+${i + 1}`
  }));

  // Hàm cuộn slider sang trái/phải
  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      // Cuộn đúng bằng chiều rộng hiển thị hiện tại để sang "trang" tiếp theo
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Reset cuộn về đầu khi đổi tab
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      {/* Tiêu đề */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold !text-[#eb5322] uppercase inline-block relative">
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
            className={`flex-1 min-w-[120px] text-center whitespace-nowrap py-3 px-2 md:px-4 font-semibold text-sm transition-colors border-none cursor-pointer focus:outline-none ${
              activeTab === tab
                ? '!bg-[#eb5322] !text-white'
                : '!bg-white !text-gray-600 hover:!text-[#eb5322]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Slider (Khung viền vàng) */}
      <div className="relative border-4 !border-[#f6a800] bg-white group">
        
        {/* Nút Left */}
        <button 
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 !bg-white border !border-gray-200 p-2 rounded-full shadow-md text-gray-500 hover:!text-[#eb5322] focus:outline-none cursor-pointer hidden md:block opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Danh sách 10 sản phẩm (hiển thị 5) */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto hide-scroll snap-x snap-mandatory"
        >
          {mockProducts.map((product) => (
            <div 
              key={product.id} 
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 flex-shrink-0 snap-start p-3"
            >
              <div className="bg-white border border-transparent hover:border-gray-200 rounded-sm hover:shadow-lg transition-all h-full flex flex-col p-2 cursor-pointer">
                <div className="relative mb-3 aspect-square overflow-hidden flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-medium !text-gray-800 line-clamp-2 mb-2 hover:!text-[#eb5322] transition-colors">{product.name}</h3>
                <div className="mt-auto">
                  <span className="text-sm font-bold !text-red-500">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
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