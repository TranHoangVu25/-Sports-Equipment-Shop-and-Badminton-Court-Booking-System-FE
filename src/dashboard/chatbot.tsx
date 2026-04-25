import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MessagesSquare,
  LineChart,
  ShoppingCart,
  Users,
  Percent,
  PieChart,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Calendar,
  Search,
  RefreshCw,
  BarChart,
  CheckCircle, 
  Eye,
  BarChart2, 
  Trash2,     
  X as XIcon, 
  AlertTriangle,
  Maximize,
  ArrowDownCircle,
  Bot,
  User,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Send,
  Loader2
} from 'lucide-react';
import { MainLayout } from "../dashboard/layouts/main-layout";


// ===============================================
// === TOAST NOTIFICATION COMPONENT ===
// ===============================================
const ToastNotification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-emerald-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle : XCircle;
  const iconColor = type === 'success' ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className={`fixed top-4 right-4 z-[120] flex items-center p-4 mb-4 rounded-lg border shadow-lg transform transition-all duration-500 ease-in-out animate-in slide-in-from-top-5 ${bgColor}`}>
      <Icon className={`w-5 h-5 mr-3 ${iconColor}`} />
      <div className={`text-sm font-medium ${textColor}`}>{message}</div>
      <button onClick={onClose} className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${textColor} hover:bg-white/50 transition-colors`}>
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

// ===============================================
// === CẤU HÌNH API ===
// ===============================================
const API_BASE_URL = 'https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/manage';

// ===============================================
// === CÁC HÀM HỖ TRỢ (HELPERS) ===
// ===============================================

function formatDateTime(isoString) {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}/${m}/${d} ${h}:${min}`;
  } catch (e) {
    return isoString;
  }
}

function formatTimestamp(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) { return ''; }
}

function formatDateShort(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${d}/${m}`;
  } catch (e) {
    return dateString;
  }
}

function getFakeData() {
  return {
    stats: {
      totalConversations: 0,
      analyzedCount: 0,
      pendingCount: 0,
      potentialCount: 0,
      spamCount: 0,
      dailyStats: []
    },
    conversations: []
  };
}

// ===============================================
// === CÁC COMPONENT CON (UI) ===
// ===============================================

const StatItem = ({ title, value, icon: Icon, color }) => {
  const colorConfig = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
  };
  const colors = colorConfig[color] || colorConfig.blue; 
  return (
    <div className="flex items-center space-x-4 min-w-[215px]">
      <div className={`p-3 rounded-full ${colors.bg}`}>
        <Icon className={colors.text} size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 whitespace-nowrap">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const ConversationsChart = ({ dailyStats = [], totalConversations = 0 }) => {
  const chartData = dailyStats.slice(-10);
  const maxCount = Math.max(...chartData.map(d => d.count), 1); 
  const dailyAverage = (dailyStats && dailyStats.length > 0)
    ? (totalConversations / dailyStats.length).toFixed(0) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 w-full">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap">Conversations (Last 10 Days)</h2>
        <div className="text-right">
           <span className="text-sm text-gray-500">Total: </span>
           <span className="text-lg font-bold text-gray-900">{totalConversations}</span>
           <span className="mx-2 text-gray-300">|</span>
           <span className="text-sm text-gray-500">Avg/Day: </span>
           <span className="text-lg font-bold text-gray-900">{dailyAverage}</span>
        </div>
      </div>

      <div className="w-full h-64 flex items-end justify-between space-x-2 sm:space-x-4 px-2 pt-6 pb-2">
        {chartData.length === 0 && (
           <div className="w-full h-full flex items-center justify-center text-gray-400">No data available</div>
        )}
        
        {chartData.map((item, index) => {
          const heightPercent = (item.count / maxCount) * 100;
          const displayHeight = item.count > 0 ? `${Math.max(heightPercent, 2)}%` : '0px';
          
          return (
            <div key={index} className="flex flex-col items-center justify-end flex-1 h-full group">
              <div className="mb-1 text-xs font-bold text-blue-600 text-center w-full">
                {item.count}
              </div>
              
              <div 
                className="w-full bg-blue-100 rounded-t-md relative hover:bg-blue-200 transition-all duration-300 cursor-pointer"
                style={{ height: displayHeight }}
              >
                  {item.count > 0 && (
                     <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500 rounded-t-md"></div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="border-t border-gray-200 w-full pt-2 flex justify-between space-x-2 sm:space-x-4 px-2">
         {chartData.map((item, index) => (
            <div key={index} className="flex-1 text-center">
               <div className="text-xs text-gray-500 font-medium truncate">
                  {formatDateShort(item.date)}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

const ConversationsFilterTabs = ({ 
  currentFilterValue, 
  onFilterChange, 
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  onSearchDate, 
  onRefresh,
  onAdvancedAnalysis // New prop
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button className="flex items-center space-x-2 px-4 py-3 border-b-2 border-yellow-500 text-yellow-600 font-semibold whitespace-nowrap">
          <MessagesSquare size={18} />
          <span className="whitespace-nowrap">Conversations</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
          <select id="statusFilter" className="border border-gray-300 rounded-md p-2 text-sm bg-white" value={currentFilterValue} onChange={(e) => onFilterChange(Number(e.target.value))}>
            <option value="0">All</option>
            <option value="1">Undefined</option>
            <option value="2">Potential</option>
            <option value="3">Spam</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2 flex-grow">
            <div className="relative w-full">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 pl-2 text-sm w-full"
                />
            </div>
            <span className="text-gray-500 font-medium">to</span>
            <div className="relative w-full">
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 pl-2 text-sm w-full"
                />
            </div>
        </div>

        <button 
          onClick={onSearchDate}
          className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md text-sm"
        >
          <Search size={16} />
          <span>Search</span>
        </button>
        
        <button 
          onClick={onRefresh} 
          className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-md text-sm"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
        <button 
          onClick={onAdvancedAnalysis}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-md text-sm whitespace-nowrap"
        >
          <BarChart size={16} /><span>Advanced Analysis</span>
        </button>
      </div>
    </div>
  );
};

const StatusTag = ({ status }) => {
  let colors = 'bg-gray-100 text-gray-700', text = 'Undefined';
  if (status === 2) { colors = 'bg-green-100 text-green-700'; text = 'Potential'; }
  else if (status === 3) { colors = 'bg-red-100 text-red-700'; text = 'Spam'; }
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors}`}>{text}</span>;
};

