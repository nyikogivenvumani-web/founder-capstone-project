import type { Category } from "../data/types.ts";

// Strict type definitions matching exactly what App.tsx passes down
type PriceFilterType = "all" | "free" | "paid";

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

// Exhaustive category map: if a new Category is added to types.ts and not
// listed here, TypeScript errors instead of silently omitting it from the UI.
const CATEGORY_MAP: Record<Category, true> = {
  "power-tools": true,
  "ladders": true,
  "cleaning": true,
  "gardening": true,
};

const CATEGORIES: (Category | "All")[] = ["All", ...(Object.keys(CATEGORY_MAP) as Category[])];

const PRICE_TYPES: PriceFilterType[] = ["all", "free", "paid"];

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
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
      {/* Search Input Bar Row */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for lawnmowers, drills, high-pressure washers..."
          aria-label="Search items"
          className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none placeholder:text-slate-400 text-slate-800"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg select-none">
          🔍
        </span>
      </div>

      {/* Two-Column Sliders and Mode Switch Toggles Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {/* Distance Range Slider Module */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="max-distance" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Maximum Distance
            </label>
            <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/50">
              {maxDistance} km
            </span>
          </div>
          <input
            id="max-distance"
            type="range"
            min="1"
            max="50"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            aria-label={`Maximum distance: ${maxDistance} kilometers`}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
          />
        </div>

        {/* Dynamic Financial Cost Type Segment Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Filter by Rental Price
          </label>
          <div className="grid grid-cols-3 bg-slate-50 p-1 rounded-xl border border-slate-200/60" role="group" aria-label="Filter by rental price">
            {PRICE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPriceType(type)}
                aria-pressed={priceType === type}
                className={`py-1.5 text-xs font-bold rounded-lg uppercase tracking-wide transition-all ${
                  priceType === type
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/40"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Horizontal Editorial Category Pill Switch Row Selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Browse Categories
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Browse categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border uppercase tracking-wider ${
                category === cat
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-100"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              {cat.replaceAll("-", " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}