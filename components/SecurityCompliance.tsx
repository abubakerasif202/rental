import React, { useState } from 'react';
import { Shield, Lock, FileText, Server, Eye, CheckCircle, AlertTriangle, FileKey } from 'lucide-react';

const SecurityCompliance: React.FC = () => {
  const [activeSection, setActiveSection] = useState('pci');

  const sections = [
    {
      id: 'pci',
      title: 'PCI-DSS Compliance',
      icon: CreditCardIcon,
      status: 'Critical',
      content: {
        overview: 'As a merchant accepting payments, we must adhere to the Payment Card Industry Data Security Standard (PCI-DSS). Our architecture minimizes scope by using SAQ A.',
        requirements: [
          'Never store full Primary Account Numbers (PAN) or CVV codes.',
          'Use Stripe Elements/JS to tokenize card data directly from the client browser.',
          'Ensure all web traffic is served over TLS 1.2+ (HTTPS).',
          'Maintain a vulnerability management program (regular patching).'
        ],
        implementation: `// Client-side Tokenization (Reduces Scope)
const stripe = useStripe();
const elements = useElements();

const handleSubmit = async (event) => {
  // Card data never touches our backend server
  const {error, paymentMethod} = await stripe.createPaymentMethod({
    type: 'card',
    card: elements.getElement(CardElement),
  });
  
  // Only the 'pm_...' ID is sent to our backend
  await savePaymentMethodToBackend(paymentMethod.id);
};`
      }
    },
    {
      id: 'privacy',
      title: 'Privacy Act 1988 (AU)',
      icon: FileText,
      status: 'Mandatory',
      content: {
        overview: 'We must comply with the Australian Privacy Principles (APPs). This governs how we collect, use, and store Personal Identifiable Information (PII) like Driver Licenses.',
        requirements: [
          'APP 11: Take reasonable steps to protect personal information from misuse, interference, and loss.',
          'Data Minimization: Only collect license data required for the rental contract.',
          'Data Retention: Automatically archive/delete PII 7 years after the last transaction (statutory requirement).',
          'Notification: Notify users if data is stored overseas (e.g., if using US-based AWS regions).'
        ],
        implementation: `// S3 Bucket Policy for Driver Licenses (AES-256 + Private)
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DenyUnencryptedObjectUploads",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::rentflow-licenses-au/*",
            "Condition": {
                "StringNotEquals": {
                    "s3:x-amz-server-side-encryption": "AES256"
                }
            }
        }
    ]
}`
      }
    },
    {
      id: 'encryption',
      title: 'Data Encryption',
      icon: Lock,
      status: 'Standard',
      content: {
        overview: 'Encryption at rest and in transit is non-negotiable for protecting client data and intellectual property.',
        requirements: [
          'Database: Enable Transparent Data Encryption (TDE) on PostgreSQL (RDS/Cloud SQL).',
          'Application Level: Encrypt highly sensitive fields (e.g., tax IDs) before insertion using a KMS key.',
          'Transport: Enforce TLS 1.3 for all internal API communication.',
          'Backups: Encrypt snapshots with a separate customer-managed key (CMK).'
        ],
        implementation: `// Node.js Crypto Module Example for Sensitive Fields
import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const secretKey = process.env.DATA_KEY; // 32 bytes

function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}`
      }
    },
    {
      id: 'access',
      title: 'Access Control (RBAC)',
      icon: Server,
      status: 'Enforced',
      content: {
        overview: 'Strict Role-Based Access Control ensures employees only access data necessary for their job function (Principle of Least Privilege).',
        requirements: [
          'MFA: Enforce Multi-Factor Authentication for all Admin and Staff accounts.',
          'Audit Logs: Record every "read" action on sensitive tables (Clients, Payments).',
          'Separation of Duties: Developers should not have write access to production databases.',
          'Just-in-Time Access: Temporary elevated privileges for maintenance tasks.'
        ],
        implementation: `// NestJS Guard for Role Protection
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    
    const { user } = context.switchToHttp().getRequest();
    // Check if user has required role
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}`
      }
    }
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-8 h-8 text-emerald-600" />
          Security & Compliance Protocols
        </h2>
        <p className="text-slate-600 mt-2 max-w-3xl">
          Regulatory framework and technical implementation guidelines for the Australian market.
        </p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Navigation Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                activeSection === section.id
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-emerald-200'
              }`}
            >
              <div className={`p-2 rounded-lg ${activeSection === section.id ? 'bg-white/10' : 'bg-slate-100'}`}>
                <section.icon className={`w-5 h-5 ${activeSection === section.id ? 'text-emerald-400' : 'text-slate-500'}`} />
              </div>
              <div>
                <span className="block font-semibold text-sm">{section.title}</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider ${
                  activeSection === section.id ? 'text-slate-400' : 'text-emerald-600'
                }`}>
                  {section.status}
                </span>
              </div>
            </button>
          ))}
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
             <div className="flex items-center gap-2 text-blue-800 font-semibold mb-2 text-sm">
                <FileKey className="w-4 h-4" />
                <span>Compliance Certs</span>
             </div>
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-blue-700">
                   <CheckCircle className="w-3 h-3 text-emerald-500" /> SOC 2 Type II (Pending)
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-700">
                   <CheckCircle className="w-3 h-3 text-emerald-500" /> ISO 27001 (Ready)
                </div>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {sections.map((section) => {
             if (section.id !== activeSection) return null;
             return (
                <div key={section.id} className="flex flex-col h-full">
                   <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <section.icon className="w-6 h-6 text-emerald-600" />
                         </div>
                         <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
                         {section.content.overview}
                      </p>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-6 space-y-8">
                      {/* Requirements List */}
                      <div>
                         <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Core Requirements
                         </h4>
                         <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {section.content.requirements.map((req, idx) => (
                               <li key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-700">
                                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                  {req}
                               </li>
                            ))}
                         </ul>
                      </div>

                      {/* Code Block */}
                      <div>
                         <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Server className="w-4 h-4 text-blue-500" />
                            Technical Implementation
                         </h4>
                         <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 border-b border-slate-700">
                               <div className="flex gap-1.5">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                               </div>
                               <span className="text-xs font-mono text-slate-400 ml-2 opacity-50">implementation_guide.ts</span>
                            </div>
                            <div className="p-4 overflow-x-auto">
                               <pre className="text-sm font-mono text-slate-300">
                                  {section.content.implementation}
                               </pre>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

// Simple Icon component wrapper to avoid TS errors with lucide-react in the array
const CreditCardIcon = (props: any) => (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
);

export default SecurityCompliance;