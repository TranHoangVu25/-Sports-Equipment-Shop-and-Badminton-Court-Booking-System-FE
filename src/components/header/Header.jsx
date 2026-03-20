import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  Gamepad2,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  UserPlus,
  X,
  Minus,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// --- DATA MEGA MENU ---
const MAIN_CATEGORIES = [
  "Áo Cầu Lông", "Áo Pickleball", "Áo tennis", "Balo Cầu Lông", "Balo Pickleball", "Balo tennis",
  "Bóng Pickleball", "Chân Váy Tennis", "Ghế Massage", "Giày Cầu Lông", "Giày Cầu Lông Lining AYTM 067-1",
  "Giày Pickleball", "Giày Running", "Giày Tennis", "Máy Chạy Bộ, Xe Đạp Tập", "Máy Đan và Thảm Cầu Lông",
  "Máy Massage", "Mũ", "Phụ Kiện Cầu Lông", "Phụ kiện Pickleball", "Phụ kiện sưu tầm", "Phụ Kiện Tennis",
  "Quần Cầu Lông", "Quần Pickleball", "Quần tennis", "Túi Pickleball", "Túi Tennis", "Túi Vợt Cầu Lông",
  "Váy cầu lông", "Váy Pickleball", "Vợt Cầu Lông", "Vợt PickleBall", "Vợt Tennis"
];

