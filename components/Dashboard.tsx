import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Users,
  Car,
  CreditCard,
  Activity,
  AlertTriangle,
  TrendingUp,
  AlertCircle,
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Settings2,
  Gauge,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { MOCK_VEHICLES, MOCK_RENTALS, MOCK_ALERTS } from "../constants";
import { VehicleStatus, Vehicle, Rental } from "../types";
import { useLoading } from "../context/LoadingContext";
import RentalClosureModal from "./RentalClosureModal";

const Dashboard: React.FC = () => {
  const { withLoading } = useLoading();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [makeFilter, setMakeFilter] = React.useState<string>("All");
  const [modelFilter, setModelFilter] = React.useState<string>("All");
  const [startDateFilter, setStartDateFilter] = React.useState<string>("");
  const [endDateFilter, setEndDateFilter] = React.useState<string>("");
  const [selectedVehicleForClosure, setSelectedVehicleForClosure] =
    React.useState<Vehicle | null>(null);
  const [selectedRentalForClosure, setSelectedRentalForClosure] =
    React.useState<Rental | null>(null);
  const [expandedVehicleId, setExpandedVehicleId] = React.useState<
    string | null
  >(null);

  const handleRefresh = async () => {
    await withLoading(async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    });
  };

  // Calculations
  const activeRentalsCount = MOCK_RENTALS.filter(
    (r) => r.status === "Active",
  ).length;
  const overdueRentals = MOCK_RENTALS.filter((r) => r.status === "Late");
  const utilizationRate = Math.round(
    (MOCK_VEHICLES.filter((v) => v.status === VehicleStatus.RENTED).length /
      MOCK_VEHICLES.length) *
      100,
  );
  const paymentFailures = MOCK_ALERTS.filter(
    (a) => a.type === "payment_failure",
  ).length;

  // Filter Logic
  const uniqueMakes = Array.from(
    new Set(MOCK_VEHICLES.map((v) => v.make)),
  ).sort();
  const uniqueModels = Array.from(
    new Set(MOCK_VEHICLES.map((v) => v.model)),
  ).sort();

  const filteredVehicles = MOCK_VEHICLES.filter((vehicle) => {
    const matchesSearch =
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || vehicle.status === statusFilter;
    const matchesMake = makeFilter === "All" || vehicle.make === makeFilter;
    const matchesModel = modelFilter === "All" || vehicle.model === modelFilter;

    let isAvailableInDateRange = true;
    if (startDateFilter && endDateFilter) {
      const filterStart = new Date(startDateFilter);
      const filterEnd = new Date(endDateFilter);

      const overlappingRentals = MOCK_RENTALS.filter((r) => {
        if (r.vehicleId !== vehicle.id) return false;
        if (r.status === "Completed") return false;

        const rentalStart = new Date(r.startDate);
        const rentalEnd = new Date(r.endDate);

        return rentalStart <= filterEnd && rentalEnd >= filterStart;
      });

      isAvailableInDateRange = overlappingRentals.length === 0;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMake &&
      matchesModel &&
      isAvailableInDateRange
    );
  });

  const chartData = [
    { name: "Mon", revenue: 2400, utilization: 65 },
    { name: "Tue", revenue: 1398, utilization: 58 },
    { name: "Wed", revenue: 9800, utilization: 82 },
    { name: "Thu", revenue: 3908, utilization: 74 },
    { name: "Fri", revenue: 4800, utilization: 88 },
    { name: "Sat", revenue: 3800, utilization: 92 },
    { name: "Sun", revenue: 4300, utilization: 85 },
  ];

  const handleOpenClosure = (vehicle: Vehicle) => {
    const rental = MOCK_RENTALS.find(
      (r) => r.vehicleId === vehicle.id && r.status === "Active",
    );
    if (rental) {
      setSelectedVehicleForClosure(vehicle);
      setSelectedRentalForClosure(rental);
    }
  };

  const handleConfirmClosure = (data: any) => {
    console.log("Closure confirmed:", data);
    // In a real app, we would update the state/DB here
    setSelectedVehicleForClosure(null);
    setSelectedRentalForClosure(null);
    handleRefresh(); // Simulate data update
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Top Stats Row */}
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
              <p className="text-sm font-medium text-zinc-500">
                Utilization Rate
              </p>
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
              <p className="text-sm font-medium text-zinc-500">
                Active Rentals
              </p>
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
              <p className="text-sm font-medium text-zinc-500">
                Critical Issues
              </p>
              <h3 className="text-3xl font-light tracking-tight text-red-600 mt-1">
                {paymentFailures + overdueRentals.length}
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
            {overdueRentals.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                {overdueRentals.length} Overdue
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
              Revenue & Performance
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
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

        {/* Action Center Column */}
        <div className="flex flex-col gap-6">
          {/* Alerts List */}
          <div className="bg-white p-0 rounded-2xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden flex-1">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-zinc-500" />
                Action Required
              </h3>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {MOCK_ALERTS.length}
              </span>
            </div>
            <div className="divide-y divide-zinc-100">
              {MOCK_ALERTS.map((alert) => (
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
      </div>

      {/* Fleet Overview Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-semibold text-zinc-900 tracking-tight">
            Live Fleet Status
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search plate, make..."
                className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-zinc-500/20 outline-none w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-400 hidden md:block" />
              <select
                className="bg-zinc-50 border border-zinc-200 text-zinc-600 text-sm rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-zinc-500/20"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value={VehicleStatus.AVAILABLE}>Available</option>
                <option value={VehicleStatus.RENTED}>Rented</option>
                <option value={VehicleStatus.MAINTENANCE}>Maintenance</option>
              </select>

              <select
                className="bg-zinc-50 border border-zinc-200 text-zinc-600 text-sm rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-zinc-500/20"
                value={makeFilter}
                onChange={(e) => setMakeFilter(e.target.value)}
              >
                <option value="All">All Makes</option>
                {uniqueMakes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>

              <select
                className="bg-zinc-50 border border-zinc-200 text-zinc-600 text-sm rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-zinc-500/20"
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
              >
                <option value="All">All Models</option>
                {uniqueModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 focus-within:ring-2 focus-within:ring-zinc-500/20">
                <input
                  type="date"
                  className="bg-transparent text-sm text-zinc-600 outline-none w-32"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                />
                <span className="text-zinc-400 text-xs">to</span>
                <input
                  type="date"
                  className="bg-transparent text-sm text-zinc-600 outline-none w-32"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                />
                {(startDateFilter || endDateFilter) && (
                  <button
                    onClick={() => {
                      setStartDateFilter("");
                      setEndDateFilter("");
                    }}
                    className="text-zinc-400 hover:text-zinc-600 ml-1"
                    title="Clear dates"
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="bg-zinc-50 text-zinc-700 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Plate</th>
                <th className="px-5 py-3">Mileage</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle, index) => (
                  <React.Fragment key={vehicle.id}>
                    <tr
                      className={`${index % 2 === 0 ? "bg-white" : "bg-zinc-50"} hover:bg-zinc-100 transition-colors`}
                    >
                      <td className="px-5 py-3 font-medium text-zinc-900">
                        <div className="flex flex-col">
                          <span>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </span>
                          <span className="text-xs text-zinc-400 font-normal">
                            {vehicle.fuelLevel}% Fuel
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-zinc-500">
                        {vehicle.licensePlate}
                      </td>
                      <td className="px-5 py-3">
                        {vehicle.mileage.toLocaleString()} km
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${vehicle.status === "Available" ? "bg-white text-zinc-700 border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)]" : ""}
                          ${vehicle.status === "Rented" ? "bg-white text-zinc-700 border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)]" : ""}
                          ${vehicle.status === "Maintenance" ? "bg-white text-zinc-700 border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)]" : ""}
                        `}
                        >
                          {vehicle.status === "Available" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 mr-1.5"></span>
                          )}
                          {vehicle.status === "Rented" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 mr-1.5"></span>
                          )}
                          {vehicle.status === "Maintenance" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                          )}
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {vehicle.status === "Rented" && (
                            <button
                              className="text-xs bg-zinc-900 text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
                              onClick={() => handleOpenClosure(vehicle)}
                            >
                              Close Rental
                            </button>
                          )}
                          <button
                            className="text-zinc-400 hover:text-zinc-600 p-1 rounded hover:bg-zinc-100 transition-colors"
                            onClick={() =>
                              setExpandedVehicleId(
                                expandedVehicleId === vehicle.id
                                  ? null
                                  : vehicle.id,
                              )
                            }
                          >
                            {expandedVehicleId === vehicle.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedVehicleId === vehicle.id && (
                      <tr className="bg-zinc-50/80 border-b border-zinc-200">
                        <td colSpan={5} className="px-6 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Engine Details */}
                            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-3">
                              <div className="bg-blue-50 p-2 rounded-lg text-blue-600 mt-0.5">
                                <Settings2 className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                  Engine
                                </p>
                                <p className="text-sm font-semibold text-zinc-900 mt-0.5">
                                  {vehicle.engineType}
                                </p>
                                <p className="text-xs text-zinc-400 mt-1">
                                  {vehicle.fuelType}
                                </p>
                              </div>
                            </div>

                            {/* Transmission Details */}
                            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-3">
                              <div className="bg-purple-50 p-2 rounded-lg text-purple-600 mt-0.5">
                                <Gauge className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                  Transmission
                                </p>
                                <p className="text-sm font-semibold text-zinc-900 mt-0.5">
                                  {vehicle.transmission}
                                </p>
                                <p className="text-xs text-zinc-400 mt-1">
                                  Smooth shifting
                                </p>
                              </div>
                            </div>

                            {/* Capacity Details */}
                            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-3">
                              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 mt-0.5">
                                <Users className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                  Capacity
                                </p>
                                <p className="text-sm font-semibold text-zinc-900 mt-0.5">
                                  {vehicle.seats} Seats
                                </p>
                                <p className="text-xs text-zinc-400 mt-1">
                                  {vehicle.tankCapacity}L Tank
                                </p>
                              </div>
                            </div>

                            {/* Premium Features */}
                            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
                              <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-4 h-4 text-amber-500" />
                                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                  Premium Features
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-auto">
                                {vehicle.features &&
                                vehicle.features.length > 0 ? (
                                  vehicle.features.map((f) => (
                                    <span
                                      key={f}
                                      className="bg-zinc-100 border border-zinc-200 px-2 py-1 rounded-md text-[10px] font-medium text-zinc-700"
                                    >
                                      {f}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-zinc-400 italic">
                                    Standard features only
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-zinc-400 italic"
                  >
                    No vehicles match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past Rentals Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden mt-6">
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900 tracking-tight">
            Past Rentals
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="bg-zinc-50 text-zinc-700 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-5 py-3">Client Name</th>
                <th className="px-5 py-3">Vehicle</th>
                <th className="px-5 py-3">Dates</th>
                <th className="px-5 py-3">Final Cost</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {MOCK_RENTALS.filter((r) => r.status === "Completed").map(
                (rental, index) => {
                  const vehicle = MOCK_VEHICLES.find(
                    (v) => v.id === rental.vehicleId,
                  );
                  return (
                    <tr
                      key={rental.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-zinc-50"} hover:bg-zinc-100 transition-colors`}
                    >
                      <td className="px-5 py-3 font-medium text-zinc-900">
                        <div className="flex flex-col">
                          <span>{rental.clientName}</span>
                          {(rental.clientEmail || rental.clientPhone) && (
                            <span className="text-xs text-zinc-400 font-normal">
                              {rental.clientEmail} • {rental.clientPhone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {vehicle
                          ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                          : "Unknown Vehicle"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <span>
                            {rental.startDate} to {rental.endDate}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {rental.durationDays} days
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-medium text-zinc-900">
                        ${rental.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="text-zinc-400 hover:text-zinc-600">
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVehicleForClosure && selectedRentalForClosure && (
        <RentalClosureModal
          vehicle={selectedVehicleForClosure}
          rental={selectedRentalForClosure}
          onClose={() => {
            setSelectedVehicleForClosure(null);
            setSelectedRentalForClosure(null);
          }}
          onConfirm={handleConfirmClosure}
        />
      )}
    </div>
  );
};

export default Dashboard;
