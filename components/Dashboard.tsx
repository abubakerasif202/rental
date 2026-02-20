import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { 
  Users, Car, CreditCard, Activity, AlertTriangle, TrendingUp, AlertCircle, Wrench, ArrowUpRight, ArrowDownRight, Clock, RefreshCw
} from 'lucide-react';
import { MOCK_VEHICLES, MOCK_RENTALS, MOCK_ALERTS } from '../constants';
import { VehicleStatus } from '../types';
import { useLoading } from '../context/LoadingContext';

const Dashboard: React.FC = () => {
  const { withLoading } = useLoading();

  const handleRefresh = async () => {
    await withLoading(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
  };

  // Calculations
  const activeRentalsCount = MOCK_RENTALS.filter(r => r.status === 'Active').length;
  const overdueRentals = MOCK_RENTALS.filter(r => r.status === 'Late');
  const utilizationRate = Math.round((MOCK_VEHICLES.filter(v => v.status === VehicleStatus.RENTED).length / MOCK_VEHICLES.length) * 100);
  const paymentFailures = MOCK_ALERTS.filter(a => a.type === 'payment_failure').length;

  const chartData = [
    { name: 'Mon', revenue: 2400, utilization: 65 },
    { name: 'Tue', revenue: 1398, utilization: 58 },
    { name: 'Wed', revenue: 9800, utilization: 82 },
    { name: 'Thu', revenue: 3908, utilization: 74 },
    { name: 'Fri', revenue: 4800, utilization: 88 },
    { name: 'Sat', revenue: 3800, utilization: 92 },
    { name: 'Sun', revenue: 4300, utilization: 85 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-emerald-600" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">$24,500</h3>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.5% from last month</span>
          </div>
        </div>

        {/* Utilization Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-blue-600" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Utilization Rate</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{utilizationRate}%</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${utilizationRate}%` }}></div>
          </div>
        </div>

        {/* Active Rentals Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Rentals</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeRentalsCount}</h3>
            </div>
            <div className="bg-purple-50 text-purple-600 p-2 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
           <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
            <span>2 pending approvals</span>
          </div>
        </div>

        {/* Issues Card */}
        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm relative overflow-hidden group">
           <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Critical Issues</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{paymentFailures + overdueRentals.length}</h3>
            </div>
            <div className="bg-red-50 text-red-600 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex gap-2">
             {paymentFailures > 0 && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">{paymentFailures} Payment Failures</span>}
             {overdueRentals.length > 0 && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">{overdueRentals.length} Overdue</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-slate-800">Revenue & Performance</h3>
             <div className="flex items-center gap-2">
               <button 
                 onClick={handleRefresh}
                 className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                 title="Refresh Data"
               >
                 <RefreshCw className="w-4 h-4" />
               </button>
               <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-2.5 py-1 outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
               </select>
             </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Center Column */}
        <div className="flex flex-col gap-6">
           
           {/* Alerts List */}
           <div className="bg-white p-0 rounded-xl border border-slate-100 shadow-sm overflow-hidden flex-1">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-500" />
                    Action Required
                 </h3>
                 <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{MOCK_ALERTS.length}</span>
              </div>
              <div className="divide-y divide-slate-50">
                 {MOCK_ALERTS.map((alert) => (
                    <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                       <div className="flex items-start gap-3">
                          <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 
                             ${alert.type === 'payment_failure' ? 'bg-red-50 text-red-600' : 
                               alert.type === 'maintenance' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                             {alert.type === 'payment_failure' && <CreditCard className="w-3.5 h-3.5" />}
                             {alert.type === 'maintenance' && <Wrench className="w-3.5 h-3.5" />}
                             {alert.type === 'risk' && <AlertTriangle className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                                {alert.message}
                             </p>
                             <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {alert.time}
                             </p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                 <button className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors">View All Alerts</button>
              </div>
           </div>

           {/* Overdue Rentals Mini-List */}
           <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
              <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                 <Clock className="w-4 h-4" />
                 Overdue Returns
              </h3>
              <div className="space-y-3">
                 {overdueRentals.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No overdue rentals.</p>
                 ) : (
                    overdueRentals.map(rental => (
                       <div key={rental.id} className="flex justify-between items-center text-sm p-2 rounded bg-red-50/50 border border-red-50">
                          <div>
                             <p className="font-medium text-slate-800">{rental.clientName}</p>
                             <p className="text-xs text-red-500">Due: {rental.endDate}</p>
                          </div>
                          <button className="text-xs bg-white border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors">
                             Contact
                          </button>
                       </div>
                    ))
                 )}
              </div>
           </div>

        </div>
      </div>

      {/* Fleet Overview Table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
           <h3 className="font-bold text-slate-800">Live Fleet Status</h3>
           <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">Manage Fleet</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Plate</th>
                <th className="px-5 py-3">Mileage</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_VEHICLES.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    <div className="flex flex-col">
                       <span>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                       <span className="text-xs text-slate-400 font-normal">{vehicle.fuelLevel}% Fuel</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-500">{vehicle.plate}</td>
                  <td className="px-5 py-3">{vehicle.mileage.toLocaleString()} km</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${vehicle.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                      ${vehicle.status === 'Rented' ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}
                      ${vehicle.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border-amber-100' : ''}
                    `}>
                      {vehicle.status === 'Available' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                      {vehicle.status === 'Rented' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>}
                      {vehicle.status === 'Maintenance' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>}
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                     <button className="text-slate-400 hover:text-slate-600">
                        <ArrowUpRight className="w-4 h-4" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;