import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Car, User, CreditCard, ChevronRight, CheckCircle2, ShieldCheck, Loader2, Info, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { format, addDays, isSameDay, isBefore, startOfToday } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Vehicle, VehicleStatus } from '../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const BookingContent: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [saveCard, setSaveCard] = useState(false);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 9, 25),
    to: new Date(2023, 9, 30)
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  
  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        const available = data.filter((v: Vehicle) => v.status === VehicleStatus.AVAILABLE);
        setVehicles(available);
        if (available.length > 0) setSelectedVehicleId(available[0].id);
      })
      .catch(err => console.error("Error fetching vehicles:", err));
  }, []);

  const [clientInfo, setClientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    license: ''
  });

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  
  const calculateDuration = () => {
    if (!dateRange?.from || !dateRange?.to) return 1;
    const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const durationDays = calculateDuration();
  const subtotal = selectedVehicle ? durationDays * selectedVehicle.dailyRate : 0;
  const taxes = subtotal * 0.1;
  const total = subtotal + taxes;

  // Mock unavailable dates for visual cues
  const unavailableDates = [
    addDays(startOfToday(), 2),
    addDays(startOfToday(), 3),
    addDays(startOfToday(), 10),
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">New Booking</h2>
        <p className="text-sm text-zinc-500 mt-1">Create a new rental reservation</p>
      </div>

      {step !== 5 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Dates & Location */}
            <div 
              className={`bg-white rounded-2xl border transition-all duration-300 ${step === 1 ? 'border-zinc-300 shadow-md' : 'border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] opacity-70'}`}
            >
              <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${step === 1 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">1. Dates & Duration</h3>
              </div>
              
              {step === 1 && (
                <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-zinc-700 mb-4 uppercase tracking-wider">Select Rental Period</label>
                      <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 inline-block">
                        <DayPicker
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          disabled={{ before: startOfToday() }}
                          modifiers={{ unavailable: unavailableDates }}
                          modifiersClassNames={{
                            unavailable: "text-zinc-300 line-through cursor-not-allowed"
                          }}
                          styles={{
                            caption: { color: '#18181b', fontWeight: '600' },
                            head_cell: { color: '#71717a', fontSize: '12px', fontWeight: '500' },
                            day: { borderRadius: '8px' },
                            day_selected: { backgroundColor: '#18181b', color: 'white' },
                            day_today: { color: '#18181b', fontWeight: 'bold', textDecoration: 'underline' }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="md:w-64 space-y-6">
                      <div className="p-4 bg-zinc-900 rounded-2xl text-white shadow-lg">
                        <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-1">Duration</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">{durationDays}</span>
                          <span className="text-sm opacity-80">Days</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Pick-up</p>
                          <p className="text-sm font-medium text-zinc-900">
                            {dateRange?.from ? format(dateRange.from, 'PPP') : 'Select date'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Return</p>
                          <p className="text-sm font-medium text-zinc-900">
                            {dateRange?.to ? format(dateRange.to, 'PPP') : 'Select date'}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-700 leading-relaxed">
                          Dates marked with a line through them are currently unavailable for this fleet category.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!dateRange?.from || !dateRange?.to}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Vehicle Selection */}
            <div 
              className={`bg-white rounded-2xl border transition-all duration-300 ${step === 2 ? 'border-zinc-300 shadow-md' : 'border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] opacity-70'}`}
            >
              <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${step === 2 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">2. Vehicle Selection</h3>
              </div>
              
              {step === 2 && (
                <div className="p-6 space-y-5 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map((v) => (
                      <div 
                        key={v.id}
                        onMouseEnter={() => setIsHovered(v.id)}
                        onMouseLeave={() => setIsHovered(null)}
                        onClick={() => setSelectedVehicleId(v.id)}
                        className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 ${selectedVehicleId === v.id ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900' : isHovered === v.id ? 'border-zinc-400 bg-zinc-50 shadow-sm scale-[1.02]' : 'border-zinc-200 hover:border-zinc-300'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-zinc-900">{v.make} {v.model}</h4>
                            <p className="text-xs text-zinc-500 mt-0.5">{v.year} • {v.fuelType}</p>
                          </div>
                          <span className="text-sm font-bold text-zinc-900">${v.dailyRate}<span className="text-xs font-normal text-zinc-500">/day</span></span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <span className="text-[10px] font-medium uppercase tracking-wider bg-white border border-zinc-200 text-zinc-600 px-2 py-1 rounded-md shadow-sm">{v.transmission}</span>
                          <span className="text-[10px] font-medium uppercase tracking-wider bg-white border border-zinc-200 text-zinc-600 px-2 py-1 rounded-md shadow-sm">{v.seats} Seats</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 flex justify-between items-center">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-zinc-500 hover:text-zinc-900 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Client Details */}
            <div 
              className={`bg-white rounded-2xl border transition-all duration-300 ${step === 3 ? 'border-zinc-300 shadow-md' : 'border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] opacity-70'}`}
            >
              <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${step === 3 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">3. Client Details</h3>
              </div>
              
              {step === 3 && (
                <div className="p-6 space-y-5 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-2 uppercase tracking-wider">First Name</label>
                      <input 
                        type="text" 
                        placeholder="John" 
                        value={clientInfo.firstName}
                        onChange={(e) => setClientInfo({...clientInfo, firstName: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all shadow-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-2 uppercase tracking-wider">Last Name</label>
                      <input 
                        type="text" 
                        placeholder="Doe" 
                        value={clientInfo.lastName}
                        onChange={(e) => setClientInfo({...clientInfo, lastName: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all shadow-sm" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-700 mb-2 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={clientInfo.email}
                        onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all shadow-sm" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-zinc-700 mb-2 uppercase tracking-wider">Driver's License Number</label>
                      <input 
                        type="text" 
                        placeholder="DL-123456789" 
                        value={clientInfo.license}
                        onChange={(e) => setClientInfo({...clientInfo, license: e.target.value})}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-900 transition-all shadow-sm" 
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-between items-center">
                    <button 
                      onClick={() => setStep(2)}
                      className="text-zinc-500 hover:text-zinc-900 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={() => setStep(4)}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Payment Method */}
            <div 
              className={`bg-white rounded-2xl border transition-all duration-300 ${step === 4 ? 'border-zinc-300 shadow-md' : 'border-zinc-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] opacity-70'}`}
            >
              <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${step === 4 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">4. Payment Method</h3>
              </div>
              
              {step === 4 && (
                <div className="p-6 space-y-5 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                      <label className="block text-xs font-semibold text-zinc-700 mb-3 uppercase tracking-wider">Secure Card Details</label>
                      <div className="bg-white p-3.5 rounded-lg border border-zinc-200 shadow-sm">
                        <CardElement 
                          onChange={(e) => {
                            if (e.error) {
                              setPaymentError(e.error.message);
                            } else {
                              setPaymentError(null);
                            }
                          }}
                          options={{
                            style: {
                              base: {
                                fontSize: '14px',
                                color: '#18181b',
                                '::placeholder': {
                                  color: '#a1a1aa',
                                },
                                fontFamily: 'Inter, system-ui, sans-serif',
                              },
                              invalid: {
                                color: '#ef4444',
                              },
                            },
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-3 flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Payments are secured and tokenized by Stripe.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 p-1">
                      <input 
                        type="checkbox" 
                        id="save-card"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900/20 cursor-pointer"
                      />
                      <label htmlFor="save-card" className="text-sm text-zinc-600 cursor-pointer select-none">
                        Save card for future payments
                      </label>
                    </div>

                    {paymentError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-red-700 leading-relaxed">
                          {paymentError}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="pt-4 flex justify-between items-center">
                    <button 
                      onClick={() => setStep(3)}
                      disabled={isProcessing}
                      className="text-zinc-500 hover:text-zinc-900 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button 
                      onClick={async () => {
                        if (!stripe || !elements) return;
                        
                        setIsProcessing(true);
                        setPaymentError(null);
                        
                        const cardElement = elements.getElement(CardElement);
                        if (!cardElement) {
                          setIsProcessing(false);
                          return;
                        }

                        const { error, paymentMethod } = await stripe.createPaymentMethod({
                          type: 'card',
                          card: cardElement as any,
                          billing_details: {
                            name: `${clientInfo.firstName} ${clientInfo.lastName}`,
                            email: clientInfo.email,
                          },
                        });

                        if (error) {
                          setPaymentError(error.message || "An unexpected error occurred with your payment method.");
                          setIsProcessing(false);
                          return;
                        }

                        // Call confirmation API with tokenized payment method ID
                        try {
                          const bookingData = {
                            email: clientInfo.email,
                            clientName: `${clientInfo.firstName} ${clientInfo.lastName}`,
                            vehicle: `${selectedVehicle.make} ${selectedVehicle.model}`,
                            dates: `${dateRange?.from ? format(dateRange.from, 'PP') : ''} to ${dateRange?.to ? format(dateRange.to, 'PP') : ''}`,
                            total: total.toFixed(2),
                            paymentMethodId: paymentMethod.id, // Send the tokenized ID
                            saveCard: saveCard // Pass the preference
                          };

                          const response = await fetch('/api/bookings/confirm', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(bookingData)
                          });
                          
                          if (response.ok) {
                            setBookingDetails(bookingData);
                            setStep(5);
                          } else {
                            const errorData = await response.json().catch(() => ({}));
                            setPaymentError(errorData.message || "Booking completed, but failed to send confirmation email.");
                          }
                        } catch (error) {
                          console.error("Error sending confirmation:", error);
                          setPaymentError("Failed to connect to the server. Please check your internet connection.");
                        }
                        
                        setIsProcessing(false);
                        if (step === 5) {
                          setClientInfo({ firstName: '', lastName: '', email: '', license: '' });
                          setDateRange({
                            from: new Date(2023, 9, 25),
                            to: new Date(2023, 9, 30)
                          });
                        }
                      }}
                      disabled={isProcessing || !stripe}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>Processing <Loader2 className="w-4 h-4 animate-spin" /></>
                      ) : (
                        <>Complete Booking <CheckCircle2 className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] sticky top-6 overflow-hidden">
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                <h3 className="text-lg font-semibold text-zinc-900">Booking Summary</h3>
              </div>
              
              <div className="aspect-video w-full overflow-hidden bg-zinc-100 border-b border-zinc-100">
                <img 
                  src={selectedVehicle?.image} 
                  alt={selectedVehicle?.model}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Dates</p>
                  <p className="text-sm font-medium text-zinc-900">
                    {dateRange?.from ? format(dateRange.from, 'MMM d, yyyy') : '...'} - {dateRange?.to ? format(dateRange.to, 'MMM d, yyyy') : '...'}
                  </p>
                  <p className="text-xs text-zinc-500">{durationDays} Days</p>
                </div>
                
                <div className="space-y-1.5">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Vehicle</p>
                  <p className="text-sm font-medium text-zinc-900">{selectedVehicle?.make} {selectedVehicle?.model}</p>
                  <p className="text-xs text-zinc-500">${selectedVehicle?.dailyRate?.toFixed(2)} / day</p>
                </div>

                <div className="pt-5 border-t border-zinc-100 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-medium text-zinc-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Taxes & Fees (10%)</span>
                    <span className="font-medium text-zinc-900">${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base pt-4 border-t border-zinc-100">
                    <span className="font-bold text-zinc-900">Total</span>
                    <span className="font-bold text-zinc-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 bg-zinc-50 border-t border-zinc-100">
                <div className="flex items-start gap-3 text-xs text-zinc-600">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <p className="leading-relaxed">
                    <span className="font-semibold text-zinc-900 block mb-0.5">Secure Reservation</span>
                    No payment is required until pick-up. A security deposit hold will be placed on your card at the counter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Step 5: Confirmation */
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-zinc-200 shadow-xl p-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-zinc-900 mb-2">Booking Confirmed!</h3>
          <p className="text-zinc-500 mb-8">A confirmation email has been sent to <span className="font-semibold text-zinc-900">{bookingDetails.email}</span></p>
          
          <div className="bg-zinc-50 rounded-2xl p-6 text-left space-y-4 mb-8 border border-zinc-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Client</p>
                <p className="text-sm font-semibold text-zinc-900">{bookingDetails.clientName}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Vehicle</p>
                <p className="text-sm font-semibold text-zinc-900">{bookingDetails.vehicle}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Dates</p>
                <p className="text-sm font-semibold text-zinc-900">{bookingDetails.dates}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Total Paid</p>
                <p className="text-sm font-semibold text-zinc-900">${bookingDetails.total}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-200 flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment Method Tokenized: {bookingDetails.paymentMethodId}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              setStep(1);
              setBookingDetails(null);
            }}
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Book Another Vehicle
          </button>
        </div>
      )}
    </div>
  );
};

const Booking: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <BookingContent />
    </Elements>
  );
};

export default Booking;
