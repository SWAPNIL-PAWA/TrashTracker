
import React, { useState } from 'react';
import { ViewState, WasteReport, ReportStatus, WasteCategory, UserStats } from './types';
import { NewReportFlow } from './components/NewReportFlow';
import { LandingPage } from './components/LandingPage';
import { HotspotMap } from './components/HotspotMap';
import { WorkerPortal } from './components/WorkerPortal';
import { TrackingPage } from './components/TrackingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CheckCircle, MapPin, Clock, Camera, X, Copy } from 'lucide-react';

// Mock Data
const MOCK_REPORTS: WasteReport[] = [
  {
    id: '1',
    token: 'TT-IND-2025-10001',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    title: 'Overflowing Bin at Market',
    category: WasteCategory.BIN_OVERFLOW,
    description: 'The main dustbin is full and garbage is spilling on the road.',
    severity: 4,
    location: { latitude: 28.6304, longitude: 77.2177, address: 'Connaught Place, Delhi', city: 'Delhi', pincode: '110001' },
    timestamp: Date.now() - 3600000,
    status: ReportStatus.PENDING,
    timeline: [{ status: ReportStatus.PENDING, timestamp: Date.now() - 3600000 }]
  },
  {
    id: '2',
    token: 'TT-IND-2025-10002',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    title: 'Chemical drums dumped',
    category: WasteCategory.OTHER,
    description: 'Suspicious blue drums left in the alleyway. Smells bad.',
    severity: 5,
    location: { latitude: 19.0760, longitude: 72.8777, address: '45 Industrial Ave, Mumbai', city: 'Mumbai', pincode: '400001' },
    timestamp: Date.now() - 86400000,
    status: ReportStatus.IN_PROGRESS,
    timeline: [
        { status: ReportStatus.PENDING, timestamp: Date.now() - 86400000 },
        { status: ReportStatus.ASSIGNED, timestamp: Date.now() - 43200000 },
        { status: ReportStatus.IN_PROGRESS, timestamp: Date.now() - 10000000 }
    ]
  },
  {
    id: '3',
    token: 'TT-IND-2025-10003',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    title: 'Construction Debris',
    category: WasteCategory.CONSTRUCTION,
    description: 'Leftover bricks and cement bags blocking the sidewalk.',
    severity: 2,
    location: { latitude: 12.9716, longitude: 77.5946, address: '88 Residential Blvd, Bangalore', city: 'Bangalore', pincode: '560001' },
    timestamp: Date.now() - 172800000,
    status: ReportStatus.RESOLVED,
    timeline: [
        { status: ReportStatus.PENDING, timestamp: Date.now() - 172800000 },
        { status: ReportStatus.RESOLVED, timestamp: Date.now() - 100000 }
    ],
    resolvedImageUrl: 'https://picsum.photos/400/300?random=10'
  },
  {
    id: '4',
    token: 'TT-IND-2025-48291',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    title: 'Garbage Pile on MG Road',
    category: WasteCategory.ROADSIDE,
    description: 'Huge pile of mixed waste blocking the pedestrian path near the metro station.',
    severity: 4,
    location: { latitude: 12.97, longitude: 77.59, address: 'MG Road, Bangalore', city: 'Bangalore', pincode: '560025' },
    timestamp: Date.now() - 7200000,
    status: ReportStatus.IN_PROGRESS,
    timeline: [
        { status: ReportStatus.PENDING, timestamp: Date.now() - 7200000 },
        { status: ReportStatus.ASSIGNED, timestamp: Date.now() - 3600000 },
        { status: ReportStatus.IN_PROGRESS, timestamp: Date.now() - 1800000 }
    ]
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [reports, setReports] = useState<WasteReport[]>(MOCK_REPORTS);
  const [trackedReport, setTrackedReport] = useState<WasteReport | null>(null);

  // State for Success Modal
  const [lastSubmittedReport, setLastSubmittedReport] = useState<WasteReport | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const generateToken = () => {
    // Generate a format like TT-IND-2025-XXXXX
    const random = Math.floor(10000 + Math.random() * 90000);
    return `TT-IND-2025-${random}`;
  };

  const handleNewReportSubmit = (newReportData: Omit<WasteReport, 'id' | 'timestamp' | 'status' | 'token' | 'timeline'>) => {
    const newToken = generateToken();
    const timestamp = Date.now();
    const newReport: WasteReport = {
      ...newReportData,
      id: Math.random().toString(36).substr(2, 9),
      token: newToken,
      timestamp: timestamp,
      status: ReportStatus.PENDING,
      timeline: [{ status: ReportStatus.PENDING, timestamp: timestamp }]
    };
    
    setReports([newReport, ...reports]);
    
    // Show Success Modal
    setLastSubmittedReport(newReport);
    setShowSuccessModal(true);
    setView('LANDING');
  };

  const getReportByToken = (token: string) => {
    return reports.find(r => r.token.toUpperCase() === token.toUpperCase());
  };

  const handleTrackReport = (report: WasteReport) => {
    setTrackedReport(report);
    setView('TRACK');
  };

  const handleTrackNew = (token: string) => {
    const report = getReportByToken(token);
    if (report) {
      setTrackedReport(report);
    } else {
      alert("Token not found! Please check the number and try again.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleUpdateStatus = (id: string, newStatus: ReportStatus, resolvedImage?: string) => {
      setReports(prev => prev.map(r => {
          if (r.id === id) {
              const updatedReport = {
                  ...r,
                  status: newStatus,
                  timeline: [...r.timeline, { status: newStatus, timestamp: Date.now() }]
              };
              if (resolvedImage) {
                  updatedReport.resolvedImageUrl = resolvedImage;
              }
              return updatedReport;
          }
          return r;
      }));
  };

  // Render Success Modal (Report Submitted)
  const renderSuccessModal = () => {
    if (!showSuccessModal || !lastSubmittedReport) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
          <div className="bg-emerald-600 p-6 text-center text-white">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold">Report Submitted!</h3>
            <p className="text-emerald-100 text-sm mt-1">Thank you for helping keep India clean.</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Your Tracking Token</p>
              <div 
                onClick={() => copyToClipboard(lastSubmittedReport.token)}
                className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-100 transition-colors"
              >
                <span className="text-xl font-mono font-bold text-emerald-800 tracking-wider">
                  {lastSubmittedReport.token}
                </span>
                <span className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  <Copy size={10} /> Tap to copy
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">Use this token to track the status of your complaint.</p>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <MapPin size={18} className="text-emerald-600" />
                <span>Location saved successfully</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Clock size={18} className="text-emerald-600" />
                <span>Time: {new Date(lastSubmittedReport.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Camera size={18} className="text-emerald-600" />
                <span>Image uploaded securely</span>
              </div>
            </div>

            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (view === 'LANDING') {
    return (
      <>
        {renderSuccessModal()}
        <LandingPage 
          onStartReporting={() => setView('REPORT')}
          onViewMap={() => setView('DASHBOARD')}
          onWorkerPortal={() => setView('WORKER')}
          onAdminPortal={() => setView('ADMIN')}
          onTrackReport={handleTrackReport}
          getReportByToken={getReportByToken}
        />
      </>
    );
  }

  const renderContent = () => {
    switch (view) {
      case 'DASHBOARD':
        return (
          <HotspotMap 
            reports={reports} 
            onBack={() => setView('LANDING')} 
          />
        );

      case 'WORKER':
        return (
           <WorkerPortal 
             reports={reports}
             onUpdateStatus={handleUpdateStatus}
             onBack={() => setView('LANDING')}
           />
        );
      
      case 'ADMIN':
        return (
            <AdminDashboard
                reports={reports}
                onViewMap={() => setView('DASHBOARD')}
                onBack={() => setView('LANDING')}
            />
        );

      case 'TRACK':
        if (!trackedReport) return <div onClick={() => setView('LANDING')}>Error: No report selected</div>;
        return (
            <TrackingPage 
                report={trackedReport}
                onBack={() => setView('LANDING')}
                onTrackNew={handleTrackNew}
            />
        );

      case 'REPORT':
        return (
          <div className="h-full">
            <NewReportFlow 
              onCancel={() => setView('LANDING')}
              onSubmit={handleNewReportSubmit}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen relative max-w-md mx-auto shadow-2xl overflow-hidden flex flex-col h-screen">
      {/* If map, admin, landing view, expand max width to desktop */}
      <style>{`
        ${['DASHBOARD', 'LANDING', 'WORKER', 'TRACK', 'ADMIN'].includes(view) ? '.max-w-md { max-width: 100% !important; height: 100vh; }' : ''}
      `}</style>

      {renderSuccessModal()}
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
