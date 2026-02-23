import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Rental, Vehicle } from "../../types";

interface PastRentalsTableProps {
  rentals: Rental[];
  vehicles: Vehicle[];
}

const PastRentalsTable: React.FC<PastRentalsTableProps> = ({
  rentals,
  vehicles,
}) => {
  return (
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
            {rentals
              .filter((r) => r.status === "Completed")
              .map((rental, index) => {
                const vehicle = vehicles.find((v) => v.id === rental.vehicleId);
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
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PastRentalsTable;
