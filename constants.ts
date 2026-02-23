import { Vehicle, VehicleStatus, Rental } from "./types";

// This is the SQL Schema requested by the user, formatted for display
export const POSTGRES_SCHEMA_SQL = `-- ---------------------------------------------------------
-- RentFlow SaaS Database Schema (PostgreSQL 16+)
-- Optimized for Multi-tenancy, Reporting, and Audit Compliance
-- ---------------------------------------------------------

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext"; -- Case insensitive text for emails

-- 2. Enum Types (Status Fields)
CREATE TYPE user_role AS ENUM ('platform_admin', 'tenant_admin', 'staff');
CREATE TYPE vehicle_status AS ENUM ('available', 'rented', 'maintenance', 'decommissioned');
CREATE TYPE rental_status AS ENUM ('pending', 'active', 'completed', 'cancelled', 'overdue');
CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded');
CREATE TYPE payment_type AS ENUM ('deposit', 'rental_fee', 'late_fee', 'damage_fee', 'toll');
CREATE TYPE contract_status AS ENUM ('draft', 'sent', 'signed', 'voided');

-- 3. Tenants (Multi-tenancy Isolation Root)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL, -- Subdomain for SaaS access
    settings JSONB DEFAULT '{}', -- Tenant specific configs (tax rates, currency, etc.)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Users (Staff & Admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email CITEXT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role DEFAULT 'staff',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, email) -- Email unique per tenant
);

-- 5. Clients (Customers)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email CITEXT,
    phone VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    driver_license_number VARCHAR(50) NOT NULL,
    driver_license_country VARCHAR(3), -- ISO Code
    license_expiry_date DATE NOT NULL,
    date_of_birth DATE NOT NULL,
    risk_score INTEGER DEFAULT 0, -- Calculated risk (0-100) based on history
    is_banned BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, driver_license_number)
);

-- 6. Vehicles
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(30),
    license_plate VARCHAR(20) NOT NULL,
    vin VARCHAR(17) UNIQUE NOT NULL,
    current_mileage INTEGER DEFAULT 0,
    fuel_type VARCHAR(20) DEFAULT 'petrol', -- petrol, diesel, electric, hybrid
    engine_type VARCHAR(50), -- e.g. 2.0L I4, 3.0L V6
    transmission VARCHAR(20), -- Automatic, Manual
    seats INTEGER DEFAULT 5,
    features TEXT[], -- e.g. GPS, Child Seat, Sunroof
    status vehicle_status DEFAULT 'available',
    daily_rate DECIMAL(10, 2) NOT NULL, -- Base rate
    last_service_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, license_plate)
);

-- 7. Rentals (Bookings)
CREATE TABLE rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_days INTEGER GENERATED ALWAYS AS (EXTRACT(DAY FROM (end_date - start_date))) STORED,
    estimated_return_date TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (start_date + (duration_days * INTERVAL '1 day')) STORED,
    actual_return_date TIMESTAMP WITH TIME ZONE,
    
    start_mileage INTEGER NOT NULL,
    end_mileage INTEGER,
    
    status rental_status DEFAULT 'pending',
    
    pickup_location VARCHAR(255),
    dropoff_location VARCHAR(255),
    
    total_amount DECIMAL(12, 2) DEFAULT 0,
    security_deposit_amount DECIMAL(12, 2) DEFAULT 0,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- 8. Contracts (Digital Signatures)
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_id UUID UNIQUE REFERENCES rentals(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    contract_pdf_url TEXT, -- Link to stored PDF in S3/GCS
    signed_pdf_url TEXT,
    
    status contract_status DEFAULT 'draft',
    signed_at TIMESTAMP WITH TIME ZONE,
    signer_ip VARCHAR(45),
    signature_hash VARCHAR(255),
    
    terms_version VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    rental_id UUID REFERENCES rentals(id) ON DELETE SET NULL,
    
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AUD',
    
    type payment_type NOT NULL,
    status payment_status DEFAULT 'pending',
    
    provider_transaction_id VARCHAR(255), -- Stripe/PayPal ID
    payment_method_details JSONB, -- Card last4, brand, etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Maintenance Logs
CREATE TABLE maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    
    service_type VARCHAR(100) NOT NULL, -- e.g. "Oil Change", "Tire Rotation"
    description TEXT,
    cost DECIMAL(10, 2) NOT NULL,
    performed_by VARCHAR(255), -- Vendor name
    
    service_date DATE NOT NULL,
    mileage_at_service INTEGER,
    
    next_service_due_date DATE,
    next_service_due_mileage INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Audit Logs (Security & Compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id), -- Nullable if system action
    
    entity_type VARCHAR(50) NOT NULL, -- e.g. 'rental', 'vehicle'
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- e.g. 'create', 'update', 'delete', 'approve'
    
    old_values JSONB,
    new_values JSONB,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_rentals_tenant_status ON rentals(tenant_id, status);
CREATE INDEX idx_rentals_client ON rentals(client_id);
CREATE INDEX idx_vehicles_tenant_status ON vehicles(tenant_id, status);
CREATE INDEX idx_payments_rental ON payments(rental_id);
CREATE INDEX idx_audit_tenant_date ON audit_logs(tenant_id, created_at DESC);
`;

