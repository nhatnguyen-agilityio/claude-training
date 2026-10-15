export const SortPosition = {
  MOST_RECENT: 'mostRecent',
  LOW_TO_HIGH: 'lowToHigh',
  HIGH_TO_LOW: 'highToLow',
} as const;

export type SortPosition = (typeof SortPosition)[keyof typeof SortPosition];

export const SORT_LABELS: Record<SortPosition, string> = {
  [SortPosition.MOST_RECENT]: 'Most Recent',
  [SortPosition.LOW_TO_HIGH]: 'Price: Low to High',
  [SortPosition.HIGH_TO_LOW]: 'Price: High to Low',
};

export const DEFAULT_SORT_POSITION = SortPosition.MOST_RECENT;
