export enum VehicleStatus {
  AVAILABLE = 'Available',
  RENTED = 'Rented',
  MAINTENANCE = 'Maintenance',
  DECOMMISSIONED = 'Decommissioned',
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  status: VehicleStatus;
  mileage: number;
  fuelLevel: number;
  engineType: string;
  transmission: 'Automatic' | 'Manual';
  seats: number;
}

export interface Rental {
  id: string;
  clientName: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: 'Active' | 'Pending' | 'Completed' | 'Late';
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
