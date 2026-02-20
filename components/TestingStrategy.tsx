import React, { useState } from 'react';
import { TestTube, Server, Zap, ShieldCheck, Activity, Webhook, ChevronRight, PlayCircle, Code } from 'lucide-react';

const TestingStrategy: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string>('unit');

  const layers = [
    {
      id: 'unit',
      title: 'Unit Testing (Jest)',
      icon: TestTube,
      color: 'text-blue-500',
      desc: 'Isolated testing of pure business logic (Pricing, Late Fees, Validation).',
      details: 'Mock all external dependencies (DB, Stripe, Email). Focus on edge cases in calculation logic.',
      code: `// tests/pricing.spec.ts
describe('PriceCalculator', () => {
  it('should apply 20% surcharge for drivers under 25', () => {
    const quote = calculateRentalPrice({
      baseRate: 100,
      days: 3,
      driverAge: 21 // Under 25
    });
    
    // Base: 300, Surcharge: 60
    expect(quote.total).toBe(360);
    expect(quote.breakdown.youngDriverFee).toBe(60);
  });
  
  it('should cap miles if not unlimited plan', () => {
    // ... logic check
  });
});`
    },
    {
      id: 'integration',
      title: 'API Integration (Supertest)',
      icon: Server,
      color: 'text-emerald-500',
      desc: 'Test HTTP endpoints with a real test database (Docker).',
      details: 'Spin up a fresh Postgres container. Execute migration. Run Request. Assert Response. Rollback/Clean.',
      code: `// tests/rentals.e2e-spec.ts
describe('POST /rentals', () => {
  it('should create rental and lock vehicle', async () => {
    const vehicle = await db.createVehicle({ status: 'Available' });
    
    const res = await request(app)
      .post('/api/v1/rentals')
      .set('Authorization', \`Bearer \${token}\`)
      .send({
        vehicleId: vehicle.id,
        startDate: '2023-12-25',
        endDate: '2023-12-30'
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('Pending');
    
    // DB Assertion
    const updatedVehicle = await db.getVehicle(vehicle.id);
    expect(updatedVehicle.status).toBe('Rented');
  });
});`
    },
    {
      id: 'webhook',
      title: 'Payment Webhooks',
      icon: Webhook,
      color: 'text-purple-500',
      desc: 'Verify asynchronous state changes from Stripe events.',
      details: 'Use Stripe CLI to trigger events. Verify idempotency keys to prevent double-processing.',
      code: `// tests/webhooks.spec.ts
describe('Stripe Webhook Handler', () => {
  it('should handle payment_intent.succeeded', async () => {
    const payload = generateStripeEvent('payment_intent.succeeded', {
       metadata: { rentalId: 'uuid-123' }
    });
    const signature = generateSignature(payload, secret);

    await request(app)
      .post('/webhooks/stripe')
      .set('Stripe-Signature', signature)
      .send(payload)
      .expect(200);

    // Verify Rental Status Updated to 'Active' or 'Paid'
    const rental = await db.getRental('uuid-123');
    expect(rental.paymentStatus).toBe('Paid');
  });
});`
    },
    {
      id: 'load',
      title: 'Load Testing (k6)',
      icon: Activity,
      color: 'text-orange-500',
      desc: 'Simulate high concurrency for fleet search and booking.',
      details: 'Test database connection pool limits and race conditions during vehicle booking.',
      code: `// k6-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp to 50 users
    { duration: '1m', target: 50 },  // Stay at 50
    { duration: '30s', target: 0 },  // Ramp down
  ],
};

export default function () {
  const res = http.get('https://api.rentflow.com/api/v1/vehicles?status=available');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}`
    },
    {
      id: 'integrity',
      title: 'Data Integrity',
      icon: ShieldCheck,
      color: 'text-slate-500',
      desc: 'Database constraint and transaction rollback verification.',
      details: 'Ensure atomic transactions work. If Payment fails, Booking must be rolled back.',
      code: `// tests/transactions.spec.ts
it('should rollback booking if payment fails', async () => {
  // Mock Stripe to throw error
  jest.spyOn(stripe.paymentIntents, 'create')
      .mockRejectedValue(new Error('Card Declined'));

  const vehicleBefore = await db.getVehicle(vId);
  
  await request(app)
    .post('/rentals')
    .send({ ...validData })
    .expect(402); // Payment Required Error

  // Assert vehicle is NOT locked
  const vehicleAfter = await db.getVehicle(vId);
  expect(vehicleAfter.status).toBe(vehicleBefore.status);
});`
    }
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-8 h-8 text-emerald-600" />
          Testing Strategy & QA
        </h2>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Multi-layered testing architecture ensuring financial accuracy, high availability, and data consistency.
        </p>
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        {/* Navigation Sidebar */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-3 overflow-y-auto pr-2">
           <div className="p-4 bg-slate-900 rounded-xl text-white mb-2 shadow-lg">
              <h3 className="font-bold text-lg mb-1">Testing Pyramid</h3>
              <p className="text-xs text-slate-400">Standard distribution of test effort.</p>
              
              <div className="mt-4 flex flex-col items-center gap-1">
                 <div className="w-16 h-8 bg-orange-500 rounded-t-sm flex items-center justify-center text-[10px] font-bold">E2E</div>
                 <div className="w-32 h-10 bg-emerald-600 flex items-center justify-center text-xs font-bold">Integration</div>
                 <div className="w-48 h-12 bg-blue-600 rounded-b-sm flex items-center justify-center text-sm font-bold">Unit</div>
              </div>
           </div>

          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
                activeLayer === layer.id
                  ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100`}>
                    <layer.icon className={`w-5 h-5 ${layer.color}`} />
                  </div>
                  <span className={`font-semibold ${activeLayer === layer.id ? 'text-slate-900' : 'text-slate-700'}`}>
                    {layer.title}
                  </span>
                </div>
                {activeLayer === layer.id && <ChevronRight className="w-5 h-5 text-emerald-500" />}
              </div>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed pl-[3.25rem]">
                {layer.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Code / Detail Panel */}
        <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="h-14 bg-slate-800 flex items-center justify-between px-6 border-b border-slate-700">
             <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-emerald-400" />
                <span className="font-semibold text-slate-200">
                   {layers.find(l => l.id === activeLayer)?.title} Example
                </span>
             </div>
             <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-700">
                <PlayCircle className="w-3 h-3" />
                <span>npm run test:{activeLayer}</span>
             </div>
          </div>
          
          {/* Details Bar */}
          <div className="bg-[#0f172a] px-6 py-4 border-b border-slate-800">
             <p className="text-slate-400 text-sm leading-relaxed">
                <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider mr-2">Strategy:</span>
                {layers.find(l => l.id === activeLayer)?.details}
             </p>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-auto p-6 bg-[#0B1120] custom-scrollbar">
            <pre className="text-sm font-mono leading-relaxed text-slate-300">
              {layers.find(l => l.id === activeLayer)?.code.split('\n').map((line, i) => (
                <div key={i} className="table-row">
                   <span className="table-cell select-none text-slate-700 text-right pr-6 w-10 opacity-50">{i + 1}</span>
                   <span className="table-cell whitespace-pre-wrap">
                     {line.split('//').map((part, idx) => {
                        if (idx === 0) {
                            return (
                                <span key={idx}>
                                    {part
                                     .replace(/(describe|it|expect|test|await|async|const|let|return|import|export|default|function)/g, '<span class="text-purple-400">$1</span>')
                                     .replace(/(db\.|request\(|http\.|check\(|sleep\()/g, '<span class="text-blue-400">$1</span>')
                                     .replace(/('.*?')/g, '<span class="text-amber-300">$1</span>')
                                     .split(/<span class="text-purple-400">|<span class="text-blue-400">|<span class="text-amber-300">|<\/span>/)
                                     .map((token, tIdx) => {
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
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingStrategy;