
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  LayoutDashboard, Map, Users, TrendingUp, AlertCircle, 
  CheckCircle, Clock, ArrowLeft, Bell, Filter 
} from 'lucide-react';
import { WasteReport, ReportStatus, WasteCategory } from '../types';

interface AdminDashboardProps {
  reports: WasteReport[];
  onViewMap: () => void;
  onBack: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports, onViewMap, onBack }) => {
  
  // Calculate Stats
  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === ReportStatus.RESOLVED).length;
  const pendingReports = reports.filter(r => r.status !== ReportStatus.RESOLVED).length;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
  
  // Mock Trend Data (since we don't have enough real historical data in mock)
  const trendData = [
    { day: 'Mon', reports: 4, resolved: 3 },
    { day: 'Tue', reports: 7, resolved: 5 },
    { day: 'Wed', reports: 5, resolved: 4 },
    { day: 'Thu', reports: 12, resolved: 8 },
    { day: 'Fri', reports: 9, resolved: 7 },
    { day: 'Sat', reports: 15, resolved: 10 },
    { day: 'Sun', reports: 8, resolved: 6 },
  ];

  // Calculate Category Distribution from real reports + some mock filler to make chart look good
  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(WasteCategory).forEach(c => counts[c] = 0);
    
    reports.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });

    // Add some dummy data if reports are low to show the chart properly
    if (totalReports < 10) {
        counts[WasteCategory.ROADSIDE] += 5;
        counts[WasteCategory.PLASTIC] += 3;
        counts[WasteCategory.WET] += 4;
    }
    
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [reports, totalReports]);

  // Mock Worker Performance
  const workers = [
    { id: 'W-1024', name: 'Ramesh Kumar', tasks: 15, rating: 4.8, status: 'Active' },
    { id: 'W-1045', name: 'Suresh Singh', tasks: 12, rating: 4.5, status: 'On Leave' },
    { id: 'W-1092', name: 'Anita Desai', tasks: 18, rating: 4.9, status: 'Active' },
    { id: 'W-1103', name: 'Vikram Malhotra', tasks: 9, rating: 4.2, status: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="bg-slate-900 text-white w-full md:w-64 flex-shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
           <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">
             A
           </div>
           <div>
             <h1 className="font-bold text-lg">City Admin</h1>
             <p className="text-xs text-slate-400">Municipality Panel</p>
           </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600 rounded-xl text-white font-medium shadow-lg shadow-emerald-900/20">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button onClick={onViewMap} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <Map size={20} />
            <span>Hotspot Map</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <Users size={20} />
            <span>Workforce</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
            <TrendingUp size={20} />
            <span>Analytics</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
             <button onClick={onBack} className="w-full flex items-center justify-center gap-2 py-3 border border-slate-700 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <ArrowLeft size={16} /> Logout
             </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 p-4 md:p-6 flex justify-between items-center sticky top-0 z-30">
          <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
               <Bell size={20} className="text-slate-400" />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Reports</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalReports}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <TrendingUp size={12} /> +12% from last week
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending Issues</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{pendingReports}</h3>
                        </div>
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="text-xs text-slate-400">
                        Requires immediate attention
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Resolved</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{resolvedReports}</h3>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        Resolution Rate: {resolutionRate}%
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Avg Resolution</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">4.2<span className="text-sm font-normal text-slate-400 ml-1">hrs</span></h3>
                        </div>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="text-xs text-green-600">
                        -30 mins faster than avg
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-slate-800">Weekly Reports Overview</h3>
                        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                            <Filter size={18} />
                        </button>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                                    cursor={{stroke: '#e2e8f0'}}
                                />
                                <Area type="monotone" dataKey="reports" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Waste Composition */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Waste Composition</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                        {categoryData.slice(0, 4).map((entry, index) => (
                            <div key={entry.name} className="flex items-center text-xs text-slate-500">
                                <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Workers & Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Worker Leaderboard */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Top Performing Workers</h3>
                    <div className="space-y-4">
                        {workers.map((worker, i) => (
                            <div key={worker.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-emerald-600 shadow-sm">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{worker.name}</p>
                                        <p className="text-xs text-slate-500">{worker.tasks} Tasks Completed</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-sm text-slate-800">⭐ {worker.rating}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${worker.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {worker.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-sm text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition-colors">
                        View All Workers
                    </button>
                </div>

                {/* Recent Reports List (Mini) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Live Reports Feed</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {reports.slice(0, 5).map(report => (
                            <div key={report.id} className="flex gap-3 items-start p-3 border-b border-gray-50 last:border-0">
                                <img src={report.imageUrl} alt="thumb" className="w-12 h-12 rounded-lg object-cover bg-gray-200 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-bold text-slate-800 truncate">{report.category}</p>
                                        <span className="text-[10px] text-slate-400">{new Date(report.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{report.location.address || "GPS Location"}</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                            report.status === ReportStatus.RESOLVED ? 'bg-green-100 text-green-700' : 
                                            report.status === ReportStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' : 
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {report.status.replace('_', ' ')}
                                        </span>
                                        {report.severity >= 4 && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-red-100 text-red-700">High Priority</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
};