const AnalyzeTag = ({ analyzed }) => {
  let colors = 'bg-yellow-100 text-yellow-700', text = 'Pending';
  if (analyzed === 2) { colors = 'bg-green-100 text-green-700'; text = 'Analyzed'; }
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors}`}>{text}</span>;
};

const ConversationsTable = ({ 
  conversations = [], 
  onViewClick, 
  onAnalyzeClick, 
  onDeleteClick,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  
  return (
    <div className="bg-white rounded-lg shadow-md mt-6 w-full overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap">Conversations</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Show:</span>
          <select 
            className="border border-gray-300 rounded-md p-1 bg-white cursor-pointer"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <span>per page</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['STT', 'ID', 'Customer', 'Status', 'Analyze', 'Date & Time', 'Actions'].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {conversations.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <MessagesSquare size={48} className="text-gray-300 mb-2" />
                    <p className="text-lg font-medium text-gray-600">No conversations found</p>
                    <p className="text-sm text-gray-400">Try adjusting your filters or date range.</p>
                  </div>
                </td>
              </tr>
            )}
            {conversations.map((row, index) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[120px]" title={row.id}>
                  {row.id}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                  {row.userId ? row.userId : 'Guest'}
                </td>
                <td className="px-3 py-2 whitespace-nowrap"><StatusTag status={row.status} /></td>
                <td className="px-3 py-2 whitespace-nowrap"><AnalyzeTag analyzed={row.analyzed} /></td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">{formatDateTime(row.createdAt)}</td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onViewClick(row)} className="flex items-center text-orange-500 hover:text-orange-700 bg-orange-50 p-1.5 rounded-md" title="View">
                      <Eye size={16} /> 
                    </button>
                    <button onClick={() => onAnalyzeClick(row)} className="flex items-center text-green-500 hover:text-green-700 bg-green-50 p-1.5 rounded-md" title="Analyze">
                      <BarChart2 size={16} />
                    </button>
                    <button onClick={() => onDeleteClick(row)} className="flex items-center text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'}`}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-md text-sm font-medium border ${
                  page === currentPage
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'}`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ConversationDetailModal = ({ conversation, onClose }) => {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  if (!conversation) return null;
  const messages = conversation.messages || [];
  const isAnalyzed = conversation.analyzed === 2;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <div><h2 className="text-xl font-bold text-gray-900">Conversation Details</h2><p className="text-sm text-gray-500">View analysis information and messages</p></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon size={24} /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="mb-4"><h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Conversation ID</h3><p className="text-sm text-gray-800 font-mono bg-gray-100 p-2 rounded">{conversation.id}</p></div>
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer Information Analysis</h3>
            {isAnalyzed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3"><CheckCircle className="text-green-500" size={20} /><p className="text-sm text-green-700 font-semibold">Conversation has been analyzed successfully.</p></div>
                <div className="mt-2 pl-8 flex items-center space-x-2"><span className="text-sm font-medium text-gray-700">Result:</span><StatusTag status={conversation.status} /></div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3"><AlertTriangle className="text-yellow-500" size={20} /><p className="text-sm text-yellow-700">Not analyzed yet. Click "Analyze" to analyze the conversation.</p></div>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2 flex-wrap gap-y-2"><h3 className="text-xs font-semibold text-gray-500 uppercase">Message History</h3><span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{messages.length} messages</span></div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700"><Maximize size={14} /><span>Full View</span></button>
                <button className="flex items-center space-x-1 text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-300"><ArrowDownCircle size={14} /><span>Scroll</span></button>
              </div>
            </div>
            <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4 overflow-y-auto ${isChatExpanded ? 'max-h-[60vh]' : 'max-h-64'} transition-all duration-300 ease-in-out`}>
              {messages.length === 0 && <p className="text-sm text-gray-500 text-center">No messages in this conversation.</p>}
              {messages.map((message, index) => (
                message.sender === 'bot' ? (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-gray-200 p-2 rounded-full"><Bot size={20} className="text-gray-600" /></div>
                    <div className="flex-1">
                      <div className="flex items-baseline space-x-2"><span className="font-semibold text-sm text-gray-800">AI Assistant</span><span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span></div>
                      <div className="bg-gray-200 p-3 rounded-lg mt-1"><p className="text-sm text-gray-900 whitespace-pre-wrap">{message.content}</p></div>
                    </div>
                  </div>
                ) : (
                  <div key={index} className="flex items-start space-x-3 justify-end">
                    <div className="flex-1 max-w-md">
                      <div className="flex items-baseline space-x-2 justify-end"><span className="font-semibold text-sm text-orange-600">Customer</span><span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span></div>
                      <div className="bg-orange-100 p-3 rounded-lg mt-1"><p className="text-sm text-gray-900 whitespace-pre-wrap">{message.content}</p></div>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-full"><User size={20} className="text-orange-600" /></div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex gap-2">
            <button onClick={() => setIsChatExpanded(true)} className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-md ${isChatExpanded ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`} disabled={isChatExpanded}><ChevronUp size={14} /><span>Expand</span></button>
            <button onClick={() => setIsChatExpanded(false)} className={`flex items-center space-x-1 text-xs px-3 py-1.5 rounded-md ${!isChatExpanded ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-700'}`} disabled={!isChatExpanded}><ChevronDown size={14} /><span>Collapse</span></button>
          </div>
          <button onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold px-4 py-2 rounded-md text-sm">Close</button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type }) => {
  if (!isOpen) return null;
  const isDelete = type === 'delete';
  const confirmColor = isDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const icon = isDelete ? <AlertTriangle size={24} className="text-red-500" /> : <BarChart2 size={24} className="text-green-500" />;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon size={20} /></button>
        </div>
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full">{icon}</div>
            <div className="flex-1"><p className="text-sm text-gray-700">{message}</p></div>
          </div>
        </div>
        <div className="flex justify-end items-center p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
          <button onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-semibold px-4 py-2 rounded-md text-sm">Cancel</button>
          <button onClick={onConfirm} className={`text-white font-semibold px-4 py-2 rounded-md text-sm ${confirmColor}`}>{isDelete ? 'Delete' : 'Analyze'}</button>
        </div>
      </div>
    </div>
  );
};

