import React, { useState } from 'react';
import { CreditCard, Lock, RefreshCw, AlertTriangle, Webhook, ChevronRight, Code, DollarSign, ShieldCheck } from 'lucide-react';

const PaymentArchitecture: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 'customer',
      title: 'Customer & Card Vaulting',
      icon: CreditCard,
      desc: 'Securely save payment methods using SetupIntents for future usage without charging immediately.',
      code: `// POST /api/v1/payment-methods/setup
// 1. Create a Customer if not exists
const customer = await stripe.customers.create({
  email: user.email,
  metadata: { tenantId: tenant.id }
});

// 2. Create a SetupIntent to collect card details securely
const setupIntent = await stripe.setupIntents.create({
  customer: customer.id,
  payment_method_types: ['card'],
  usage: 'off_session', // crucial for future recurring charges
});

// 3. Frontend uses setupIntent.client_secret to show Card Element
return { clientSecret: setupIntent.client_secret };`
    },
    {
      id: 'deposit',
      title: 'Security Deposit Hold',
      icon: Lock,
      desc: 'Place a hold on the card funds before vehicle release using manual capture.',
      code: `// POST /api/v1/rentals/:id/deposit
// 1. Authorize funds (Hold) but do not capture
const paymentIntent = await stripe.paymentIntents.create({
  amount: 50000, // $500.00 Security Deposit
  currency: 'aud',
  customer: customer.stripe_id,
  payment_method: paymentMethodId,
  off_session: true,
  confirm: true,
  capture_method: 'manual', // <--- IMPORTANT: Holds funds for 7 days
  description: \`Security Deposit for Rental \${rentalId}\`
});

// 2. Store paymentIntent.id in rentals table
await db.rentals.update({
  where: { id: rentalId },
  data: { deposit_transaction_id: paymentIntent.id }
});`
    },
    {
      id: 'recurring',
      title: 'Recurring Billing & Late Fees',
      icon: RefreshCw,
      desc: 'Automated weekly charging for long-term rentals and ad-hoc late fee generation.',
      code: `// CRON JOB: Run Daily
// 1. Find active rentals due for payment
const dueRentals = await db.rentals.findDuePayments();

for (const rental of dueRentals) {
  try {
    // 2. Charge the saved payment method
    const charge = await stripe.paymentIntents.create({
      amount: rental.weekly_rate,
      currency: 'aud',
      customer: rental.customer_stripe_id,
      payment_method: rental.payment_method_id,
      off_session: true,
      confirm: true,
      description: \`Weekly Rental Charge: \${rental.id}\`
    });
    
    await logPayment(rental.id, charge.id, 'success');
  } catch (err) {
    // 3. Handle declines gracefully
    await triggerDunningProcess(rental.client_email);
    await logPayment(rental.id, null, 'failed');
  }
}`
    },
    {
      id: 'webhooks',
      title: 'Webhook & Status Sync',
      icon: Webhook,
      desc: 'Asynchronous event handling to update local database state securely.',
      code: `// POST /webhook
const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

switch (event.type) {
  case 'payment_intent.succeeded':
    const pi = event.data.object;
    // Update DB: Mark rental as paid / Deposit secure
    await db.payments.updateStatus(pi.metadata.rental_id, 'captured');
    break;

  case 'payment_intent.payment_failed':
    const failedPi = event.data.object;
    // Action: Notify staff, Block vehicle ignition?
    await db.rentals.flagRisk(failedPi.metadata.rental_id);
    break;
    
  case 'charge.refunded':
    // Handle deposit release
    break;
}`
    }
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          Stripe Integration Architecture
        </h2>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Technical specification for handling high-value rental transactions, security deposits, and recurring automated billing.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        {/* Left: Navigation Steps */}
        <div className="w-1/3 flex flex-col gap-3 overflow-y-auto pr-2">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                activeStep === idx
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activeStep === idx ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'}`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`font-semibold ${activeStep === idx ? 'text-white' : 'text-slate-900'}`}>
                    {step.title}
                  </span>
                </div>
                {activeStep === idx && <ChevronRight className="w-5 h-5 text-emerald-400" />}
              </div>
              <p className={`mt-3 text-sm leading-relaxed ${activeStep === idx ? 'text-slate-400' : 'text-slate-500'}`}>
                {step.desc}
              </p>
            </button>
          ))}

          {/* Integration Notes Card */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
             <div className="flex items-center gap-2 text-amber-800 font-semibold mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Backend Engineering Notes</span>
             </div>
             <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                <li>Always use idempotency keys for charges to prevent double billing.</li>
                <li>Deposits expire after 7 days; implement a refresher job if rental is longer.</li>
                <li>Never store raw card numbers. Only store `pm_xxx` IDs.</li>
             </ul>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
          <div className="h-10 bg-slate-800 flex items-center justify-between px-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-300">backend/services/payment.service.ts</span>
            </div>
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
               <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6 bg-[#0f172a] custom-scrollbar">
            <code className="text-sm font-mono leading-relaxed">
              {steps[activeStep].code.split('\n').map((line, i) => (
                <div key={i} className="table-row">
                   <span className="table-cell select-none text-slate-700 text-right pr-4 w-8">{i + 1}</span>
                   <span className="table-cell whitespace-pre-wrap">
                     {line.split('//').map((part, idx, arr) => {
                        if (idx === 0) {
                            return (
                                <span key={idx} className="text-slate-300">
                                    {part
                                     .replace(/(const|await|return|switch|case|break|try|catch|for|if)/g, '<span class="text-purple-400">$1</span>')
                                     .replace(/(stripe\.|db\.)/g, '<span class="text-blue-400">$1</span>')
                                     .replace(/('.*?')/g, '<span class="text-amber-300">$1</span>')
                                     .split(/<span class="text-purple-400">|<span class="text-blue-400">|<span class="text-amber-300">|<\/span>/)
                                     .map((token, tIdx, tArr) => {
                                        if (part.includes(`class="text-purple-400">${token}`)) return <span key={tIdx} className="text-purple-400">{token}</span>;
                                        if (part.includes(`class="text-blue-400">${token}`)) return <span key={tIdx} className="text-blue-400">{token}</span>;
                                        if (part.includes(`class="text-amber-300">${token}`)) return <span key={tIdx} className="text-amber-300">{token}</span>;
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
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentArchitecture;