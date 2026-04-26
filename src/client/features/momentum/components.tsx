import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Field } from '@chakra-ui/react';
import {
  LuArrowLeft,
  LuArrowRight,
  LuCalendarDays,
  LuPlus,
  LuSparkles,
  LuStar,
  LuTrash2,
  LuUndo2,
} from 'react-icons/lu';
import { COLOR_LABELS, COLOR_STYLES, panelStyles } from './palette';
import {
  getTodayDateKey,
  getVisibleStarText,
  shiftDateKey,
  type MomentumBoardState,
  type MomentumCategory,
  type MomentumColor,
} from './storage';

interface HeaderSectionProps {
  activeDateDisplay: string;
  activeDateLabel: string;
  boardState: MomentumBoardState;
  selectedDate: string;
  setSelectedDate: (dateKey: string) => void;
  totalStars: number;
}

interface CardGridProps {
  categories: MomentumCategory[];
  selectedDateCounts: Record<string, number>;
  updateStarCount: (categoryId: string, delta: number) => void;
}

interface CategoryManagerProps {
  categories: MomentumCategory[];
  categoryError: string | null;
  handleAddCategory: () => void;
  handleRemoveCategory: (category: MomentumCategory) => void;
  newCategoryColor: MomentumColor;
  newCategoryName: string;
  onColorChange: (color: MomentumColor) => void;
  onNameChange: (name: string) => void;
}

const countTrackedDays = (state: MomentumBoardState) => Object.keys(state.entries).length;

export const HeaderSection = ({
  activeDateDisplay,
  activeDateLabel,
  boardState,
  selectedDate,
  setSelectedDate,
  totalStars,
}: HeaderSectionProps) => (
  <>
    <Flex
      justify="space-between"
      align={{ base: 'flex-start', lg: 'flex-end' }}
      direction={{ base: 'column', lg: 'row' }}
      gap={5}
    >
      <Box maxW="720px">
        <Flex
          display="inline-flex"
          align="center"
          gap={2}
          px={4}
          py={2}
          borderRadius="999px"
          bg="rgba(255, 252, 244, 0.86)"
          border="1px dashed rgba(126, 113, 89, 0.42)"
          color="var(--board-soft)"
          boxShadow="0 6px 16px rgba(83, 62, 31, 0.08)"
          transform="rotate(-1.2deg)"
        >
          <LuSparkles />
          <Text fontSize="sm" letterSpacing="0.14em" textTransform="uppercase">
            Homework For Your Future Self
          </Text>
        </Flex>

        <Heading
          as="h1"
          mt={4}
          fontSize={{ base: '4xl', md: '6xl' }}
          lineHeight="0.96"
          letterSpacing="-0.03em"
          fontFamily="var(--font-sans)"
          transform="rotate(-1deg)"
        >
          Momentum Board
        </Heading>

        <Text
          mt={4}
          fontSize={{ base: 'md', md: 'lg' }}
          color="var(--board-soft)"
          maxW="62ch"
          fontFamily="var(--font-accent)"
        >
          A ruled-paper board for daily reps. Add stars like teacher marks on homework and let the
          date key decide when a fresh sheet starts.
        </Text>
      </Box>

      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={3}
        w={{ base: 'full', lg: '470px' }}
        align="stretch"
      >
        <Box {...panelStyles} p={4} flex="1">
          <Text color="var(--board-muted)" fontSize="xs" textTransform="uppercase" letterSpacing="0.18em">
            Active Day
          </Text>
          <Text mt={2} fontSize="2xl" fontWeight="700">
            {activeDateLabel}
          </Text>
          <Text color="var(--board-soft)">{activeDateDisplay}</Text>
        </Box>
        <Box {...panelStyles} p={4}>
          <Text color="var(--board-muted)" fontSize="xs" textTransform="uppercase" letterSpacing="0.18em">
            Total Stars
          </Text>
          <Flex mt={2} align="center" gap={2}>
            <LuStar color="var(--board-amber)" />
            <Text fontSize="2xl" fontWeight="700">{totalStars}</Text>
          </Flex>
          <Text color="var(--board-soft)">{getVisibleStarText(totalStars)}</Text>
        </Box>
        <Box {...panelStyles} p={4} flex="1">
          <Text color="var(--board-muted)" fontSize="xs" textTransform="uppercase" letterSpacing="0.18em">
            Tracked Days
          </Text>
          <Text mt={2} fontSize="2xl" fontWeight="700">
            {countTrackedDays(boardState)}
          </Text>
          <Text color="var(--board-soft)">Filed in localStorage</Text>
        </Box>
      </Flex>
    </Flex>

    <Box {...panelStyles} p={{ base: 4, md: 5 }}>
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <Box>
          <Flex align="center" gap={2} color="var(--board-muted)">
            <LuCalendarDays />
            <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.16em">
              Current Board
            </Text>
          </Flex>
          <Heading as="h2" size="lg" mt={2}>
            {activeDateLabel} - {activeDateDisplay}
          </Heading>
        </Box>

        <Flex wrap="wrap" gap={3}>
          <Button onClick={() => { setSelectedDate(shiftDateKey(selectedDate, -1)); }} variant="outline">
            <LuArrowLeft />
            Previous
          </Button>
          <Button onClick={() => { setSelectedDate(shiftDateKey(getTodayDateKey(), -1)); }} variant="outline">
            Yesterday
          </Button>
          <Button onClick={() => { setSelectedDate(getTodayDateKey()); }} bg="var(--board-amber)" color="#5d4211">
            Today
          </Button>
          <Button onClick={() => { setSelectedDate(shiftDateKey(selectedDate, 1)); }} variant="outline">
            Next
            <LuArrowRight />
          </Button>
          <Input
            type="date"
            maxW="176px"
            value={selectedDate}
            onChange={event => {
              if (event.target.value) {
                setSelectedDate(event.target.value);
              }
            }}
            bg="var(--board-paper-strong)"
            borderColor="rgba(123, 110, 88, 0.22)"
          />
        </Flex>
      </Flex>
    </Box>
  </>
);

export const MomentumCardGrid = ({
  categories,
  selectedDateCounts,
  updateStarCount,
}: CardGridProps) => {
  if (categories.length === 0) {
    return (
      <Box {...panelStyles} p={6}>
        <Heading as="h2" size="lg">No categories yet</Heading>
        <Text mt={2} color="var(--board-soft)">
          Add your first category below. The board stays stable even if you remove everything and rebuild later.
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={5}>
      {categories.map(category => {
        const palette = COLOR_STYLES[category.color];
        const count = selectedDateCounts[category.id] ?? 0;

        return (
          <Box
            key={category.id}
            p={5}
            borderRadius="18px"
            border="1px solid"
            borderColor={palette.border}
            bg={palette.surface}
            boxShadow="0 12px 24px rgba(83, 62, 31, 0.08)"
            position="relative"
            _before={{
              content: '""',
              position: 'absolute',
              top: '18px',
              bottom: '18px',
              left: '18px',
              width: '2px',
              bg: 'var(--board-margin)',
              opacity: 0.8,
            }}
          >
            <Flex justify="space-between" align="flex-start" gap={4} pl={5}>
              <Box>
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="0.18em"
                  color={palette.accent}
                >
                  {COLOR_LABELS[category.color]}
                </Text>
                <Heading as="h3" fontSize="2xl" mt={2} lineHeight="1.05">
                  {category.name}
                </Heading>
                <Text mt={5} color={palette.text} fontSize="lg">
                  {getVisibleStarText(count)}
                </Text>
              </Box>

              <Box textAlign="right">
                <Text
                  fontSize={{ base: '4xl', md: '5xl' }}
                  fontWeight="700"
                  lineHeight="0.92"
                  color={palette.text}
                >
                  {count}
                </Text>
                <Text mt={2} color="var(--board-muted)" fontSize="sm">
                  {count === 1 ? 'star today' : 'stars today'}
                </Text>
              </Box>
            </Flex>

            <Flex mt={6} gap={3} wrap="wrap">
              <Button
                onClick={() => { updateStarCount(category.id, 1); }}
                bg={palette.accent}
                color="white"
                fontWeight="700"
              >
                <LuPlus />
                Add Star
              </Button>
              <Button
                onClick={() => { updateStarCount(category.id, -1); }}
                variant="outline"
                disabled={count === 0}
              >
                <LuUndo2 />
                Undo
              </Button>
            </Flex>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};

export const CategoryManager = ({
  categories,
  categoryError,
  handleAddCategory,
  handleRemoveCategory,
  newCategoryColor,
  newCategoryName,
  onColorChange,
  onNameChange,
}: CategoryManagerProps) => (
  <Box {...panelStyles} p={{ base: 4, md: 5 }}>
    <Heading as="h2" size="lg">
      Category Control
    </Heading>
    <Text mt={2} color="var(--board-soft)">
      Add new categories any time. Removing a category also removes its stored star counts so the data model stays clean.
    </Text>

    <Flex mt={5} direction={{ base: 'column', md: 'row' }} gap={3} align="flex-end">
      <Field.Root flex="1">
        <Field.Label color="var(--board-muted)">Category name</Field.Label>
        <Input
          value={newCategoryName}
          onChange={event => { onNameChange(event.target.value); }}
          placeholder="Business Outreach"
          bg="var(--board-paper-strong)"
          borderColor="rgba(123, 110, 88, 0.22)"
        />
      </Field.Root>

      <Field.Root w={{ base: 'full', md: '180px' }}>
        <Field.Label color="var(--board-muted)">Color</Field.Label>
        <select
          value={newCategoryColor}
          onChange={event => { onColorChange(event.target.value as MomentumColor); }}
          style={{
            height: '40px',
            padding: '0 12px',
            borderRadius: '8px',
            background: 'var(--board-paper-strong)',
            border: '1px solid rgba(123, 110, 88, 0.22)',
            color: 'var(--board-ink)',
          }}
        >
          {Object.entries(COLOR_LABELS).map(([color, label]) => (
            <option key={color} value={color}>
              {label}
            </option>
          ))}
        </select>
      </Field.Root>

      <Button onClick={handleAddCategory} bg="var(--board-amber)" color="#5d4211" fontWeight="700">
        <LuPlus />
        Add
      </Button>
    </Flex>

    {categoryError && (
      <Text mt={3} color="#ffb8ab">
        {categoryError}
      </Text>
    )}

    <Flex mt={6} direction="column" gap={3}>
      {categories.map(category => {
        const palette = COLOR_STYLES[category.color];

        return (
          <Flex
            key={category.id}
            justify="space-between"
            align="center"
            gap={3}
            p={3}
            borderRadius="20px"
            bg="rgba(255, 253, 248, 0.82)"
            border="1px solid rgba(123, 110, 88, 0.14)"
          >
            <Flex align="center" gap={3}>
              <Box w="12px" h="12px" borderRadius="999px" bg={palette.accent} />
              <Box>
                <Text fontWeight="600">{category.name}</Text>
                <Text fontSize="sm" color="var(--board-muted)">
                  {category.id}
                </Text>
              </Box>
            </Flex>

            <Button
              variant="ghost"
              color="#a65f50"
              onClick={() => { handleRemoveCategory(category); }}
            >
              <LuTrash2 />
              Remove
            </Button>
          </Flex>
        );
      })}
    </Flex>
  </Box>
);
