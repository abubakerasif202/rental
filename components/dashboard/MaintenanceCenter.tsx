import React from "react";
import { Wrench, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

const MOCK_MAINTENANCE = [
  {
    id: "m1",
    vehicle: "Ford Ranger (WA-321)",
    type: "Oil Change",
    status: "overdue",
    dueDate: "2023-10-15",
    priority: "high",
  },
  {
    id: "m2",
    vehicle: "Toyota Camry (NSW-123)",
    type: "Tire Rotation",
    status: "scheduled",
    dueDate: "2023-11-02",
    priority: "medium",
  },
  {
    id: "m3",
    vehicle: "Hyundai i30 (VIC-456)",
    type: "Brake Inspection",
    status: "completed",
    dueDate: "2023-10-20",
    priority: "low",
  },
];

const MaintenanceCenter: React.FC = () => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
          <Wrench className="w-4 h-4" />
          Maintenance Center
        </h3>
        <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
          View Schedule
        </button>
      </div>
      <div className="divide-y divide-zinc-100">
        {MOCK_MAINTENANCE.map((item) => (
          <div key={item.id} className="p-4 hover:bg-zinc-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg ${
                  item.status === 'overdue' ? 'bg-red-50 text-red-600' : 
                  item.status === 'scheduled' ? 'bg-zinc-100 text-zinc-600' : 
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {item.status === 'overdue' ? <AlertTriangle className="w-4 h-4" /> : 
                   item.status === 'scheduled' ? <Clock className="w-4 h-4" /> : 
                   <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{item.vehicle}</p>
                  <p className="text-xs text-zinc-500">{item.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${
                  item.status === 'overdue' ? 'text-red-600' : 'text-zinc-500'
                }`}>
                  {item.status === 'overdue' ? 'Overdue' : 'Due'}: {item.dueDate}
                </p>
                <button className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 transition-colors">
                  Log Service
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceCenter;
