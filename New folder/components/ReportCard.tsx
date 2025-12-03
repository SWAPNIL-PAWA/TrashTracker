
import React from 'react';
import { WasteReport, ReportStatus, WasteCategory } from '../types';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';

interface ReportCardProps {
  report: WasteReport;
}

const statusColors = {
  [ReportStatus.PENDING]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  [ReportStatus.IN_PROGRESS]: 'text-blue-600 bg-blue-50 border-blue-200',
  [ReportStatus.RESOLVED]: 'text-green-600 bg-green-50 border-green-200',
};

const categoryColors = {
  [WasteCategory.ROADSIDE]: 'bg-gray-100 text-gray-700',
  [WasteCategory.BIN_OVERFLOW]: 'bg-red-100 text-red-700',
  [WasteCategory.PLASTIC]: 'bg-blue-100 text-blue-700',
  [WasteCategory.WET]: 'bg-green-100 text-green-700',
  [WasteCategory.CONSTRUCTION]: 'bg-orange-100 text-orange-700',
  [WasteCategory.OTHER]: 'bg-purple-100 text-purple-700',
};

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const date = new Date(report.timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-gray-200">
        <img 
          src={report.imageUrl} 
          alt={report.category} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[report.status]}`}>
            {report.status.replace('_', ' ')}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[report.category]}`}>
            {report.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        {report.title && (
            <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{report.title}</h3>
        )}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{report.description}</p>
        
        <div className="flex items-center text-gray-400 text-xs mb-3">
          <MapPin size={12} className="mr-1" />
          <span className="truncate">
            {report.location.address || `${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}`}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
           <div className="flex items-center text-xs text-gray-400">
             <Clock size={12} className="mr-1" />
             {date}
           </div>
           
           {report.severity >= 4 && (
             <div className="flex items-center text-red-500 text-xs font-bold">
               <AlertTriangle size={12} className="mr-1" />
               High Priority
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
