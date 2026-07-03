import type { Item } from "../data/types.ts";

interface ItemCardProps {
  item: Item;
  onSelect: (id: string) => void;
}

export function ItemCard({ item, onSelect }: ItemCardProps) {
  // 1. Defensively handle the price object structure
  const isFree = item.price === null || item.price.amountCents === 0;
  
  // Format cents to Rands (e.g., 5000 cents -> R50)
  const formattedPrice = !isFree && item.price
    ? `R${(item.price.amountCents / 100).toFixed(0)}`
    : "";

  // 2. Safely grab the first photo if it exists
  const hasPhoto = item.photoUrls && item.photoUrls.length > 0;
  const mainPhotoUrl = hasPhoto ? item.photoUrls[0] : null;

  // 3. Human-readable category mapper for the placeholder UI
  const formatCategory = (cat: string) => {
    return cat.replace("-", " ");
  };

  return (
    <div 
      onClick={() => onSelect(item.id)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 cursor-pointer flex flex-col h-full relative"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden border-b border-slate-100">
        {mainPhotoUrl ? (
          <img 
            src={mainPhotoUrl} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          /* Premium UI Fallback for missing photos (Required by Brief) */
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-indigo-50/30 flex flex-col items-center justify-center p-4">
            <span className="text-3xl mb-1.5 opacity-80">🛠️</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {formatCategory(item.category)}
            </span>
          </div>
        )}

        {/* Dynamic Price / Free Badge */}
        <div className="absolute top-3 left-3 z-10">
          {isFree ? (
            <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
              FREE LEND
            </span>
          ) : (
            <span className="bg-slate-900 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
              {formattedPrice}<span className="text-slate-300 font-medium">/{item.price?.period}</span>
            </span>
          )}
        </div>

        {/* Defensive Distance Badge (Handles Null location sharing gracefully) */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-slate-200/40">
          {item.distanceKm !== null ? `📍 ${item.distanceKm.toFixed(1)} km` : "📍 Nearby"}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {item.title}
          </h3>
          
          {/* Defensively handle missing owner ratings (Null Check) */}
          {item.owner.rating !== null ? (
            <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded">
              ★ {item.owner.rating.toFixed(1)}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-400 shrink-0 bg-slate-50 px-1.5 py-0.5 rounded">
              New Owner
            </span>
          )}
        </div>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
          {item.description}
        </p>

        {/* Footer Meta Details */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-500">
            <span>By</span>
            <strong className="text-slate-700 font-semibold">{item.owner.displayName}</strong>
          </div>
          <span className="text-indigo-600 font-bold tracking-tight group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
            Borrow →
          </span>
        </div>
      </div>
    </div>
  );
}