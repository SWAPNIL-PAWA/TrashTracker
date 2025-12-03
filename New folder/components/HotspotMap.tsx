
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Search, Map as MapIcon, Layers } from 'lucide-react';
import { WasteReport } from '../types';

declare global {
  interface Window {
    L: any;
  }
}

interface HotspotMapProps {
  reports: WasteReport[];
  onBack: () => void;
}

// Mock Data - Major Cities in India
const MOCK_HOTSPOTS = [
  { id: 101, name: 'Connaught Place', city: 'Delhi', count: 18, severity: 'high', lat: 28.6304, lng: 77.2177 },
  { id: 102, name: 'Noida Sector 18', city: 'Delhi NCR', count: 12, severity: 'medium', lat: 28.5747, lng: 77.3560 },
  { id: 103, name: 'Marine Drive', city: 'Mumbai', count: 20, severity: 'high', lat: 18.922, lng: 72.823 },
  { id: 104, name: 'Dadar Market', city: 'Mumbai', count: 14, severity: 'medium', lat: 19.017, lng: 72.847 },
  { id: 105, name: 'Koregaon Park', city: 'Pune', count: 12, severity: 'high', lat: 18.536, lng: 73.893 },
  { id: 106, name: 'Hinjewadi Phase 1', city: 'Pune', count: 5, severity: 'medium', lat: 18.591, lng: 73.739 },
  { id: 107, name: 'MG Road', city: 'Bangalore', count: 16, severity: 'high', lat: 12.971, lng: 77.594 },
  { id: 108, name: 'Indiranagar', city: 'Bangalore', count: 8, severity: 'medium', lat: 12.978, lng: 77.640 },
  { id: 109, name: 'Marina Beach', city: 'Chennai', count: 9, severity: 'medium', lat: 13.0500, lng: 80.2824 },
  { id: 110, name: 'Park Street', city: 'Kolkata', count: 15, severity: 'high', lat: 22.555, lng: 88.351 },
  { id: 111, name: 'Charminar Area', city: 'Hyderabad', count: 11, severity: 'medium', lat: 17.3616, lng: 78.4747 },
];