const SUB_CATEGORIES = [
  "Áo Cầu Lông Alien Armour", "Áo cầu Lông Apacs", "Áo cầu lông Bubadu", "Áo cầu lông cá sấu tím", "Áo cầu lông cá sấu xanh", "Áo cầu lông CabaSports", "Áo cầu lông DonexPro", "Áo cầu lông Felet", "Áo cầu lông Flypower", "Áo cầu lông Kamito", "Áo cầu lông Kawasaki", "Áo cầu lông Kumpoo", "Áo cầu lông Kumpoo 9102 đỏ", "Áo cầu lông Kumpoo 9102 xanh", "Áo cầu lông Kumpoo 9108 đen", "Áo cầu lông Kumpoo KW 1004 đen nam chính hãng", "Áo cầu lông Kumpoo KW 9016 đen chính hãng", "Áo cầu lông Kumpoo KW 9016 trắng chính hãng", "Áo cầu lông Kumpoo KW 9103 cam nam chính hãng", "Áo cầu lông Kumpoo KW 9103 xanh nam chính hãng", "Áo cầu lông Kumpoo KW 9106 đen nam chính hãng", "Áo cầu lông Kumpoo KW 9106 đen nữ chính hãng", "Áo cầu lông Kumpoo KW 9106 đỏ nam chính hãng", "Áo cầu lông Kumpoo KW 9106 đỏ nữ chính hãng", "Áo cầu lông Kumpoo KW 9203 cam nữ chính hãng", "Áo cầu lông Kumpoo KW 9203 xanh nam chính hãng", "Áo cầu lông Lining", "Áo cầu lông Lining AAYR199-2 nam chính hãng", "Áo Cầu Lông Lining Nam cam - mã 750", "Áo Cầu Lông Lining Nữ cam - mã 750", "Áo cầu lông Lining nữ Đen - mã 724", "Áo Cầu Lông Lining Nữ vàng - mã 774", "Áo cầu lông Mizuno", "Áo cầu lông NN02 nam - Đen", "Áo cầu lông NN02 nam - Trắng", "Áo cầu lông NN02 nam - Vàng", "Áo cầu lông NN02 nam - Xanh dương", "Áo cầu lông NN02 nữ - Đen", "Áo cầu lông NN02 nữ - Trắng", "Áo cầu lông NN02 nữ - Vàng", "Áo cầu lông NN02 nữ - Xanh dương", "Áo cầu lông Paramout -  Xanh chuối", "Áo cầu lông Prokennex 200 nam - Vàng chính hãng", "Áo cầu lông Prokennex 20011 nam - Đỏ chính hãng", "Áo cầu lông Prokennex 20011 nữ - Đỏ chính hãng", "Áo cầu lông Prokennex 20012 nam - Xanhchính hãng", "Áo cầu lông Prokennex 20014 nam - Xanh đậm chính hãng", "Áo cầu lông Prokennex 20014 nữ - Xanh đậm chính hãng", "Áo cầu lông Taro", "Áo cầu lông training hình quả cầu nam - Đen", "Áo cầu lông training hình quả cầu nam - Trắng", "Áo cầu lông training hình quả cầu nam - Vàng", "Áo cầu lông training hình quả cầu nam - Xanh", "Áo cầu lông training hình quả cầu nữ - Trắng", "Áo cầu lông training hình quả cầu nữ - Vàng", "Áo cầu lông training hình quả cầu nữ - Xanh", "Áo cầu lông Victec", "Áo cầu lông Victec  AVT01 nam - Trắng", "Áo cầu lông Victec AVT01 nam - Vàng", "Áo cầu lông Victec AVT01 nam - Xanh", "Áo cầu lông Victec AVT01 nữ - Trắng", "Áo cầu lông Victec AVT01 nữ - Vàng", "Áo cầu lông Victec AVT01 nữ - Xanh", "Áo cầu lông Victec AVT02 nam - Đỏ", "Áo cầu lông Victec AVT02 nam - Trắng đen", "Áo cầu lông Victec AVT02 nam - Vàng", "Áo cầu lông Victec AVT02 nam - Xanh", "Áo cầu lông Victec AVT02 nữ - Đỏ", "Áo cầu lông Victec AVT02 nữ - Trắng đen", "Áo cầu lông Victec AVT02 nữ - Vàng", "Áo cầu lông Victec AVT02 nữ - Xanh", "Áo cầu lông Victec AVT03 nam - Trắng", "Áo cầu lông Victec AVT03 nam - Vàng", "Áo cầu lông Victec AVT03 nam - Xanh", "Áo cầu lông Victec AVT03 nữ - Trắng", "Áo cầu lông Victec AVT03 nữ - Vàng", "Áo cầu lông Victec AVT03 nữ - Xanh", "Áo cầu lông Victec AVT04 nam - Đỏ", "Áo cầu lông Victec AVT04 nam - Xanh ngọc", "Áo cầu lông Victec AVT04 nữ - Đỏ", "Áo cầu lông Victec AVT04 nữ - Xanh ngọc", "Áo cầu lông Victec AVT06 nam - Trắng", "Áo cầu lông Victec AVT06 nam - Xanh", "Áo cầu lông Victec AVT06 nam - Xanh nhạt", "Áo cầu lông Victor", "Áo Cầu Lông Victor 1030 Đen", "Áo Cầu Lông Victor 1030 Vàng", "Áo Cầu Lông Victor 1030 Xanh", "Áo cầu lông Victor nam Đen - mã 472", "Áo cầu lông Victor nam trắng - mã 494", "Áo cầu lông Victor nam trắng - mã 495", "Áo Cầu Lông Victor T-40043 Đen Chính Hãng", "Áo cầu lông Vina Authentic", "Áo cầu lông VNB", "Áo Cầu Lông VNB Nam cam - mã 772", "Áo Cầu Lông VNB Nam Đen - mã 769", "Áo Cầu Lông VNB Nam Đen - mã 772", "Áo Cầu Lông VNB Nam Đen - mã 785", "Áo Cầu Lông VNB Nam Đen - mã 786", "Áo Cầu Lông VNB Nam Đen - mã 800", "Áo Cầu Lông VNB Nam Đen - mã 801", "Áo Cầu Lông VNB Nam Đen - mã 804", "Áo Cầu Lông VNB Nam Đen - mã 806", "Áo cầu lông VNB nam Đỏ cam - mã 643", "Áo Cầu Lông VNB Nam trắng - mã 772", "Áo Cầu Lông VNB Nam trắng - mã 786", "Áo Cầu Lông VNB Nam trắng - mã 800", "Áo Cầu Lông VNB Nam trắng - mã 804", "Áo Cầu Lông VNB Nam vàng - mã 786", "Áo Cầu Lông VNB Nam xanh biển - mã 758", "Áo Cầu Lông VNB nữ trắng - mã 793", "Áo Cầu Lông VNB Nữ trắng - mã 804", "Áo Cầu Lông VNB Nữ vàng - mã 802", "Áo cầu lông VS", "Áo cầu lông Yonex", "Áo cầu lông Yonex 1923 nam - Đen", "Áo cầu lông Yonex A2022 nam - Xanh trắng", "Áo cầu lông Yonex A28 nam - Xanh đen", "Áo cầu lông Yonex A28 nam - Xanh dương", "Áo cầu lông Yonex A28 nữ - Xanh đen", "Áo cầu lông Yonex A28 nữ - Xanh dương", "Áo cầu lông Yonex AT26 nữ- Vàng", "Áo Cầu Lông Yonex Nam cam - mã 825", "Áo Cầu Lông Yonex Nam cam - mã 831", "Áo cầu lông Yonex nam Đen - mã 365", "Áo Cầu Lông Yonex Nam Đen - mã 813", "Áo Cầu Lông Yonex Nam Đen - mã 815", "Áo Cầu Lông Yonex Nam Đen - mã 831", "Áo Cầu Lông Yonex Nam Đen - mã 839", "Áo cầu lông yonex nam trắng - mã 059", "Áo Cầu Lông Yonex Nam trắng - mã 815", "Áo Cầu Lông Yonex Nam trắng - mã 831", "Áo Cầu Lông Yonex Nam vàng - mã 835", "Áo Cầu Lông Yonex Nam xanh - mã 825", "Áo Cầu Lông Yonex Nam xanh - mã 831", "Áo Cầu Lông Yonex Nam xanh - mã 833", "Áo cầu lông Yonex nam xanh biển - mã 371", "Áo Cầu Lông Yonex Nữ Đen - mã 787", "Áo Cầu Lông Yonex nữ Đen - mã 831", "Áo Cầu Lông Yonex Nữ trắng - mã 787", "Áo Cầu Lông Yonex Nữ trắng - mã 827", "Áo Cầu Lông Yonex Nữ trắng - mã 837", "Áo cầu lông Yonex RM 1005 - Xanh biển", "Áo cầu lông Yonex RM 1860 - Vàng chính hãng", "Áo cầu lông Yonex RM 1863 xám chính hãng", "Áo cầu lông Zata", "Áo Pickleball Adidas", "Áo Pickleball Babolat", "Áo Pickleball Joola", "Áo Pickleball Kaiwin", "Áo Pickleball Kamito", "Áo Pickleball Selkirk", "Áo Pickleball Skechers", "Áo tennis Adidas", "Áo tennis Babolat", "Áo tennis Donex Pro", "Áo tennis Nike", "Áo tennis Uniqlo", "Áo tennis Vina Authentic", "Áo tennis Wilson", "Áo thể thao Pebble Beach", "Áo thể thao SFD", "Balo cầu lông Adidas", "Balo cầu lông Adonex", "Balo cầu lông Apacs", "Balo cầu lông DonexPro", "Balo cầu lông Felet", "Balo cầu lông Flypower Intan", "Balo cầu lông Forza", "Balo cầu lông Kamito", "Balo cầu lông Kawasaki", "Balo cầu lông Kumpoo", "Balo cầu lông Kumpoo 712 đen chính hãng", "Balo cầu lông Kumpoo KB-928 đen xanh", "Balo cầu lông Lining", "Balo cầu lông Lotus", "Balo cầu lông Mizuno", "Balo cầu lông Sunbatta", "Balo cầu lông Taro", "Balo cầu lông Victor", "Balo cầu lông VNB", "Balo Cầu Lông Yonex", "Balo cầu lông Ywyat", "Balo Pickleball Arronax", "Balo Pickleball CRBN", "Balo Pickleball Joola", "Balo Pickleball Selkirk", "Balo Pickleball Wilson", "Balo Tennis Babolat", "Balo Tennis Babolat Backpack Pure Strike (753081-149)", "Balo Tennis Head", "Balo Tennis Prince", "Balo Tennis Wilson", "Balô Victor 012F", "Băng bó cơ", "Băng bó cơ tay Shiwei", "Băng chặn mồ hôi", "Băng chặn mồ hôi Tennis", "Băng chặn mồ hôi Victor One Piece - Chopper", "Băng chặn mồ hôi Victor One Piece - Franky", "Băng Chặn Mồ Hôi Victor SP-LZJG Chính Hãng", "Băng Chặn Mồ Hôi Victor SP-LZJQ Chính Hãng", "Băng Chặn Mồ Hôi Victor SPTUC 2408 Chính Hãng", "Băng cơ", "Băng dán nặng đầu vợt Yonex AC184 Made in Japan", "Băng Đầu Babolat Logo Headband chính hãng (1301-1001)", "Băng đầu cầu lông Lining AQAR028-2 chính hãng", "Băng đầu cầu lông Lining AQAR028-4 chính hãng", "Băng Gối Victor SP182 Đen Chính Hãng", "Băng keo thể thao Nano cuộn 2.5cm", "Băng keo thể thao Nano cuộn 3cm", "Băng keo thể thao Nano cuộn 5cm", "Băng trán cầu lông Lining AQAQ 062-1 chính hãng", "Băng trán cầu lông Lining AQAQ 062-2 chính hãng", "Băng trán cầu lông Lining AQAQ 062-3 chính hãng", "Băng trán cầu lông Lining AQAQ064-1 chính hãng", "Băng trán cầu lông Lining AQAQ064-2 chính hãng", "Băng trán cầu lông Lining AQAQ064-3 chính hãng", "Băng trán cầu lông Lining AQAQ064-4 chính hãng", "Banh Power Ball", "Bao điện thoại Kumpoo 811", "Bảo vệ khung vợt", "Bảo vệ khung vợt Pickleball", "Bình nước cầu lông", "Bình Nước Giữ Nhiệt TM Legend Chính Hãng", "Bình xịt", "Bình xịt khử mùi giày Ligpro (200ml)", "Bình xịt lạnh Starbalm (150ml)", "Bình xịt lạnh Taan", "Bình xịt nóng Starbalm (150ml)", "Bình xịt vệ sinh giày Ligpro (420ml)", "Bó Gối Kumpoo K281 Chính Hãng", "Bó Gối Kumpoo K381 Chính Hãng", "Bó gót chân Kawasaki", "Bộ quần áo cầu lông", "Bọc cán vợt", "Bọc khung vợt Victor PG-8823", "Bọc khung vợt VS", "Bọc khung vợt Yonex", "Bọc silicone cán vợt Pickleball Arronax", "Bóng Pickleball Bamboo", "Bóng Pickleball Diadem", "Bóng Pickleball Facolos", "Bóng Pickleball Franklin", "Bóng Pickleball Gamicy", "Bóng Pickleball Gamma", "Bóng Pickleball Joola", "Bóng Pickleball Kaiwin", "Bóng Pickleball Kamito", "Bóng Pickleball Lining", "Bóng Pickleball Passion", "Bóng Pickleball Prokennex", "Bóng Pickleball Spikopoll", "Bóng Pickleball Taro", "Bóng Tennis", "Bút", "Cao đỏ Starbalm (25g)", "Cao trắng Starbalm (25g)", "Chai lăn làm nóng Starbalm (75ml)", "Chân Váy Tennis Adicolor Classics", "Chân Váy Tennis Dry 500 Trắng", "Chân Váy Tennis SK Dry 100 Trắng", "Chân Váy Tennis SK Dry 900 Đen", "Chân Váy Tennis SK Soft 500 - Trắng", "Chì dán đầu vợt Pickleball Arronax tăng trọng lượng vợt", "Combo vợt cầu lông", "Cước đan vợt cầu lông", "Cước Tennis (dây đan vợt tennis)", "Đai đuôi tay cầm vợt cầu lông", "Đai Tập Yonex AC516 Chính Hãng", "Dầu xoa bóp Starbalm (50ml)", "Dây giày cầu lông", "Dây kháng lực", "Dây nhảy Felet Skipping Rope Chính Hãng", "Dây nhảy Freeway", "Dây Nhảy Yonex AC054", "Dây Nhảy Yonex AC514 Chính Hãng", "Đệm Massage thư giãn toàn thân Azaki M166 chính hãng", "Dép thể thao", "Dép Victor phiên bản OnePiece", "Đo sức căng mặt lưới cầu lông", "Gấu bông ôm cán vợt cầu lông loại 1", "Gấu bông ôm cán vợt cầu lông loại 2", "Gel làm lạnh Starbalm (100ml)", "Gel làm lạnh Starbalm (25ml)", "Gel làm nóng Starbalm (100ml)", "Gen vợt cầu lông", "Ghế massage Azaki", "Ghế massage Daikiosan", "Ghế massage Dr Care", "Ghế massage Elip", "Ghế massage Fuji", "Ghế Massage Giá Rẻ", "Ghế massage Kagawa", "Ghế massage Kingsport", "Ghế massage KLC", "Ghế massage Maxcare", "Ghế massage Ogawa", "Ghế massage Okasa", "Ghế massage OKIA", "Ghế massage Panasonic", "Ghế massage Queen Crown", "Ghế Massage Thương Gia", "Ghế massage Tokuyo", "Ghế massage Toshiko", "Ghế Massage Trung Cấp", "Ghế massage Xiaomi", "Giảm rung", "Giày Cầu Lông Adidas", "Giày cầu lông Adonex trắng xanh", "Giày cầu lông Apacs", "Giày Cầu Lông Asics", "Giày cầu lông Babolat", "Giày cầu lông Felet", "Giày Cầu Lông Fleet", "Giày Cầu Lông FlyPower", "Giày cầu lông Jogarbola", "Giày cầu lông Kamito", "Giày cầu lông Kason", "Giày cầu lông Kawasaki", "Giày cầu lông Kawasaki K318", "Giày Cầu Lông Kumpoo", "Giày cầu lông Lefus", "Giày cầu lông Lining", "Giày Cầu Lông Lotus", "Giày Cầu Lông Mizuno", "Giày Cầu Lông Promax", "Giày Cầu Lông Sunbatta", "Giày cầu lông Taro", "Giầy cầu lông Victor", "Giày cầu lông Victor 920 DC - Đỏ đen", "Giày cầu lông VNB", "Giày cầu lông VS", "Giày cầu lông Yonex", "Giày Cầu Lông Yonex Strider", "Giày cầu lông Yonex Super ACE Light Xám - Xanh chuối", "Giày chạy bộ Yonex Running SAFERUN 350 Đỏ chính hãng", "Giày chạy bộ Yonex Running SAFERUN 350 Trắng chính hãng", "Giày chạy bộ Yonex Running SAFERUN 350 Xanh Đen chính hãng", "Giày Pickleball Asics", "Giày Pickleball Diadem", "Giày Pickleball Jogarbola", "Giày Pickleball Joola", "Giày Pickleball Kamito", "Giày Pickleball Nike", "Giày Running Victor 701CR-2018 Đỏ", "Giày Running Victor 701CR-2018 Xanh", "Giày Running Yonex SHB 5003 Bella (Grey) chính hãng", "Giày Running Yonex SHB 5003 Bella (Lt grey) chính hãng", "Giày Running Yonex SHB 5003 Bella (Navy) chính hãng", "Giày Running Yonex SHB 5006 Lucy (Black) chính hãng", "Giày Running Yonex SHB 5007 Davis (Black) chính hãng", "Giày Running Yonex SHB 5007 Davis (Gray) chính hãng", "Giày Running Yonex SHB 5007 Davis (Khaki) chính hãng", "Giày Running Yonex SHR 8001 Walter - Black chính hãng", "Giày Running Yonex SHR 8001 Walter - Blue chính hãng", "Giày Running Yonex SHR 8001 Walter - Gray chính hãng", "Giày Running Yonex SHR 8001 Walter - Red chính hãng", "Giày Running Yonex SHR 8006 Verona - Black chính hãng", "Giày Running Yonex SHR 8006 Verona - Grey chính hãng", "Giày Running Yonex SHR 8006 Verona - Peach chính hãng", "Giày Running Yonex SHR 8006 Verona - Purple chính hãng", "Giày Running Yonex Trusmart 5013 Wade - Đen chính hãng", "Giày Running Yonex Trusmart 5013 Wade - Navy chính hãng", "Giày Tennis Adidas", "Giày Tennis Asics", "Giày Tennis Babolat", "Giày tennis Head", "Giày tennis Jogarbola", "Giày Tennis Mizuno", "Giày Tennis Nike", "Giày Tennis Prince", "Giày tennis Wilson", "Giày Tennis Yonex", "Kem xoa bóp Starbalm (200ml)", "Kéo cắt lưới Victor", "Kéo cắt lưới Yonex", "Khăn cầu lông Lining AMJM034-1 chính hãng", "Khăn cầu lông Yonex đỏ", "Khăn lau mồ hôi", "Khăn lau mồ hôi tennis", "Logo sơn vợt", "Lót cán vợt TAAN", "Lót giày cầu lông", "Lưới Cầu Lông CM - Sports 88", "Lưới cầu lông Hải Yến", "Lưới cầu lông Hải Yến loại ngắn", "Lưới Cầu Lông Kizuna", "Lưới cầu lông Taro TR24-01 (Xanh đen) chính hãng", "Lưới cầu lông Taro TR24-02 (Xanh đỏ) chính hãng", "Lưới cầu lông Yonex 139 chính hãng", "Lưới cầu lông Yonex 141 chính hãng", "Lưới cầu lông Yonex 142 chính hãng", "Lưới pickleball", "Ly Nước Yonex YOBC3056CR", "Máy (Súng) Massage Cầm Tay Azaki G188 chính hãng", "Máy chạy bộ Azaki Helios H8500 chính hãng", "Máy chạy bộ Azaki Hercules H6000 chính hãng", "Máy chạy bộ Azaki Mercury M1000 chính hãng", "Máy chạy bộ Azaki TH666 chính hãng", "Máy chạy bộ Azaki Zeus Z9100 chính hãng", "Máy Đan Vợt Cầu Lông", "Máy đẩy tinh chất Azelio chính hãng", "Máy Massage Bụng Azaki Slim Beauty A150 chính hãng", "Máy Massage Cổ Azaki N109 Plus chính hãng", "Máy Massage kéo giãn cột sống Azaki L110 chính hãng", "Máy Massage Lưng & Bụng Azaki W122 chính hãng", "Máy Massage Mắt Azaki E191 Plus chính hãng", "Miếng bọc đầu vợt TAAN", "Miếng dán cân bằng vợt tennis Babolat Balancer tape (710015)", "Miếng dán nhiệt Starbalm", "Móc khóa cầu lông", "Móc kính silicon", "Mũ Bucket Victoc OnePiece Limited", "Mũ cầu lông Victor Hello Kitty", "Mũ cầu lông Victor Hello Kitty VC-KT213 I Hồng", "Mũ lưỡi trai Victor OnePiece Limited", "Mực Sơn Vợt Cầu Lông", "Mực Sơn Vợt Tennis", "Nón Cầu Lông", "Nón tennis", "Nút giày Infinity", "Ống Cầu Lông Kawasaki King Kong 500", "Ống cầu lông nhựa Adidas Flieger TS5 Vàng - 3 trái", "Ống làm nóng Starbalm (50ml)", "Phấn hút mồ hôi", "PHỤ KIỆN VỢT", "Quả cầu lông", "Quấn cán cầu lông", "Quấn Cán Sunbatta", "Quấn cán vợt cầu lông GP3000-S", "Quấn cán vợt cầu lông Victor", "Quấn Cán Vợt Cầu Lông Yonex AC136-3EX", "Quấn Cán Vợt Cầu Lông Yonex AC138-3EX", "Quấn Cán Vợt Pickleball", "Quấn Cán Vợt Tennis", "Quần cầu lông Adidas", "QUẦN CẦU LÔNG ALIEN AMOUR", "Quần Cầu Lông Apacs", "Quần cầu lông Bubadu", "Quần cầu lông Butterfly 92021 - Đen đỏ", "Quần cầu lông butterfly 92021 - Đen trắng", "Quần cầu lông Butterfly 92021 - Đen xanh dương", "Quần cầu lông Butterfly92021 - Đen vàng", "Quần cầu lông CabaSports", "Quần cầu lông Donex Pro", "Quần cầu lông Felet", "Quần cầu lông flypower", "Quần cầu lông Kamito", "Quần cầu lông Kamito KMPS200240 nam đen chính hãng", "Quần cầu lông Kamito KMPS200240F nữ đen chính hãng", "Quần cầu lông Kawasaki", "Quần cầu lông Kumpoo", "Quần cầu lông Kumpoo 1129 đen chính hãng", "Quần cầu lông Kumpoo 701 đen chính hãng", "Quần cầu lông Lining", "Quần cầu lông lining nam logo nhũ vàng trắng - mã 036", "Quần cầu lông Lining nữ đen - Mã 059", "Quần cầu lông Mizuno", "Quần cầu lông Mizuno nữ Đen - mã 429", "Quần cầu lông nữ Revilo B1320", "Quần cầu lông QN02 nam - Đen đỏ", "Quần cầu lông QN02 nam - Đen vàng", "Quần cầu lông QN02 nam - Đen xanh chuối", "Quần cầu lông QN02 nam - Đen xanh dương", "Quần cầu lông QN02 nữ - Đen đỏ", "Quần cầu lông QN02 nữ - Đen vàng", "Quần cầu lông QN02 nữ - Đen xanh chuối", "Quần cầu lông QN02 nữ - Đen xanh dương", "Quần Cầu Lông SFD", "Quần cầu lông Taro", "Quần cầu lông Victec", "Quần cầu lông Victec 01 nam - Đen đỏ", "Quần cầu lông Victec 01 nam - Đen trắng", "Quần cầu lông Victec 01 nam - Đen vàng", "Quần cầu lông Victec 01 nam - Đen xanh", "Quần cầu lông Victec 01 nữ - Đen đỏ", "Quần cầu lông Victec 01 nữ - Đen vàng", "Quần cầu lông Victec 01 nữ - Đen xanh", "Quần cầu lông Victec 02 nam - Đen trắng", "Quần cầu lông Victec 02 nam - Đen vàng", "Quần cầu lông Victec 02 nam - Đen xanh", "Quần cầu lông Victec 02 nữ - Đen trắng", "Quần cầu lông Victec 02 nữ - Đen vàng", "Quần cầu lông Victec 02 nữ - Đen xanh", "Quần cầu lông Victor", "Quần cầu lông Victor 01 - Đen xanh", "Quần cầu lông Victor nam Đen - mã 431", "Quần cầu lông victor nam logo xanh trắng - mã 011", "Quần cầu lông Victor nam trắng - mã 371", "Quần cầu lông Victor nữ Đen - mã 371", "Quần cầu lông Victor nữ Đen - mã 372", "Quần cầu lông Victor nữ Đen - mã 431", "Quần cầu lông victor nữ logo xanh Đen - mã 011", "Quần cầu lông Victor nữ trắng - mã 371", "Quần cầu lông Victor nữ trắng - mã 433", "Quần cầu lông Vina Authentic", "Quần cầu lông VNB", "Quần cầu lông Yonex", "Quần Cầu Lông Yonex Nữ Đen - mã 351", "Quần cầu lông Yonex nữ Đen - mã 393", "Quần cầu lông Yonex nữ Đen - mã 396", "Quần cầu lông Yonex nữ trắng - mã 349", "Quấn lót cán Victor GR50", "Quần lửng cầu lông Yonex - Đen", "Quần Pickleball Joola", "Quần Pickleball Kaiwin", "Quần Pickleball Kamito", "Quần tennis Adidas", "Quần tennis Babolat", "Quần Tennis Donex Pro MSC-2030 Đen Phối Trắng Chính Hãng", "Quần tennis Nike", "Quần tennis Uniqlo", "Quần tennis Wilson", "Quạt Yonex hình hổ 2035CR", "Quạt Yonex hình quả cầu 1033CR", "Sơn vợt cầu lông Yonex", "Tạ Đeo Yonex AC515 Chính Hãng", "Tẩy mặt vợt Pickleball", "Thảm cầu lông Mini", "Thảm Sân Cầu Lông", "Túi", "Túi bọc đầu vợt Pickleball", "Túi bút", "Túi cầu lông DonexPro", "Túi Cầu Lông Flypower Xanh - Đen", "Túi cầu lông Kamito", "Túi cầu lông Kumpoo KB-163 Đen nâu", "Túi cầu lông Kumpoo KB-166 Đen", "Túi cầu lông Lining ABJE104-1000", "Túi cầu lông Lining ABJE104-2000", "Túi cầu lông Paramount trắng đỏ", "Túi cầu lông Sunbatta", "Túi cầu lông VNB", "Túi cầu lông VNB Bag2020", "Túi cầu lông Ywyat", "Túi đơn đựng vợt cầu lông", "Túi đơn đựng vợt Pickleball", "Túi đơn đựng vợt VNB 1002", "Túi đựng giày", "Túi đựng phụ kiện", "Túi Lining ABJT063-1 Đen Chính Hãng", "Túi Lining ABJT063-3 Cam Chính Hãng", "Túi nhung đựng vợt cầu lông VICTEC", "Túi nhung Yonex BA248", "Túi Pickleball CRBN", "Túi Pickleball Joola", "Túi Pickleball Kamito", "Túi Pickleball Proton", "Túi Pickleball Spikopoll", "Túi Pickleball Wilson", "Túi rút đựng vợt", "Túi rút Kamito - Đen logo vàng", "Túi rút Kamito - Đỏ logo trắng", "Túi Tennis Adidas", "Túi Tennis Babolat", "Túi Tennis Head", "Túi Tennis Nike", "Túi tennis Prince", "Túi Tennis Tecnifibre", "Túi Tennis Wilson", "Túi vợt cầu lông Adidas", "Túi vợt cầu lông Adonex", "Túi Vợt Cầu Lông Apacs", "Túi vợt cầu lông Felet", "Túi vợt cầu lông Flypower", "Túi vợt cầu lông Forza", "Túi vợt cầu lông FUKYMI", "Túi vợt cầu lông Kason", "Túi vợt cầu lông Kawasaki", "Túi vợt cầu lông Kawasaki 8308 đen đỏ chính hãng", "Túi vợt cầu lông Kawasaki 8683 chính hãng", "Túi vợt cầu lông Kumpoo", "Túi vợt cầu lông Lining", "Túi vợt cầu lông Lotus", "Túi vợt cầu lông Mizuno", "Túi vợt cầu lông Proace", "Túi vợt cầu lông Taro", "Túi vợt cầu lông Victec", "Túi vợt cầu lông Victor", "Túi vợt cầu lông Yonex", "Túi Xách Cầu Lông Yonex BA279", "Túi Xách Cầu Lông Yonex BA282", "Túi xách cầu lông Yonex BA304CR", "Váy cầu lông Donex Pro", "Váy Cầu Lông Donexpro ACS 827 Xanh", "Váy cầu lông Kamito", "Váy cầu lông Kumpoo 022 đen chính hãng", "Váy Cầu Lông Kumpoo 022 Trắng Chính Hãng", "Váy Cầu Lông Kumpoo 221 Trắng Chính Hãng", "Váy Cầu Lông Kumpoo 222 Trắng Chính Hãng", "Váy cầu lông Kumpoo 820 đen chính hãng", "Váy cầu lông Kumpoo 821 đen chính hãng", "Váy cầu lông Kumpoo 821 trắng chính hãng", "Váy cầu lông Lining", "Váy cầu lông Lining 019", "Váy cầu lông Lining 021 - Đen", "Váy cầu lông Lining 021 - Trắng", "Váy cầu lông Lining 031 - Đỏ", "Váy cầu lông Lining 031 - Xanh", "Váy cầu lông Lining 035 - Đen", "Váy cầu lông Lining 035 - Trắng", "Váy cầu lông Lining 1688 Đen", "Váy cầu lông Lining 1688 Hồng", "Váy cầu lông Lining 1688 Trắng", "Váy cầu lông Lining 1688 Xanh Nhạt", "Váy cầu lông Lining 38005 Xanh Dương", "Váy cầu lông Lining 8203 Đen", "Váy cầu lông Taro", "Váy cầu lông Victec", "Váy cầu lông Victec 01- Đen trắng", "Váy cầu lông Victec 02 - Đen trắng", "Váy cầu lông Victec 03 - Đen xanh đậm", "Váy cầu lông Victec 03 - Đen xanh nhạt", "Váy cầu lông Victec 1 - Đen đỏ", "Váy cầu lông Victec 1 - Đen trắng", "Váy cầu lông Victec 1 - Trắng", "Váy cầu lông Victor", "Váy cầu lông Victor 018", "Váy cầu lông Victor 9036 -  Đen", "Váy cầu lông Victor 9036 - Trắng", "Váy cầu lông Victor Hello Kitty K-KT207 A Trắng", "Váy cầu lông Yonex", "Váy cầu lông Yonex 020", "Váy Pickleball Kamito", "Váy tennis Babolat", "Viên khử mùi Yonex DeoBalls", "Vớ Cầu Lông", "Vớ Cầu Lông Kumpoo KSO G20 Đen Chính Hãng", "Vớ Cầu Lông Kumpoo KSO G75 Tím Chính Hãng", "Vớ Cầu Lông Kumpoo KSO G75 Trắng Chính Hãng", "Vớ cầu lông Yonex 145042 BCR ngắn - Trắng", "Vớ cầu lông Yonex 145042 BCR ngắn - Xanh chuối phối đen", "Vớ cầu lông Yonex 245062 BCR ngắn - Hồng", "Vớ cầu lông Yonex 245062 BCR ngắn - Trắng", "Vớ cầu lông Yonex 245062 BCR ngắn - Xanh chuối", "Vớ cầu lông Yonex cổ ngắn - Trắng xanh đen", "Vớ tennis", "Vòng tay cao su", "Vợt cầu lông Adidas", "Vợt Cầu Lông Adonex", "Vợt cầu lông Apacs", "Vợt Cầu Lông Ashaway", "Vợt cầu lông Babolat", "Vợt Cầu Lông Cũ", "Vợt cầu lông Felet", "Vợt Cầu Lông Fleet", "Vợt Cầu Lông FlyPower", "Vợt cầu lông Forza", "Vợt Cầu Lông FUKYMI", "Vợt Cầu Lông Giá Rẻ", "Vợt cầu lông Gosen", "Vợt cầu lông Ixe", "Vợt cầu lông Jogarbola", "Vợt Cầu Lông Kamito", "Vợt Cầu Lông Kawasaki", "Vợt cầu lông Kumpoo", "Vợt cầu lông Lining", "Vợt Cầu lông Lotus", "Vợt Cầu Lông Maxta", "Vợt Cầu Lông Mizuno", "Vợt Cầu Lông Paramount", "Vợt cầu lông PJB (Hàn Quốc)", "Vợt Cầu Lông Pro Kennex", "Vợt cầu lông Proace", "Vợt cầu lông Protech", "Vợt cầu lông Redson", "Vợt Cầu Lông Sunbatta", "Vợt cầu lông Taro", "Vợt Cầu Lông Tenway", "Vợt cầu lông The 3rd Game", "Vợt cầu lông Vicleo", "Vợt cầu lông Victec", "Vợt cầu lông Victor", "Vợt Cầu Lông VNB", "Vợt Cầu Lông VS", "Vợt cầu lông Yonex", "Vợt cầu lông Yuko Voltric LT chính hãng", "Vợt Phôi Cầu Lông", "Vợt Pickleball Adidas", "Vợt Pickleball Amakirk", "Vợt Pickleball Apacs", "Vợt Pickleball Arronax", "Vợt Pickleball Babolat", "Vợt Pickleball Bamboo", "Vợt Pickleball Beesoul", "Vợt Pickleball CRBN", "Vợt Pickleball Diadem", "Vợt PickleBall Facolos", "Vợt Pickleball Felet", "Vợt Pickleball Franklin", "Vợt Pickleball Gamicy", "Vợt Pickleball Gamma", "Vợt Pickleball Gearbox", "Vợt PickleBall Head", "Vợt Pickleball Jogarbola", "Vợt PickleBall Joola", "Vợt Pickleball Kaiwin", "Vợt Pickleball Kamito", "Vợt Pickleball Lining", "Vợt Pickleball Lotus", "Vợt Pickleball Niupipo", "Vợt Pickleball Osone", "Vợt Pickleball Passion", "Vợt Pickleball Progaja", "Vợt Pickleball Prokennex", "Vợt Pickleball Proton", "Vợt Pickleball Selkirk", "Vợt Pickleball Selkirk Amped Control - Epic", "Vợt Pickleball Selkirk Amped Control - Invikta", "Vợt Pickleball Spikopoll", "Vợt Pickleball Sypik", "Vợt Pickleball Taro", "Vợt Pickleball Vulcan", "Vợt Pickleball Weierfu", "Vợt Pickleball Wilson", "Vợt Tennis Babolat", "Vợt Tennis Head", "Vợt Tennis Prince", "Vợt Tennis Tecnifibre", "Vợt Tennis Wilson", "Vợt Tennis Yonex", "Xe đạp tập Azaki Apollo SB380 chính hãng", "Xe đạp tập Azaki Olympus SB450 chính hãng"
];

