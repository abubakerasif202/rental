import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw } from "lucide-react";

interface RevenueChartProps {
  chartData: any[];
  onRefresh: () => void;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ chartData, onRefresh }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
          Revenue & Performance
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <select className="bg-zinc-50 border border-zinc-200 text-zinc-600 text-sm rounded-lg px-2.5 py-1 outline-none focus:ring-2 focus:ring-zinc-500/20">
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
                <stop offset="5%" stopColor="#18181b" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e4e4e7"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #e4e4e7",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              cursor={{
                stroke: "#18181b",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#18181b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
