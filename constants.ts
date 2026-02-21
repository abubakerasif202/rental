import { Vehicle, VehicleStatus, Rental } from './types';

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
  { id: '1', make: 'Toyota', model: 'Camry', year: 2023, plate: 'NSW-123', status: VehicleStatus.RENTED, mileage: 15420, fuelLevel: 45, engineType: '2.5L I4', transmission: 'Automatic', seats: 5 },
  { id: '2', make: 'Hyundai', model: 'i30', year: 2022, plate: 'VIC-456', status: VehicleStatus.AVAILABLE, mileage: 32100, fuelLevel: 100, engineType: '2.0L I4', transmission: 'Automatic', seats: 5 },
  { id: '3', make: 'Tesla', model: 'Model 3', year: 2024, plate: 'QLD-789', status: VehicleStatus.AVAILABLE, mileage: 5000, fuelLevel: 80, engineType: 'Electric', transmission: 'Automatic', seats: 5 },
  { id: '4', make: 'Ford', model: 'Ranger', year: 2021, plate: 'WA-321', status: VehicleStatus.MAINTENANCE, mileage: 56000, fuelLevel: 20, engineType: '2.0L Bi-Turbo Diesel', transmission: 'Automatic', seats: 5 },
  { id: '5', make: 'Kia', model: 'Carnival', year: 2023, plate: 'SA-654', status: VehicleStatus.RENTED, mileage: 12000, fuelLevel: 60, engineType: '2.2L Diesel', transmission: 'Automatic', seats: 8 },
  { id: '6', make: 'Toyota', model: 'Corolla', year: 2023, plate: 'TAS-999', status: VehicleStatus.RENTED, mileage: 8000, fuelLevel: 90, engineType: '1.8L Hybrid', transmission: 'Automatic', seats: 5 },
];

export const MOCK_RENTALS: Rental[] = [
  { id: '101', clientName: 'Alice Smith', vehicleId: '1', startDate: '2023-10-25', endDate: '2023-10-30', durationDays: 5, status: 'Active', totalAmount: 450 },
  { id: '102', clientName: 'Bob Jones', vehicleId: '5', startDate: '2023-10-20', endDate: '2023-11-05', durationDays: 16, status: 'Active', totalAmount: 1200 },
  { id: '103', clientName: 'Charlie Brown', vehicleId: '2', startDate: '2023-10-01', endDate: '2023-10-05', durationDays: 4, status: 'Completed', totalAmount: 300 },
  { id: '104', clientName: 'David Lee', vehicleId: '3', startDate: '2023-11-01', endDate: '2023-11-03', durationDays: 2, status: 'Pending', totalAmount: 500 },
  { id: '105', clientName: 'Sarah Connor', vehicleId: '4', startDate: '2023-09-10', endDate: '2023-09-15', durationDays: 5, status: 'Late', totalAmount: 850 },
  { id: '106', clientName: 'Mike Ross', vehicleId: '6', startDate: '2023-10-15', endDate: '2023-10-22', durationDays: 7, status: 'Late', totalAmount: 620 },
];

export const MOCK_ALERTS = [
    { id: 1, type: 'payment_failure', message: 'Payment failed for Rental #106 (Insufficient Funds)', severity: 'high', time: '10 mins ago' },
    { id: 2, type: 'maintenance', message: 'Ford Ranger (WA-321) service overdue by 500km', severity: 'medium', time: '2 hours ago' },
    { id: 3, type: 'risk', message: 'New user "John Doe" flagged for high risk score (85/100)', severity: 'medium', time: '5 hours ago' },
];