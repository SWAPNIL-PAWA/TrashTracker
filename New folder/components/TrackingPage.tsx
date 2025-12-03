
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin, CheckCircle, Clock, Calendar, AlertTriangle, ShieldCheck, Search, Share2, User } from 'lucide-react';
import { WasteReport, ReportStatus } from '../types';

declare global {
  interface Window {
    L: any;
  }
}

interface TrackingPageProps {
  report: WasteReport;
  onBack: () => void;
  onTrackNew: (token: string) => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({ report, onBack, onTrackNew }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [newToken, setNewToken] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newToken.trim()) {
        onTrackNew(newToken.trim());
        setNewToken('');
    }
  };

  // Helper to determine active step
  const getProgressStep = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.PENDING: return 1;
      case ReportStatus.ASSIGNED: return 2;
      case ReportStatus.IN_PROGRESS: return 3;
      case ReportStatus.RESOLVED: return 5;
      default: return 0;
    }
  };

  const currentStep = getProgressStep(report.status);

  // Timeline Step Component
  const TimelineStep = ({ 
    stepNumber, 
    label, 
    date,
    icon: Icon 
  }: { 
    stepNumber: number, 
    label: string, 
    date?: number,
    icon: any 
  }) => {
    
    const isCompleted = stepNumber <= currentStep;
    const isCurrent = stepNumber === currentStep;

    return (
      <div className="flex flex-row md:flex-col items-center gap-4 md:gap-3 relative z-10 w-full md:w-1/5">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-6 left-1/2 w-full h-1 bg-gray-100 -z-10" 
             style={{ display: stepNumber === 5 ? 'none' : 'block' }}>
           <div className={`h-full bg-emerald-500 transition-all duration-1000 ${isCompleted && stepNumber < currentStep ? 'w-full' : 'w-0'}`}></div>
        </div>

        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm ${
            isCompleted 
              ? 'bg-emerald-600 border-emerald-600 text-white' 
              : 'bg-white border-gray-200 text-gray-300'
          } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
        >
          <Icon size={20} />
        </div>
        <div className="flex-1 md:text-center">
          <p className={`text-sm font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
          {date && isCompleted && (
             <p className="text-xs text-emerald-600 font-medium mt-0.5">
                {new Date(date).toLocaleDateString()}
             </p>
          )}
          {isCurrent && !report.resolvedImageUrl && (
             <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider animate-pulse mt-1">
                Processing
             </p>
          )}
        </div>
      </div>
    );
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current && window.L) {
      // Create Map
      mapInstanceRef.current = window.L.map(mapRef.current, {
        center: [report.location.latitude, report.location.longitude],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false
      });

      // Add Tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstanceRef.current);

      // Custom Icon
      const iconHtml = `
            <div style="position: relative; width: 30px; height: 30px; display: flex; justify-content: center;">
                <div style="position: absolute; top: 0; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="#EF4444" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                        <circle cx="12" cy="9" r="2.5" fill="white"></circle>
                    </svg>
                </div>
            </div>
      `;
      const customIcon = window.L.divIcon({
          className: 'custom-pin',
          html: iconHtml,
          iconSize: [30, 30],
          iconAnchor: [15, 30]
      });

      // Add Marker
      window.L.marker([report.location.latitude, report.location.longitude], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup("<b>Garbage Location</b><br>Reported here.").openPopup();

    } else if (mapInstanceRef.current) {
        // Update view if report changes
        mapInstanceRef.current.setView([report.location.latitude, report.location.longitude], 16);
    }
  }, [report]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Search */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 py-3 shadow-sm">
        <div className="container mx-auto flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Track Complaint</h1>
                    <p className="text-xs text-gray-500 font-mono">{report.token}</p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                <input 
                    type="text" 
                    value={newToken}
                    onChange={(e) => setNewToken(e.target.value)}
                    placeholder="Track another token..." 
                    className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6 max-w-5xl">
        
        {/* Status Timeline Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Status Timeline</h2>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between relative">
                <TimelineStep 
                    stepNumber={1} 
                    label="Submitted" 
                    date={report.timestamp} 
                    icon={Clock} 
                />
                <TimelineStep 
                    stepNumber={2} 
                    label="Assigned" 
                    icon={User} 
                />
                <TimelineStep 
                    stepNumber={3} 
                    label="Worker Reached" 
                    icon={MapPin} 
                />
                <TimelineStep 
                    stepNumber={4} 
                    label="Cleaned" 
                    icon={CheckCircle} 
                />
                <TimelineStep 
                    stepNumber={5} 
                    label="Verified & Closed" 
                    date={report.status === ReportStatus.RESOLVED ? Date.now() : undefined} 
                    icon={ShieldCheck} 
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Details & Map Column */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Map Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <MapPin size={18} className="text-emerald-600" /> Location Details
                        </h3>
                        <div className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                             {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
                        </div>
                    </div>
                    <div className="h-64 relative bg-gray-100 z-0">
                        <div ref={mapRef} className="w-full h-full" />
                    </div>
                    <div className="p-4 bg-white relative z-10">
                        <p className="text-sm font-bold text-gray-900">{report.location.address || "Address not available"}</p>
                        <p className="text-xs text-gray-500 mt-1">{report.location.city} • {report.location.pincode}</p>
                    </div>
                </div>

                {/* Report Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} className="text-orange-500" /> Report Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Category</p>
                            <p className="text-sm font-medium text-gray-900 bg-gray-100 inline-block px-3 py-1 rounded-full">
                                {report.category}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Severity</p>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(lvl => (
                                    <div key={lvl} className={`h-2 w-6 rounded-full ${
                                        lvl <= report.severity 
                                        ? (report.severity >= 4 ? 'bg-red-500' : 'bg-yellow-400') 
                                        : 'bg-gray-200'
                                    }`} />
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{report.severity >= 4 ? 'High Priority' : 'Normal Priority'}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Description</p>
                            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {report.description || "No description provided."}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Photos Column */}
            <div className="space-y-6">
                
                {/* Before Photo */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 bg-red-50 flex justify-between items-center">
                        <span className="font-bold text-red-700 text-sm">Before Cleaning</span>
                        <Calendar size={14} className="text-red-400" />
                    </div>
                    <div className="relative h-48 bg-gray-100 group cursor-pointer">
                        <img src={report.imageUrl} alt="Reported" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <div className="p-3 bg-white">
                        <p className="text-xs text-gray-400">Reported on {new Date(report.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* After Photo */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 bg-emerald-50 flex justify-between items-center">
                        <span className="font-bold text-emerald-700 text-sm">After Cleaning</span>
                        <ShieldCheck size={14} className="text-emerald-500" />
                    </div>
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                        {report.resolvedImageUrl ? (
                            <img src={report.resolvedImageUrl} alt="Resolved" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-6 text-gray-400">
                                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-xs font-medium">Waiting for completion...</p>
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-white">
                        {report.resolvedImageUrl ? (
                            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                <CheckCircle size={12} /> Verified Resolution
                            </p>
                        ) : (
                            <p className="text-xs text-gray-400">Worker has not updated yet</p>
                        )}
                    </div>
                </div>

                {/* Share Button */}
                <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                    <Share2 size={18} /> Share Status
                </button>

            </div>
        </div>
      </div>
    </div>
  );
};
