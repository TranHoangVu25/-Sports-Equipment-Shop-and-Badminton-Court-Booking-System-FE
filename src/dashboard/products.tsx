import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Package, 
  Trash2, 
  AlertTriangle,
  Copy,
  Clock,
  TrendingUp,
  Layout,
  Menu, 
  Bell, 
  LogOut,
  X,
  Save,
  Image as ImageIcon,
  Tag,
  Layers,
  Smile,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Check,
  Eye
} from "lucide-react";
import { MainLayout } from "../dashboard/layouts/main-layout";


// --- CONSTANTS DATA ---
const CHARACTERS_DATA = [
    { "name": "Chiikawa", "slug": "chiikawa", "image": "https://chiikawamarket.jp/cdn/shop/collections/01chiikawa.png" },
    { "name": "Hachiware", "slug": "hachiware", "image": "https://chiikawamarket.jp/cdn/shop/collections/02hachiware.png" },
    { "name": "Usagi", "slug": "usagi", "image": "https://chiikawamarket.jp/cdn/shop/collections/03usagi.png" },
    { "name": "Momonga", "slug": "momonga", "image": "https://chiikawamarket.jp/cdn/shop/collections/04momonga.png" },
    { "name": "Kurimanju", "slug": "kurimanju", "image": "https://chiikawamarket.jp/cdn/shop/collections/05kurimanju.png" },
    { "name": "Rakko", "slug": "rakko", "image": "https://chiikawamarket.jp/cdn/shop/collections/06rakko.png" },
    { "name": "Shisa", "slug": "shisa", "image": "https://chiikawamarket.jp/cdn/shop/collections/07sisa.png" },
    { "name": "Furuhonya", "slug": "furuhonya", "image": "https://chiikawamarket.jp/cdn/shop/collections/08furuhonya.png" },
    { "name": "Anoko", "slug": "anoko", "image": "https://chiikawamarket.jp/cdn/shop/collections/09anoko.png" },
    { "name": "Dekatsuyo", "slug": "dekatsuyo", "image": "https://chiikawamarket.jp/cdn/shop/collections/10dekatsuyo.png" },
    { "name": "Ode", "slug": "ode", "image": "https://chiikawamarket.jp/cdn/shop/collections/11ode.png" },
    { "name": "Chimaera", "slug": "chimaera", "image": "https://chiikawamarket.jp/cdn/shop/collections/12kimera.png" },
    { "name": "Yoroi-san", "slug": "yoroisan", "image": "https://chiikawamarket.jp/cdn/shop/collections/13yoroisan.png" },
    { "name": "Beetle", "slug": "beetle", "image": "https://chiikawamarket.jp/cdn/shop/collections/14kabutomusi.png" },
    { "name": "Goblin", "slug": "goblin", "image": "https://chiikawamarket.jp/cdn/shop/collections/15goburin.png" },
    { "name": "Star", "slug": "star", "image": "https://chiikawamarket.jp/cdn/shop/collections/16hoshi.png" }
];

