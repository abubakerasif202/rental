import React from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Settings2,
  Gauge,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Vehicle, VehicleStatus } from "../../types";

interface FleetStatusTableProps {
  vehicles: Vehicle[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  makeFilter: string;
  setMakeFilter: (val: string) => void;
  modelFilter: string;
  setModelFilter: (val: string) => void;
  uniqueMakes: string[];
  uniqueModels: string[];
  startDateFilter: string;
  setStartDateFilter: (val: string) => void;
  endDateFilter: string;
  setEndDateFilter: (val: string) => void;
  onOpenClosure: (vehicle: Vehicle) => void;
  expandedVehicleId: string | null;
  setExpandedVehicleId: (id: string | null) => void;
}

const FleetStatusTable: React.FC<FleetStatusTableProps> = ({
  vehicles,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  makeFilter,
  setMakeFilter,
  modelFilter,
  setModelFilter,
  uniqueMakes,
  uniqueModels,
  startDateFilter,
  setStartDateFilter,
  endDateFilter,
  setEndDateFilter,
  onOpenClosure,
  expandedVehicleId,
  setExpandedVehicleId,
}) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-5 border-b border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="font-semibold text-zinc-900 tracking-tight">
          Live Fleet Status
        </h3>

        <div className="flex flex-wrap items-center gap-3">
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
            {vehicles.length > 0 ? (
              vehicles.map((vehicle, index) => (
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
                        ${vehicle.status === "Available" ? "bg-white text-zinc-700 border-zinc-200 shadow-sm" : ""}
                        ${vehicle.status === "Rented" ? "bg-white text-zinc-700 border-zinc-200 shadow-sm" : ""}
                        ${vehicle.status === "Maintenance" ? "bg-white text-zinc-700 border-zinc-200 shadow-sm" : ""}
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
                            onClick={() => onOpenClosure(vehicle)}
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
                          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-3">
                            <div className="bg-zinc-100 p-2 rounded-lg text-zinc-900 mt-0.5">
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

                          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-3">
                            <div className="bg-zinc-100 p-2 rounded-lg text-zinc-900 mt-0.5">
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

                          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-3">
                            <div className="bg-zinc-100 p-2 rounded-lg text-zinc-900 mt-0.5">
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
  );
};

export default FleetStatusTable;
