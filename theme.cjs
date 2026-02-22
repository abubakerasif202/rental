const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// App.tsx
replaceInFile('./App.tsx', [
  ['bg-slate-900', 'bg-[#0A0A0A]'],
  ['border-slate-800', 'border-zinc-800/50'],
  ['text-slate-300', 'text-zinc-400'],
  ['text-emerald-400', 'text-white'],
  ['bg-emerald-500/10', 'bg-white/10'],
  ['hover:bg-slate-800', 'hover:bg-white/5'],
  ['text-slate-400', 'text-zinc-400'],
  ['bg-slate-50', 'bg-[#F4F4F5]'],
  ['border-slate-200', 'border-zinc-200'],
  ['text-slate-800', 'text-zinc-900'],
  ['bg-emerald-50 text-emerald-700 ring-emerald-600/20', 'bg-zinc-100 text-zinc-700 ring-zinc-200'],
  ['text-slate-500', 'text-zinc-500'],
  ['<Key className="w-6 h-6" />', '<div className="bg-white text-black p-1.5 rounded-md"><Key className="w-4 h-4" /></div>'],
  ['<span className="font-bold text-xl tracking-tight text-white">RentFlow</span>', '<span className="font-semibold text-lg tracking-widest text-white uppercase">RentFlow</span>'],
  ['SaaS Admin & Architect', 'Prestige Fleet Management']
]);

// Dashboard.tsx
replaceInFile('./components/Dashboard.tsx', [
  ['bg-slate-50', 'bg-zinc-50'],
  ['bg-slate-100', 'bg-zinc-100'],
  ['bg-slate-200', 'bg-zinc-200'],
  ['bg-slate-400', 'bg-zinc-400'],
  ['bg-slate-800', 'bg-zinc-800'],
  ['bg-slate-900', 'bg-zinc-900'],
  ['text-slate-400', 'text-zinc-400'],
  ['text-slate-500', 'text-zinc-500'],
  ['text-slate-600', 'text-zinc-600'],
  ['text-slate-700', 'text-zinc-700'],
  ['text-slate-800', 'text-zinc-800'],
  ['text-slate-900', 'text-zinc-900'],
  ['border-slate-100', 'border-zinc-200'],
  ['border-slate-200', 'border-zinc-200'],
  ['divide-slate-100', 'divide-zinc-200'],
  ['divide-slate-50', 'divide-zinc-100'],
  
  // Premium accent colors (replace emerald/blue/purple with monochrome)
  ['text-emerald-600', 'text-zinc-900'],
  ['bg-emerald-50', 'bg-zinc-100'],
  ['text-blue-600', 'text-zinc-900'],
  ['bg-blue-50', 'bg-zinc-100'],
  ['text-purple-600', 'text-zinc-900'],
  ['bg-purple-50', 'bg-zinc-100'],
  ['bg-blue-500', 'bg-zinc-900'], // progress bar
  
  // Chart colors
  ['#10b981', '#18181b'],
  ['#64748b', '#71717a'],
  ['#e2e8f0', '#e4e4e7'],
  
  // Status pills (make them more subtle)
  ['bg-emerald-50 text-emerald-700 border-emerald-100', 'bg-white text-zinc-700 border-zinc-200 shadow-sm'],
  ['bg-blue-50 text-blue-700 border-blue-100', 'bg-white text-zinc-700 border-zinc-200 shadow-sm'],
  ['bg-amber-50 text-amber-700 border-amber-100', 'bg-white text-zinc-700 border-zinc-200 shadow-sm'],
  
  // Buttons
  ['bg-emerald-500', 'bg-zinc-900'],
  ['hover:bg-emerald-50', 'hover:bg-zinc-100'],
  ['focus:ring-emerald-500/20', 'focus:ring-zinc-500/20'],
  
  // Typography tweaks
  ['font-bold text-zinc-900', 'font-semibold text-zinc-900 tracking-tight'],
  ['font-bold text-zinc-800', 'font-semibold text-zinc-900 tracking-tight'],
  ['text-2xl font-bold', 'text-3xl font-light tracking-tight'],
  ['rounded-xl', 'rounded-2xl'],
  ['shadow-sm', 'shadow-[0_2px_10px_rgba(0,0,0,0.04)]']
]);

// RentalClosureModal.tsx
replaceInFile('./components/RentalClosureModal.tsx', [
  ['bg-slate-50', 'bg-zinc-50'],
  ['bg-slate-100', 'bg-zinc-100'],
  ['bg-slate-200', 'bg-zinc-200'],
  ['bg-slate-400', 'bg-zinc-400'],
  ['bg-slate-800', 'bg-zinc-800'],
  ['bg-slate-900', 'bg-zinc-900'],
  ['text-slate-400', 'text-zinc-400'],
  ['text-slate-500', 'text-zinc-500'],
  ['text-slate-600', 'text-zinc-600'],
  ['text-slate-700', 'text-zinc-700'],
  ['text-slate-800', 'text-zinc-800'],
  ['text-slate-900', 'text-zinc-900'],
  ['border-slate-100', 'border-zinc-200'],
  ['border-slate-200', 'border-zinc-200'],
  ['text-emerald-600', 'text-zinc-900'],
  ['bg-emerald-100', 'bg-zinc-100'],
  ['bg-emerald-500', 'bg-zinc-900'],
  ['accent-emerald-500', 'accent-zinc-900'],
  ['focus:ring-emerald-500/20', 'focus:ring-zinc-500/20'],
  ['text-blue-500', 'text-zinc-900'],
  ['bg-blue-50', 'bg-zinc-50'],
  ['border-blue-100', 'border-zinc-200'],
  ['text-blue-700', 'text-zinc-700'],
  ['text-amber-500', 'text-zinc-900'],
  ['rounded-xl', 'rounded-2xl']
]);

console.log('Theme applied successfully.');
