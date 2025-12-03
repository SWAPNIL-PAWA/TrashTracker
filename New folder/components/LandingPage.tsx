
import React, { useState, useEffect } from 'react';
import { 
  Camera, MapPin, Users, Leaf, 
  Trash2, AlignLeft, Award, WifiOff, Search, Globe, AlertCircle, X
} from 'lucide-react';
import { WasteReport } from '../types';

interface LandingPageProps {
  onStartReporting: () => void;
  onViewMap: () => void;
  onWorkerPortal: () => void;
  onAdminPortal: () => void;
  onTrackReport: (report: WasteReport) => void;
  getReportByToken: (token: string) => WasteReport | undefined;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartReporting, 
  onViewMap,
  onWorkerPortal,
  onAdminPortal,
  onTrackReport,
  getReportByToken,
}) => {
  const [trackToken, setTrackToken] = useState('');
  const [searchError, setSearchError] = useState('');
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Show intro popup once per session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) {
      setTimeout(() => setShowIntro(true), 1000);
    }
  }, []);

  const handleCloseIntro = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackToken.trim()) {
      const report = getReportByToken(trackToken.trim());
      if (report) {
        setSearchError('');
        onTrackReport(report);
      } else {
        setSearchError('Token not found. Please check and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* Intro Popup */}
      {showIntro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={handleCloseIntro}
              className="absolute top-4 right-4 p-1 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
            >
              <X size={20} />
            </button>
            <div className="text-center p-8 pb-0">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                 <Leaf size={40} className="text-green-600" />
               </div>
               <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome to TrashTracker India 🇮🇳</h2>
               <p className="text-gray-500 text-sm">Keeping your city clean made simple.</p>
            </div>
            
            <div className="p-8 space-y-6">
               <div className="flex justify-between items-center text-xs font-bold text-gray-400 px-2">
                 <span>Upload</span>
                 <span>Get Token</span>
                 <span>Track</span>
                 <span>Clean City</span>
               </div>
               <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                 <div className="w-1/4 bg-green-500"></div>
                 <div className="w-1/4 bg-blue-500"></div>
                 <div className="w-1/4 bg-orange-500"></div>
                 <div className="w-1/4 bg-emerald-500"></div>
               </div>
               
               <button 
                 onClick={handleCloseIntro}
                 className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all"
               >
                 Get Started
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <Leaf size={20} fill="currentColor" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-lg text-gray-900 tracking-tight">TrashTracker</span>
              <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">India</span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-green-200 rounded-full text-sm font-medium text-green-700 hover:bg-green-50 transition-colors">
            <Globe size={16} />
            English
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 overflow-hidden bg-green-50/50">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-48 h-48 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-green-100 p-4 animate-in zoom-in duration-500">
               <div className="text-center">
                 <div className="flex justify-center mb-2">
                   <div className="relative">
                     <Leaf size={48} className="text-green-600 z-10 relative" />
                     <Trash2 size={24} className="text-blue-500 absolute -bottom-1 -right-1" />
                   </div>
                 </div>
                 <div className="font-bold text-green-800 text-sm mt-2">TRASH TRACKER</div>
                 <div className="text-[10px] text-green-600 font-medium">INDIA</div>
                 <div className="text-[8px] text-green-400 mt-1">CLEANER INDIA, SMARTER INDIA</div>
               </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Cleaner India, <span className="text-green-600">Smarter India</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Welcome to TrashTracker — help us keep your city clean by reporting garbage hotspots instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={onStartReporting}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1"
            >
              Report Garbage Now
            </button>
            <button 
              onClick={onViewMap}
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 border-2 border-green-600 rounded-xl font-bold transition-all"
            >
              View Hotspots Map
            </button>
          </div>

          {/* Track Your Report Section */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform translate-y-4">
             <div className="flex items-center gap-2 mb-6 justify-center">
               <Search size={24} className="text-green-600" />
               <h3 className="text-xl font-bold text-gray-800">Track Your Complaint</h3>
             </div>
             
             <div className="w-full">
                 <form onSubmit={handleTrackSubmit} className="relative max-w-md mx-auto">
                    <input 
                        type="text" 
                        value={trackToken}
                        onChange={(e) => setTrackToken(e.target.value)}
                        placeholder="Enter Token (e.g., TT-IND-2025-48291)" 
                        className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-mono text-base shadow-inner"
                    />
                    <button 
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-green-600 text-white px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-bold"
                    >
                        Track
                    </button>
                </form>
                {searchError && (
                    <div className="mt-3 text-red-500 text-sm font-medium flex items-center justify-center gap-2 animate-pulse">
                        <AlertCircle size={16} />
                        {searchError}
                    </div>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose TrashTracker?</h2>
            <p className="text-gray-500">Built for Indian cities. Designed for real problems. Optimized for scale.</p>
          </div>
           <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                color: "green",
                title: "Report with Photos",
                desc: "Capture garbage issues instantly. Add location, category, and description. Upload later if offline.",
                points: ["Auto GPS detection", "Multiple categories", "Offline saving"]
              },
              {
                icon: MapPin,
                color: "blue",
                title: "Real-time Hotspots",
                desc: "See live garbage concentration on interactive map. Identify problem areas in your city instantly.",
                points: ["Density heatmap", "Severity levels", "Area-wise tracking"]
              },
              {
                icon: Users,
                color: "orange",
                title: "Worker Dashboard",
                desc: "Municipal workers view reports, assign tasks, and update status in real-time.",
                points: ["Task assignment", "Status tracking", "Performance metrics"]
              },
              {
                icon: AlignLeft,
                color: "purple",
                title: "Before/After Proof",
                desc: "Workers upload cleanup photos. Citizens verify completion. Build accountability with visual proof.",
                points: ["Photo comparison", "Slider verification", "Timestamp records"]
              },
              {
                icon: Award,
                color: "yellow",
                title: "Swachhta Badges",
                desc: "Earn badges: Swachhta Samrat. Climb weekly leaderboards. Lead the cleanliness movement.",
                points: ["Community badges", "Weekly rankings", "Ward comparisons"]
              },
              {
                icon: WifiOff,
                color: "cyan",
                title: "Works Offline",
                desc: "Low signal? No problem. Save reports locally. Auto-sync when connection returns.",
                points: ["Local storage", "Auto sync", "Network indicator"]
              }
            ].map((card, idx) => {
               const colorClasses = {
                green: { bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-600', dot: 'bg-green-500' },
                blue: { bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-600', dot: 'bg-blue-500' },
                orange: { bg: 'bg-orange-50', border: 'border-orange-100', iconBg: 'bg-orange-600', dot: 'bg-orange-500' },
                purple: { bg: 'bg-purple-50', border: 'border-purple-100', iconBg: 'bg-purple-600', dot: 'bg-purple-500' },
                yellow: { bg: 'bg-yellow-50', border: 'border-yellow-100', iconBg: 'bg-yellow-600', dot: 'bg-yellow-500' },
                cyan: { bg: 'bg-cyan-50', border: 'border-cyan-100', iconBg: 'bg-cyan-600', dot: 'bg-cyan-500' },
              }[card.color] || { bg: 'bg-gray-50', border: 'border-gray-100', iconBg: 'bg-gray-600', dot: 'bg-gray-500' };

              return (
                <div key={idx} className={`${colorClasses.bg} p-8 rounded-2xl border ${colorClasses.border} hover:shadow-lg transition-shadow`}>
                  <div className={`w-12 h-12 ${colorClasses.iconBg} rounded-lg flex items-center justify-center text-white mb-6`}>
                    <card.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed min-h-[60px]">
                    {card.desc}
                  </p>
                  <ul className="space-y-2 text-xs text-gray-500">
                    {card.points.map((p, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 ${colorClasses.dot} rounded-full`}></div>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="font-bold text-lg mb-4">TrashTracker India</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                A civic engagement platform for a cleaner, smarter India. Report waste. Engage communities. Track impact.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><button onClick={onStartReporting} className="hover:text-white transition-colors">Report Garbage</button></li>
                <li><button onClick={onViewMap} className="hover:text-white transition-colors">View Hotspots</button></li>
                <li><button onClick={onWorkerPortal} className="hover:text-white transition-colors">Worker Portal</button></li>
                <li><button onClick={onAdminPortal} className="hover:text-white transition-colors">Admin Portal</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Information</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Support Swachh Bharat</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Part of the National Clean India Mission. Together, we build cleaner cities.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
            © 2025 TrashTracker India. Building Cleaner India, Smarter India.
          </div>
        </div>
      </footer>
    </div>
  );
};
