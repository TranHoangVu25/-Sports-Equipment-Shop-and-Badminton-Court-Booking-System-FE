import { Link } from 'react-router-dom';

const badmintonCategories = [
  { name: "Vợt Cầu Lông", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/1.1.webp" },
  { name: "Giày Cầu Lông", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/2_1.webp" },
  { name: "Áo Cầu Lông", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/3_1.webp" },
  { name: "Váy Cầu Lông", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/8.webp" },
  { name: "Quần Cầu Lông", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/4.webp" },
  { name: "Túi Vợt Cầu Lông", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/5.webp" },
  { name: "Balo Cầu Lông", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/6.webp" },
  { name: "Phụ Kiện Cầu Lông", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/7.webp" }
];

const BadmintonProductsSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mb-12 w-full">
      {/* Tiêu đề */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold !text-[#eb5322] uppercase inline-block relative">
          Sản phẩm cầu lông
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 !bg-[#eb5322] rounded-full"></span>
        </h2>
      </div>

      {/* Grid Hình Ảnh */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badmintonCategories.map((category, index) => (
          <Link key={index} to="#" className="block overflow-hidden rounded-sm hover:opacity-90 transition-opacity">
            <img 
              src={category.image} 
              alt={category.name} 
              className="w-full h-auto aspect-square object-cover hover:scale-105 transition-transform duration-500" 
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
export default BadmintonProductsSection; 