export const HotspotMap: React.FC<HotspotMapProps> = ({ reports, onBack }) => {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  
  const cities = ['All Cities', 'Bangalore', 'Chennai', 'Delhi', 'Delhi NCR', 'Hyderabad', 'Kolkata', 'Mumbai', 'Pune'];

  const filteredHotspots = selectedCity === 'All Cities' 
    ? MOCK_HOTSPOTS 
    : MOCK_HOTSPOTS.filter(h => h.city === selectedCity);

  // Initialize Leaflet Map
  useEffect(() => {
    // Small delay to ensure container has dimensions
    const timer = setTimeout(() => {
        if (mapRef.current && !mapInstanceRef.current && window.L) {
            // Create Map with attributionControl disabled
            mapInstanceRef.current = window.L.map(mapRef.current, { attributionControl: false }).setView([20.5937, 78.9629], 5);

            // Add OpenStreetMap Tiles
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);

            // Initialize Layer Group for markers
            layerGroupRef.current = window.L.layerGroup().addTo(mapInstanceRef.current);
            
            // Initial marker render
            updateMarkers();
        }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Update markers whenever filtered data changes
  useEffect(() => {
    if (mapInstanceRef.current && layerGroupRef.current) {
        updateMarkers();
    }
  }, [selectedCity, filteredHotspots]);

  // Handle Resize for Responsive Layout
  useEffect(() => {
    const handleResize = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
        }
    };
    window.addEventListener('resize', handleResize);
    // Call once immediately in case of layout shift
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateMarkers = () => {
    if (!layerGroupRef.current || !window.L) return;

    layerGroupRef.current.clearLayers();

    filteredHotspots.forEach(spot => {
        const isHigh = spot.severity === 'high';
        const color = isHigh ? '#EF4444' : '#F59E0B';
        const fillColor = isHigh ? '#EF4444' : '#3B82F6';

        // 1. Add Heatmap Circle
        window.L.circle([spot.lat, spot.lng], {
            color: fillColor,
            fillColor: fillColor,
            fillOpacity: 0.2,
            radius: isHigh ? 8000 : 5000,
            weight: 1
        }).addTo(layerGroupRef.current);

        // 2. Add Custom Pin Icon
        const iconHtml = `
            <div style="position: relative; width: 30px; height: 30px; display: flex; justify-content: center;">
                <div style="position: absolute; top: 0; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });

        // 3. Add Marker
        const marker = window.L.marker([spot.lat, spot.lng], { icon: customIcon })
            .addTo(layerGroupRef.current);

        // 4. Add Popup
        const popupContent = `
            <div style="padding: 12px; font-family: 'Inter', sans-serif;">
                <h3 style="font-weight: 700; color: #1F2937; margin-bottom: 4px;">${spot.name}</h3>
                <p style="color: #6B7280; font-size: 12px; margin-bottom: 8px;">${spot.city}</p>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: ${isHigh ? '#FEF2F2' : '#FFFBEB'}; color: ${isHigh ? '#DC2626' : '#D97706'}; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid ${isHigh ? '#FECACA' : '#FDE68A'}; text-transform: uppercase;">
                        ${spot.severity}
                    </span>
                    <span style="font-size: 11px; font-weight: 600; color: #4B5563;">${spot.count} Reports</span>
                </div>
            </div>
        `;
        marker.bindPopup(popupContent);
    });

    // Auto-center map logic
    if (selectedCity !== 'All Cities' && filteredHotspots.length > 0) {
        const latLngs = filteredHotspots.map(s => [s.lat, s.lng]);
        const bounds = window.L.latLngBounds(latLngs);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center px-4 justify-between bg-white z-30 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
              <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MapIcon size={18} className="text-emerald-600" /> Garbage Hotspots
              </h1>
              <p className="text-xs text-gray-500">Live data from TrashTracker India</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-medium bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600">
          <Layers size={14} />
          <span>OpenStreetMap View</span>
        </div>
      </div>

      {/* Main Content: Responsive Layout */}
      {/* Mobile: Column (Map Top, List Bottom). Desktop: Row (Map Left, List Right) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Map Area */}
        <div className="flex-1 bg-slate-100 relative z-0 min-h-[50%] md:min-h-0">
             <div 
               ref={mapRef} 
               id="map" 
               className="w-full h-full"
             />

             {/* Map Controls Overlay */}
             <div className="absolute top-4 right-4 md:bottom-6 md:left-6 md:top-auto md:right-auto flex flex-col gap-3 z-[400] pointer-events-none">
                <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg border border-gray-100 p-3 text-xs w-48 pointer-events-auto">
                    <div className="font-bold mb-2 text-gray-800 border-b border-gray-100 pb-1">Legend</div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></span>
                        <span className="text-gray-600">High Severity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-400 border border-white shadow-sm"></span>
                        <span className="text-gray-600">Medium Severity</span>
                    </div>
                </div>
             </div>
        </div>

        {/* Sidebar */}
        <div className="w-full h-[45vh] md:h-auto md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-gray-200 flex flex-col shadow-2xl z-20 shrink-0">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search locations..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
            </div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Filter by City</h3>
            <div className="flex flex-wrap gap-2">
                {cities.map(city => (
                    <button 
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                            selectedCity === city 
                            ? 'bg-emerald-600 text-white shadow-sm' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-300'
                        }`}
                    >
                        {city}
                    </button>
                ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 bg-gray-50/50">
             {filteredHotspots.map(spot => (
                 <div 
                    key={spot.id} 
                    onClick={() => {
                        if (mapInstanceRef.current) {
                            mapInstanceRef.current.setView([spot.lat, spot.lng], 14);
                            setSelectedCity(spot.city);
                            // On mobile, scroll to map
                            if (window.innerWidth < 768) {
                                mapRef.current?.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    }}
                    className="bg-white p-3 mb-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex items-start gap-3"
                 >
                     <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${spot.severity === 'high' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                     <div className="flex-1">
                         <div className="flex justify-between items-start">
                             <h4 className="font-bold text-gray-800 text-sm group-hover:text-emerald-700">{spot.name}</h4>
                         </div>
                         <p className="text-xs text-gray-500 mb-2">{spot.city}</p>
                         <div className="flex items-center gap-2">
                             <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium border border-gray-200">
                                {spot.count} Reports
                             </span>
                             {spot.severity === 'high' && (
                                 <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium border border-red-100">
                                     High Priority
                                 </span>
                             )}
                         </div>
                     </div>
                 </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
