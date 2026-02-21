import React, { useState } from 'react';
import { 
  GitCommit, ArrowRight, CheckCircle, AlertCircle, Clock, 
  CreditCard, FileSignature, Key, Gauge, DollarSign, Calculator 
} from 'lucide-react';

const RentalLifecycle: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('booking');

  const states = [
    {
      id: 'booking',
      title: 'Booking & Validation',
      icon: Calculator,
      color: 'bg-blue-500',
      description: 'Initial inquiry, availability check, and driver validation.',
      logic: `// 1. Availability Check (prevent overbooking)
const availableCars = await db.vehicles.find({
  where: {
    class: req.vehicleClass,
    status: 'Available',
    // Ensure no overlapping rentals
    NOT: {
      rentals: {
        some: {
          startDate: { lte: req.endDate },
          endDate: { gte: req.startDate },
          status: { in: ['Active', 'Pending'] }
        }
      }
    }
  }
});

// 2. Risk Assessment
const riskScore = await calculateDriverRisk(req.licenseNumber);
if (riskScore > 80) throw new Error('High Risk Driver');`
    },
    {
      id: 'deposit',
      title: 'Deposit & Hold',
      icon: CreditCard,
      color: 'bg-indigo-500',
      description: 'Secure funds via Pre-Authorization before vehicle release.',
      logic: `// Stripe PaymentIntent (Manual Capture)
const hold = await stripe.paymentIntents.create({
  amount: 50000, // $500.00 Deposit
  currency: 'aud',
  customer: customer.stripeId,
  capture_method: 'manual', // <--- IMPORTANT: Don't charge yet
  payment_method: req.cardId,
  confirm: true
});

// Update Rental State
await db.rentals.update({
  where: { id: rentalId },
  data: { 
    status: 'Pending',
    depositTransactionId: hold.id 
  }
});`
    },
    {
      id: 'pickup',
      title: 'Pickup & Active',
      icon: Key,
      color: 'bg-emerald-500',
      description: 'Contract signing, key handover, and status transition.',
      logic: `// 1. Digital Signature Check
if (!rental.contract || rental.contract.status !== 'Signed') {
  throw new Error('Contract not signed');
}

// 2. State Transition (Atomic Transaction)
await db.$transaction([
  db.rentals.update({
    where: { id: rentalId },
    data: { 
      status: 'Active', 
      actualPickupDate: new Date(),
      startMileage: vehicle.currentMileage
    }
  }),
  db.vehicles.update({
    where: { id: rental.vehicleId },
    data: { status: 'Rented' }
  }),
  // 3. Audit Log for Compliance
  db.auditLogs.create({
    data: {
      tenantId: rental.tenantId,
      actorId: req.userId,
      entityType: 'rental',
      entityId: rentalId,
      action: 'status_change',
      oldValues: { status: 'Pending' },
      newValues: { status: 'Active' }
    }
  })
]);`
    },
    {
      id: 'active',
      title: 'On-Rent / Monitoring',
      icon: Clock,
      color: 'bg-amber-500',
      description: 'Daily recurring checks for overdue status or tolls.',
      logic: `// CRON: Check Overdue Rentals (Every Hour)
const now = new Date();
const overdueRentals = await db.rentals.findMany({
  where: {
    status: 'Active',
    endDate: { lt: now } // Due date passed
  }
});

for (const rental of overdueRentals) {
  // Flag as late
  await db.rentals.update({
    where: { id: rental.id },
    data: { status: 'Overdue' }
  });
  
  // Audit Log (System Action)
  await db.auditLogs.create({
    data: {
      tenantId: rental.tenantId,
      entityType: 'rental',
      entityId: rental.id,
      action: 'status_change',
      oldValues: { status: 'Active' },
      newValues: { status: 'Overdue' },
      notes: 'Automated system transition'
    }
  });
  
  // Trigger Alert
  await sendSlackAlert(\`Rental \${rental.id} is overdue!\`);
}`
    },
    {
      id: 'return',
      title: 'Return Inspection',
      icon: Gauge,
      color: 'bg-orange-500',
      description: 'Final odometer reading, fuel check, and damage logging.',
      logic: `// Calculate Usage Fees
const distance = req.endMileage - rental.startMileage;
const allowedDistance = rental.days * 200; // 200km/day limit
const excessKm = Math.max(0, distance - allowedDistance);
const excessFee = excessKm * 0.25; // $0.25 per extra km

// Fuel Charge
let fuelFee = 0;
if (req.fuelLevel < 100) {
  const missingLiters = (100 - req.fuelLevel) * vehicle.tankCapacity;
  fuelFee = missingLiters * 2.50; // $2.50/L penalty
}

const finalTotal = rental.baseRate + excessFee + fuelFee;`
    },
    {
      id: 'settlement',
      title: 'Settlement & Refund',
      icon: DollarSign,
      color: 'bg-slate-600',
      description: 'Final charge capture and deposit release.',
      logic: `// 1. Charge the Final Amount
await stripe.paymentIntents.create({
  amount: finalTotal,
  currency: 'aud',
  customer: rental.clientId,
  confirm: true
});

// 2. Release Security Deposit (Cancel Hold)
await stripe.paymentIntents.cancel(rental.depositTransactionId);

// 3. Close Loop
await db.$transaction([
  db.rentals.update({
    where: { id: rentalId },
    data: { status: 'Completed', finalTotal: finalTotal }
  }),
  db.vehicles.update({
    where: { id: rental.vehicleId },
    data: { 
      status: 'Available', 
      currentMileage: req.endMileage 
    }
  }),
  db.auditLogs.create({
    data: {
      tenantId: rental.tenantId,
      actorId: req.userId,
      entityType: 'rental',
      entityId: rentalId,
      action: 'status_change',
      oldValues: { status: 'Active' },
      newValues: { status: 'Completed' }
    }
  })
]);`
    }
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <GitCommit className="w-8 h-8 text-emerald-600" />
          Rental State Machine
        </h2>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Complete software lifecycle of a rental transaction, mapping business rules to database states and logic gates.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex gap-8">
        {/* Visual Timeline (Left) */}
        <div className="w-1/3 overflow-y-auto pr-4 custom-scrollbar">
          <div className="relative">
            {/* Connector Line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 -z-10"></div>
            
            <div className="space-y-6">
              {states.map((state, idx) => (
                <div 
                  key={state.id}
                  onClick={() => setSelectedState(state.id)}
                  className={`relative pl-16 py-2 cursor-pointer transition-all group ${
                    selectedState === state.id ? 'opacity-100 scale-[1.02]' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Node Circle */}
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors ${
                    selectedState === state.id ? state.color : 'bg-slate-100'
                  }`}>
                    <state.icon className={`w-5 h-5 ${selectedState === state.id ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                  
                  {/* Content Card */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    selectedState === state.id 
                      ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500/20' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                         selectedState === state.id ? 'text-emerald-600' : 'text-slate-400'
                      }`}>Step {idx + 1}</span>
                      {selectedState === state.id && <ArrowRight className="w-4 h-4 text-emerald-500" />}
                    </div>
                    <h3 className={`font-bold ${selectedState === state.id ? 'text-slate-900' : 'text-slate-600'}`}>
                      {state.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {state.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logic Panel (Right) */}
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col shadow-2xl overflow-hidden">
          <div className="h-12 bg-slate-800 flex items-center justify-between px-6 border-b border-slate-700">
             <div className="flex items-center gap-3">
                <FileSignature className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-sm text-slate-300">
                   Backend Logic: <span className="text-emerald-400 font-bold uppercase">{selectedState}</span>
                </span>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">TypeScript / Node.js</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6 bg-[#0f172a] custom-scrollbar">
             <pre className="font-mono text-sm text-slate-300 leading-relaxed">
                {states.find(s => s.id === selectedState)?.logic.split('\n').map((line, i) => (
                   <div key={i} className="table-row">
                      <span className="table-cell select-none text-slate-700 text-right pr-6 w-10 opacity-50">{i + 1}</span>
                      <span className="table-cell whitespace-pre-wrap">
                        {line.split('//').map((part, idx) => {
                           if (idx === 0) {
                              return (
                                 <span key={idx}>
                                    {part
                                       .replace(/(const|await|if|else|throw|new|for|while|return)/g, '<span class="text-purple-400">$1</span>')
                                       .replace(/(db\.|stripe\.)/g, '<span class="text-blue-400">$1</span>')
                                       .replace(/('.*?')/g, '<span class="text-amber-300">$1</span>')
                                       .replace(/(\d+)/g, '<span class="text-orange-300">$1</span>')
                                       .split(/<span class="text-purple-400">|<span class="text-blue-400">|<span class="text-amber-300">|<span class="text-orange-300">|<\/span>/)
                                       .map((token, tIdx) => {
                                          if (part.includes(`class="text-purple-400">${token}`)) return <span key={tIdx} className="text-purple-400">{token}</span>;
                                          if (part.includes(`class="text-blue-400">${token}`)) return <span key={tIdx} className="text-blue-400">{token}</span>;
                                          if (part.includes(`class="text-amber-300">${token}`)) return <span key={tIdx} className="text-amber-300">{token}</span>;
                                          if (part.includes(`class="text-orange-300">${token}`)) return <span key={tIdx} className="text-orange-300">{token}</span>;
                                          return token;
                                       })
                                    }
                                 </span>
                              );
                           }
                           return <span key={idx} className="text-slate-500 italic">{'//' + part}</span>;
                        })}
                      </span>
                   </div>
                ))}
             </pre>
          </div>

          <div className="p-4 bg-slate-800 border-t border-slate-700 text-xs text-slate-400 flex items-center gap-2">
             <AlertCircle className="w-4 h-4 text-emerald-500" />
             <span>
                State changes must be wrapped in Database Transactions to ensure consistency.
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalLifecycle;