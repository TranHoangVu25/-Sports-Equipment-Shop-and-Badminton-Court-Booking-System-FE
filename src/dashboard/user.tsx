import React, { useState, useEffect } from "react";
import { MainLayout } from "./layouts/main-layout"; 

import { 
  Users, 
  UserPlus, 
  UserX, 
  Search, 
  Plus,
  Eye,
  EyeOff,
  Edit,
  Ban,
  Unlock,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Mail,
  Lock,
  User as UserIcon,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ShoppingCart
} from "lucide-react";

// --- Toast Notification Component ---
const ToastNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-emerald-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle : XCircle;
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className={`fixed top-4 right-4 z-[60] flex items-center p-4 mb-4 rounded-lg border shadow-lg transform transition-all duration-500 ease-in-out animate-in slide-in-from-top-5 ${bgColor}`}>
      <Icon className={`w-5 h-5 mr-3 ${iconColor}`} />
      <div className={`text-sm font-medium ${textColor}`}>{message}</div>
      <button onClick={onClose} className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${textColor} hover:bg-white/50 transition-colors border-none cursor-pointer`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const UserDashBoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Tìm kiếm và Lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State Thống kê (từ API)
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    lockedUsers: 0,
  });

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);

  // View details modal
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [isViewLoading, setIsViewLoading] = useState(false); 

  // Block confirm modal
  const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State quản lý ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toast Notification State
  const [notification, setNotification] = useState(null);

  // --- FORM STATE & VALIDATION ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Người dùng",
    password: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isDetailLoading, setIsDetailLoading] = useState(false); 

  // --- LẤY TOKEN GẮN VÀO HEADER ---
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  // --- KẾT NỐI API BAN ĐẦU ---
  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  // Xử lý Lọc dữ liệu trên UI
  const filteredUsers = users.filter(user => {
    const matchRole = roleFilter === "Tất cả" || user.role === roleFilter;
    const matchStatus = statusFilter === "Tất cả" || user.status === statusFilter;
    return matchRole && matchStatus;
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset trang về 1 khi đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter, searchTerm, itemsPerPage]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // FETCH STATS TỪ API
  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8086/api/v1/users/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 0 && data.result) {
          setDashboardStats({
            totalUsers: data.result.totalUsers || 0,
            newUsers: data.result.newUsers || 0,
            lockedUsers: data.result.lockedUsers || 0,
          });
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
    }
  };

  // FETCH USERS TỪ API CÓ SEARCH THEO TÊN VÀ TÙY CHỌN HIỂN THỊ LOADING UI
  const fetchUsers = async (searchQuery = "", showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      const url = searchQuery 
        ? `http://localhost:8086/api/v1/users?userName=${encodeURIComponent(searchQuery)}`
        : `http://localhost:8086/api/v1/users`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
      });

      if (!response.ok) {
        throw new Error("Tải danh sách người dùng thất bại");
      }

      const data = await response.json();

      if (data.code === 0 && Array.isArray(data.result)) {
        const mappedUsers = data.result.map(user => ({
          id: user.id.toString(),
          username: user.fullName || "Người dùng ẩn danh",
          email: user.email,
          role: user.role === "admin" ? "Quản trị viên" : "Người dùng", 
          status: user.lockedAt ? "Bị khóa" : "Hoạt động", 
          isLocked: !!user.lockedAt,
          joinDate: formatDate(user.createdAt),
          lastLogin: user.lastSignInAt ? formatDate(user.lastSignInAt) : "Chưa từng",
          avatarColor: getRandomColor(user.id),
          initials: getInitials(user.fullName || user.email),
          phone: user.phoneNumber,
          ordersCount: 0, 
          totalSpent: 0
        }));
        setUsers(mappedUsers);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải người dùng:", err);
      setUsers([]);
      setError(null);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Xử lý Tìm kiếm
  const handleSearch = () => {
    fetchUsers(searchTerm);
  };

  const handleKeyDownSearch = (e) => {
    if (e.key === 'Enter') {
      fetchUsers(searchTerm);
    }
  };

  // Làm mới tất cả cài đặt
  const handleRefresh = () => {
    setSearchTerm("");
    setRoleFilter("Tất cả");
    setStatusFilter("Tất cả");
    setCurrentPage(1);
    fetchUsers("", true);
    fetchStats();
  };

  // Fetch detail for View Modal
  const fetchUserDetailForView = async (user) => {
    setIsViewLoading(true);
    setViewUser({
      ...user,
      orders: [],
      ordersCount: 0,
      totalSpent: 0
    }); 
    
    try {
      const response = await fetch(`http://localhost:8086/api/v1/users/detail/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 0 && data.result) {
          const uInfo = data.result.userInfo || {};
          
          setViewUser(prev => ({
              ...prev,
              email: uInfo.email,
              phone: uInfo.phoneNumber, 
              joinDate: formatDate(uInfo.createdAt),
              lastLogin: uInfo.lastSignInAt ? formatDate(uInfo.lastSignInAt) : "Chưa từng",
              orders: data.result.orders || [],
              ordersCount: data.result.totalOrders || 0,
              totalSpent: data.result.totalAmount || 0
          }));
        }
      }
    } catch (error) {
        console.error("Lỗi khi tải chi tiết người dùng:", error);
    } finally {
        setIsViewLoading(false);
    }
  };

  // --- HELPER FUNCTIONS ---
  const formatDate = (isoString) => {
    if (!isoString || isoString === "null") return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getRandomColor = (id) => {
    const colors = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-orange-500", "bg-teal-500"];
    return colors[id % colors.length] || "bg-blue-500";
  };

  const formatVND = (amount) => {
    if (amount === undefined || amount === null) return "0 VNĐ";
    return amount.toLocaleString("vi-VN") + " VNĐ";
  };

  const translateOrderStatus = (status) => {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === 'success') return <span className="text-emerald-600 font-medium">Thành công</span>;
    if (s === 'pending') return <span className="text-orange-500 font-medium">Chờ xử lý</span>;
    if (s === 'processing') return <span className="text-blue-500 font-medium">Đang xử lý</span>;
    if (s === 'shipped') return <span className="text-indigo-500 font-medium">Đang giao</span>;
    if (s === 'delivered') return <span className="text-emerald-600 font-medium">Đã giao</span>;
    if (s.includes('hủy') || s === 'cancelled' || s === 'failed' || s === 'failure') return <span className="text-red-600 font-medium">Thất bại/Hủy</span>;
    return <span className="text-gray-600 font-medium">{status}</span>;
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = (isEdit = false) => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên";
    if (!formData.email.trim()) {
        errors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email không hợp lệ";
    }
    
    if (!isEdit) {
        if (!formData.password) errors.password = "Vui lòng nhập mật khẩu";
        if (formData.password && formData.password.length < 6) errors.password = "Mật khẩu tối thiểu 6 ký tự";
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    } else {
        if (formData.password) {
            if (formData.password.length < 6) errors.password = "Mật khẩu tối thiểu 6 ký tự";
            if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveUser = async () => {
    const isEdit = !!selectedUser;
    if (validateForm(isEdit)) {
        setIsDetailLoading(true);
        try {
            if (!isEdit) {
                // CREATE USER
                const payload = {
                    email: formData.email,
                    fullName: formData.fullName,
                    encryptedPassword: formData.password,
                    role: formData.role === "Người dùng" ? "customer" : "admin"
                };

                const response = await fetch("http://localhost:8086/api/v1/users/create-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeader()
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                
                if (response.ok && data.code === 0) {
                    showNotification("Thêm người dùng thành công!", "success");
                    setIsAddUserModalOpen(false);
                    fetchStats();
                    fetchUsers(searchTerm, false); // Fetch ngầm không giật màn hình
                } else {
                    showNotification(`Thất bại: ${data.message || "Lỗi không xác định"}`, "error");
                }
            } else {
                // UPDATE USER
                const payload = {
                    email: formData.email,
                    fullName: formData.fullName,
                    role: formData.role === "Người dùng" ? "customer" : "admin"
                };
                
                if (formData.password) {
                    payload.encryptedPassword = formData.password;
                }

                const response = await fetch(`http://localhost:8086/api/v1/users/${selectedUser.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeader()
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.code === 0) {
                    showNotification("Cập nhật người dùng thành công!", "success");
                    setIsEditUserModalOpen(false);
                    fetchStats();
                    fetchUsers(searchTerm, false); // Fetch ngầm không giật màn hình
                } else {
                    showNotification(`Cập nhật thất bại: ${data.message || "Lỗi không xác định"}`, "error");
                }
            }
        } catch (error) {
            console.error("Error saving user:", error);
            showNotification("Đã xảy ra lỗi khi lưu thông tin.", "error");
        } finally {
            setIsDetailLoading(false);
        }
    }
  };

  const handleOpenAddModal = () => {
      setFormData({
        fullName: "",
        email: "",
        role: "Người dùng",
        password: "",
        confirmPassword: ""
      });
      setFormErrors({});
      setIsAddUserModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
      setSelectedUser(user);
      setFormData({
        fullName: user.username,
        email: user.email,
        role: user.role === "Người dùng" ? "Người dùng" : "Quản trị viên",
        password: "",
        confirmPassword: ""
      });
      setFormErrors({});
      setIsEditUserModalOpen(true);
  };

  // CHUẨN BỊ STATS RENDER TỪ API
  const stats = [
    {
      title: "Tổng người dùng",
      value: dashboardStats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Người dùng mới",
      value: dashboardStats.newUsers.toLocaleString(), 
      icon: UserPlus,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Tài khoản bị khóa",
      value: dashboardStats.lockedUsers.toLocaleString(),
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const handleToggleLockStatus = async () => {
    if (!selectedUser) {
      setIsBlockConfirmOpen(false);
      return;
    }
    
    const isUnlocking = selectedUser.isLocked;
    const endpoint = isUnlocking ? 'unlock' : 'lock';

    try {
      const response = await fetch(`http://localhost:8086/api/v1/users/${endpoint}/${selectedUser.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        },
      });

      const data = await response.json();

      if (response.ok && data.code === 0) {
         showNotification(`${isUnlocking ? 'Mở khóa' : 'Khóa'} tài khoản thành công!`, "success");
         fetchStats();
         fetchUsers(searchTerm, false); // Truyền showLoader = false để fetch ngầm
      } else {
         showNotification(`Không thể ${isUnlocking ? 'mở khóa' : 'khóa'}: ${data.message || "Lỗi hệ thống"}`, "error");
      }
    } catch (error) {
      console.error("Error toggling lock status:", error);
      showNotification("Xảy ra lỗi khi gọi hệ thống.", "error");
    } finally {
      setIsBlockConfirmOpen(false);
      setSelectedUser(null);
    }
  };

  const openViewModal = (user) => {
    setIsViewUserModalOpen(true);
    fetchUserDetailForView(user);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans w-full">
        {/* Đã gỡ bỏ giới hạn max-w-7xl mx-auto để trải rộng ra 2 bên */}
        <div className="space-y-6 relative p-4 md:p-6 w-full">
          
          {/* Toast Notification */}
          {notification && (
            <ToastNotification 
              message={notification.message} 
              type={notification.type} 
              onClose={() => setNotification(null)} 
            />
          )}

          {/* 1. Page Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản và quyền truy cập của hệ thống.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow transition-all cursor-pointer border-none"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm Người Dùng
            </button>
          </div>
        </div>

        {/* 2. Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-indigo-100 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* 3. Filters & Search */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-5 justify-between">
              
              {/* Search */}
              <div className="flex-1 max-w-lg">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Tìm kiếm</label>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDownSearch}
                    placeholder="Tìm kiếm theo tên..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-40">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Vai trò</label>
                  <div className="relative">
                      <select 
                        value={roleFilter} 
                        onChange={(e) => setRoleFilter(e.target.value)} 
                        className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none"
                      >
                        <option value="Tất cả">Tất cả</option>
                        <option value="Quản trị viên">Quản trị viên</option>
                        <option value="Người dùng">Người dùng</option>
                      </select>
                  </div>
                </div>

                <div className="w-full sm:w-40">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Trạng thái</label>
                  <div className="relative">
                      <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)} 
                        className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none"
                      >
                        <option value="Tất cả">Tất cả</option>
                        <option value="Hoạt động">Hoạt động</option>
                        <option value="Bị khóa">Bị khóa</option>
                      </select>
                  </div>
                </div>
                
                <div className="flex items-end gap-2">
                  <button 
                    onClick={handleSearch}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm h-[42px] border-none cursor-pointer"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Tìm kiếm
                  </button>
                  <button 
                    onClick={handleRefresh}
                    className="px-3 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 rounded-lg text-sm font-medium flex items-center transition-colors h-[42px] cursor-pointer" 
                    title="Làm mới cài đặt"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Data Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px] flex flex-col">
              {/* Table Header */}
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-800">Danh sách người dùng</h3>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 border border-gray-200 rounded shadow-sm">
                          Tổng số: {filteredUsers.length}
                      </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-gray-500">Hiển thị:</span>
                      <select 
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 shadow-sm cursor-pointer outline-none"
                      >
                          <option value={10}>10</option>
                          <option value={15}>15</option>
                          <option value={20}>20</option>
                      </select>
                      <span className="text-gray-500">/ trang</span>
                  </div>
              </div>
            
            <div className="overflow-x-auto flex-1">
              {loading ? (
                  <div className="flex flex-col items-center justify-center h-64">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                      <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
                  </div>
              ) : (
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-gray-700 font-bold text-xs uppercase border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 w-16 text-center">STT</th>
                    <th className="px-6 py-4">Thông tin</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Vai trò</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Ngày tham gia</th>
                    <th className="px-6 py-4">Đăng nhập lần cuối</th>
                    <th className="px-6 py-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.map((user, index) => (
                      <tr key={index} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="px-6 py-4 text-center font-medium text-gray-400">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4">
                              <div>
                                  <div className="font-bold text-gray-900 text-base">{user.username}</div>
                                  <div className="text-xs text-gray-400 font-mono mt-0.5">ID: {user.id}</div>
                              </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 font-medium">
                              {user.email}
                          </td>
                          <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${
                                  user.role === 'Quản trị viên' 
                                  ? 'bg-red-50 text-red-700 border-red-100' 
                                  : 'bg-purple-50 text-purple-700 border-purple-100'
                              }`}>
                                  {user.role}
                              </span>
                          </td>
                          <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${
                                  user.status === 'Hoạt động' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                  : 'bg-gray-100 text-gray-600 border-gray-200'
                              }`}>
                                  {user.status}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                              <div className="text-sm">{user.joinDate.split(' ')[0]}</div>
                              <div className="text-xs text-gray-400">{user.joinDate.split(' ').slice(1).join(' ')}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                              {user.lastLogin !== "Chưa từng" ? (
                                  <>
                                      <div className="text-sm">{user.lastLogin.split(' ')[0]}</div>
                                      <div className="text-xs text-gray-400">{user.lastLogin.split(' ').slice(1).join(' ')}</div>
                                  </>
                              ) : (
                                  <span className="text-gray-400 text-xs italic">Chưa từng</span>
                              )}
                          </td>
                          <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                  <button 
                                    onClick={() => handleOpenEditModal(user)}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:shadow-sm transition-all border-none cursor-pointer" 
                                    title="Sửa thông tin"
                                  >
                                      <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => openViewModal(user)}
                                    className="p-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer border-none"
                                    title="Xem chi tiết"
                                  >
                                      <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsBlockConfirmOpen(true);
                                    }}
                                    className={`p-2 rounded-lg hover:shadow-sm transition-all border-none cursor-pointer ${
                                      user.isLocked 
                                        ? "bg-green-50 text-green-600 hover:bg-green-100" 
                                        : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                    }`}
                                    title={user.isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                                  >
                                      {user.isLocked ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                  </button>
                              </div>
                          </td>
                      </tr>
                  ))}
                </tbody>
              </table>
              )}
              
              {!loading && filteredUsers.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Không tìm thấy người dùng</h3>
                  </div>
              )}
            </div>

            {/* Footer Pagination */}
            <div className="p-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                    <span>Trang <span className="font-semibold text-gray-900">{currentPage}</span> / <span className="font-semibold text-gray-900">{totalPages}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center rounded-md bg-indigo-600 text-white font-medium shadow-sm transition-colors">{currentPage}</span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
          </div>

          {/* --- ADD USER MODAL --- */}
          {isAddUserModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                  <h3 className="text-lg font-bold text-gray-900">Thêm Người Dùng</h3>
                  <button 
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto bg-white flex-1 scrollbar-thin">
                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Họ và tên <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          type="text" 
                          placeholder="Nhập họ tên" 
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.fullName ? 'border-red-300' : 'border-gray-200'}`} 
                        />
                      </div>
                      {formErrors.fullName && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.fullName}</p>}
                   </div>

                   <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Email <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          type="email" 
                          placeholder="Nhập email" 
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.email ? 'border-red-300' : 'border-gray-200'}`} 
                        />
                      </div>
                      {formErrors.email && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.email}</p>}
                   </div>

                   <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Vai trò</label>
                      <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer">
                        <option value="Người dùng">Người dùng</option>
                        <option value="Quản trị viên">Quản trị viên</option>
                      </select>
                   </div>

                   <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Mật khẩu <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.password ? 'border-red-300' : 'border-gray-200'}`} 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formErrors.password && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.password}</p>}
                   </div>

                   <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••" 
                          className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`} 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.confirmPassword}</p>}
                   </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white shrink-0">
                  <button 
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer border-none"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSaveUser}
                    disabled={isDetailLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                  >
                    {isDetailLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2" />}
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- EDIT USER MODAL --- */}
          {isEditUserModalOpen && selectedUser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                  <h3 className="text-lg font-bold text-gray-900">Cập nhật Người dùng</h3>
                  <button 
                    onClick={() => setIsEditUserModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto bg-white flex-1 scrollbar-thin">
                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Họ và tên <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          type="text" 
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.fullName ? 'border-red-300' : 'border-gray-200'}`} 
                        />
                      </div>
                      {formErrors.fullName && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.fullName}</p>}
                   </div>

                   <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Email <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          type="email" 
                          className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.email ? 'border-red-300' : 'border-gray-200'}`} 
                        />
                      </div>
                      {formErrors.email && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.email}</p>}
                   </div>

                   <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Vai trò</label>
                      <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer">
                        <option value="Quản trị viên">Quản trị viên</option>
                        <option value="Người dùng">Người dùng</option>
                      </select>
                   </div>

                   <div className="col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Mật khẩu mới (Tùy chọn)</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          type={showPassword ? "text" : "password"}
                          placeholder="Bỏ trống nếu không muốn đổi" 
                          className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.password ? 'border-red-300' : 'border-gray-200'}`} 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formErrors.password && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.password}</p>}
                   </div>
                   
                   {formData.password && (
                      <div className="col-span-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Xác nhận mật khẩu mới <span className="text-red-500">*</span></label>
                          <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Nhập lại mật khẩu" 
                              className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`} 
                          />
                          <button 
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none bg-transparent border-none cursor-pointer"
                          >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          </div>
                          {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.confirmPassword}</p>}
                      </div>
                   )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white shrink-0">
                  <button 
                    onClick={() => setIsEditUserModalOpen(false)}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer border-none"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSaveUser}
                    disabled={isDetailLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
                  >
                    {isDetailLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2" />}
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- BLOCK/UNLOCK USER MODAL --- */}
          {isBlockConfirmOpen && selectedUser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedUser.isLocked ? "Xác nhận Mở khóa tài khoản" : "Xác nhận Khóa tài khoản"}
                  </h3>
                  <button 
                    onClick={() => {
                      setIsBlockConfirmOpen(false);
                      setSelectedUser(null);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="px-6 py-5 flex gap-4 items-start bg-white flex-1 overflow-y-auto">
                  <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${selectedUser.isLocked ? 'bg-green-50' : 'bg-red-50'}`}>
                    {selectedUser.isLocked ? <Unlock className="w-6 h-6 text-green-600" /> : <Lock className="w-6 h-6 text-red-600" />}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">
                      Bạn có chắc chắn muốn {selectedUser.isLocked ? "mở khóa" : "khóa"} tài khoản này?
                    </p>
                    <p>
                      Người dùng <span className="font-semibold">{selectedUser.username}</span> (ID: <span className="font-mono text-xs">{selectedUser.id}</span>) 
                      {selectedUser.isLocked ? " sẽ có thể đăng nhập trở lại." : " sẽ không thể đăng nhập."}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setIsBlockConfirmOpen(false);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors border-none"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      handleToggleLockStatus();
                    }}
                    className={`px-4 py-2 text-white rounded-lg text-sm cursor-pointer border-none transition-colors ${selectedUser.isLocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {selectedUser.isLocked ? "Mở khóa" : "Khóa tài khoản"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW USER DETAILS MODAL --- */}
          {isViewUserModalOpen && viewUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                  <h3 className="text-lg font-semibold text-gray-900">Chi tiết người dùng</h3>
                  <button
                  onClick={() => {
                      setIsViewUserModalOpen(false);
                      setViewUser(null);
                  }}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 bg-transparent border-none cursor-pointer"
                  >
                  <X className="w-5 h-5" />
                  </button>
              </div>

              {isViewLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center text-gray-500 flex-1">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                      <p>Đang tải thông tin...</p>
                  </div>
              ) : (
              <div className="p-6 bg-white space-y-5 flex-1 overflow-y-auto scrollbar-thin">
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${viewUser.avatarColor}`}>
                      <span className="font-bold text-lg">{viewUser.initials}</span>
                  </div>
                  <div className="flex-1">
                      <div className="text-lg font-semibold text-gray-900">{viewUser.username}</div>
                      <div className="text-sm text-gray-500 mt-1">{viewUser.email}</div>
                      {viewUser.phone && <div className="text-xs text-gray-400 mt-1">SĐT: {viewUser.phone}</div>}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                          <div className="text-xs text-gray-400">Số lượng đơn hàng</div>
                          <div className="font-medium text-gray-800">{viewUser.ordersCount}</div>
                      </div>
                      <div>
                          <div className="text-xs text-gray-400">Tổng chi tiêu</div>
                          <div className="font-medium text-gray-800">{formatVND(viewUser.totalSpent)}</div>
                      </div>
                      <div className="col-span-2 mt-1">
                          <div className="text-xs text-gray-400">Ngày tham gia</div>
                          <div className="font-medium text-gray-800">{viewUser.joinDate.split(' ')[0]}</div>
                      </div>
                      </div>
                  </div>
                  </div>

                  <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Các đơn hàng gần đây</h4>
                  <div className="space-y-3 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
                      {viewUser.orders && viewUser.orders.length > 0 ? (
                          viewUser.orders.slice(0, 5).map((order, idx) => (
                              <div key={idx} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                              <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <ShoppingCart className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm text-gray-800 font-medium truncate">
                                        Đơn hàng #{order.orderId.includes('_') ? order.orderId.split('_').pop() : order.orderId}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5 flex justify-between pr-2">
                                        <span>{formatDate(order.createdAt)}</span>
                                        <span className="font-semibold text-indigo-600">{formatVND(order.totalAmount)}</span>
                                    </div>
                                    <div className="text-[11px] mt-1">
                                        {translateOrderStatus(order.status)}
                                    </div>
                                  </div>
                              </div>
                              </div>
                          ))
                      ) : (
                          <p className="text-sm text-gray-500 italic">Không có đơn hàng nào.</p>
                      )}
                  </div>
                  </div>

              </div>
              )}

              <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                  <button
                  onClick={() => {
                      setIsViewUserModalOpen(false);
                      setViewUser(null);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer border-none"
                  >
                  Đóng
                  </button>
                  <button
                  onClick={() => {
                      setIsViewUserModalOpen(false);
                      setIsEditUserModalOpen(true);
                      handleOpenEditModal(viewUser); 
                  }}
                  disabled={isViewLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 border-none cursor-pointer"
                  >
                  Sửa
                  </button>
              </div>
              </div>
          </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};