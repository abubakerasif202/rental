# RentFlow Backend Architecture Guide

This guide outlines the core backend engineering patterns for the RentFlow SaaS platform, focusing on high-value payment security and robust rental lifecycle management.

## 1. Stripe Payment Integration

Our platform uses Stripe to handle complex rental billing scenarios, including card vaulting for recurring charges and manual authorization for security deposits.

### 1.1 Payment Method Vaulting (SetupIntents)
To allow future charges (like weekly rental fees or late penalties) without requiring the customer to be present, we use Stripe **SetupIntents**.

- **Process**:
  1. Create or retrieve a Stripe `Customer`.
  2. Generate a `SetupIntent` with `usage: 'off_session'`.
  3. The frontend uses the `client_secret` to securely collect and tokenize the card.
- **Why?**: This avoids storing raw card data on our servers (PCI Compliance) while enabling "Card-on-File" functionality for frictionless recurring billing.

### 1.2 Security Deposit Hold (Manual Capture)
A $500.00 AUD security deposit is required for all rentals. We use **Manual Capture** to place a temporary hold on the customer's funds.

- **Implementation**:
  - When a rental is initialized, a `PaymentIntent` is created with `capture_method: 'manual'`.
  - This **authorizes** the funds, guaranteeing they are available for up to 7 days (standard Stripe limit).
  - **Important**: The funds are not transferred to our account unless `capture` is called. If the vehicle is returned without issues, the `PaymentIntent` is cancelled, releasing the hold.

## 2. Rental State Machine

The rental process is governed by a strict state machine to prevent overbooking and ensure financial consistency.

### 2.1 Booking & Validation
Before any state transition, the backend must perform:
1. **Concurrency Check**: Ensure the specific vehicle is not already booked for overlapping dates (`startDate` to `endDate`).
2. **Risk Assessment**: Calculate the driver's risk score based on history and license validation. High-risk scores (>80) should block the booking.

### 2.2 Atomic Database Transactions
Vehicle pickup and return involve multiple table updates that **must** be executed within a single database transaction to prevent "ghost rentals" or status mismatches.

#### Vehicle Pickup (Transition to `Active`)
- Update `rentals` table: Set `status = 'Active'`, record `actualPickupDate`, and store `start_mileage`.
- Update `vehicles` table: Set `status = 'Rented'`.
- *Failure handling*: If any update fails, the entire transaction rolls back.

#### Vehicle Return (Transition to `Completed`)
- **Usage Calculation**: Calculate excess mileage fees and fuel penalties.
- **Financial Settlement**:
  1. Charge the final calculated amount via Stripe.
  2. Release the security deposit hold (`stripe.paymentIntents.cancel`).
- **Update DB**: Mark rental as `Completed` and vehicle as `Available` with the new odometer reading.

## 3. Engineering Standards

- **Idempotency**: All payment-related API endpoints must accept an `Idempotency-Key` header to prevent double charges during network retries.
- **Soft Deletes**: Tables like `tenants`, `users`, `clients`, and `vehicles` use a `deleted_at` timestamp. Never use hard `DELETE` for these entities to maintain audit trails.
- **Data Integrity**: Financial tables (`rentals`, `payments`, `contracts`) use `ON DELETE RESTRICT` to prevent accidental deletion of revenue records.
- **Audit Logging**: Every state change must trigger an entry in the `audit_logs` table, capturing the `old_values`, `new_values`, and the `actor_id`.
- **Partitioning**: The `audit_logs` table should be partitioned by range on `created_at` (e.g., monthly partitions) to ensure the system remains performant as logs grow into the millions.
