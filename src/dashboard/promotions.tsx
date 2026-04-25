import React, { useState, useEffect } from "react";
import { 
  Plus, 
  RotateCcw, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  TicketPercent,
  CheckCircle2,
  XCircle,
  Calendar,
  X,
  Save,
  AlertCircle
} from "lucide-react";
import { MainLayout } from "./layouts/main-layout"; 


// --- Confirm Delete Modal ---
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemCode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Promotion?</h3>
          <p className="text-sm text-slate-500 mb-6">
            Are you sure you want to delete promotion <span className="font-bold text-slate-800">{itemCode}</span>? <br/>This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Promotion Form Modal ---
const PromotionFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    code: "",
    value: "",
    type: "amount", // or 'percent'
    minOrder: "",
    expiry: "",
    status: "active" // 'active' (unused) or 'inactive' (used/expired)
  });
  const [errors, setErrors] = useState({});

  // Reset or Populate form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (initialData) {
        // Edit Mode: Format date for datetime-local input (YYYY-MM-DDTHH:MM)
        let formattedDate = "";
        try {
           formattedDate = initialData.expiry.includes("T") ? initialData.expiry : ""; 
        } catch (e) {}

        setFormData({
          ...initialData,
          expiry: formattedDate 
        });
      } else {
        // Create Mode
        setFormData({
          code: "",
          value: "",
          type: "amount",
          minOrder: "",
          expiry: "",
          status: "active"
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "Coupon code is required";
    if (!formData.value) {
      newErrors.value = "Discount value is required";
    } else if (Number(formData.value) <= 0) {
      newErrors.value = "Value must be positive";
    }
    
    if (formData.type === 'percent' && Number(formData.value) > 100) {
      newErrors.value = "Percentage cannot exceed 100%";
    }

    if (!formData.expiry) newErrors.expiry = "Expiry date is required";
    
    if (formData.minOrder && Number(formData.minOrder) < 0) {
      newErrors.minOrder = "Min order cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? "Edit Promotion" : "Create New Promotion"}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Coupon Code */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Coupon Code <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              name="code"
              value={formData.code} 
              onChange={handleChange}
              placeholder="e.g. SALE50, WELCOME"
              className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.code ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'}`}
            />
            {errors.code && <p className="text-xs text-red-500 flex items-center mt-1"><AlertCircle size={12} className="mr-1"/> {errors.code}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Discount Type */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="amount">Fixed Amount ($)</option>
                <option value="percent">Percentage (%)</option>
              </select>
            </div>

            {/* Discount Value */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Value <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g. 50000 or 20"
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.value ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'}`}
              />
              {errors.value && <p className="text-xs text-red-500 flex items-center mt-1"><AlertCircle size={12} className="mr-1"/> {errors.value}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Min Order */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Min Order Value</label>
              <input 
                type="number" 
                name="minOrder"
                value={formData.minOrder}
                onChange={handleChange}
                placeholder="e.g. 100000"
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.minOrder ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'}`}
              />
              {errors.minOrder && <p className="text-xs text-red-500 flex items-center mt-1"><AlertCircle size={12} className="mr-1"/> {errors.minOrder}</p>}
            </div>

            {/* Expiry Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Expiry Date <span className="text-red-500">*</span></label>
              <input 
                type="datetime-local" 
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.expiry ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'}`}
              />
              {errors.expiry && <p className="text-xs text-red-500 flex items-center mt-1"><AlertCircle size={12} className="mr-1"/> {errors.expiry}</p>}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive / Used</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Save size={16} className="mr-2" /> Save Promotion
          </button>
        </div>
      </div>
    </div>
  );
};

export const PromotionsDashBoard = () => {
  // Mock Data - Expanded for pagination
  const generateMockPromotions = () => {
    const items = [
      { id: 1, code: "SALE134", value: 50000, type: "amount", expiry: "2025-10-30T16:33", minOrder: 500000, status: "active" },
      { id: 2, code: "WELCOME2025", value: 10, type: "percent", expiry: "2025-12-31T23:59", minOrder: 0, status: "active" },
      { id: 3, code: "FREESHIP", value: 30000, type: "amount", expiry: "2025-11-15T10:00", minOrder: 150000, status: "inactive" },
      { id: 4, code: "VIPMEMBER", value: 20, type: "percent", expiry: "2026-01-01T00:00", minOrder: 1000000, status: "active" },
      { id: 5, code: "FLASH50", value: 50000, type: "amount", expiry: "2025-10-10T12:00", minOrder: 200000, status: "inactive" },
      { id: 6, code: "BLACKFRIDAY", value: 30, type: "percent", expiry: "2025-11-28T23:59", minOrder: 2000000, status: "active" },
      { id: 7, code: "SUMMERSALE", value: 15, type: "percent", expiry: "2025-08-31T23:59", minOrder: 300000, status: "inactive" },
      { id: 8, code: "NEWUSER", value: 20000, type: "amount", expiry: "2025-12-31T23:59", minOrder: 100000, status: "active" },
      { id: 9, code: "BDAYGIFT", value: 100000, type: "amount", expiry: "2025-06-15T23:59", minOrder: 1000000, status: "active" },
      { id: 10, code: "FREESHIP_V2", value: 30000, type: "amount", expiry: "2025-09-15T10:00", minOrder: 250000, status: "active" },
      { id: 11, code: "CYBERMONDAY", value: 25, type: "percent", expiry: "2025-12-01T23:59", minOrder: 1500000, status: "active" },
      { id: 12, code: "XMAS2025", value: 50000, type: "amount", expiry: "2025-12-25T23:59", minOrder: 500000, status: "active" },
      { id: 13, code: "NY2026", value: 20, type: "percent", expiry: "2026-01-01T23:59", minOrder: 500000, status: "active" },
      { id: 14, code: "VALENTINE", value: 14, type: "percent", expiry: "2026-02-14T23:59", minOrder: 200000, status: "active" },
      { id: 15, code: "WOMENDAY", value: 8, type: "percent", expiry: "2026-03-08T23:59", minOrder: 200000, status: "active" },
    ];
    return items;
  };

  const [promotions, setPromotions] = useState(generateMockPromotions());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  
  // State for Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPromotions = promotions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(promotions.length / itemsPerPage);

  // Helper function to format currency or percentage
  const formatDiscount = (value, type) => {
    if (type === "percent") return `${value}%`;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Helper for Status Label
  const StatusBadge = ({ status }) => {
    const isInactive = status === 'inactive';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isInactive 
          ? 'bg-slate-100 text-slate-600 border-slate-200' 
          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }`}>
        {isInactive ? 'Used / Inactive' : 'Active'}
      </span>
    );
  };

  // Handlers
  const handleCreate = () => {
    setSelectedPromo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (promo) => {
    setPromoToDelete(promo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (promoToDelete) {
      setPromotions(prev => prev.filter(p => p.id !== promoToDelete.id));
      setIsDeleteModalOpen(false);
      setPromoToDelete(null);
    }
  };

  const handleSave = (formData) => {
    if (selectedPromo) {
      // Update existing
      setPromotions(prev => prev.map(p => p.id === selectedPromo.id ? { ...formData, id: p.id } : p));
    } else {
      // Create new
      const newPromo = {
        ...formData,
        id: Math.max(...promotions.map(p => p.id), 0) + 1
      };
      setPromotions(prev => [newPromo, ...prev]);
    }
    setIsModalOpen(false);
  };

  // Simple formatting for display date
  const formatDateDisplay = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing limit
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-in fade-in duration-500 p-6 bg-slate-50 min-h-screen">
        
        {/* --- HEADER SECTION --- */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <TicketPercent size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Promotion Management</h1>
              <p className="text-slate-500 mt-1 text-sm">Create and manage your discount coupons</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleCreate}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm shadow-indigo-200"
            >
              <Plus size={16} className="mr-2" /> Add
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all shadow-sm">
              <RotateCcw size={16} className="mr-2" /> Refresh
            </button>
          </div>
        </div>

        {/* --- FILTERS SECTION --- */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* Sort */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Sort By</label>
              <div className="relative">
                <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer">
                  <option>Z-A</option>
                  <option>A-Z</option>
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
              <div className="relative">
                <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer">
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-3">
              <button className="flex-1 flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm">
                <Filter size={16} className="mr-2" /> Filter
              </button>
              <button className="flex-1 flex items-center justify-center px-4 py-2.5 bg-white border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all">
                <XCircle size={16} className="mr-2" /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* --- LIST SECTION --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Header List */}
          <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Promotion List</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Show Per Page */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Show:</span>
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="appearance-none border border-slate-300 rounded px-2 py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
                <span className="hidden sm:inline">per page</span>
              </div>

              <button className="flex items-center px-3 py-1.5 bg-white border border-slate-300 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-all">
                <Download size={14} className="mr-1.5" /> Export Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="px-6 py-4 w-10 text-center">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                  </th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Expiry Date</th>
                  <th className="px-6 py-4 text-right">Min Order</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentPromotions.map((promo, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    </td>
                    <td className="px-6 py-4 text-slate-500">{promo.id}</td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold font-mono border border-purple-200">
                        {promo.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {formatDiscount(promo.value, promo.type)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm capitalize">
                      {promo.type === 'percent' ? 'Percent (%)' : 'Fixed ($)'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={promo.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                      {formatDateDisplay(promo.expiry)}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600 text-sm">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(promo.minOrder)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(promo)}
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" 
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(promo)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" 
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {promotions.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No promotions found.
            </div>
          )}

          {/* Pagination Footer */}
          {promotions.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              <div className="text-sm text-slate-500">
                Page <span className="font-medium text-slate-900">{currentPage}</span> of <span className="font-medium text-slate-900">{totalPages}</span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Simple pagination logic to show limited pages if many
                  if (totalPages > 7 && (page < currentPage - 1 || page > currentPage + 1) && page !== 1 && page !== totalPages) {
                     if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={i} className="w-9 h-9 flex items-center justify-center text-slate-400">...</span>
                     }
                     return null;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg font-medium transition-colors ${
                        currentPage === page 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Promotion Modal --- */}
      <PromotionFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedPromo}
      />

      {/* --- Confirm Delete Modal --- */}
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemCode={promoToDelete?.code}
      />
    </MainLayout>
  );
};