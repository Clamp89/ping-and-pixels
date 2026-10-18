interface AffiliateCardProps {
  title: string;
  description: string;
  price?: string;
  affiliateUrl: string;
  badgeText?: string;
}

export default function AffiliateCard({
  title,
  description,
  price,
  affiliateUrl,
  badgeText = "Featured Deal",
}: AffiliateCardProps) {
  if (!affiliateUrl) return null;

  return (
    <div className="my-8 p-6 rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 px-2.5 py-1 rounded-full">
          {badgeText}
        </span>
        {price && (
          <span className="text-lg font-bold text-slate-100">{price}</span>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>

      <a
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2.5 font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-md hover:shadow-emerald-500/20"
      >
        Check Current Price
      </a>
    </div>
  );
}