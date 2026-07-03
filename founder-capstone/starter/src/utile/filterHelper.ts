import type { Item } from "../data/types.ts";

export type PriceFilterType = "all" | "free" | "paid";

interface FilterOptions {
  query: string;
  category: string; // Will handle "All" or explicit categories like "power-tools"
  maxDistance: number;
  priceType: PriceFilterType;
}

/**
 * Pure, defensively-programmed filtering engine built exactly to the src/data/types.ts specification.
 * Handles missing distances, null prices, and active item status filters.
 */
export function getFilteredItems(items: Item[], options: FilterOptions): Item[] {
  const { query, category, maxDistance, priceType } = options;

  return items.filter((item) => {
    // 1. Defensively eliminate paused or removed items immediately
    if (item.status !== "available") return false;

    // 2. Text Search Match (Title & Description) - Case Insensitive
    const matchesSearch =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());
    if (!matchesSearch) return false;

    // 3. Category Filter
    const matchesCategory = category === "All" || item.category === category;
    if (!matchesCategory) return false;

    // 4. Defensive Distance Check (Handles null state if viewer hasn't shared location)
    // Product choice: If location is unknown (null), we still show it to avoid a blank feed,
    // but we can optionally hide it if a strict radius is selected.
    const matchesDistance = 
      item.distanceKm === null || item.distanceKm <= maxDistance;
    if (!matchesDistance) return false;

    // 5. Defensive Price Check (Handles null object or 0 cents as free)
    const isFree = item.price === null || item.price.amountCents === 0;
    const matchesPrice =
      priceType === "all" ||
      (priceType === "free" && isFree) ||
      (priceType === "paid" && !isFree);

    return matchesPrice;
  });
}