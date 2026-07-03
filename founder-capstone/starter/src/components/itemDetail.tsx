import { useState } from "react";
import type { Item } from "../data/types.ts";

interface ItemDetailProps {
  item: Item;
  onBack: () => void;
  onBookIntent: () => void;
}

export function ItemDetail({ item, onBack, onBookIntent }: ItemDetailProps) {
  // State to track the active image index in the carousel array
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // 1. Defensively process price architecture
  const isFree = item.price === null || item.price.amountCents === 0;
  const formattedPrice = !isFree && item.price
    ? `R${(item.price.amountCents / 100).toFixed(0)}`
    : "Free";

  const hasPhotos = item.photoUrls && item.photoUrls.length > 0;
  const currentPhoto = hasPhotos ? item.photoUrls[activeImageIndex] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Editorial Navigation Back Arrow */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-2 py-1 transition mb-6 uppercase tracking-wider"
      >
        ← Back to inventory
      </button>

      {/* Main Two-Column Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Assets Media Block */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm">
            {currentPhoto ? (
              <img
                src={currentPhoto}
                alt={`${item.title} - View ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-50 to-indigo-50/20 flex flex-col items-center justify-center">
                <span className="text-5xl mb-3 opacity-60">🛠️</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  No images uploaded
                </span>
              </div>
            )}

            {/* Dynamic Category Tag overlay */}
            <span className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-sm text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-800">
              {item.category.replace("-", " ")}
            </span>
          </div>

          {/* Thumbnail Selector Row (Only shows if there are multiple images) */}
          {hasPhotos && item.photoUrls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {item.photoUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 shrink-0 transition focus:outline-none ${
                    activeImageIndex === index
                      ? "border-indigo-600 shadow-sm scale-98"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Pricing, and Action Widgets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-6">
            
            {/* Header Identity Core */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
                  {item.title}
                </h2>
                {item.owner.rating !== null && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-100/50 shrink-0">
                    ★ {item.owner.rating.toFixed(1)}
                  </span>
                )}
              </div>
              
              <p className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                {item.distanceKm !== null 
                  ? `📍 Located ${item.distanceKm.toFixed(1)} km away from you` 
                  : "📍 Located in your neighborhood"}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Premium Text Body Paragraph */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Item Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Owner Metadata Row Profile Block */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center shadow-sm">
                  {item.owner.displayName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Lender</h4>
                  <p className="text-sm font-bold text-slate-800">{item.owner.displayName}</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-white text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Verified Neighbor
              </span>
            </div>

            {/* 🚨 THE RESHAPED TRAP: High-Trust Community Widget instead of Deceptive Countdown Pressure */}
            <div className="bg-gradient-to-r from-indigo-50/50 to-slate-50 p-4 rounded-2xl border border-indigo-100/40 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide">
                  Community Transparency
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                This item is marked as <strong className="text-slate-900 font-semibold">Available</strong> for community use. Pddle verifies all members to secure safe handovers and clear lending insurance.
              </p>
            </div>

            {/* Sticky Pricing & Master Conversion Button Block */}
            <div className="pt-2 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Rental Cost:
                </span>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900">{formattedPrice}</span>
                  {!isFree && item.price && (
                    <span className="text-sm font-semibold text-slate-400">/{item.price.period}</span>
                  )}
                </div>
              </div>

              <button
                onClick={onBookIntent}
                className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 text-white font-extrabold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-[0.99] tracking-wider uppercase text-sm"
              >
                Book This Item
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}