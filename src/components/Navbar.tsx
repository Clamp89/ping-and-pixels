import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tight text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Ping <span className="text-slate-400">&</span> Pixels
        </Link>

        {/* Category Navigation */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link 
            href="/gaming" 
            className="text-slate-300 hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800"
          >
            Gaming
          </Link>
          <Link 
            href="/tech" 
            className="text-slate-300 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800"
          >
            Tech News
          </Link>
        </div>
      </div>
    </nav>
  );
}