import type { Category } from "../data/types.ts";
import type { PriceFilterType } from "../utils/filterHelpers.ts";

interface FilterBarProps {
  query: string;
  setQuery: (val: string) => void;
  category: Category | "All";
  setCategory: (val: Category | "All") => void;
  maxDistance: number;
  setMaxDistance: (val: number) => void;
  priceType: PriceFilterType;
  setPriceType: (val: PriceFilterType) => void;
}

export function FilterBar({
  query,
  setQuery,
  category,
  setCategory,
  maxDistance,
  setMaxDistance,
  priceType,
  setPriceType,
}: FilterBarProps) {
  
  // Clean readable labels mapped directly to internal type strings
  const categoryLabels: { value: Category | "All"; label: string }[] = [
    { value: "All", label: "All Equipment" },
    { value: "power-tools", label: "⚡ Power Tools" },
    { value: "hand-tools", label: "🔧 Hand Tools" },
    { value: "garden", label: "🏡 Garden & Outdoor" },
    { value: "kitchen", label: "🍳 Kitchen Appliances" },
    { value: "outdoor", label: "⛺ Camping & Adventure" },
    { value: "party", label: "🎈 Party & Events" },
    { value: "other", label: "📦 Miscellaneous" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Text Search Input */}
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="What item do you need to borrow today?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 text-sm transition outline-none text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Price Choice Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
          {(["all", "free", "paid"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setPriceType(type)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition capitalize tracking-wide ${
                priceType === type
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {type} Items
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
        {/* Category Selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "All")}
            className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 rounded-xl px-3 py-2 cursor-pointer outline-none focus:border-indigo-500 transition"
          >
            {categoryLabels.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Range Radius Slider */}
        <div className="flex items-center gap-4 min-w-[260px]">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Radius: <strong className="text-slate-700 font-bold">{maxDistance}km</strong>
          </span>
          <input
            type="range"
            min="2"
            max="25"
            step="1"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>
    </div>
  );
}