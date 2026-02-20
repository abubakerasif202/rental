import React, { useState } from 'react';
import { Terminal, Lock, Users, Car, Calendar, CreditCard, Wrench, ChevronDown, ChevronRight, Share2, Copy } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  roles: string[];
  description: string;
  requestBody?: object;
  responseBody?: object;
}

interface ResourceGroup {
  id: string;
  name: string;
  description: string;
  icon: any;
  endpoints: Endpoint[];
}

const ApiDocs: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<string>('rentals');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({});

  const toggleEndpoint = (path: string) => {
    setExpandedEndpoints(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const resources: ResourceGroup[] = [
    {
      id: 'auth',
      name: 'Authentication',
      description: 'JWT-based stateless authentication.',
      icon: Lock,
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/auth/login',
          summary: 'Login User',
          roles: ['Public'],
          description: 'Authenticates a user and returns a JWT access token and refresh token.',
          requestBody: { email: "admin@rentflow.com", password: "secure_password" },
          responseBody: { accessToken: "eyJhbGc...", refreshToken: "d78sw...", expiresIn: 3600 }
        }
      ]
    },
    {
      id: 'clients',
      name: 'Clients',
      description: 'Manage customer profiles and risk assessments.',
      icon: Users,
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/clients',
          summary: 'List Clients',
          roles: ['Staff', 'Admin'],
          description: 'Retrieve a paginated list of clients with optional search filters.',
        },
        {
          method: 'POST',
          path: '/api/v1/clients',
          summary: 'Create Client',
          roles: ['Staff', 'Admin'],
          description: 'Register a new client. Performs automatic license validation check.',
          requestBody: { 
            firstName: "John", 
            lastName: "Doe", 
            email: "john@example.com", 
            driverLicense: "DL123456",
            dob: "1990-01-01" 
          },
          responseBody: { id: "uuid-client-1", riskScore: 0, status: "active" }
        }
      ]
    },
    {
      id: 'vehicles',
      name: 'Vehicles',
      description: 'Fleet inventory and status management.',
      icon: Car,
      endpoints: [
        {
          method: 'GET',
          path: '/api/v1/vehicles',
          summary: 'List Vehicles',
          roles: ['Public', 'Staff'],
          description: 'Get available vehicles. Public role only sees "Available" status cars.',
        },
        {
          method: 'POST',
          path: '/api/v1/vehicles',
          summary: 'Add Vehicle',
          roles: ['Admin'],
          description: 'Onboard a new vehicle to the fleet.',
          requestBody: { make: "Toyota", model: "Camry", year: 2024, vin: "JTN...", plate: "NSW-111" }
        },
        {
          method: 'PATCH',
          path: '/api/v1/vehicles/:id',
          summary: 'Update Vehicle',
          roles: ['Staff', 'Admin'],
          description: 'Update vehicle details, status, or mileage correction.',
          requestBody: { status: "maintenance", currentMileage: 15042 }
        }
      ]
    },
    {
      id: 'rentals',
      name: 'Rentals',
      description: 'Core booking and rental lifecycle operations.',
      icon: Calendar,
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/rentals',
          summary: 'Create Rental',
          roles: ['Staff', 'Admin'],
          description: 'Initialize a rental agreement. Locks vehicle availability.',
          requestBody: { 
            clientId: "uuid-client-1", 
            vehicleId: "uuid-vehicle-5", 
            startDate: "2023-11-01T10:00:00Z", 
            endDate: "2023-11-05T10:00:00Z",
            depositAmount: 500.00 
          },
          responseBody: { id: "rental-123", status: "pending", totalEstimated: 450.00 }
        },
        {
          method: 'POST',
          path: '/api/v1/rentals/:id/close',
          summary: 'Close Rental',
          roles: ['Staff', 'Admin'],
          description: 'Finalize a rental upon return. Calculates final fees based on mileage and fuel.',
          requestBody: { 
            endMileage: 15600, 
            fuelLevel: 100,
            damageReported: false 
          },
          responseBody: { id: "rental-123", status: "completed", finalTotal: 450.00, balanceDue: 0 }
        }
      ]
    },
    {
      id: 'payments',
      name: 'Payments',
      description: 'Payment processing and refund handling.',
      icon: CreditCard,
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/payments',
          summary: 'Process Payment',
          roles: ['Staff', 'Admin'],
          description: 'Charge a stored payment method for a specific rental.',
          requestBody: { 
            rentalId: "rental-123", 
            amount: 150.00, 
            type: "rental_fee", 
            paymentMethodId: "pm_card_visa" 
          },
          responseBody: { id: "pay-999", status: "captured", transactionId: "ch_stripe_123" }
        }
      ]
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      description: 'Service logs and fleet upkeep.',
      icon: Wrench,
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/maintenance',
          summary: 'Log Service',
          roles: ['Staff', 'Admin'],
          description: 'Record a maintenance event. Automatically updates vehicle status if needed.',
          requestBody: { 
            vehicleId: "uuid-vehicle-5", 
            serviceType: "Oil Change", 
            cost: 120.00, 
            vendor: "Bob's Mechanics" 
          }
        }
      ]
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'POST': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PUT': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PATCH': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getActiveResource = () => resources.find(r => r.id === activeGroup) || resources[0];

  return (
    <div className="flex h-full animate-in fade-in duration-500 gap-6">
      
      {/* Sidebar: Resources */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-2">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-emerald-600" />
            API Reference
          </h2>
          <p className="text-xs text-slate-500 mt-1">v1.0.4 • OAS 3.0 Standard</p>
        </div>

        {resources.map((resource) => (
          <button
            key={resource.id}
            onClick={() => setActiveGroup(resource.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all border text-left ${
              activeGroup === resource.id
                ? 'bg-white border-emerald-200 shadow-sm ring-1 ring-emerald-500/20'
                : 'bg-transparent border-transparent hover:bg-slate-100 text-slate-600'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeGroup === resource.id ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
              <resource.icon className="w-4 h-4" />
            </div>
            <div>
              <span className={`block text-sm font-semibold ${activeGroup === resource.id ? 'text-slate-900' : ''}`}>
                {resource.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {resource.endpoints.length} endpoints
              </span>
            </div>
          </button>
        ))}
        
        <div className="mt-auto p-4 bg-slate-900 rounded-xl text-slate-300">
          <div className="flex items-center gap-2 mb-2 text-white font-semibold">
            <Share2 className="w-4 h-4" />
            <span>Postman Collection</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Download the full collection for testing.</p>
          <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors">
            Download .json
          </button>
        </div>
      </div>

      {/* Main Content: Endpoints */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
           <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              {getActiveResource().name} API
           </h3>
           <p className="text-slate-600 mt-2">{getActiveResource().description}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
          {getActiveResource().endpoints.map((endpoint, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
              {/* Endpoint Header */}
              <div 
                onClick={() => toggleEndpoint(endpoint.path + endpoint.method)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors select-none"
              >
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold border ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-slate-700">{endpoint.path}</code>
                  <span className="text-sm text-slate-500 font-medium hidden sm:inline-block">- {endpoint.summary}</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex gap-1">
                      {endpoint.roles.map(role => (
                        <span key={role} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-wider rounded border border-slate-200">
                          {role}
                        </span>
                      ))}
                   </div>
                   {expandedEndpoints[endpoint.path + endpoint.method] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedEndpoints[endpoint.path + endpoint.method] && (
                <div className="border-t border-slate-100 p-4 bg-slate-50/50">
                  <p className="text-sm text-slate-600 mb-6">{endpoint.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {endpoint.requestBody && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Request Body</h4>
                          <span className="text-[10px] text-emerald-600 font-mono">application/json</span>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 relative group">
                           <button className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              <Copy className="w-3 h-3" />
                           </button>
                           <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">
                              {JSON.stringify(endpoint.requestBody, null, 2)}
                           </pre>
                        </div>
                      </div>
                    )}
                    
                    {endpoint.responseBody && (
                       <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Response (200 OK)</h4>
                          <span className="text-[10px] text-emerald-600 font-mono">application/json</span>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                           <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">
                              {JSON.stringify(endpoint.responseBody, null, 2)}
                           </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ApiDocs;