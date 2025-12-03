import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { WasteReport, WasteCategory } from '../types';

interface StatsDashboardProps {
  reports: WasteReport[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ reports }) => {
  
  const categoryData = React.useMemo(() => {
    const counts = reports.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [reports]);

  const severityData = React.useMemo(() => {
    const data = [0, 0, 0, 0, 0]; // 1 to 5
    reports.forEach(r => {
      if (r.severity >= 1 && r.severity <= 5) {
        data[r.severity - 1]++;
      }
    });
    return data.map((val, idx) => ({ severity: `Lvl ${idx + 1}`, count: val }));
  }, [reports]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Waste Composition</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
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
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {categoryData.map((entry, index) => (
            <div key={entry.name} className="flex items-center text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              {entry.name} ({entry.value})
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Severity Analysis</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityData}>
              <XAxis dataKey="severity" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
