import React, { useState, useEffect } from "react";
import {
  X,
  Gauge,
  Fuel,
  Calculator,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Vehicle, Rental } from "../types";

interface RentalClosureModalProps {
  vehicle: Vehicle;
  rental: Rental;
  onClose: () => void;
  onConfirm: (finalData: any) => void;
}

const RentalClosureModal: React.FC<RentalClosureModalProps> = ({
  vehicle,
  rental,
  onClose,
  onConfirm,
}) => {
  const [returnMileage, setReturnMileage] = useState<number>(
    vehicle.mileage + 150,
  );
  const [fuelLevel, setFuelLevel] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Constants for calculation (should ideally come from tenant settings)
  const KM_LIMIT_PER_DAY = 200;
  const EXCESS_KM_RATE = 0.25; // $0.25 per km
  const FUEL_PENALTY_RATE = 2.5; // $2.50 per liter
  const TANK_CAPACITY = vehicle.tankCapacity; // Liters

  // Calculations
  const duration = rental.durationDays;
  const allowedKm = duration * KM_LIMIT_PER_DAY;
  const actualKm = returnMileage - (vehicle.mileage - 150); // Mocking start mileage as current - 150
  const excessKm = Math.max(0, actualKm - allowedKm);
  const excessKmFee = excessKm * EXCESS_KM_RATE;

  const fuelMissingPercent = Math.max(0, 100 - fuelLevel);
  const fuelFee =
    (fuelMissingPercent / 100) * TANK_CAPACITY * FUEL_PENALTY_RATE;

  const baseAmount = rental.totalAmount;
  const finalTotal = baseAmount + excessKmFee + fuelFee;

  const handleConfirm = async () => {
    setIsProcessing(true);
    // Simulate API call and logic processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsSuccess(true);
    setTimeout(() => {
      onConfirm({
        rentalId: rental.id,
        finalTotal,
        returnMileage,
        fuelLevel,
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 mb-2">
            Rental Closed
          </h3>
          <p className="text-zinc-500 mb-6">
            Final amount of ${finalTotal.toFixed(2)} has been processed and
            security deposit released.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">
              Close Rental Transaction
            </h3>
            <p className="text-xs text-zinc-500">
              Rental #{rental.id} • {vehicle.make} {vehicle.model}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-zinc-900" />
                Return Odometer (km)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-zinc-500/20 outline-none transition-all font-mono"
                value={returnMileage}
                onChange={(e) => setReturnMileage(Number(e.target.value))}
              />
              <p className="text-[10px] text-zinc-400 mt-1.5 px-1">
                Start Mileage: {(vehicle.mileage - 150).toLocaleString()} km
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2 flex items-center gap-2">
                <Fuel className="w-4 h-4 text-zinc-900" />
                Return Fuel Level (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="flex-1 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                  value={fuelLevel}
                  onChange={(e) => setFuelLevel(Number(e.target.value))}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-20 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-500/20 outline-none transition-all font-mono text-center font-bold text-zinc-700"
                  value={fuelLevel}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= 100) setFuelLevel(val);
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1 px-1">
                <span>Empty</span>
                <span>Full</span>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-zinc-900 flex-shrink-0" />
                <p className="text-xs text-zinc-700 leading-relaxed">
                  Ensure all personal belongings are removed and a visual
                  inspection for new damages has been completed.
                </p>
              </div>
            </div>
          </div>

          {/* Calculation Section */}
          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
            <h4 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              Final Settlement
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Base Rental Fee</span>
                <span className="font-medium text-zinc-900">
                  ${baseAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-zinc-500">Excess Mileage</span>
                  <span className="text-[10px] text-zinc-400">
                    {excessKm} km @ ${EXCESS_KM_RATE}/km
                  </span>
                </div>
                <span
                  className={`font-medium ${excessKmFee > 0 ? "text-red-600" : "text-zinc-900"}`}
                >
                  +${excessKmFee.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-zinc-500">Fuel Refill Penalty</span>
                  <span className="text-[10px] text-zinc-400">
                    {fuelMissingPercent}% missing
                  </span>
                </div>
                <span
                  className={`font-medium ${fuelFee > 0 ? "text-red-600" : "text-zinc-900"}`}
                >
                  +${fuelFee.toFixed(2)}
                </span>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-200 flex justify-between items-center">
                <span className="font-bold text-zinc-900">
                  Total Settlement
                </span>
                <span className="text-2xl font-black text-zinc-900">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`w-full mt-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                ${isProcessing ? "bg-zinc-400 cursor-not-allowed" : "bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98]"}
              `}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>Confirm & Process Payment</>
              )}
            </button>
            <p className="text-[10px] text-zinc-400 text-center mt-4">
              This will capture the final amount from the customer's card and
              release the $500.00 security deposit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalClosureModal;