const CATEGORIES_DATA = [
    { "name": "Plush/Mascot", "slug": "nuigurumi-mascot" },
    { "name": "Plush", "slug": "nuigurumi" },
    { "name": "Mascot", "slug": "mascot" },
    { "name": "Goods", "slug": "goods" },
    { "name": "Bag", "slug": "bags" },
    { "name": "Pouch", "slug": "pouch" },
    { "name": "Card holder", "slug": "cardholder" },
    { "name": "Key ring", "slug": "keyholder" },
    { "name": "Badge", "slug": "badge" },
    { "name": "Charm", "slug": "charm" },
    { "name": "Hair accessories/Mirror", "slug": "hair" },
    { "name": "Accessories/Watch", "slug": "accessory_watch" },
    { "name": "Umbrella", "slug": "umbrella" },
    { "name": "Patch", "slug": "patch" },
    { "name": "Interior", "slug": "interior" },
    { "name": "Figure", "slug": "figure" },
    { "name": "Organizer", "slug": "organizer" },
    { "name": "Lighting/Humidifier", "slug": "lighthumidifier" },
    { "name": "Bedding/Cushion", "slug": "bedding" },
    { "name": "Wall interior", "slug": "wallinterior" },
    { "name": "Pets", "slug": "pets" },
    { "name": "Acrylic stand", "slug": "acrylstand" },
    { "name": "Apparel", "slug": "apparel" },
    { "name": "T-shirts/Hoodie", "slug": "casualtops" },
    { "name": "Hat", "slug": "hat" },
    { "name": "Glove/Scarve", "slug": "fashionaccessories" },
    { "name": "Socks", "slug": "socks" },
    { "name": "Room shoes", "slug": "roomshoes" },
    { "name": "Costume", "slug": "costume" },
    { "name": "Stationery", "slug": "stationery" },
    { "name": "Writing materials", "slug": "writing_materials" },
    { "name": "Memo", "slug": "memo" },
    { "name": "Sticker", "slug": "stickers_tapes" },
    { "name": "Pencase", "slug": "pencase" },
    { "name": "Folder", "slug": "folder" },
    { "name": "Magnet", "slug": "magnet" },
    { "name": "Calender/Note", "slug": "notes" },
    { "name": "Towel", "slug": "towel" },
    { "name": "Bath towel", "slug": "bathtowel" },
    { "name": "Face towel", "slug": "facetowel" },
    { "name": "Hand towel", "slug": "handtowel" },
    { "name": "Kitchen goods", "slug": "kitchen" },
    { "name": "Cups", "slug": "cups" },
    { "name": "Tumbler/Water bottle", "slug": "tumbler" },
    { "name": "Tableware", "slug": "tableware" },
    { "name": "Cutlery", "slug": "cutlery" },
    { "name": "Utensils", "slug": "utensils" },
    { "name": "Lunch box", "slug": "lunchbox" },
    { "name": "Apron", "slug": "apron" },
    { "name": "Dish cloth/Mat", "slug": "dishtowel" },
    { "name": "PC/Smartphone goods", "slug": "spgoods" },
    { "name": "Smartphone case", "slug": "spcase" },
    { "name": "Smartphone ring", "slug": "spring" },
    { "name": "Charging accessories", "slug": "chargecables" },
    { "name": "Mouse pad", "slug": "mousepad" },
    { "name": "Amenity", "slug": "amenity" },
    { "name": "Bathroom", "slug": "bathroom" },
    { "name": "Cosmetics", "slug": "cosmetic" },
    { "name": "Mask/Hygiene", "slug": "hygiene" },
    { "name": "Outdoor", "slug": "outdoor" },
    { "name": "Picnic goods", "slug": "picnic" },
    { "name": "Car goods", "slug": "car" },
    { "name": "Toy/Puzzle", "slug": "plaything" },
    { "name": "Toy", "slug": "toys" },
    { "name": "Puzzle", "slug": "puzzle" },
    { "name": "Kit", "slug": "kit" },
    { "name": "Food", "slug": "foods" }
];

// --- Product Detail Modal ---
const ProductDetailModal = ({ isOpen, onClose, product }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isOpen && product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else {
      setSelectedImage(null);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  };

  const displayImage = selectedImage || (product.images && product.images.length > 0 ? product.images[0] : null);
  const isAvailable = product.status === 'available';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Package className="mr-2 text-indigo-600" size={20} /> 
            Product Details
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images Section */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 relative group">
                        {displayImage ? (
                            <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-gray-400 flex flex-col items-center">
                                <ImageIcon size={48} className="opacity-50 mb-2"/>
                                <span className="text-sm">No Image</span>
                            </div>
                        )}
                        <div className="absolute top-3 right-3">
                             <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide border shadow-sm ${
                                 isAvailable ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'
                             }`}>
                                 {isAvailable ? 'Available' : 'Sold Out'}
                             </span>
                        </div>
                    </div>
                    {/* Thumbnail list */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                             {product.images.map((img, idx) => (
                                 <div 
                                    key={idx} 
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden cursor-pointer transition-all ${selectedImage === img ? 'ring-2 ring-indigo-500 ring-offset-1 border-indigo-500' : 'border-slate-200 hover:border-indigo-300'}`}
                                 >
                                     <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                 </div>
                             ))}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                        <div className="flex flex-wrap gap-2 text-sm">
                             <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium border border-indigo-100 flex items-center">
                                <Smile size={14} className="mr-1.5"/>
                                {product.character}
                             </span>
                             <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium border border-slate-200 flex items-center">
                                <Tag size={14} className="mr-1.5"/>
                                {product.category}
                             </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 border-y border-slate-100 py-6">
                         <div>
                             <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Price</p>
                             <p className="text-2xl font-bold text-indigo-600">{formatPrice(product.price_raw)}</p>
                         </div>
                         <div className="h-10 w-px bg-slate-200"></div>
                         <div>
                             <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Sold</p>
                             <p className="text-2xl font-bold text-slate-900">{product.sold}</p>
                         </div>
                         <div className="h-10 w-px bg-slate-200"></div>
                         <div>
                             <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-1">Stock</p>
                             <p className="text-2xl font-bold text-slate-900">{product.stock}</p>
                         </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Description</h4>
                        <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100 max-h-40 overflow-y-auto custom-scrollbar">
                            {product.description || "No description available."}
                        </div>
                    </div>

                    <div>
                         <h4 className="text-sm font-bold text-slate-900 mb-3">Additional Info</h4>
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white border border-slate-200 rounded-lg p-3">
                                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Vendor</p>
                                 <p className="text-sm font-medium text-slate-800">{product.vendor || 'Chiikawa Official'}</p>
                             </div>
                             <div className="bg-white border border-slate-200 rounded-lg p-3">
                                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">ID</p>
                                 <p className="text-sm font-medium text-slate-800 font-mono">{product.id}</p>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50 rounded-b-xl">
           <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all shadow-sm">
              Close
           </button>
        </div>
      </div>
    </div>
  );
};

