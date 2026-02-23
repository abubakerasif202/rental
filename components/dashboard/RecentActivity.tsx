import React from "react";
import { User, RefreshCw, PlusCircle, Trash2, CheckCircle } from "lucide-react";

const MOCK_ACTIVITY = [
  {
    id: "a1",
    user: "Abubakar Asif",
    action: "Updated",
    entity: "Rental #106",
    time: "15 mins ago",
    icon: RefreshCw,
  },
  {
    id: "a2",
    user: "Sarah Connor",
    action: "Created",
    entity: "Rental #107",
    time: "1 hour ago",
    icon: PlusCircle,
  },
  {
    id: "a3",
    user: "Admin System",
    action: "Completed",
    entity: "Rental #103",
    time: "2 hours ago",
    icon: CheckCircle,
  },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
          <User className="w-4 h-4" />
          Recent Activity
        </h3>
        <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
          View Audit Log
        </button>
      </div>
      <div className="divide-y divide-zinc-100">
        {MOCK_ACTIVITY.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-zinc-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-zinc-100 text-zinc-600">
                <activity.icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-800 leading-snug">
                  <span className="font-semibold text-zinc-900">{activity.user}</span>{" "}
                  {activity.action} <span className="font-medium">{activity.entity}</span>
                </p>
                <p className="text-xs text-zinc-400 mt-1">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
