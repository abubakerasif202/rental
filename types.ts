export enum VehicleStatus {
  AVAILABLE = "Available",
  RENTED = "Rented",
  MAINTENANCE = "Maintenance",
  DECOMMISSIONED = "Decommissioned",
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin: string;
  fuelType: string;
  status: VehicleStatus;
  mileage: number;
  fuelLevel: number;
  engineType: string;
  transmission: "Automatic" | "Manual";
  seats: number;
  tankCapacity: number; // in liters
  features: string[];
  image?: string;
  dailyRate: number;
}

export interface Rental {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  estimatedReturnDate?: string;
  status: "Active" | "Pending" | "Completed" | "Late";
  totalAmount: number;
}

export interface SchemaTable {
  name: string;
  description: string;
  columns: Array<{
    name: string;
    type: string;
    constraints?: string;
    description?: string;
  }>;
}
