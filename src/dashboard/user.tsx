import React, { useState, useEffect } from "react";
import { MainLayout } from "./layouts/main-layout"; 

import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  Plus,
  Eye,
  EyeOff,
  Edit,
  Ban,
  Download,
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
  XCircle
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
      <button onClick={onClose} className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${textColor} hover:bg-white/50`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const UserDashBoard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    role: "User",
    status: "Active",
    password: "",
    confirmPassword: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isDetailLoading, setIsDetailLoading] = useState(false); 

  // --- API CONNECTION ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/users", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      if (data.code === 0 && Array.isArray(data.result)) {
        const mappedUsers = data.result.map(user => ({
          id: user.id.toString(),
          username: user.fullName || "Unnamed User",
          email: user.email,
          role: user.role === "customer" ? "USER" : "ADMIN", 
          status: user.lockedAt ? "FALSE" : "TRUE", 
          joinDate: formatDate(user.createdAt),
          lastLogin: user.lastSignInAt ? formatDate(user.lastSignInAt) : "Never",
          avatarColor: getRandomColor(user.id),
          initials: getInitials(user.fullName || user.email),
          ordersCount: user.signInCount || 0,
          totalSpent: (user.signInCount || 0) * 150000
        }));
        setUsers(mappedUsers);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detail for Edit
  const fetchUserDetail = async (userId) => {
    setIsDetailLoading(true);
    setFormErrors({});
    try {
      const response = await fetch(`https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/users/${userId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const u = data.result || data; 
        
        setFormData({
          fullName: u.fullName || "",
          email: u.email || "",
          role: u.role === "customer" ? "User" : "Admin",
          status: u.lockedAt ? "Inactive" : "Active",
          password: "", 
          confirmPassword: ""
        });
      } else {
        console.warn("Could not fetch detail, falling back to list data");
        // Fallback logic handled in handleOpenEditModal
      }
    } catch (error) {
      console.error("Error fetching user detail:", error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Fetch detail for View Modal
  const fetchUserDetailForView = async (user) => {
    setIsViewLoading(true);
    setViewUser(user); 
    
    try {
      const response = await fetch(`https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/users/${user.id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const u = data.result || data;
        
        // Merge detailed info into viewUser
        setViewUser(prev => ({
            ...prev,
            email: u.email,
            phone: u.phone, 
        }));
      }
    } catch (error) {
        console.error("Error fetching user detail for view:", error);
    } finally {
        setIsViewLoading(false);
    }
  };

  // --- HELPER FUNCTIONS ---
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit', hour12: true 
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
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "Email is invalid";
    }
    
    if (!isEdit) {
        if (!formData.password) errors.password = "Password is required";
        if (formData.password && formData.password.length < 6) errors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
    } else {
        if (formData.password) {
            if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
            if (formData.password !== formData.confirmPassword) errors.confirmPassword = "Passwords do not match";
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
                    role: formData.role === "User" ? "customer" : "admin"
                };

                const response = await fetch("https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/users/create-user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                
                if (response.ok && data.code === 0) {
                    showNotification("User created successfully!", "success");
                    setIsAddUserModalOpen(false);
                    fetchUsers(); 
                } else {
                    showNotification(`Failed to create user: ${data.message || "Unknown error"}`, "error");
                }
            } else {
                // UPDATE USER
                const payload = {
                    email: formData.email,
                    fullName: formData.fullName,
                    role: formData.role === "User" ? "customer" : "admin"
                };
                
                // Add password to payload only if changed
                if (formData.password) {
                    payload.encryptedPassword = formData.password;
                }

                const response = await fetch(`https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/users/${selectedUser.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.code === 0) {
                    showNotification("User updated successfully!", "success");
                    setIsEditUserModalOpen(false);
                    fetchUsers();
                } else {
                    showNotification(`Failed to update user: ${data.message || "Unknown error"}`, "error");
                }
            }
        } catch (error) {
            console.error("Error saving user:", error);
            showNotification("An error occurred while saving.", "error");
        } finally {
            setIsDetailLoading(false);
        }
    }
  };

  const handleOpenAddModal = () => {
      setFormData({
        fullName: "",
        email: "",
        role: "User",
        status: "Active",
        password: "",
        confirmPassword: ""
      });
      setFormErrors({});
      setIsAddUserModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
      setSelectedUser(user);
      // Pre-fill form with list data directly
      setFormData({
        fullName: user.username, // Using username from list as fullName
        email: user.email,
        role: user.role === "USER" ? "User" : "Admin",
        status: user.status === "TRUE" ? "Active" : "Inactive",
        password: "",
        confirmPassword: ""
      });
      setFormErrors({});
      setIsEditUserModalOpen(true);
  };

  // Stats Data
  const stats = [
    {
      title: "Total Users",
      value: users.length.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: users.filter(u => u.status === "TRUE").length.toLocaleString(),
      change: "+8%",
      trend: "up",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "New Users",
      value: "5", 
      change: "+15%",
      trend: "up",
      icon: UserPlus,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Blocked Users",
      value: users.filter(u => u.status === "FALSE").length.toLocaleString(),
      change: "-5%",
      trend: "down",
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const handleLockAccount = async () => {
    if (!selectedUser) {
      setIsBlockConfirmOpen(false);
      return;
    }
    
    try {
      const response = await fetch(`https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/users/lock/${selectedUser.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.code === 0) {
         showNotification("Account locked successfully!", "success");
         fetchUsers(); // Refresh list to get updated status
      } else {
         showNotification(`Failed to lock account: ${data.message || "Unknown error"}`, "error");
      }
    } catch (error) {
      console.error("Error locking user:", error);
      showNotification("An error occurred while locking the account.", "error");
    } finally {
      setIsBlockConfirmOpen(false);
      setSelectedUser(null);
    }
  };

  const openViewModal = (user) => {
    setIsViewUserModalOpen(true);
    fetchUserDetailForView(user);
  };

  const formatVND = (amount) => {
    return amount.toLocaleString("vi-VN") + " VNĐ";
  };

  return (
    <MainLayout>
      <div className="space-y-6 relative p-6">
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
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage user accounts and access permissions.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center transition-all shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-indigo-100 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 3. Filters */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
           <div className="flex flex-col lg:flex-row gap-5 justify-between">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Search</label>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search by name, email..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-40">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Role</label>
                <div className="relative">
                    <select className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none">
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>User</option>
                    </select>
                </div>
              </div>

              <div className="w-full sm:w-40">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Status</label>
                <div className="relative">
                    <select className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none">
                    <option>All Statuses</option>
                    <option>True</option>
                    <option>False</option>
                    </select>
                </div>
              </div>
              
              <div className="flex items-end gap-2">
                <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm shadow-indigo-200 h-[42px]">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                <button className="px-3 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg text-sm font-medium flex items-center transition-colors h-[42px]" title="Remove Filter">
                  <X className="w-4 h-4" />
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
                    <h3 className="font-semibold text-gray-800">User List</h3>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 border border-gray-200 rounded shadow-sm">
                        Total: {users.length}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-gray-500">Show:</span>
                    <select className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 shadow-sm cursor-pointer outline-none">
                        <option>10</option>
                        <option>15</option>
                        <option>20</option>
                    </select>
                    <span className="text-gray-500">per page</span>
                </div>
            </div>
          
          <div className="overflow-x-auto flex-1">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
                    <p className="text-gray-500 text-sm">Loading users from API...</p>
                </div>
            ) : (
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-gray-700 font-bold text-xs uppercase border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">#</th>
                  <th className="px-6 py-4">User Info</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user, index) => (
                    <tr key={index} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-4 text-center font-medium text-gray-400">
                            {index + 1}
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
                                user.role === 'ADMIN' 
                                ? 'bg-red-50 text-red-700 border-red-100' 
                                : 'bg-purple-50 text-purple-700 border-purple-100'
                            }`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${
                                user.status === 'TRUE' 
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
                            {user.lastLogin !== "Never" ? (
                                <>
                                    <div className="text-sm">{user.lastLogin.split(' ')[0]}</div>
                                    <div className="text-xs text-gray-400">{user.lastLogin.split(' ').slice(1).join(' ')}</div>
                                </>
                            ) : (
                                <span className="text-gray-400 text-xs italic">Never</span>
                            )}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => handleOpenEditModal(user)}
                                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:shadow-sm transition-all" 
                                  title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => openViewModal(user)}
                                  className="p-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all"
                                  title="View Details"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsBlockConfirmOpen(true);
                                  }}
                                  className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 hover:shadow-sm transition-all"
                                  title="Block User"
                                >
                                    <Ban className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
            )}
            
            {!loading && users.length === 0 && !error && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No users found</h3>
                </div>
            )}

            {error && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-red-500">
                    <p>Error loading data: {error}</p>
                </div>
            )}
          </div>

          {/* Footer Pagination */}
          <div className="p-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                  <span>Page <span className="font-semibold text-gray-900">1</span> of <span className="font-semibold text-gray-900">1</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                  <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md bg-indigo-600 text-white font-medium shadow-sm transition-colors">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                  </button>
              </div>
          </div>
        </div>

        {/* --- ADD USER MODAL --- */}
        {isAddUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
                <button 
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto bg-white">
                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        type="text" 
                        placeholder="Enter full name" 
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
                        placeholder="Enter email" 
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.email ? 'border-red-300' : 'border-gray-200'}`} 
                      />
                    </div>
                    {formErrors.email && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.email}</p>}
                 </div>

                 <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Role</label>
                    <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer">
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                 </div>

                 <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                 </div>

                 <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Password <span className="text-red-500">*</span></label>
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.password && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.password}</p>}
                 </div>

                 <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Confirm Password <span className="text-red-500">*</span></label>
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.confirmPassword}</p>}
                 </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
                <button 
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveUser}
                  disabled={isDetailLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDetailLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2" />}
                  Save User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- EDIT USER MODAL --- */}
        {isEditUserModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="text-lg font-bold text-gray-900">Update User</h3>
                <button 
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto bg-white">
                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Full Name <span className="text-red-500">*</span></label>
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
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Role</label>
                    <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer">
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                 </div>

                 <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                 </div>

                 <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">New Password (Optional)</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        type={showPassword ? "text" : "password"}
                        placeholder="Leave blank to keep current password" 
                        className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.password ? 'border-red-300' : 'border-gray-200'}`} 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.password && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.password}</p>}
                 </div>
                 
                 {/* Only show confirm password if password field has value */}
                 {formData.password && (
                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Confirm New Password <span className="text-red-500">*</span></label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password" 
                            className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`} 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        </div>
                        {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{formErrors.confirmPassword}</p>}
                    </div>
                 )}
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
                <button 
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveUser}
                  disabled={isDetailLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ... (Keep Block Confirm Modal) ... */}
        {isBlockConfirmOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="text-lg font-bold text-gray-900">Confirm lock account</h3>
                <button 
                  onClick={() => {
                    setIsBlockConfirmOpen(false);
                    setSelectedUser(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 flex gap-4 items-start bg-white">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-50">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900 mb-1">
                    Are you sure to lock this account?
                  </p>
                  <p>
                    User <span className="font-semibold">{selectedUser?.username}</span> (ID: <span className="font-mono text-xs">{selectedUser?.id}</span>) wont't login.
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    This action can be undone by unlocking it later.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setIsBlockConfirmOpen(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleLockAccount();
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                >
                  Lock account
                </button>
              </div>
            </div>
          </div>
        )}

        {isViewUserModalOpen && viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button
                onClick={() => {
                    setIsViewUserModalOpen(false);
                    setViewUser(null);
                }}
                className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                <X className="w-5 h-5" />
                </button>
            </div>

            {/* Body */}
            {isViewLoading ? (
                <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                    <p>Loading user info...</p>
                </div>
            ) : (
            <div className="p-6 bg-white space-y-5">
                {/* Profile card (light) */}
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${viewUser.avatarColor}`}>
                    <span className="font-bold text-lg">{viewUser.initials}</span>
                </div>
                <div className="flex-1">
                    <div className="text-lg font-semibold text-gray-900">{viewUser.username}</div>
                    <div className="text-sm text-gray-500 mt-1">{viewUser.email}</div>
                    {viewUser.phone && <div className="text-xs text-gray-400 mt-1">Phone: {viewUser.phone}</div>}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                        <div className="text-xs text-gray-400">Number of orders</div>
                        <div className="font-medium text-gray-800">{viewUser.ordersCount}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Total Spent</div>
                        <div className="font-medium text-gray-800">{formatVND(viewUser.totalSpent)}</div>
                    </div>
                    <div className="col-span-2 mt-1">
                        <div className="text-xs text-gray-400">Join Date</div>
                        <div className="font-medium text-gray-800">{viewUser.joinDate.split(' ')[0]}</div>
                    </div>
                    </div>
                </div>
                </div>

                {/* Recent activities */}
                <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Recent Activity</h4>
                <div className="space-y-3">
                    <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 8h18M3 12h18M3 16h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div>
                        <div className="text-sm text-gray-800 font-medium">Booked ticket for event "Summer Concert 2024"</div>
                        <div className="text-xs text-gray-500 mt-0.5">2 hours ago</div>
                        </div>
                    </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M5 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div>
                        <div className="text-sm text-gray-800 font-medium">Logged into the system</div>
                        <div className="text-xs text-gray-500 mt-0.5">1 day ago</div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>

            </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                onClick={() => {
                    setIsViewUserModalOpen(false);
                    setViewUser(null);
                }}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                Close
                </button>
                <button
                onClick={() => {
                    // Close view and open edit for same user
                    setIsViewUserModalOpen(false);
                    setIsEditUserModalOpen(true);
                    handleOpenEditModal(viewUser); // Load detail
                }}
                disabled={isViewLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                Edit
                </button>
            </div>
            </div>
        </div>
        )}

      </div>
    </MainLayout>
  );
};