import React from "react";
import {
  TrendingUp,
  CreditCard,
  Car,
  Users,
  AlertTriangle,
  AlertCircle,
  ArrowUpRight,
  Activity,
} from "lucide-react";

interface StatCardsProps {
  activeRentalsCount: number;
  utilizationRate: number;
  paymentFailures: number;
  overdueCount: number;
}

const StatCards: React.FC<StatCardsProps> = ({
  activeRentalsCount,
  utilizationRate,
  paymentFailures,
  overdueCount,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Revenue Card */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-16 h-16 text-zinc-900" />
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">Total Revenue</p>
            <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight mt-1">
              $24,500
            </h3>
          </div>
          <div className="bg-zinc-100 text-zinc-900 p-2 rounded-lg">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-zinc-900">
          <ArrowUpRight className="w-3 h-3" />
          <span>+12.5% from last month</span>
        </div>
      </div>

      {/* Utilization Card */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Activity className="w-16 h-16 text-zinc-900" />
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">Utilization Rate</p>
            <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight mt-1">
              {utilizationRate}%
            </h3>
          </div>
          <div className="bg-zinc-100 text-zinc-900 p-2 rounded-lg">
            <Car className="w-5 h-5" />
          </div>
        </div>
        <div className="w-full bg-zinc-100 rounded-full h-1.5 mt-2">
          <div
            className="bg-zinc-900 h-1.5 rounded-full"
            style={{ width: `${utilizationRate}%` }}
          ></div>
        </div>
      </div>

      {/* Active Rentals Card */}
      <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] relative overflow-hidden group">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">Active Rentals</p>
            <h3 className="text-2xl font-semibold text-zinc-900 tracking-tight mt-1">
              {activeRentalsCount}
            </h3>
          </div>
          <div className="bg-zinc-100 text-zinc-900 p-2 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-zinc-400">
          <span>2 pending approvals</span>
        </div>
      </div>

      {/* Issues Card */}
      <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <AlertTriangle className="w-16 h-16 text-red-600" />
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">Critical Issues</p>
            <h3 className="text-3xl font-light tracking-tight text-red-600 mt-1">
              {paymentFailures + overdueCount}
            </h3>
          </div>
          <div className="bg-red-50 text-red-600 p-2 rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="flex gap-2">
          {paymentFailures > 0 && (
            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
              {paymentFailures} Payment Failures
            </span>
          )}
          {overdueCount > 0 && (
            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
              {overdueCount} Overdue
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCards;
