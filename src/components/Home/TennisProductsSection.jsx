import { Link } from 'react-router-dom';

const tennisCategories = [
  { name: "Vợt Tennis", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/bvot-tennis.jpg" },
  { name: "Giày Tennis", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/b-gay-tennis.jpg" },
  { name: "Balo Tennis", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/b-balo-tennis.jpg" },
  { name: "Túi Tennis", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/b-tui-tennis.jpg" },
  { name: "Váy Tennis", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/chan-vay-tennis.jpg" },
  { name: "Áo Tennis", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/ao-tennis_1.jpg" },
  { name: "Quần Tennis", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/quan-tennis.jpg" },
  { name: "Cước Tennis", image: "https://cdn.shopvnb.com/img/400x400/uploads/danh_muc/thumb/cuoc-tennis.jpg" }
];

const TennisProductsSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mb-12 w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold !text-[#eb5322] uppercase inline-block relative">
          Sản phẩm Tennis
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 !bg-[#eb5322] rounded-full"></span>
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tennisCategories.map((category, index) => (
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

export default TennisProductsSection; 