/**
 * --- PROGRESS MODAL (Used for Save & Delete) ---
 */
const ProcessProgressModal = ({ isOpen, productName, actionType = 'saving' }) => {
  if (!isOpen) return null;

  const isDeleting = actionType === 'deleting';
  const colorClass = isDeleting ? 'text-red-600' : 'text-indigo-600';
  const bgClass = isDeleting ? 'bg-red-50' : 'bg-indigo-50';
  const barClass = isDeleting ? 'bg-red-600' : 'bg-indigo-600';
  const title = isDeleting ? 'Deleting Product' : 'Saving Product';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 flex flex-col items-center animate-in zoom-in-95 duration-300">
        <div className={`w-16 h-16 ${bgClass} rounded-full flex items-center justify-center mb-4`}>
           <Loader2 className={`w-8 h-8 ${colorClass} animate-spin`} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-500 text-center mb-6">
          Processing data for <span className={`font-bold ${colorClass}`}>"{productName}"</span>...
        </p>
        
        {/* Loading Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${barClass} animate-progress-indeterminate rounded-full`}></div>
        </div>
      </div>
    </div>
  );
};

/**
 * --- CONFIRM DELETE MODAL ---
 */
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
          <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
              <p className="text-sm text-gray-500">
                  Are you sure you want to delete <span className="font-bold text-gray-900">"{productName}"</span>?
                  <br />This action cannot be undone.
              </p>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50/50">
              <button onClick={onClose} className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all">Cancel</button>
              <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm">Delete</button>
          </div>
      </div>
    </div>
  );
};

/**
 * --- PRODUCT FORM MODAL (Create & Edit) ---
 */
const ProductFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", status: "Active", vendor: ""
  });

  const [images, setImages] = useState([""]);
  const [variants, setVariants] = useState([{ name: "", img: "" }]);
  const [categories, setCategories] = useState([{ name: "", slug: "" }]);
  const [characters, setCharacters] = useState([{ name: "", slug: "" }]);
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    if (isOpen) {
      setErrors({}); 
      if (initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description || "Sample description for " + initialData.name,
          price: initialData.price_raw || "0", // Use raw price if available
          status: "Active",
          vendor: "Chiikawa Official"
        });
        setImages(initialData.images && initialData.images.length > 0 ? initialData.images : ["https://example.com/image1.jpg"]);
        setVariants([{ name: "Standard", img: "" }]);
        setCategories([{ name: initialData.category, slug: initialData.category_slug || "" }]);
        setCharacters([{ name: initialData.character, slug: initialData.character_slug || "" }]);
      } else {
        setFormData({ name: "", description: "", price: "", status: "Active", vendor: "" });
        setImages([""]); 
        setVariants([{ name: "", img: "" }]);
        setCategories([{ name: "", slug: "" }]);
        setCharacters([{ name: "", slug: "" }]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // --- Handlers ---
  const handleSimpleListChange = (index, value, list, setList) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
    if (value && errors.images) setErrors({...errors, images: null});
  };
  
  const addSimpleField = (list, setList) => {
    setList([...list, ""]);
  };

  const removeSimpleField = (index, list, setList) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleObjectListChange = (index, field, value, list, setList, errorKey) => {
    const newList = [...list];
    newList[index] = { ...newList[index], [field]: value };
    setList(newList);
     if (value && errors[errorKey]) setErrors({...errors, [errorKey]: null});
  };
  
  const addObjectField = (emptyObj, list, setList) => {
    setList([...list, emptyObj]);
  };

  const removeObjectField = (index, list, setList) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    const hasValidImage = images.some(img => img.trim() !== "");
    if (!hasValidImage) newErrors.images = "At least one image URL is required";
    const hasValidCategory = categories.some(cat => cat.name.trim() !== "");
    if (!hasValidCategory) newErrors.categories = "Category is required";
    const hasValidCharacter = characters.some(char => char.name.trim() !== "");
    if (!hasValidCharacter) newErrors.characters = "Character is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
        // Collect all data to pass to onSave
        const fullData = {
            ...formData,
            images,
            variants,
            categories,
            characters
        };
      onSave(fullData);
    }
  };

  const renderSimpleListInput = (label, icon, list, setList, placeholder, error) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700 flex items-center justify-between">
        <div className="flex items-center">{icon} <span className="ml-2">{label}</span> <span className="text-red-500 ml-1">*</span></div>
        {error && <span className="text-xs text-red-500 font-normal">{error}</span>}
      </label>
      <div className="space-y-2">
        {list.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={item}
              onChange={(e) => handleSimpleListChange(index, e.target.value, list, setList)}
              placeholder={`${placeholder} ${index + 1}`}
              className={`flex-1 px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${error && index === 0 && !item ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`}
            />
            <button 
              type="button"
              onClick={() => removeSimpleField(index, list, setList)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Remove"
            >
               <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => addSimpleField(list, setList)} className="flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
        <Plus size={14} className="mr-1" /> Add {label}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Package className="mr-2 text-indigo-600" size={20} /> 
            {initialData ? "Edit Product" : "Create New Product"}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm animate-in slide-in-from-top-2">
              <AlertTriangle size={16} />
              <span>Please fill in all required fields marked with *</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">General Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if(e.target.value) setErrors({...errors, name: null});
                    }}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`} 
                    placeholder="e.g., Chiikawa Plush S" 
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea rows={3} value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Product details..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => {
                         setFormData({...formData, price: e.target.value});
                         if(e.target.value) setErrors({...errors, price: null});
                      }}
                      className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 ${errors.price ? 'border-red-300 focus:ring-red-200' : 'border-slate-300 focus:ring-indigo-500'}`} 
                      placeholder="0.00" 
                    />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Vendor</label>
                    <input type="text" className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Brand name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Archived</option>
                  </select>
                </div>
              </div>
              {renderSimpleListInput("Images (URL)", <ImageIcon size={16} className="text-pink-500"/>, images, setImages, "http://image-url.com", errors.images)}
            </div>

            <div className="space-y-8">
              
              <div className="space-y-3">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
                       <Layers size={16} className="mr-2 text-blue-500"/> Variants
                    </label>
                    <button onClick={() => addObjectField({ name: "", img: "" }, variants, setVariants)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                       <Plus size={14} className="mr-1"/> Add Variant
                    </button>
                 </div>
                 <div className="space-y-3">
                    {variants.map((item, index) => (
                       <div key={index} className="flex gap-2 items-start bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <div className="grid grid-cols-2 gap-2 flex-1">
                            <input type="text" value={item.name} onChange={(e) => handleObjectListChange(index, "name", e.target.value, variants, setVariants, 'variants')} placeholder="Name" className="px-2 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            <input type="text" value={item.img} onChange={(e) => handleObjectListChange(index, "img", e.target.value, variants, setVariants, 'variants')} placeholder="Img URL" className="px-2 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                          </div>
                          <button 
                            onClick={() => removeObjectField(index, variants, setVariants)}
                            className="p-1.5 mt-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Remove Variant"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
                       <Tag size={16} className="mr-2 text-green-500"/> Categories <span className="text-red-500 ml-1">*</span>
                    </label>
                    <button onClick={() => addObjectField({ name: "", slug: "" }, categories, setCategories)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                       <Plus size={14} className="mr-1"/> Add Category
                    </button>
                 </div>
                 {errors.categories && <p className="text-xs text-red-500">{errors.categories}</p>}
                 <div className="space-y-3">
                    {categories.map((item, index) => (
                       <div key={index} className={`flex gap-2 items-start bg-slate-50 p-2 rounded-lg border ${errors.categories && index === 0 && !item.name ? 'border-red-300' : 'border-slate-200'}`}>
                          <div className="grid grid-cols-2 gap-2 flex-1">
                            <input type="text" value={item.name} onChange={(e) => handleObjectListChange(index, "name", e.target.value, categories, setCategories, 'categories')} placeholder="Name" className="px-2 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            <input type="text" value={item.slug} onChange={(e) => handleObjectListChange(index, "slug", e.target.value, categories, setCategories, 'categories')} placeholder="Slug" className="px-2 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                          </div>
                          <button 
                            onClick={() => removeObjectField(index, categories, setCategories)}
                            className="p-1.5 mt-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Remove Category"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
                       <Smile size={16} className="mr-2 text-yellow-500"/> Characters <span className="text-red-500 ml-1">*</span>
                    </label>
                    <button onClick={() => addObjectField({ name: "", slug: "" }, characters, setCharacters)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                       <Plus size={14} className="mr-1"/> Add Character
                    </button>
                 </div>
                 {errors.characters && <p className="text-xs text-red-500">{errors.characters}</p>}
                 <div className="space-y-3">
                    {characters.map((item, index) => (
                       <div key={index} className={`flex gap-2 items-start bg-slate-50 p-2 rounded-lg border ${errors.characters && index === 0 && !item.name ? 'border-red-300' : 'border-slate-200'}`}>
                          <div className="grid grid-cols-2 gap-2 flex-1">
                            <input type="text" value={item.name} onChange={(e) => handleObjectListChange(index, "name", e.target.value, characters, setCharacters, 'characters')} placeholder="Name" className="px-2 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            <input type="text" value={item.slug} onChange={(e) => handleObjectListChange(index, "slug", e.target.value, characters, setCharacters, 'characters')} placeholder="Slug" className="px-2 py-1.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                          </div>
                          <button 
                            onClick={() => removeObjectField(index, characters, setCharacters)}
                            className="p-1.5 mt-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Remove Character"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-xl">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all shadow-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow">
            <Save size={16} className="mr-2" /> Save Product
          </button>
        </div>

      </div>
    </div>
  );
};

export const ProductDashBoard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false); 
  const [processAction, setProcessAction] = useState('saving'); 
  
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [processProductName, setProcessProductName] = useState("");

  // New State for View Detail Modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCharacter, setFilterCharacter] = useState([]); 
  const [filterCategory, setFilterCategory] = useState(null); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- API CONNECTION ---
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/products/all", {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      if (data.code === 0 && Array.isArray(data.result)) {
        // Map API data to Dashboard format
        const mappedProducts = data.result.map(p => {
          // Handle arrays for characters and categories
          const mainChar = p.characters && p.characters.length > 0 ? p.characters[0] : null;
          const mainCat = p.categories && p.categories.length > 0 ? p.categories[0] : null;

          return {
            id: p.id,
            name: p.name,
            character: mainChar ? mainChar.name : "Unknown",
            character_slug: mainChar ? mainChar.slug : "unknown",
            category: mainCat ? mainCat.name : "Uncategorized",
            category_slug: mainCat ? mainCat.slug : "uncategorized",
            // Store full arrays
            characters: p.characters || [],
            categories: p.categories || [],
            sold: p.sold || 0,
            stock: p.stock || 0,
            price_raw: p.price, 
            status: p.status || "unavailable", 
            revenue: formatPrice(Math.round((p.sold || 0) * (p.price || 0))),
            imageColor: "bg-gray-100", 
            images: p.images || [], 
            description: p.description,
            vendor: p.vendor
          };
        });
        setProducts(mappedProducts);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  };

  const toggleCharacterFilter = (slug) => {
    setFilterCharacter(prev => {
      if (prev.includes(slug)) {
        return prev.filter(s => s !== slug); 
      } else {
        return [...prev, slug]; 
      }
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCharacter = filterCharacter.length === 0 ? true : filterCharacter.includes(product.character_slug);
    const matchesCategory = filterCategory ? product.category_slug === filterCategory : true;
    return matchesSearch && matchesCharacter && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCharacter, filterCategory]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedProduct(null); 
    setIsFormModalOpen(true);
  };

  const handleViewClick = (product) => {
    setViewProduct(product);
    setIsViewModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const name = selectedProduct?.name;
    setIsDeleteModalOpen(false);
    setProcessProductName(name);
    setProcessAction('deleting');
    setIsProcessing(true);

    try {
        const response = await fetch(`https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/products/${selectedProduct.id}`, {
            method: "DELETE",
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            // Success
            setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
        } else {
            console.error("Failed to delete product");
        }
    } catch (e) {
        console.error("Error deleting product:", e);
    } finally {
        setIsProcessing(false);
        setSelectedProduct(null);
    }
  };

  const handleSaveProduct = async (formData) => {
    setIsFormModalOpen(false);
    setProcessProductName(formData.name);
    setProcessAction('saving');
    setIsProcessing(true);

    try {
        // Construct payload
        const payload = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            status: formData.status,
            vendor: formData.vendor, // Added vendor to payload
            images: formData.images,
            variants: formData.variants, // Added variants to payload
            categories: formData.categories, // Added categories to payload
            characters: formData.characters // Added characters to payload
        };

        let response;
        if (selectedProduct) {
            // UPDATE
            response = await fetch(`https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/products/${selectedProduct.id}`, {
                method: "PUT",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
        } else {
            // CREATE
            response = await fetch("https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/products", {
                method: "POST",
                headers: {
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
        }

        if (response.ok) {
            fetchProducts(); // Refresh list
        } else {
            console.error("Failed to save product");
        }
    } catch (e) {
        console.error("Error saving product:", e);
    } finally {
        setIsProcessing(false);
        setSelectedProduct(null);
    }
  };

  const renderPagination = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always add 1
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      // Range around current
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
          start = 2;
          end = 4;
      }
      if (currentPage >= totalPages - 2) {
          start = totalPages - 3;
          end = totalPages - 1;
      }

      for (let i = start; i <= end; i++) {
          pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');

      // Always add last
      pages.push(totalPages);
    }
    
    return pages.map((page, index) => {
        if (page === '...') {
            return <span key={`ellipsis-${index}`} className="px-2 text-slate-400">...</span>;
        }
        return (
          <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
              {page}
          </button>
        );
    });
  };

  return (
    <MainLayout>
    <div className="space-y-6 animate-fade-in pb-10 p-6">
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
          <p className="text-slate-500 mt-1">Manage list of Chiikawa products</p>
        </div>
        
        {/* Only Create Button Here */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button onClick={handleCreateClick} className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm shadow-indigo-200">
            <Plus size={16} className="mr-2" /> Create Product
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
            {/* Character Filter */}
            <div className="flex-1 min-w-0 bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <Smile size={14} className="mr-1.5 text-indigo-500"/> Filter by Character
                    </span>
                    {filterCharacter.length > 0 && (
                         <button onClick={() => setFilterCharacter([])} className="text-xs text-red-500 hover:text-red-700 flex items-center font-medium">
                            <FilterX size={12} className="mr-1" /> Clear
                         </button>
                    )}
                </div>
                <div className="flex gap-3 overflow-x-auto p-2 custom-scrollbar snap-x">
                    <button 
                        onClick={() => setFilterCharacter([])}
                        className={`snap-start flex-shrink-0 flex flex-col items-center gap-1 min-w-[80px] p-1 rounded-lg transition-all ${filterCharacter.length === 0 ? 'bg-indigo-50 ring-2 ring-indigo-500 ring-offset-1' : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                    >
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">ALL</div>
                        <span className="text-[10px] font-medium text-slate-600 truncate max-w-full">All</span>
                    </button>
                    {CHARACTERS_DATA.map((char) => {
                        const isSelected = filterCharacter.includes(char.slug);
                        return (
                          <button 
                              key={char.slug}
                              onClick={() => toggleCharacterFilter(char.slug)}
                              className={`snap-start flex-shrink-0 flex flex-col items-center gap-1 min-w-[80px] p-1 rounded-lg transition-all relative ${isSelected ? 'bg-indigo-50 ring-2 ring-indigo-500 ring-offset-1' : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                          >
                              <img src={char.image} alt={char.name} className="w-14 h-14 rounded-full object-cover bg-white border border-slate-100 shadow-sm" />
                              <span className="text-[10px] font-medium text-slate-600 truncate max-w-full">{char.name}</span>
                              {isSelected && (
                                <div className="absolute top-1 right-1 bg-indigo-500 text-white rounded-full w-4 h-4 flex items-center justify-center border border-white">
                                  <Check size={10} strokeWidth={3} />
                                </div>
                              )}
                          </button>
                        );
                    })}
                </div>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-72 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <Tag size={14} className="mr-1.5 text-green-500"/> Filter by Category
                    </span>
                    {filterCategory && (
                        <button onClick={() => setFilterCategory(null)} className="text-xs text-red-500 hover:text-red-700 flex items-center font-medium">
                            <FilterX size={12} className="mr-1" /> Clear
                        </button>
                    )}
                </div>
                <div className="relative flex-1">
                    <select 
                        value={filterCategory || ""}
                        onChange={(e) => setFilterCategory(e.target.value || null)}
                        className="w-full h-10 pl-3 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {CATEGORIES_DATA.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mt-3 text-xs text-slate-400">
                    Showing {filteredProducts.length} results
                </div>
            </div>
        </div>

        {/* --- SEARCH SECTION (MOVED HERE) --- */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products by name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                />
             </div>
             <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm">
                <Search size={16} className="mr-2" /> Search
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-3" />
                <p>Loading products...</p>
             </div>
        ) : (
        <>
        {currentProducts.map((product) => {
            const isAvailable = product.status === 'available';
            return (
          <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col">
            <div className={`h-48 ${product.imageColor} relative flex items-center justify-center group-hover:opacity-95 transition-opacity`}>
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide border shadow-sm ${
                    isAvailable 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                    : 'bg-red-100 text-red-700 border-red-200'
                }`}>
                    {isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="absolute top-3 right-3 flex gap-2 z-10">
                <button onClick={() => handleViewClick(product)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-600 hover:text-white transition-all transform hover:scale-105" title="View Details">
                  <Eye size={14} />
                </button>
                <button onClick={() => handleEditClick(product)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105" title="Edit Product">
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDeleteClick(product)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-600 shadow-sm hover:bg-red-600 hover:text-white transition-all transform hover:scale-105" title="Delete Product">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="text-slate-400 flex flex-col items-center">
                 {product.images && product.images.length > 0 && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                 ) : (
                    <Package size={48} className="opacity-50" />
                 )}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-3">
                <h3 className="font-bold text-slate-900 text-lg truncate mb-1" title={product.name}>{product.name}</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">{product.character}</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{product.category}</span>
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                   <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Sold</p>
                   <p className="text-sm font-semibold text-slate-700">{product.sold} <span className="text-slate-400 font-normal">/ {product.stock}</span></p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">Price</p>
                   <p className="text-sm font-bold text-slate-900">{formatPrice(product.price_raw)}</p>
                </div>
              </div>
            </div>
          </div>
        )})}
        {currentProducts.length === 0 && !error && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search size={32} />
             </div>
             <p className="text-lg font-medium text-slate-600">No products found</p>
             <p className="text-sm">Try adjusting your filters or search query.</p>
             {(filterCharacter.length > 0 || filterCategory || searchQuery) && (
                 <button 
                    onClick={() => { setFilterCharacter([]); setFilterCategory(null); setSearchQuery(""); }}
                    className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                 >
                    Clear all filters
                 </button>
             )}
          </div>
        )}
        </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
           <button 
             onClick={() => handlePageChange(currentPage - 1)}
             disabled={currentPage === 1}
             className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
           >
             <ChevronLeft size={20} />
           </button>
           
           <div className="flex items-center gap-1">
             {renderPagination()}
           </div>

           <button 
             onClick={() => handlePageChange(currentPage + 1)}
             disabled={currentPage === totalPages}
             className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
           >
             <ChevronRight size={20} />
           </button>
           <div className="ml-4 text-sm text-slate-500">
             Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length}
           </div>
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name}
      />
      
      <ProductFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={selectedProduct}
      />
      
      <ProductDetailModal
         isOpen={isViewModalOpen}
         onClose={() => setIsViewModalOpen(false)}
         product={viewProduct}
      />

      <ProcessProgressModal 
        isOpen={isProcessing} 
        productName={processProductName} 
        actionType={processAction}
      />

    </div>
    </MainLayout>
  );
};