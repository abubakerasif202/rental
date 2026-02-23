import React from "react";
import { AlertCircle, CreditCard, Wrench, AlertTriangle, Clock } from "lucide-react";
import { Rental } from "../../types";

interface ActionCenterProps {
  alerts: any[];
  overdueRentals: Rental[];
}

const ActionCenter: React.FC<ActionCenterProps> = ({ alerts, overdueRentals }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Alerts List */}
      <div className="bg-white p-0 rounded-2xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden flex-1">
        <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-zinc-500" />
            Action Required
          </h3>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {alerts.length}
          </span>
        </div>
        <div className="divide-y divide-zinc-100">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 hover:bg-zinc-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 
                         ${
                           alert.type === "payment_failure"
                             ? "bg-red-50 text-red-600"
                             : alert.type === "maintenance"
                               ? "bg-amber-50 text-amber-600"
                               : "bg-zinc-100 text-zinc-900"
                         }`}
                >
                  {alert.type === "payment_failure" && (
                    <CreditCard className="w-3.5 h-3.5" />
                  )}
                  {alert.type === "maintenance" && (
                    <Wrench className="w-3.5 h-3.5" />
                  )}
                  {alert.type === "risk" && (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {alert.message}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-zinc-50 text-center border-t border-zinc-200">
          <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors">
            View All Alerts
          </button>
        </div>
      </div>

      {/* Overdue Rentals Mini-List */}
      <div className="bg-white p-4 rounded-2xl border border-red-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Overdue Returns
        </h3>
        <div className="space-y-3">
          {overdueRentals.length === 0 ? (
            <p className="text-sm text-zinc-400 italic">
              No overdue rentals.
            </p>
          ) : (
            overdueRentals.map((rental) => (
              <div
                key={rental.id}
                className="flex justify-between items-center text-sm p-2 rounded bg-red-50/50 border border-red-50"
              >
                <div>
                  <p className="font-medium text-zinc-800">
                    {rental.clientName}
                  </p>
                  <p className="text-xs text-red-500">
                    Due: {rental.endDate}
                  </p>
                  {(rental.clientPhone || rental.clientEmail) && (
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      {rental.clientPhone} • {rental.clientEmail}
                    </p>
                  )}
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
  );
};

export default ActionCenter;