// Mock Data
export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    color: "Silver",
    licensePlate: "NSW-123",
    vin: "6T1BR12K...",
    fuelType: "Petrol",
    status: VehicleStatus.RENTED,
    mileage: 15420,
    fuelLevel: 45,
    engineType: "2.5L I4",
    transmission: "Automatic",
    seats: 5,
    tankCapacity: 60,
    features: ["GPS", "Bluetooth", "Reverse Camera"],
    image: "https://picsum.photos/seed/camry/400/250",
    dailyRate: 120,
  },
  {
    id: "2",
    make: "Hyundai",
    model: "i30",
    year: 2022,
    color: "White",
    licensePlate: "VIC-456",
    vin: "KMHDU41B...",
    fuelType: "Petrol",
    status: VehicleStatus.AVAILABLE,
    mileage: 32100,
    fuelLevel: 100,
    engineType: "2.0L I4",
    transmission: "Automatic",
    seats: 5,
    tankCapacity: 50,
    features: ["Apple CarPlay", "Android Auto", "Lane Assist"],
    image: "https://picsum.photos/seed/i30/400/250",
    dailyRate: 95,
  },
  {
    id: "3",
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    color: "Blue",
    licensePlate: "QLD-789",
    vin: "5YJ3E1EA...",
    fuelType: "Electric",
    status: VehicleStatus.AVAILABLE,
    mileage: 5000,
    fuelLevel: 80,
    engineType: "Electric",
    transmission: "Automatic",
    seats: 5,
    tankCapacity: 75,
    features: ["Autopilot", "Glass Roof", "Premium Audio", "GPS"],
    image: "https://picsum.photos/seed/tesla3/400/250",
    dailyRate: 210,
  },
  {
    id: "4",
    make: "Ford",
    model: "Ranger",
    year: 2021,
    color: "Grey",
    licensePlate: "WA-321",
    vin: "6FPPXXMJ...",
    fuelType: "Diesel",
    status: VehicleStatus.MAINTENANCE,
    mileage: 56000,
    fuelLevel: 20,
    engineType: "2.0L Bi-Turbo Diesel",
    transmission: "Automatic",
    seats: 5,
    tankCapacity: 80,
    features: ["4WD", "Tow Bar", "Snorkel", "GPS"],
    image: "https://picsum.photos/seed/ranger/400/250",
    dailyRate: 145,
  },
  {
    id: "5",
    make: "Kia",
    model: "Carnival",
    year: 2023,
    color: "Black",
    licensePlate: "SA-654",
    vin: "KNAGF41C...",
    fuelType: "Diesel",
    status: VehicleStatus.RENTED,
    mileage: 12000,
    fuelLevel: 60,
    engineType: "2.2L Diesel",
    transmission: "Automatic",
    seats: 8,
    tankCapacity: 72,
    features: ["Child Seat Anchors", "Dual Sunroof", "Power Sliding Doors"],
    image: "https://picsum.photos/seed/carnival/400/250",
    dailyRate: 175,
  },
  {
    id: "6",
    make: "Toyota",
    model: "Corolla",
    year: 2023,
    color: "Red",
    licensePlate: "TAS-999",
    vin: "JTDDP11E...",
    fuelType: "Hybrid",
    status: VehicleStatus.RENTED,
    mileage: 8000,
    fuelLevel: 90,
    engineType: "1.8L Hybrid",
    transmission: "Automatic",
    seats: 5,
    tankCapacity: 43,
    features: ["GPS", "Hybrid Drive", "Keyless Entry"],
    image: "https://picsum.photos/seed/corolla/400/250",
    dailyRate: 85,
  },
];

