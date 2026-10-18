import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-extrabold text-slate-100 tracking-tight hover:text-emerald-400 transition-colors"
        >
          Ping & Pixels
        </Link>
        
        <div className="flex gap-2 sm:gap-4">
          <Link 
            href="/gaming" 
            className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-900"
          >
            Gaming
          </Link>
          <Link 
            href="/tech" 
            className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors px-3 py-2 rounded-md hover:bg-slate-900"
          >
            Tech
          </Link>
        </div>
      </div>
    </nav>
  );
}