
import React, { useState, useRef } from 'react';
import { Camera, MapPin, Loader2, ArrowLeft, Trash2, Recycle, Hammer, Leaf, AlertTriangle } from 'lucide-react';
import { analyzeWasteImage } from '../services/geminiService';
import { WasteCategory, LocationData, WasteReport } from '../types';

interface NewReportFlowProps {
  onCancel: () => void;
  onSubmit: (report: Omit<WasteReport, 'id' | 'timestamp' | 'status' | 'token' | 'timeline'>) => void;
}

const CategoryIcon = ({ category }: { category: WasteCategory }) => {
  switch (category) {
    case WasteCategory.ROADSIDE: return <Trash2 size={18} />;
    case WasteCategory.BIN_OVERFLOW: return <Trash2 size={18} />;
    case WasteCategory.PLASTIC: return <Recycle size={18} />;
    case WasteCategory.WET: return <Leaf size={18} />;
    case WasteCategory.CONSTRUCTION: return <Hammer size={18} />;
    default: return <AlertTriangle size={18} />;
  }
};

export const NewReportFlow: React.FC<NewReportFlowProps> = ({ onCancel, onSubmit }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WasteCategory | null>(null);
  const [severity, setSeverity] = useState<number>(3); // Default medium severity
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locating, setLocating] = useState(false);
  const [safetyWarning, setSafetyWarning] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImage(base64);
      
      // Auto-trigger analysis
      setIsAnalyzing(true);
      try {
        const result = await analyzeWasteImage(base64);
        if (!category) setCategory(result.category);
        if (!description) setDescription(result.description);
        if (result.severity) setSeverity(result.severity);
        setSafetyWarning(result.safetyWarning);
        
        // Auto-fetch location if not already set (Zero Effort UX)
        if (!location) {
          handleGetLocation();
        }

      } catch (err) {
        console.error("Analysis failed", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGetLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate Address Fetching for "Zero Effort"
          setTimeout(() => {
             const mockAddresses = [
               { addr: "12 Main Market Road, Sector 4", city: "New Delhi", pin: "110001" },
               { addr: "Opp. Central Park, 5th Avenue", city: "Mumbai", pin: "400050" },
               { addr: "Near Metro Station Gate 2", city: "Bangalore", pin: "560001" }
             ];
             const random = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
             
             setLocation({
               latitude: position.coords.latitude,
               longitude: position.coords.longitude,
               address: random.addr,
               city: random.city,
               pincode: random.pin
             });
             setLocating(false);
          }, 1500); // Simulate network delay for "scanning" effect
        },
        (error) => {
          console.error("Location error", error);
          setLocating(false);
          // Fallback
          setLocation({
             latitude: 28.6139,
             longitude: 77.2090,
             address: "Manual Pin Location",
             city: "Delhi",
             pincode: "110001"
          });
        }
      );
    } else {
      alert("Geolocation not supported");
      setLocating(false);
    }
  };

  const handleSubmit = () => {
    if (!location) {
      alert("Please specify a location");
      return;
    }
    if (!category) {
        alert("Please select a category");
        return;
    }
    if (!image) {
        alert("Please upload a photo");
        return;
    }

    onSubmit({
      imageUrl: image,
      title: title || "Waste Report",
      category,
      description,
      severity: severity, // Use the AI-detected severity
      location,
      aiAnalysis: safetyWarning
    });
  };

  return (
    <div className="h-full flex flex-col bg-green-50/30">
      {/* Header */}
      <div className="bg-transparent p-4 flex items-center gap-3">
        <button onClick={onCancel} className="text-emerald-900 hover:bg-black/5 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="font-bold text-xl text-emerald-900">Report Garbage</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
        
        {/* Report Title */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <label className="block text-sm font-semibold text-gray-800 mb-2">Report Title</label>
           <input 
             type="text" 
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
             placeholder="E.g., Main Street Garbage Can"
           />
        </div>

        {/* Description */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <label className="block text-sm font-semibold text-gray-800 mb-2">Description (Optional)</label>
           <textarea 
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm resize-none"
             placeholder="Provide more details about the garbage location..."
             rows={3}
             maxLength={200}
           />
           <div className="text-right text-xs text-gray-400 mt-1">{description.length}/200</div>
        </div>

        {/* Upload Photo */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Upload Photo</label>
            
            {image ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img src={image} alt="Upload" className="w-full h-48 object-cover" />
                    <button 
                        onClick={() => { setImage(null); fileInputRef.current!.value = ''; }}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                    >
                        <Trash2 size={16} />
                    </button>
                    {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col text-white backdrop-blur-sm">
                            <Loader2 className="animate-spin mb-2 text-emerald-400" size={32} />
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">AI Analyzing Waste...</span>
                        </div>
                    )}
                </div>
            ) : (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-100 transition-colors gap-3"
                >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-emerald-600">
                        <Camera size={24} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-gray-800">Click to upload image</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                capture="environment"
                onChange={handleImageUpload}
            />
        </div>

        {/* Categories */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Select Categories</label>
            <div className="grid grid-cols-2 gap-3">
                {Object.values(WasteCategory).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium transition-all ${
                            category === cat 
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-sm' 
                                : 'bg-gray-50 border border-transparent text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <CategoryIcon category={cat} />
                        <span className="truncate">{cat}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Location - ENHANCED for Step 1 */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Location Details</label>
            {location ? (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-full text-emerald-600 shadow-sm">
                            <MapPin size={18} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">GPS Location Locked</h4>
                            <p className="text-xs text-gray-600 mt-1">{location.address}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-gray-500 font-mono">
                                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </span>
                                {location.pincode && (
                                    <span className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-gray-500 font-mono">
                                        PIN: {location.pincode}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button onClick={() => setLocation(null)} className="text-xs text-emerald-600 font-bold hover:underline">
                            Retry
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    {locating ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>Detecting City & Area...</span>
                        </>
                    ) : (
                        <>
                            <MapPin size={18} />
                            <span>Auto-Detect Location</span>
                        </>
                    )}
                </button>
            )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 pb-8">
            <button 
                onClick={handleSubmit}
                disabled={!location || !category || !image || isAnalyzing}
                className={`w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all ${
                    !location || !category || !image || isAnalyzing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:-translate-y-1'
                }`}
            >
                Submit Report
            </button>
        </div>

      </div>
    </div>
  );
};