export const MOCK_RENTALS: Rental[] = [
  {
    id: "101",
    clientName: "Alice Smith",
    clientEmail: "alice@example.com",
    clientPhone: "555-0101",
    vehicleId: "1",
    startDate: "2023-10-25",
    endDate: "2023-10-30",
    durationDays: 5,
    estimatedReturnDate: "2023-10-30",
    status: "Active",
    totalAmount: 450,
  },
  {
    id: "102",
    clientName: "Bob Jones",
    clientEmail: "bob@example.com",
    clientPhone: "555-0102",
    vehicleId: "5",
    startDate: "2023-10-20",
    endDate: "2023-11-05",
    durationDays: 16,
    estimatedReturnDate: "2023-11-05",
    status: "Active",
    totalAmount: 1200,
  },
  {
    id: "103",
    clientName: "Charlie Brown",
    clientEmail: "charlie@example.com",
    clientPhone: "555-0103",
    vehicleId: "2",
    startDate: "2023-10-01",
    endDate: "2023-10-05",
    durationDays: 4,
    estimatedReturnDate: "2023-10-05",
    status: "Completed",
    totalAmount: 300,
  },
  {
    id: "104",
    clientName: "David Lee",
    clientEmail: "david@example.com",
    clientPhone: "555-0104",
    vehicleId: "3",
    startDate: "2023-11-01",
    endDate: "2023-11-03",
    durationDays: 2,
    estimatedReturnDate: "2023-11-03",
    status: "Pending",
    totalAmount: 500,
  },
  {
    id: "105",
    clientName: "Sarah Connor",
    clientEmail: "sarah@example.com",
    clientPhone: "555-0105",
    vehicleId: "4",
    startDate: "2023-09-10",
    endDate: "2023-09-15",
    durationDays: 5,
    estimatedReturnDate: "2023-09-15",
    status: "Late",
    totalAmount: 850,
  },
  {
    id: "106",
    clientName: "Mike Ross",
    clientEmail: "mike@example.com",
    clientPhone: "555-0106",
    vehicleId: "6",
    startDate: "2023-10-15",
    endDate: "2023-10-22",
    durationDays: 7,
    estimatedReturnDate: "2023-10-22",
    status: "Late",
    totalAmount: 620,
  },
];

export const MOCK_ALERTS = [
  {
    id: 1,
    type: "payment_failure",
    message: "Payment failed for Rental #106 (Insufficient Funds)",
    severity: "high",
    time: "10 mins ago",
  },
  {
    id: 2,
    type: "maintenance",
    message: "Ford Ranger (WA-321) service overdue by 500km",
    severity: "medium",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "risk",
    message: 'New user "John Doe" flagged for high risk score (85/100)',
    severity: "medium",
    time: "5 hours ago",
  },
];
