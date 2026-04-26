import type { MomentumColor } from './storage';

export const COLOR_LABELS: Record<MomentumColor, string> = {
  blue: 'Blue',
  plum: 'Plum',
  gold: 'Gold',
  coral: 'Coral',
  mint: 'Mint',
  slate: 'Slate',
};

export const COLOR_STYLES: Record<MomentumColor, {
  surface: string;
  border: string;
  accent: string;
  text: string;
}> = {
  blue: {
    surface: 'linear-gradient(180deg, rgba(231, 241, 255, 0.96), rgba(248, 251, 255, 0.98))',
    border: 'rgba(88, 130, 206, 0.28)',
    accent: '#5e86cf',
    text: '#24446e',
  },
  plum: {
    surface: 'linear-gradient(180deg, rgba(247, 235, 255, 0.96), rgba(253, 249, 255, 0.98))',
    border: 'rgba(155, 110, 201, 0.26)',
    accent: '#9462ba',
    text: '#593975',
  },
  gold: {
    surface: 'linear-gradient(180deg, rgba(255, 247, 218, 0.97), rgba(255, 252, 240, 0.99))',
    border: 'rgba(195, 157, 73, 0.28)',
    accent: '#c18c24',
    text: '#77561e',
  },
  coral: {
    surface: 'linear-gradient(180deg, rgba(255, 237, 232, 0.97), rgba(255, 249, 247, 0.99))',
    border: 'rgba(212, 122, 104, 0.28)',
    accent: '#c56c58',
    text: '#7e3c2e',
  },
  mint: {
    surface: 'linear-gradient(180deg, rgba(231, 250, 241, 0.97), rgba(248, 255, 251, 0.99))',
    border: 'rgba(76, 154, 119, 0.26)',
    accent: '#4d9e7d',
    text: '#245844',
  },
  slate: {
    surface: 'linear-gradient(180deg, rgba(237, 242, 248, 0.97), rgba(251, 253, 255, 0.99))',
    border: 'rgba(103, 124, 151, 0.24)',
    accent: '#5f738f',
    text: '#324459',
  },
};

export const panelStyles = {
  bg: 'var(--board-paper)',
  border: '1px solid rgba(123, 110, 88, 0.18)',
  borderRadius: '20px',
  boxShadow: '0 14px 32px var(--board-shadow)',
} as const;
