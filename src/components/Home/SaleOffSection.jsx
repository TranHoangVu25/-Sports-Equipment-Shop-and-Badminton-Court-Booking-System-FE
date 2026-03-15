import { Link } from 'react-router-dom';

const SaleOffSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mb-12">
      {/* Tiêu đề */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold !text-[#eb5322] uppercase inline-block relative">
          Sale off
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 !bg-[#eb5322] rounded-full"></span>
        </h2>
      </div>

      {/* 3 Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="#" className="block overflow-hidden rounded-lg shadow-sm hover:opacity-90 transition-opacity">
          <img 
            src="https://cdn.shopvnb.com/img/406x136/uploads/danh_muc/3_2.webp" 
            alt="Sale Off 1" 
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
          />
        </Link>
        <Link to="#" className="block overflow-hidden rounded-lg shadow-sm hover:opacity-90 transition-opacity">
          <img 
            src="https://cdn.shopvnb.com/img/406x136/uploads/danh_muc/2.webp" 
            alt="Sale Off 2" 
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
          />
        </Link>
        <Link to="#" className="block overflow-hidden rounded-lg shadow-sm hover:opacity-90 transition-opacity">
          <img 
            src="https://cdn.shopvnb.com/img/406x136/uploads/danh_muc/1_3.webp" 
            alt="Sale Off 3" 
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" 
          />
        </Link>
      </div>
    </div>
  );
};

export default SaleOffSection; 