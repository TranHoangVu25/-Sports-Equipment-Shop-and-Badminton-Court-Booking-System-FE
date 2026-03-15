import {
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useEffect, useState } from 'react';

const bannerImages = [
  "https://cdn.shopvnb.com/img/1920x640/uploads/slider/1000z-launch-website-banner_1695177885.webp",
  "https://cdn.shopvnb.com/img/1920x640/uploads/slider/grpht-thrttl_1759089897.webp",
  "https://cdn.shopvnb.com/img/1920x640/uploads/slider/62-1-_1764612898.webp",
  "https://cdn.shopvnb.com/img/1920x640/uploads/slider/vnb_1772396342.webp",
  "https://cdn.shopvnb.com/img/1920x640/uploads/slider/ynx-eclp-banner_1695178004.webp"
];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 group">
      {/* Slider Images */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-[200px] sm:h-[300px] md:h-[450px] lg:h-[640px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {bannerImages.map((src, index) => (
          <div key={index} className="w-full flex-shrink-0 h-full">
            <img 
              src={src} 
              alt={`Banner ${index + 1}`} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://via.placeholder.com/1920x640.png?text=Banner+Image+Not+Found" }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-none"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-none"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all border-none cursor-pointer ${
              index === currentIndex ? "bg-[#eb5322] w-8" : "bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider; 