/* ============================================================
 * This is a near-empty shell ON PURPOSE.
 *
 * We are not giving you a component structure, a router, a state
 * pattern, or a design. Those are the decisions being assessed —
 * designing them is your job, and defending them in your Decision
 * Log is the point.
 *
 * Delete this placeholder. Build the product described in BRIEF.md.
 * Type your data using src/data/types.ts. Load it via
 * src/data/items.ts (or reshape that — your call).
 * ============================================================ */

import { useState } from "react";
import { ITEMS } from "./data/items.ts";
import type { Category, Item } from "./data/types.ts";
import { ItemCard } from "./components/ItemCard.tsx";
import { FilterBar } from "./components/FilterBar.tsx";
import { getFilteredItems, PriceFilterType } from "./utils/filterHelpers.ts";

type ViewMode = "browse" | "detail" | "booking";

export function App() {
  // Navigation State
  const [view, setView] = useState<ViewMode>("browse");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Authentication Mock State (UX Reshaped Protection)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthBarrier, setShowAuthBarrier] = useState<boolean>(false);

  // Filter Interface State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [priceType, setPriceType] = useState<PriceFilterType>("all");

  // Safely find the active item context
  const selectedItem = ITEMS.find((i) => i.id === selectedItemId);

  // Compute filtered grid view listings reactively
  const displayItems = getFilteredItems(ITEMS, {
    query: searchQuery,
    category: selectedCategory,
    maxDistance,
    priceType,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 
          className="text-2xl font-black tracking-tight text-indigo-600 cursor-pointer select-none"
          onClick={() => setView("browse")}
        >
          Pddle
        </h1>
        <div>
          {isAuthenticated ? (
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm">
              🏡 Neighborhood Member
            </span>
          ) : (
            <button 
              onClick={() => setShowAuthBarrier(true)}
              className="text-xs font-bold text-slate-600 hover:text-indigo-600 transition tracking-wide uppercase"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Primary Template Render Controller */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {view === "browse" && (
          <>
            <FilterBar
              query={searchQuery}
              setQuery={setSearchQuery}
              category={selectedCategory}
              setCategory={setSelectedCategory}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              priceType={priceType}
              setPriceType={setPriceType}
            />

            {displayItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onSelect={(id) => {
                      setSelectedItemId(id);
                      setView("detail");
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 max-w-md mx-auto p-6">
                <span className="text-4xl">🔍</span>
                <h3 className="mt-4 text-sm font-bold text-slate-900">No equipment found nearby</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Try broadening your radius slider or refining your keyword query string.
                </p>
              </div>
            )}
          </>
        )}

        {view === "detail" && selectedItem && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-2xl mx-auto">
            <button 
              onClick={() => setView("browse")} 
              className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition mb-6 block uppercase tracking-wider"
            >
              ← Back to Browse
            </button>
            <h2 className="text-2xl font-black text-slate-900 mb-4">{selectedItem.title}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{selectedItem.description}</p>
            
            {/* Context Intent Trigger Button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthBarrier(true);
                } else {
                  setView("booking");
                }
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition transform active:scale-[0.98] tracking-wide uppercase text-sm"
            >
              Request to Borrow Now
            </button>
          </div>
        )}

        {view === "booking" && selectedItem && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-md mx-auto text-center">
            <h2 className="text-xl font-black text-slate-900 mb-2">Confirm Booking</h2>
            <p className="text-sm text-slate-500 mb-6">You are requesting to borrow: <strong className="text-indigo-600">{selectedItem.title}</strong></p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left text-xs text-slate-600 space-y-2 mb-6">
              <p>👤 Owner: {selectedItem.owner.displayName}</p>
              <p>⏱️ Return window: Within 48 hours</p>
            </div>
            <button 
              onClick={() => {
                alert("Booking request submitted to neighbor!");
                setView("browse");
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-sm tracking-wide uppercase"
            >
              Finalize Request
            </button>
          </div>
        )}
      </main>

      {/* Auth Modal Barrier */}
      {showAuthBarrier && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-slate-900 mb-1">Verify Identity</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Pddle relies on high trust. Verify your community email to proceed with borrowing items.
            </p>
            <button
              onClick={() => {
                setIsAuthenticated(true);
                setShowAuthBarrier(false);
                if (selectedItemId && view === "detail") setView("booking");
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition text-xs tracking-wide uppercase shadow-sm"
            >
              Verify Instantly with Email
            </button>
            <button
              onClick={() => setShowAuthBarrier(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}