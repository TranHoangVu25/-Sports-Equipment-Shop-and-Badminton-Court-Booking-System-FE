import {
    MapPin,
    MessageCircle,
    ShoppingBag
} from 'lucide-react';

const FooterContent = () => {
  return (
    <footer className="!bg-[#222222] !text-gray-300 pt-16 pb-8 border-t-4 !border-[#eb5322] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="!text-white text-base font-bold uppercase mb-6 tracking-wide">Thông tin chung</h3>
            <div className="space-y-4 text-sm leading-relaxed">
              <p><span className="!text-[#eb5322] font-bold">VNB Sports</span> là hệ thống cửa hàng cầu lông, pickleball với hơn 80 chi nhánh trên toàn quốc, cung cấp sỉ và lẻ các mặt hàng dụng cụ cầu lông, pickleball từ phong trào tới chuyên nghiệp</p>
              <p><span className="!text-[#eb5322] font-bold">Với sứ mệnh:</span> "VNB cam kết mang đến những sản phẩm, dịch vụ chất lượng tốt nhất phục vụ cho người chơi thể thao để nâng cao sức khỏe của chính mình."</p>
              <p><span className="!text-[#eb5322] font-bold">Tầm nhìn:</span> "Trở thành nhà phân phối và sản xuất thể thao lớn nhất Việt Nam"</p>
            </div>
          </div>
          <div>
            <h3 className="!text-white text-base font-bold uppercase mb-6 tracking-wide">Thông tin liên hệ</h3>
            <div className="space-y-3 text-sm">
              <p><span className="font-bold !text-white">Hệ thống cửa hàng:</span> <span className="!text-[#eb5322]">1 Super Center, 5 shop Premium và 78 cửa hàng</span> trên toàn quốc</p>
              <p className="!text-[#eb5322] font-bold cursor-pointer hover:!underline mb-4 inline-block">Xem tất cả các cửa hàng VNB</p>
              <p><span className="font-bold !text-white">Hotline:</span> <span className="!text-[#eb5322]">0977508430 | 0338000308</span></p>
              <p><span className="font-bold !text-white">Email:</span> <span className="!text-[#eb5322]">info@shopvnb.com</span></p>
              <p><span className="font-bold !text-white">Hợp tác kinh doanh:</span> <span className="!text-[#eb5322]">0947342259 (Ms. Thảo)</span></p>
              <p><span className="font-bold !text-white">Hotline bán sỉ:</span> <span className="!text-[#eb5322]">0911195711 0911105211</span></p>
              <p><span className="font-bold !text-white">Nhượng quyền thương hiệu:</span> <span className="!text-[#eb5322]">0334.741.141 (Mr. Hậu)</span></p>
            </div>
          </div>
          <div>
            <h3 className="!text-white text-base font-bold uppercase mb-6 tracking-wide">Chính sách</h3>
            <ul className="space-y-3 text-sm">
              {[
                'Thông tin về vận chuyển và giao nhận', 'Chính sách đổi trả, hoàn tiền', 'Chính sách bảo hành',
                'Chính sách xử lý khiếu nại', 'Chính sách vận chuyển', 'Điều khoản sử dụng',
                'Chính Sách Bảo Mật Thông Tin', 'Chính sách nhượng quyền'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 mt-1 text-xs !text-gray-400">•</span>
                  <a href="#" className="!text-gray-300 hover:!text-[#eb5322] transition-colors !no-underline">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="!text-white text-base font-bold uppercase mb-6 tracking-wide">Hướng dẫn</h3>
            <ul className="space-y-3 text-sm">
              {[
                'Cách chọn vợt Pickleball dành cho người mới bắt đầu chơi', 'Hướng dẫn cách chọn vợt cầu lông cho người mới chơi',
                'Hướng dẫn thanh toán', 'Kiểm tra bảo hành', 'Kiểm tra đơn hàng', 'HƯỚNG DẪN MUA HÀNG'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="mr-2 mt-1 text-xs !text-gray-400">•</span>
                  <a href="#" className="!text-gray-300 hover:!text-[#eb5322] transition-colors !no-underline">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingActions = () => {
  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <button className="!appearance-none !bg-gray-800 !text-white px-4 py-3 !rounded-full shadow-lg flex items-center space-x-2 hover:!bg-gray-700 transition-colors !border !border-gray-600 focus:!outline-none">
          <ShoppingBag size={18} className="!text-[#eb5322]" />
          <span className="text-sm font-semibold">Xem giỏ hàng (0)</span>
        </button>
      </div>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        <button className="!appearance-none !bg-blue-500 !text-white p-3 !rounded-full shadow-lg hover:!bg-blue-600 transition-colors w-12 h-12 flex items-center justify-center relative group !border-none focus:!outline-none">
          <MessageCircle size={24} />
          <span className="absolute -top-8 right-0 !bg-gray-800 !text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Chat Zalo</span>
        </button>
        <button className="!appearance-none !bg-blue-500 !text-white px-5 py-2.5 !rounded-full shadow-lg flex items-center space-x-2 hover:!bg-blue-600 transition-colors !border-none focus:!outline-none">
          <MapPin size={18} />
          <span className="text-sm font-semibold">Hệ thống cửa hàng</span>
        </button>
      </div>
    </>
  );
};

// Main Footer Component xuất ra để dùng
const Footer = () => (
  <>
    <FooterContent />
    <FloatingActions />
  </>
);

export default Footer;