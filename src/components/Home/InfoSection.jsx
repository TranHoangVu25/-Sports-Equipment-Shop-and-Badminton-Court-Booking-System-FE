import {
    CreditCard,
    RefreshCw,
    ShieldCheck,
    Truck
} from 'lucide-react';

const InfoSection = () => {
  const infos = [
    {
      icon: <Truck size={32} className="!text-[#eb5322]" strokeWidth={1.5} />,
      title: "Vận chuyển TOÀN QUỐC",
      desc: "Thanh toán khi nhận hàng"
    },
    {
      icon: <ShieldCheck size={32} className="!text-[#eb5322]" strokeWidth={1.5} />,
      title: "Bảo đảm chất lượng",
      desc: "Sản phẩm bảo đảm chất lượng"
    },
    {
      icon: <CreditCard size={32} className="!text-[#eb5322]" strokeWidth={1.5} />,
      title: "Tiến hành THANH TOÁN",
      desc: "Với nhiều PHƯƠNG THỨC"
    },
    {
      icon: <RefreshCw size={32} className="!text-[#eb5322]" strokeWidth={1.5} />,
      title: "Đổi sản phẩm mới",
      desc: "nếu sản phẩm lỗi"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {infos.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <h4 className="text-gray-800 font-bold text-sm uppercase tracking-tight">{item.title}</h4>
              <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection; 