const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center justify-between mb-4" role="alert">
      <div className="flex items-center"><Info size={20} className="mr-3" /><div><strong className="font-bold">Connection Error: </strong><span className="block sm:inline">Failed to connect to API. Displaying fallback data. (Error: {message})</span></div></div>
      <button onClick={onClose} className="ml-4 text-red-500 hover:text-red-700"><XIcon size={20} /></button>
    </div>
  );
};

// --- NEW COMPONENT: Advanced Analysis Modal ---
const AdvancedAnalysisModal = ({ isOpen, onClose, showNotification }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false); // State for sending ads process

  useEffect(() => {
    if (isOpen) {
      fetchAnalysisData();
    }
  }, [isOpen]);

  const fetchAnalysisData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/advance-analyst`, {
         headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
         }
      });
      if (!response.ok) throw new Error("Failed to fetch analysis data");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSendAds = async () => {
    setIsSending(true);
    try {
        const response = await fetch(`https://fearsome-ollie-correspondently.ngrok-free.dev/api/v1/mail/send-product-ads`, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            showNotification("Ads sent successfully to all eligible users!", "success");
            onClose(); // Optional: close modal on success
        } else {
            const errData = await response.json().catch(() => ({}));
            showNotification(`Failed to send ads: ${errData.message || "Unknown error"}`, "error");
        }
    } catch (error) {
        console.error("Error sending ads:", error);
        showNotification("Network error occurred while sending ads.", "error");
    } finally {
        setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
          <div>
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart className="text-purple-600" size={24} /> 
                Advanced Analysis
             </h2>
             <p className="text-sm text-slate-500 mt-1">Detailed user activity insights and marketing actions</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
             <XIcon size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-3" />
                <p>Analyzing data...</p>
             </div>
          ) : error ? (
             <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-center">
                Failed to load data: {error}
             </div>
          ) : data.length === 0 ? (
             <div className="text-center py-12 text-slate-500">No data available for analysis.</div>
          ) : (
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                   <thead className="bg-slate-50">
                      <tr>
                         <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User ID</th>
                         <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Orders</th>
                         <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Chats</th>
                         <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Spam</th>
                         <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Potential</th>
                         <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Undefined</th>
                      </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-slate-200">
                      {data.map((item) => (
                         <tr key={item.userId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                               #{item.userId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-600">
                               <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold text-xs">{item.totalOrders}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-600">{item.totalConversations}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600 font-medium">{item.spamCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-medium">{item.potentialCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-400">{item.undefinedCount}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
              Close
           </button>
           {/* Single Send Ads Button for the whole batch */}
           <button 
              onClick={handleBulkSendAds}
              disabled={loading || isSending || data.length === 0}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
           >
              {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send size={16} className="mr-2" />}
              {isSending ? 'Sending...' : 'Send Ads to All'}
           </button>
        </div>
      </div>
    </div>
  );
};

// ===================================================================================
// MAIN COMPONENT: ChatbotDashboard
// ===================================================================================

export const ChatbotDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [showErrorBanner, setShowErrorBanner] = useState(true);
  
  // === STATE CÁC BỘ LỌC ===
  const [statusFilter, setStatusFilter] = useState(0); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [confirmationState, setConfirmationState] = useState({ isOpen: false, type: null, data: null, title: '', message: '' });
  
  // === STATE ADVANCED ANALYSIS ===
  const [isAdvancedAnalysisModalOpen, setIsAdvancedAnalysisModalOpen] = useState(false);

  // === STATE NOTIFICATION ===
  const [notification, setNotification] = useState(null);

  // === STATE CHO PHÂN TRANG ===
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const isInitialMount = useRef(true);

  // === TÍNH TOÁN PHÂN TRANG ===
  const allConversations = overviewData?.conversations || [];
  const totalItems = allConversations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConversations = allConversations.slice(startIndex, startIndex + itemsPerPage);

  // Helper to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // === API CALLS ===
  
  // 1. Fetch Overview (Tải toàn bộ ban đầu)
  const fetchData = useCallback(async () => {
    setShowErrorBanner(true); setError(null);
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/overview`, { 
        method: 'GET', 
        mode: 'cors', 
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          "ngrok-skip-browser-warning": "true" 
        } 
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.code === 0 && data.result) { 
        setOverviewData(data.result); 
        setError(null);
        setCurrentPage(1); 
      } 
      else { throw new Error('Invalid data structure from API.'); }
    } catch (err) {
      console.error("Failed to fetch data:", err); setError(err.message); setOverviewData(getFakeData()); setShowErrorBanner(true);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 2. Execute Filter Status (Tự động chạy khi đổi dropdown)
  const executeFilterStatus = useCallback(async () => {
    if (statusFilter === 0) { if (!isInitialMount.current) await fetchData(); return; }
    console.log(`Filtering by status: ${statusFilter}`); setLoading(true); setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/filter-status?status=${statusFilter}`, { 
        method: 'GET', 
        mode: 'cors', 
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          "ngrok-skip-browser-warning": "true" 
        } 
      });
      if (!response.ok) throw new Error(`Filter API failed! status: ${response.status}`);
      const filteredConversations = await response.json();
      setOverviewData(prevData => ({ stats: prevData?.stats || getFakeData().stats, conversations: filteredConversations }));
      setCurrentPage(1);
    } catch (err) { console.error("Failed to filter data:", err); setError(err.message); setShowErrorBanner(true); } 
    finally { setLoading(false); }
  }, [statusFilter, fetchData]);

  useEffect(() => { if (isInitialMount.current) { isInitialMount.current = false; } else { executeFilterStatus(); } }, [statusFilter, executeFilterStatus]);


  // 3. Execute Date Filter (Khi nhấn nút Search)
  const handleDateSearch = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start date and end date.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/by-date?startDate=${startDate}&endDate=${endDate}`, { 
        method: 'GET', 
        mode: 'cors', 
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          "ngrok-skip-browser-warning": "true" 
        } 
      });

      if (!response.ok) {
        throw new Error(`Date filter API failed! status: ${response.status}`);
      }

      const filteredConversations = await response.json();
      // API trả về List<Conversation>
      setOverviewData(prevData => ({ 
        stats: prevData?.stats || getFakeData().stats, 
        conversations: filteredConversations 
      }));
      setCurrentPage(1); // Reset trang

    } catch (err) {
      console.error("Failed to filter by date:", err);
      setError(err.message);
      setShowErrorBanner(true);
    } finally {
      setLoading(false);
    }
  };


  const handleRefresh = useCallback(() => {
    setStartDate('');
    setEndDate('');
    if (statusFilter !== 0) {
       setStatusFilter(0); 
    } else {
       fetchData(); 
    }
  }, [statusFilter, fetchData]);

  // --- Event Handlers ---
  const handleViewClick = (conversationData) => { setSelectedConversation(conversationData); };
  const handleCloseModal = () => { setSelectedConversation(null); };
  const handleAnalyzeClick = (conversation) => { setConfirmationState({ isOpen: true, type: 'analyze', data: conversation, title: 'Confirm Analysis', message: `Are you sure you want to analyze conversation ID: ${conversation.id}?` }); };
  const handleDeleteClick = (conversation) => { setConfirmationState({ isOpen: true, type: 'delete', data: conversation, title: 'Confirm Deletion', message: `Are you sure you want to delete conversation ID: ${conversation.id}? This action cannot be undone.` }); };
  const handleCloseConfirmation = useCallback(() => { setConfirmationState({ isOpen: false, type: null, data: null, title: '', message: '' }); }, []);

  const handleConfirmAction = useCallback(async () => {
    const { type, data } = confirmationState;
    handleCloseConfirmation();
    if (error && !confirmationState.data.id.startsWith('fake_')) { alert("Cannot perform action: API connection failed. Please refresh."); return; }
    try {
      setLoading(true);
      if (type === 'analyze') {
        const response = await fetch(`${API_BASE_URL}/analyze/${data.id}`, { 
          method: 'POST', 
          mode: 'cors', 
          headers: { 
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "true"
          } 
        });
        if (!response.ok) throw new Error(`Analyze API failed! status: ${response.status}`);
        await fetchData();
      } else if (type === 'delete') {
        const response = await fetch(`${API_BASE_URL}/delete/${data.id}`, { 
          method: 'DELETE', 
          mode: 'cors',
          headers: { 
            "ngrok-skip-browser-warning": "true"
          }
        });
        if (!response.ok) throw new Error(`Delete API failed! status: ${response.status}`);
        await fetchData();
      }
    } catch (err) { console.error(`Failed to ${type} conversation:`, err); setError(err.message); setShowErrorBanner(true); } 
    finally { setLoading(false); }
  }, [confirmationState, fetchData, handleCloseConfirmation, error]);

  if (loading && !overviewData) {
    return (
      <MainLayout>
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center text-blue-600 text-xl font-medium px-4 py-2 rounded-lg">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Loading Dashboard...
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!overviewData || !overviewData.stats || !overviewData.conversations) {
    return ( 
      <MainLayout>
        <div className="flex h-full items-center justify-center flex-col">
          <p className="text-xl font-medium text-red-600">Failed to load any data.</p>
          {error && <p className="text-sm text-gray-500 mt-2">{error}</p>}
        </div>
      </MainLayout> 
    );
  }

  const derivedStats = [
    { id: 1, title: 'Conversations', value: overviewData.stats.totalConversations, icon: MessagesSquare, color: 'blue' },
    { id: 2, title: 'Analyzed', value: overviewData.stats.analyzedCount, icon: LineChart, color: 'green' },
    { id: 3, title: 'Pending', value: overviewData.stats.pendingCount, icon: Clock, color: 'yellow' },
    { id: 4, title: 'Potential (Good)', value: overviewData.stats.potentialCount, icon: CheckCircle2, color: 'green' },
    { id: 5, title: 'Spam', value: overviewData.stats.spamCount, icon: XCircle, color: 'red' },
  ];

  return (
    <MainLayout>
      <div className="relative">
        {loading && (
          <div className="fixed top-4 right-4 z-[100]">
            <div className="flex items-center bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Loading...
            </div>
          </div>
        )}

        {/* --- TOAST NOTIFICATION RENDER --- */}
        {notification && (
            <ToastNotification 
                message={notification.message} 
                type={notification.type} 
                onClose={() => setNotification(null)} 
            />
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-8 whitespace-nowrap">Manage user conversation</h1>
        {error && showErrorBanner && <ErrorBanner message={error} onClose={() => setShowErrorBanner(false)} />}

        <div className="space-y-6 mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {derivedStats.map((stat) => (
                <StatItem 
                  key={stat.id} 
                  title={stat.title} 
                  value={stat.value} 
                  icon={stat.icon} 
                  color={stat.color} 
                />
              ))}
            </div>
          </div>

          <ConversationsChart dailyStats={overviewData.stats.dailyStats} totalConversations={overviewData.stats.totalConversations} />
          
          <ConversationsFilterTabs 
            currentFilterValue={statusFilter} 
            onFilterChange={setStatusFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onSearchDate={handleDateSearch}
            onRefresh={handleRefresh} 
            onAdvancedAnalysis={() => setIsAdvancedAnalysisModalOpen(true)}
          />
          
          <ConversationsTable 
            conversations={paginatedConversations} 
            onViewClick={handleViewClick} 
            onAnalyzeClick={handleAnalyzeClick} 
            onDeleteClick={handleDeleteClick}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>

        <ConversationDetailModal conversation={selectedConversation} onClose={handleCloseModal} />
        <ConfirmationModal isOpen={confirmationState.isOpen} onClose={handleCloseConfirmation} onConfirm={handleConfirmAction} title={confirmationState.title} message={confirmationState.message} type={confirmationState.type} />
        
        {/* NEW: Advanced Analysis Modal with single Send Ads button and Toast integration */}
        <AdvancedAnalysisModal 
            isOpen={isAdvancedAnalysisModalOpen} 
            onClose={() => setIsAdvancedAnalysisModalOpen(false)} 
            showNotification={showNotification}
        />
      </div>
    </MainLayout>
  );
};