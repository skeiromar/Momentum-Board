import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';
import { PageMeta } from '../ui/components/page-meta';
import {
  CategoryManager,
  HeaderSection,
  MomentumCardGrid,
  StoragePreview,
} from '../features/momentum/components';
import {
  createCategoryId,
  formatBoardDate,
  getRelativeDateLabel,
  getTodayDateKey,
  hasCategoryNameConflict,
  loadMomentumState,
  saveMomentumState,
  type MomentumBoardState,
  type MomentumCategory,
  type MomentumColor,
} from '../features/momentum/storage';

const countStarsForDate = (state: MomentumBoardState, dateKey: string) =>
  Object.values(state.entries[dateKey] ?? {}).reduce((sum, count) => sum + count, 0);

const buildDateCounts = (
  counts: Record<string, number>,
  categoryId: string,
  nextCount: number,
) => Object.fromEntries(
  Object.entries({
    ...counts,
    ...(nextCount > 0 ? { [categoryId]: nextCount } : {}),
  }).filter(([, count]) => count > 0),
);

const removeCategoryFromEntries = (
  entries: MomentumBoardState['entries'],
  categoryId: string,
): MomentumBoardState['entries'] => {
  const nextEntries: MomentumBoardState['entries'] = {};

  for (const [dateKey, counts] of Object.entries(entries)) {
    const nextCounts = Object.fromEntries(
      Object.entries(counts).filter(([entryCategoryId]) => entryCategoryId !== categoryId),
    );

    if (Object.keys(nextCounts).length > 0) {
      nextEntries[dateKey] = nextCounts;
    }
  }

  return nextEntries;
};

const Home = () => {
  const [boardState, setBoardState] = useState(() => loadMomentumState());
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateKey());
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState<MomentumColor>('blue');
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    saveMomentumState(boardState);
  }, [boardState]);

  const selectedDateCounts = boardState.entries[selectedDate] ?? {};
  const totalStars = countStarsForDate(boardState, selectedDate);
  const activeDateLabel = getRelativeDateLabel(selectedDate);
  const activeDateDisplay = formatBoardDate(selectedDate);

  const updateStarCount = (categoryId: string, delta: number) => {
    setBoardState(previousState => {
      const currentCounts = previousState.entries[selectedDate] ?? {};
      const currentCount = currentCounts[categoryId] ?? 0;
      const nextCount = Math.max(0, currentCount + delta);
      const nextDayCounts = buildDateCounts(currentCounts, categoryId, nextCount);
      const nextEntries = Object.fromEntries(
        Object.entries({
          ...previousState.entries,
          ...(Object.keys(nextDayCounts).length > 0 ? { [selectedDate]: nextDayCounts } : {}),
        }).filter(([, counts]) => Object.keys(counts).length > 0),
      );

      return {
        ...previousState,
        entries: nextEntries,
      };
    });
  };

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setCategoryError('Enter a category name first.');
      return;
    }

    if (hasCategoryNameConflict(trimmedName, boardState.categories)) {
      setCategoryError('That category already exists.');
      return;
    }

    const nextCategory: MomentumCategory = {
      id: createCategoryId(trimmedName, boardState.categories.map(category => category.id)),
      name: trimmedName,
      color: newCategoryColor,
    };

    setBoardState(previousState => ({
      ...previousState,
      categories: [...previousState.categories, nextCategory],
    }));
    setNewCategoryName('');
    setNewCategoryColor('blue');
    setCategoryError(null);
  };

  const handleRemoveCategory = (category: MomentumCategory) => {
    const confirmed = window.confirm(
      `Remove "${category.name}"? This deletes its saved stars across all dates.`,
    );

    if (!confirmed) {
      return;
    }

    setBoardState(previousState => ({
      ...previousState,
      categories: previousState.categories.filter(item => item.id !== category.id),
      entries: removeCategoryFromEntries(previousState.entries, category.id),
    }));
  };

  return (
    <Box
      as="main"
      minH="100vh"
      position="relative"
      overflow="hidden"
      bg="var(--board-bg)"
      color="var(--board-ink)"
    >
      <PageMeta
        title="Momentum Board"
        description="A local-first daily board for tracking directional momentum with simple star counts."
      />
      <Box
        position="absolute"
        inset="0"
        bg="radial-gradient(circle at top right, rgba(240, 200, 92, 0.18), transparent 26%), radial-gradient(circle at bottom left, rgba(87, 132, 200, 0.14), transparent 24%)"
        pointerEvents="none"
      />

      <Container maxW="1240px" px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }} position="relative">
        <Flex direction="column" gap={8}>
          <HeaderSection
            activeDateDisplay={activeDateDisplay}
            activeDateLabel={activeDateLabel}
            boardState={boardState}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            totalStars={totalStars}
          />

          <MomentumCardGrid
            categories={boardState.categories}
            selectedDateCounts={selectedDateCounts}
            updateStarCount={updateStarCount}
          />

          <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
            <CategoryManager
              categories={boardState.categories}
              categoryError={categoryError}
              handleAddCategory={handleAddCategory}
              handleRemoveCategory={handleRemoveCategory}
              newCategoryColor={newCategoryColor}
              newCategoryName={newCategoryName}
              onColorChange={setNewCategoryColor}
              onNameChange={name => {
                setNewCategoryName(name);
                if (categoryError) {
                  setCategoryError(null);
                }
              }}
            />

            <StoragePreview
              selectedDate={selectedDate}
              selectedDateCounts={selectedDateCounts}
            />
          </SimpleGrid>
        </Flex>
      </Container>
    </Box>
  );
};

export default Home;
