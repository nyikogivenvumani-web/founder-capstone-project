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
import type { Category } from "./data/types.ts";
import { ItemCard } from "./components/ItemCard.tsx";
import { FilterBar } from "./components/filterBar.tsx";
import { ItemDetail } from "./components/itemDetail.tsx";
import { getFilteredItems, PriceFilterType } from "./utils/filterHelpers.ts";

type ViewMode = "browse" | "detail" | "booking";

export function App() {
  // Navigation State Control
  const [view, setView] = useState<ViewMode>("browse");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // High-Trust Guard Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthBarrier, setShowAuthBarrier] = useState<boolean>(false);

  // Search Engine State Values
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [priceType, setPriceType] = useState<PriceFilterType>("all");

  // Multi-Step Wizard Flow States
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [rentalDays, setRentalDays] = useState<number>(1);
  const [trustPledgeSigned, setTrustPledgeSigned] = useState<boolean>(false);

  // Active Lookup Context Item
  const selectedItem = ITEMS.find((i) => i.id === selectedItemId);

  // Compute Active Array Grid Reactively
  const displayItems = getFilteredItems(ITEMS, {
    query: searchQuery,
    category: selectedCategory,
    maxDistance,
    priceType,
  });

  // Dynamic Monetary Pricing Engine
  const calculateTotalCost = () => {
    if (!selectedItem || !selectedItem.price) return 0;
    return (selectedItem.price.amountCents * rentalDays) / 100;
  };

  const handleResetNavigation = () => {
    setView("browse");
    setSelectedItemId(null);
    setBookingStep(1);
    setRentalDays(1);
    setTrustPledgeSigned(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-100">
      {/* Dynamic Main Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 
          className="text-2xl font-black tracking-tight text-indigo-600 cursor-pointer select-none hover:opacity-90 transition"
          onClick={handleResetNavigation}
        >
          Pddle
        </h1>
        <div>
          {isAuthenticated ? (
            <span className="text-[11px] font-extrabold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100/60 shadow-sm tracking-wide uppercase">
              🏡 Neighborhood Member
            </span>
          ) : (
            <button 
              onClick={() => setShowAuthBarrier(true)}
              className="text-xs font-bold text-slate-600 hover:text-indigo-600 focus:text-indigo-600 focus:outline-none transition tracking-wider uppercase border border-slate-200 hover:border-indigo-100 rounded-xl px-4 py-2 bg-white"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Container Core View Router */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* VIEW 1: BROWSE GRID SCREEN */}
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
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto p-8 shadow-sm">
                <span className="text-4xl block mb-2">🔍</span>
                <h3 className="text-sm font-bold text-slate-900">No equipment found nearby</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Try broadening your range radius slider or adjusting your search phrase keyword parameters.
                </p>
              </div>
            )}
          </>
        )}

        {/* VIEW 2: HIGH-FIDELITY ITEM DETAIL SCREEN */}
        {view === "detail" && selectedItem && (
          <ItemDetail
            item={selectedItem}
            onBack={handleResetNavigation}
            onBookIntent={() => {
              if (!isAuthenticated) {
                setShowAuthBarrier(true);
              } else {
                setView("booking");
              }
            }}
          />
        )}

        {/* VIEW 3: THREE-STEP HIGH-TRUST BOOKING WIZARD FLOW */}
        {view === "booking" && selectedItem && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-md max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Steps Visual Indicator Navigation */}
            <div className="flex items-center justify-between mb-8 px-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    bookingStep === step 
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100" 
                      : bookingStep > step 
                        ? "bg-emerald-500 text-white" 
                        : "bg-slate-100 text-slate-400"
                  }`}>
                    {bookingStep > step ? "✓" : step}
                  </div>
                  {step < 3 && (
                    <div className={`h-0.5 mx-2 flex-grow transition-colors duration-300 ${
                      bookingStep > step ? "bg-emerald-400" : "bg-slate-100"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* STEP 3.1: SPECIFY RENTAL RETAIN DURATION CONFIGURATION */}
            {bookingStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Select Loan Duration</h2>
                  <p className="text-xs text-slate-400 mt-0.5">How long do you need this tool or item for?</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg border border-indigo-100">
                    📦
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{selectedItem.title}</h3>
                    <p className="text-xs text-slate-400">Owner: {selectedItem.owner.displayName}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Duration: <span className="text-slate-900 font-extrabold">{rentalDays} Day(s)</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 px-0.5">
                    <span>1 Day</span>
                    <span>3 Days</span>
                    <span>7 Days (Max)</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Cost:</span>
                  <span className="text-2xl font-black text-slate-900">
                    {selectedItem.price === null || selectedItem.price.amountCents === 0 
                      ? "Free Lend" 
                      : `R${calculateTotalCost()}`}
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setView("detail")}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl transition text-xs tracking-wide uppercase border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setBookingStep(2)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl transition text-xs tracking-wide uppercase shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    Continue to Pledge
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3.2: NEIGHBORHOOD SYSTEM TRUST PLEDGE SAFETY STEP */}
            {bookingStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Community Trust Pledge</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Pddle operates purely on mutual respect and care.</p>
                </div>

                <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-2xl space-y-3 text-left text-xs text-amber-900">
                  <p className="flex items-start gap-2 leading-relaxed">
                    <span className="shrink-0">🤝</span>
                    <span>I promise to treat this equipment with high care and return it clean and operational.</span>
                  </p>
                  <p className="flex items-start gap-2 leading-relaxed">
                    <span className="shrink-0">⏱️</span>
                    <span>I pledge to strictly return the item within the configured <strong className="font-bold">{rentalDays} day</strong> window timeframe.</span>
                  </p>
                  <p className="flex items-start gap-2 leading-relaxed">
                    <span className="shrink-0">🛡️</span>
                    <span>I accept accountability for asset handover compliance standards enforced by our neighborhood guild.</span>
                  </p>
                </div>

                <label className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={trustPledgeSigned}
                    onChange={(e) => setTrustPledgeSigned(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition">
                    I explicitly sign this community safety pledge
                  </span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl transition text-xs tracking-wide uppercase border border-slate-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (trustPledgeSigned) setBookingStep(3);
                    }}
                    disabled={!trustPledgeSigned}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl transition text-xs tracking-wide uppercase shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    Request Item
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3.3: HIGH-FIDELITY TRANSACTION COMPLETION VIEW */}
            {bookingStep === 3 && (
              <div className="space-y-6 py-4 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-2xl border border-emerald-100 mx-auto shadow-sm">
                  ✓
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Request Transmitted!</h2>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    We have submitted your lending application directly to <strong className="text-slate-800 font-semibold">{selectedItem.owner.displayName}</strong>. You will receive an alert once they authorize the drop-off time window.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs text-slate-600 max-w-sm mx-auto space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Lending Duration:</span>
                    <span className="font-bold text-slate-800">{rentalDays} Day(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-medium">Estimated Invoice:</span>
                    <span className="font-bold text-slate-800">
                      {selectedItem.price === null || selectedItem.price.amountCents === 0 
                        ? "R0.00 (Free)" 
                        : `R${calculateTotalCost()}.00`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleResetNavigation}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl transition text-xs tracking-wide uppercase tracking-wider"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        )}
      </main>

      {/* AUTH OVERLAY MODAL BARRIER */}
      {showAuthBarrier && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-slate-900 mb-1 tracking-tight">Verify Identity</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Pddle is built on tight community circles. Complete verification to access tool rentals.
            </p>
            <button
              onClick={() => {
                setIsAuthenticated(true);
                setShowAuthBarrier(false);
                if (selectedItemId && view === "detail") setView("booking");
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition text-xs tracking-wide uppercase shadow-md focus:ring-2 focus:ring-indigo-500/20 outline-none"
            >
              Verify Instantly with Email Address
            </button>
            <button
              onClick={() => setShowAuthBarrier(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-sm p-1 font-bold rounded-lg transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}