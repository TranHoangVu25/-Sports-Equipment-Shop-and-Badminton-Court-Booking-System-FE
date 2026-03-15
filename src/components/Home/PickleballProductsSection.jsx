import { Link } from 'react-router-dom';

const pickleballCategories = [
  { name: "Vợt Pickleball", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/vot-pickleball_1718941016.jpg" },
  { name: "Giày Pickleball", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/giay-pickleball_1718941327.jpg" },
  { name: "Áo Pickleball", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/ao-pickleball_1718941625.jpg" },
  { name: "Quần Pickleball", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/quan-pickleball_1718941896.jpg" },
  { name: "Túi Pickleball", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/tui-pickleball_1718941360.jpg" },
  { name: "Balo Pickleball", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/balo-pickleball_1718941341.jpg" },
  { name: "Bóng Pickleball", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/bong-pickleball_1718941306.jpg" },
  { name: "Phụ Kiện Pickleball", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/phu-kien-pickleball-2_1719190265.jpg" }
];

const PickleballProductsSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mb-12 w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold !text-[#eb5322] uppercase inline-block relative">
          Sản phẩm Pickleball
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 !bg-[#eb5322] rounded-full"></span>
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pickleballCategories.map((category, index) => (
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
export default PickleballProductsSection; 