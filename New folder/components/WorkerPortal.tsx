
import React, { useState, useRef } from 'react';
import { WasteReport, ReportStatus } from '../types';
import { ArrowLeft, CheckCircle, Clock, MapPin, Camera, LogOut, Upload, Loader2 } from 'lucide-react';

interface WorkerPortalProps {
  reports: WasteReport[];
  onUpdateStatus: (id: string, newStatus: ReportStatus, resolvedImage?: string) => void;
  onBack: () => void;
}

export const WorkerPortal: React.FC<WorkerPortalProps> = ({ reports, onUpdateStatus, onBack }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [workerId, setWorkerId] = useState('');
  const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED'>('PENDING');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedReportForUpload, setSelectedReportForUpload] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (workerId.trim().length > 3) {
      setIsLoggedIn(true);
    } else {
      alert("Please enter a valid Worker ID (min 4 chars)");
    }
  };

  const handleStatusChange = (id: string, status: ReportStatus) => {
    onUpdateStatus(id, status);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedReportForUpload) {
      setUploadingId(selectedReportForUpload);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simulate network delay
        setTimeout(() => {
          onUpdateStatus(selectedReportForUpload, ReportStatus.RESOLVED, reader.result as string);
          setUploadingId(null);
          setSelectedReportForUpload(null);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const pendingReports = reports.filter(r => 
    r.status === ReportStatus.PENDING || 
    r.status === ReportStatus.ASSIGNED || 
    r.status === ReportStatus.IN_PROGRESS
  );
  
  const resolvedReports = reports.filter(r => r.status === ReportStatus.RESOLVED);

  const displayReports = activeTab === 'PENDING' ? pendingReports : resolvedReports;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <UsersIcon className="text-orange-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Worker Portal</h1>
            <p className="text-gray-500 text-sm mt-1">Municipal Staff Login</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Worker ID</label>
              <input 
                type="text" 
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                placeholder="Enter ID (e.g. W-1024)"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-mono"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
            >
              Login
            </button>
            <button 
              type="button"
              onClick={onBack}
              className="w-full py-2 text-gray-400 text-sm hover:text-gray-600"
            >
              Cancel & Return to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-orange-600 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="flex justify-between items-center container mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
               <span className="font-bold text-lg">W</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">Worker Panel</h1>
              <p className="text-orange-100 text-xs">ID: {workerId}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="p-2 bg-orange-700 rounded-lg hover:bg-orange-800 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-40">
        <div className="container mx-auto flex">
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === 'PENDING' ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-transparent text-gray-500'
            }`}
          >
            Pending Tasks ({pendingReports.length})
          </button>
          <button 
            onClick={() => setActiveTab('RESOLVED')}
            className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${
              activeTab === 'RESOLVED' ? 'border-green-600 text-green-600 bg-green-50' : 'border-transparent text-gray-500'
            }`}
          >
            Completed ({resolvedReports.length})
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 p-4 container mx-auto max-w-2xl">
        <div className="space-y-4">
          {displayReports.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
               <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
               <p>No reports found in this section.</p>
            </div>
          ) : (
            displayReports.map(report => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative h-48">
                  <img src={report.imageUrl} alt="Waste" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                    {report.category}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                     <p className="font-bold truncate">{report.location.address || "Detected Location"}</p>
                     <p className="text-xs text-gray-300">{new Date(report.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="p-5">
                   <div className="flex items-start justify-between mb-4">
                     <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Token</p>
                        <p className="font-mono font-bold text-gray-800">{report.token}</p>
                     </div>
                     <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                       report.status === ReportStatus.RESOLVED ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                     }`}>
                       {report.status.replace('_', ' ')}
                     </div>
                   </div>

                   {/* Action Buttons */}
                   {activeTab === 'PENDING' && (
                     <div className="grid grid-cols-2 gap-3 mt-4">
                        {report.status === ReportStatus.PENDING && (
                           <button 
                             onClick={() => handleStatusChange(report.id, ReportStatus.ASSIGNED)}
                             className="col-span-2 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                           >
                             Accept Task
                           </button>
                        )}
                        
                        {(report.status === ReportStatus.ASSIGNED || report.status === ReportStatus.IN_PROGRESS) && (
                           <>
                             <button 
                               onClick={() => handleStatusChange(report.id, ReportStatus.IN_PROGRESS)}
                               disabled={report.status === ReportStatus.IN_PROGRESS}
                               className={`py-3 rounded-lg font-bold border border-gray-200 transition-colors ${
                                 report.status === ReportStatus.IN_PROGRESS ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                               }`}
                             >
                               {report.status === ReportStatus.IN_PROGRESS ? 'In Progress' : 'Start Work'}
                             </button>
                             <button 
                               onClick={() => {
                                 setSelectedReportForUpload(report.id);
                                 fileInputRef.current?.click();
                               }}
                               className="py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                             >
                               {uploadingId === report.id ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                               Mark Cleaned
                             </button>
                           </>
                        )}
                     </div>
                   )}

                   {activeTab === 'RESOLVED' && report.resolvedImageUrl && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                         <p className="text-xs text-green-600 font-bold mb-2 flex items-center gap-2">
                           <CheckCircle size={14} /> Cleanup Verified
                         </p>
                         <img src={report.resolvedImageUrl} alt="Proof" className="w-full h-32 object-cover rounded-lg border-2 border-green-100" />
                      </div>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        capture="environment"
        onChange={handleImageUpload}
      />
    </div>
  );
};

const UsersIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
