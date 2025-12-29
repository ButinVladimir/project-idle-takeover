import { Theme } from '@shared/types';
import { DistrictUnlockState } from '@state/city-state/types';
import { MapStyles } from './interfaces';

export const CELL_SIZE = 10;

export const MAP_STYLES: Record<Theme, MapStyles> = {
  [Theme.light]: {
    [DistrictUnlockState.locked]: {
      notSelectedStyles: {
        borderColor: '#e4e4e7',
        color: '#7f1d1d',
      },
      selectedStyles: {
        borderColor: '#dc2626',
        color: '#ef4444',
      },
    },
    [DistrictUnlockState.contested]: {
      notSelectedStyles: {
        borderColor: '#e4e4e7',
        color: '#78350f',
      },
      selectedStyles: {
        borderColor: '#d97706',
        color: '#f59e0b',
      },
    },
    [DistrictUnlockState.captured]: {
      notSelectedStyles: {
        borderColor: '#e4e4e7',
        color: '#0c4a6e',
      },
      selectedStyles: {
        borderColor: '#0284c7',
        color: '#0ea5e9',
      },
    },
  },
  [Theme.dark]: {
    [DistrictUnlockState.locked]: {
      notSelectedStyles: {
        borderColor: '#36363b',
        color: '#7f1d1d',
      },
      selectedStyles: {
        borderColor: '#ef4444',
        color: '#dc2626',
      },
    },
    [DistrictUnlockState.contested]: {
      notSelectedStyles: {
        borderColor: '#36363b',
        color: '#78350f',
      },
      selectedStyles: {
        borderColor: '#f59e0b',
        color: '#d97706',
      },
    },
    [DistrictUnlockState.captured]: {
      notSelectedStyles: {
        borderColor: '#36363b',
        color: '#0c4a6e',
      },
      selectedStyles: {
        borderColor: '#0ea5e9',
        color: '#0284c7',
      },
    },
  },
};
