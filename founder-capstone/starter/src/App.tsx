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

// Strict View Routing Type
type View = "browse" | "detail" | "booking";

export function App() {
  // Navigation & Selection State
  const [currentView, setCurrentView] = useState<View>("browse");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Auth & Booking State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [bookingStep, setBookingStep] = useState<number>(1);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [maxDistance, setMaxDistance] = useState<number>(50); // km
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  // Find the selected item safely
  const selectedItem = ITEMS.find((item) => item.id === selectedItemId);

  // Push back against the forced login: Trigger auth only when booking is clicked
  const handleBookNowTrigger = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setCurrentView("booking");
      setBookingStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Premium Sticky Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div 
          className="text-2xl font-black tracking-tight text-indigo-600 cursor-pointer"
          onClick={() => setCurrentView("browse")}
        >
          Pddle
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <span className="text-sm font-medium bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              👋 Active Neighbor
            </span>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentView === "browse" && (
          <div>
            {/* Filter Component Placeholder */}
            {/* Item Grid Component Placeholder */}
          </div>
        )}

        {currentView === "detail" && selectedItem && (
          <div>
            {/* Detail View Component Placeholder */}
            <button 
              onClick={handleBookNowTrigger}
              className="mt-6 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform active:scale-95 text-center block"
            >
              BOOK NOW
            </button>
          </div>
        )}

        {currentView === "booking" && selectedItem && (
          <div>
            {/* Multi-step Booking Flow Placeholder */}
          </div>
        )}
      </main>

      {/* Honest Auth Modal (Growth Hack Reshaped) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-slate-100">
            <h3 className="text-xl font-bold text-slate-950 mb-2">Join the Neighborhood</h3>
            <p className="text-sm text-slate-600 mb-6">Create a free account to instantly book items near you.</p>
            {/* Simple Email Capture Form */}
            <button 
              onClick={() => {
                setIsAuthenticated(true);
                setShowAuthModal(false);
                if (selectedItemId) setCurrentView("booking");
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition"
            >
              Continue with Email
            </button>
            <button 
              onClick={() => setShowAuthModal(false)}
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