const Logo = () => (
  <div className="flex items-center space-x-2">
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 20 L40 60 L60 20 Z" fill="black" />
      <path d="M40 80 L60 40 L80 80 Z" fill="black" />
    </svg>
    <span className="font-extrabold text-2xl tracking-tighter !text-gray-900">VNB</span>
  </div>
);

const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Vợt cầu lông Yonex Astrox 22 Lite (BK/RD) chính hãng',
      size: '3F5',
      price: 2349000,
      quantity: 1,
      image: 'https://cdn.shopvnb.com/img/100x100/uploads/gallery/vot-cau-long-yonex-astrox-22-lite-bkrd-chinh-hang_1741200200.webp'
    },
    {
      id: 2,
      name: 'Giày cầu lông Yonex Velo 300 Chính Hãng - White/Black',
      size: '40.5',
      price: 679000,
      quantity: 1,
      image: 'https://cdn.shopvnb.com/img/100x100/uploads/gallery/giay-cau-long-yonex-velo-300-chinh-hang-white-black_1741200061.webp'
    }
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8085/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; 
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="!bg-white py-4 border-b border-gray-100 relative z-[1000]">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <Logo />
        </div>
        
        <div className="hidden lg:flex items-center space-x-6 text-sm font-medium !text-gray-700">
          <div className="flex items-center space-x-2">
            <Phone size={18} className="!text-[#eb5322]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 leading-none">HOTLINE:</span>
              <span className="!text-[#eb5322] font-bold">0977508430 | 0338000308</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer hover:!text-[#eb5322]">
            <MapPin size={18} className="!text-[#eb5322]" />
            <span className="font-bold uppercase text-[11px]">Hệ thống cửa hàng</span>
          </div>
        </div>

        <div className="flex-1 w-full md:w-auto max-w-md mx-auto md:mx-4 relative">
          <input 
            type="text" 
            placeholder="Tìm sản phẩm..." 
            className="!w-full !bg-gray-100 border-none rounded-sm py-2 px-4 pr-10 text-sm focus:outline-none placeholder:italic"
          />
          <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 !text-gray-400" />
        </div>
        
        <div className="flex items-center justify-center space-x-6">
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 transition-colors">
               <Gamepad2 size={20} className="!text-gray-600 group-hover:!text-[#eb5322]" />
            </div>
            <span className="text-[10px] uppercase font-semibold !text-gray-600 group-hover:!text-[#eb5322]">Tra cứu</span>
          </div>
          
          <div className="flex flex-col items-center cursor-pointer relative group">
            <div className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 transition-colors">
               <User size={20} className="!text-gray-600 group-hover:!text-[#eb5322]" />
            </div>
            <span className="text-[10px] uppercase font-semibold !text-gray-600 group-hover:!text-[#eb5322]">Tài khoản</span>

            <div className="hidden group-hover:block absolute top-full left-1/2 transform -translate-x-1/2 w-48 pt-2 z-[9999]">
              <div className="!bg-white border border-gray-200 shadow-2xl rounded-sm relative">
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 !bg-white border-t border-l border-gray-200 rotate-45 z-0"></div>
                <ul className="relative z-10 py-2 m-0 list-none !bg-white">
                  {isLoggedIn ? (
                    <>
                      <li>
                        <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] !no-underline transition-colors">
                          <User size={16} className="mr-3" />
                          Trang cá nhân
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] border-none !bg-transparent cursor-pointer font-sans transition-colors">
                          <LogOut size={16} className="mr-3" />
                          Thoát tài khoản
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/login" className="flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] !no-underline transition-colors border-b border-gray-50">
                          <LogIn size={16} className="mr-3" />
                          Đăng nhập
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="flex items-center px-4 py-2.5 text-sm !text-gray-700 hover:!bg-gray-50 hover:!text-[#eb5322] !no-underline transition-colors">
                          <UserPlus size={16} className="mr-3" />
                          Đăng ký ngay
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center cursor-pointer group relative">
            <div 
              onClick={() => navigate('/cart')}
              className="!bg-gray-100 p-2 rounded-full mb-1 group-hover:!bg-orange-50 relative"
            >
               <ShoppingCart size={20} className="!text-gray-600 group-hover:!text-[#eb5322]" />
               <span className="absolute -top-1 -right-1 !bg-[#eb5322] !text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">
                 {cartItems.length}
               </span>
            </div>
            <span className="text-[10px] uppercase font-semibold !text-gray-600 group-hover:!text-[#eb5322]">Giỏ hàng</span>

            <div className="hidden group-hover:block absolute top-full right-0 w-[320px] pt-2 z-[9999]">
              <div className="!bg-white border border-gray-200 shadow-2xl rounded-sm overflow-hidden">
                <div className="!bg-[#eb5322] !text-white text-[11px] font-bold px-3 py-2 uppercase">
                  Giỏ hàng
                </div>
                
                <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                  {cartItems.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-500 italic">Giỏ hàng trống</div>
                  ) : (
                    cartItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="p-3 flex gap-3 relative group/item hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 flex-shrink-0 border border-gray-100 p-1">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-medium !text-gray-800 line-clamp-2 leading-tight mb-1">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 mb-2">Size: {item.size}</p>
                          <div className="flex items-center border border-gray-200 rounded-sm w-fit">
                            <button className="px-1 border-r border-gray-200 hover:bg-gray-100"><Minus size={10} /></button>
                            <span className="px-2 text-[10px] font-bold">{item.quantity}</span>
                            <button className="px-1 border-l border-gray-200 hover:bg-gray-100"><Plus size={10} /></button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button className="!text-gray-400 hover:!text-red-500"><X size={14} /></button>
                          <span className="text-[11px] font-bold !text-[#eb5322] whitespace-nowrap">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-medium text-gray-600">Tổng tiền:</span>
                      <span className="text-[13px] font-bold !text-[#eb5322]">{formatPrice(totalPrice)}</span>
                    </div>
                    <button 
                      onClick={() => navigate('/cart')}
                      className="w-full !bg-[#eb5322] hover:!bg-[#d04316] !text-white text-[11px] font-bold py-2 rounded-sm uppercase transition-colors border-none cursor-pointer"
                    >
                      Đặt hàng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  const navItems = [
    { label: 'TRANG CHỦ', link: "/" },
    { label: 'SẢN PHẨM', hasDropdown: true, link: "#" },
    { label: 'SALE OFF', link: "#" },
    { label: 'TIN TỨC', link: "#" },
    { label: 'CHÍNH SÁCH NHƯỢNG QUYỀN', link: "#" },
    { label: 'HƯỚNG DẪN', hasDropdown: true, link: "#" },
    { label: 'GIỚI THIỆU', link: "#" },
    { label: 'LIÊN HỆ', link: "#" },
  ];

  const getSubItems = (mainCategory) => {
    return SUB_CATEGORIES.filter(sub => 
      sub.toLowerCase().includes(mainCategory.toLowerCase())
    ).slice(0, 6);
  };

  return (
    <nav className="!bg-[#eb5322] !text-white w-full sticky top-0 z-[90] relative">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center justify-center whitespace-nowrap m-0 p-0 list-none">
          {navItems.map((item, index) => (
            <li key={index} className="group static">
              <Link to={item.link} className="flex items-center px-5 py-4 text-[13px] font-bold !text-white hover:!bg-black/10 transition-colors !no-underline uppercase tracking-wider h-full">
                {item.label}
                {item.hasDropdown && <ChevronDown size={14} className="ml-1 opacity-70" />}
              </Link>

              {/* MEGA MENU CHO "SẢN PHẨM" - TRÀN VIỀN 100% & GIẢM CHIỀU CAO */}
              {item.label === 'SẢN PHẨM' && (
                <div className="hidden group-hover:block absolute top-full left-0 w-full !bg-white shadow-2xl border-t border-gray-100 z-[9999]">
                  <div className="w-full px-8 py-6 grid grid-cols-5 gap-x-8 gap-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    {MAIN_CATEGORIES.map((main) => (
                      <div key={main} className="space-y-3">
                        <h3 className="text-[16px] font-bold !text-gray-900 uppercase border-b border-gray-100 pb-2 flex items-center group/title cursor-pointer hover:!text-[#eb5322] transition-colors tracking-tight whitespace-normal break-words leading-snug">
                          {main}
                          <ChevronRight size={16} className="ml-1 opacity-0 group-hover/title:opacity-100 -translate-x-2 group-hover/title:translate-x-0 transition-all text-[#eb5322]" />
                        </h3>
                        <ul className="list-none p-0 m-0 space-y-2">
                          {getSubItems(main).map((sub) => (
                            <li key={sub}>
                              <Link to="#" className="text-[13px] !text-gray-600 hover:!text-[#eb5322] hover:translate-x-1.5 transition-all !no-underline block leading-snug whitespace-normal break-words">
                                {sub}
                              </Link>
                            </li>
                          ))}
                          {SUB_CATEGORIES.filter(s => s.toLowerCase().includes(main.toLowerCase())).length > 6 && (
                            <li>
                              <Link to="#" className="text-[12px] font-medium italic !text-[#eb5322] hover:underline !no-underline block mt-1.5">
                                Xem thêm...
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const Header = () => (
  <header className="w-full relative z-[1000]">
    <TopBar />
    <Navigation />
  </header>
);

export default Header;