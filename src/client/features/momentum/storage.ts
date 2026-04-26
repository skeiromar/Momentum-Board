export type MomentumColor = 'blue' | 'plum' | 'gold' | 'coral' | 'mint' | 'slate';

export interface MomentumCategory {
  id: string;
  name: string;
  color: MomentumColor;
}

export interface MomentumBoardState {
  schemaVersion: '1';
  categories: MomentumCategory[];
  entries: Record<string, Record<string, number>>;
}

const STORAGE_KEY = 'momentum-board/v1';
const SCHEMA_VERSION: MomentumBoardState['schemaVersion'] = '1';

const DEFAULT_CATEGORY_SEEDS: Omit<MomentumCategory, 'id'>[] = [
  { name: 'Applying / Recruiter Messages', color: 'blue' },
  { name: 'Contracts', color: 'coral' },
  { name: 'Full-Time Jobs', color: 'plum' },
  { name: 'System Design', color: 'slate' },
  { name: 'LeetCode / SQL', color: 'gold' },
  { name: 'Infra Knowledge / AWS', color: 'mint' },
  { name: 'Portfolio / GitHub / Resume / LinkedIn', color: 'blue' },
  { name: 'Outreach / Networking', color: 'coral' },
  { name: 'Volunteer / Develop for Good', color: 'mint' },
  { name: 'Startup Outreach', color: 'plum' },
  { name: 'Startup Pitching', color: 'gold' },
  { name: 'Startup Research', color: 'slate' },
  { name: 'Startup Prototype', color: 'blue' },
  { name: 'YouTube Upload', color: 'coral' },
  { name: 'Trading / Investing / Market Prep', color: 'gold' },
  { name: 'Health', color: 'mint' },
  { name: 'Chores / Life Admin', color: 'slate' },
  { name: 'Reflection / Planning', color: 'plum' },
];

const COLOR_OPTIONS: MomentumColor[] = ['blue', 'plum', 'gold', 'coral', 'mint', 'slate'];

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const normalizeName = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ');

const slugify = (value: string) => value
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  || 'category';

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isMomentumColor = (value: unknown): value is MomentumColor =>
  typeof value === 'string' && COLOR_OPTIONS.includes(value as MomentumColor);

const dedupeCategories = (categories: MomentumCategory[]) => {
  const seenNames = new Set<string>();
  const seenIds = new Set<string>();

  return categories.filter(category => {
    const normalizedName = normalizeName(category.name);
    if (!normalizedName || seenNames.has(normalizedName) || seenIds.has(category.id)) {
      return false;
    }

    seenNames.add(normalizedName);
    seenIds.add(category.id);
    return true;
  });
};

export const DEFAULT_CATEGORIES = dedupeCategories(
  DEFAULT_CATEGORY_SEEDS.map(category => ({
    ...category,
    id: slugify(category.name),
  })),
);

export const createEmptyBoardState = (): MomentumBoardState => ({
  schemaVersion: SCHEMA_VERSION,
  categories: DEFAULT_CATEGORIES,
  entries: {},
});

const sanitizeEntries = (value: unknown): MomentumBoardState['entries'] => {
  if (!isObjectRecord(value)) {
    return {};
  }

  const normalizedEntries: MomentumBoardState['entries'] = {};

  for (const [dateKey, counts] of Object.entries(value)) {
    if (!isObjectRecord(counts)) {
      continue;
    }

    const nextCounts: Record<string, number> = {};

    for (const [categoryId, rawCount] of Object.entries(counts)) {
      if (typeof rawCount !== 'number' || !Number.isFinite(rawCount)) {
        continue;
      }

      const count = Math.max(0, Math.round(rawCount));
      if (count > 0) {
        nextCounts[categoryId] = count;
      }
    }

    if (Object.keys(nextCounts).length > 0) {
      normalizedEntries[dateKey] = nextCounts;
    }
  }

  return normalizedEntries;
};

const sanitizeCategories = (value: unknown): MomentumCategory[] => {
  if (!Array.isArray(value)) {
    return DEFAULT_CATEGORIES;
  }

  const parsed = value.flatMap(item => {
    if (!isObjectRecord(item)) {
      return [];
    }

    const { id, name, color } = item;
    if (typeof id !== 'string' || typeof name !== 'string' || !isMomentumColor(color)) {
      return [];
    }

    return [{
      id: slugify(id),
      name: name.trim(),
      color,
    }];
  });

  return parsed.length > 0 ? dedupeCategories(parsed) : DEFAULT_CATEGORIES;
};

export const loadMomentumState = (): MomentumBoardState => {
  if (typeof window === 'undefined') {
    return createEmptyBoardState();
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createEmptyBoardState();
    }

    const parsed = JSON.parse(stored) as unknown;
    if (!isObjectRecord(parsed)) {
      return createEmptyBoardState();
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      categories: sanitizeCategories(parsed.categories),
      entries: sanitizeEntries(parsed.entries),
    };
  } catch {
    return createEmptyBoardState();
  }
};

export const saveMomentumState = (state: MomentumBoardState) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const createCategoryId = (name: string, existingIds: string[]) => {
  const base = slugify(name);
  const existing = new Set(existingIds);

  if (!existing.has(base)) {
    return base;
  }

  let suffix = 2;
  while (existing.has(`${base}-${String(suffix)}`)) {
    suffix += 1;
  }

  return `${base}-${String(suffix)}`;
};

export const hasCategoryNameConflict = (name: string, categories: MomentumCategory[]) => {
  const normalizedName = normalizeName(name);
  return categories.some(category => normalizeName(category.name) === normalizedName);
};

export const formatBoardDate = (dateKey: string) => DAY_FORMATTER.format(parseDateKey(dateKey));

export const getTodayDateKey = (date = new Date()) => {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

export const shiftDateKey = (dateKey: string, amount: number) => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return getTodayDateKey(date);
};

export const getRelativeDateLabel = (dateKey: string) => {
  const today = getTodayDateKey();
  const yesterday = shiftDateKey(today, -1);
  const tomorrow = shiftDateKey(today, 1);

  if (dateKey === today) {
    return 'Today';
  }

  if (dateKey === yesterday) {
    return 'Yesterday';
  }

  if (dateKey === tomorrow) {
    return 'Tomorrow';
  }

  return formatBoardDate(dateKey);
};

export const getVisibleStarText = (count: number) => {
  if (count <= 0) {
    return '☆';
  }

  if (count <= 6) {
    return '★'.repeat(count);
  }

  return `${'★'.repeat(6)} +${String(count - 6)}`;
};
