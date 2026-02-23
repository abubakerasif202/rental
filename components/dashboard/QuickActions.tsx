import React from "react";
import { Plus, Car, Download, Users, Calendar, Filter } from "lucide-react";

interface QuickActionsProps {
  onNewBooking?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNewBooking }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-6">
      <h3 className="font-semibold text-zinc-900 tracking-tight mb-4 flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onNewBooking}
          className="flex flex-col items-center gap-2 p-4 bg-zinc-50 hover:bg-zinc-900 hover:text-white border border-zinc-200 rounded-xl transition-all group"
        >
          <Calendar className="w-5 h-5 text-zinc-600 group-hover:text-white" />
          <span className="text-xs font-medium">New Booking</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 bg-zinc-50 hover:bg-zinc-900 hover:text-white border border-zinc-200 rounded-xl transition-all group">
          <Car className="w-5 h-5 text-zinc-600 group-hover:text-white" />
          <span className="text-xs font-medium">Add Vehicle</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 bg-zinc-50 hover:bg-zinc-900 hover:text-white border border-zinc-200 rounded-xl transition-all group">
          <Users className="w-5 h-5 text-zinc-600 group-hover:text-white" />
          <span className="text-xs font-medium">New Client</span>
        </button>
        <button className="flex flex-col items-center gap-2 p-4 bg-zinc-50 hover:bg-zinc-900 hover:text-white border border-zinc-200 rounded-xl transition-all group">
          <Download className="w-5 h-5 text-zinc-600 group-hover:text-white" />
          <span className="text-xs font-medium">Export Report</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
