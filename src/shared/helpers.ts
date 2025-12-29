import clamp from 'lodash/clamp';
import { IExponent, ILinear, ITierExponent, ITierLinear } from './interfaces/formulas';
import { SCHEMA_PROPERTY } from './constants';

export const calculatePower = (exponent: number, params: IExponent): number => {
  return params.multiplier * Math.pow(params.base, exponent);
};

export const calculateTierPower = (exponent: number, tier: number, params: ITierExponent): number => {
  return calculatePower(exponent, params) * calculateTierMultiplier(tier, params.baseTier);
};

export const reverseTierPower = (points: number, tier: number, params: ITierExponent): number => {
  return Math.floor(
    Math.log(points / calculateTierMultiplier(tier, params.baseTier) / params.multiplier) / Math.log(params.base),
  );
};

export const calculateLinear = (level: number, params: ILinear): number => {
  return params.base + level * params.multiplier;
};

export const calculateTierLinear = (level: number, tier: number, params: ITierLinear): number => {
  return calculateLinear(level, params) * calculateTierMultiplier(tier, params.baseTier);
};

export const calculateTierMultiplier = (tier: number, base: number): number => {
  return Math.pow(base, tier);
};

export const binarySearchDecimal = (
  minValue: number,
  maxValue: number,
  checkFn: (value: number) => boolean,
): number => {
  let value = minValue;
  let step = maxValue - minValue;
  let nextValue;

  while (step > 0) {
    nextValue = value + step;

    if (nextValue <= maxValue && checkFn(nextValue)) {
      value = nextValue;
    } else {
      step = Math.floor(step / 2);
    }
  }

  return value;
};

export const normalizePercentage = (value: number): number => {
  return clamp(Math.floor(value), 0, 100);
};

export const checkPercentage = (value: number): boolean => {
  return value >= 0 && value <= 100;
};

export function moveElementInArray<T>(array: T[], fromIndex: number, toIndex: number): void {
  let fixedToIndex = toIndex;

  if (fixedToIndex < 0) {
    fixedToIndex = 0;
  }

  if (fixedToIndex >= array.length) {
    fixedToIndex = array.length - 1;
  }

  const movedElement = array[fromIndex];

  if (fromIndex < fixedToIndex) {
    for (let i = fromIndex; i < fixedToIndex; i++) {
      array[i] = array[i + 1];
    }
  } else {
    for (let i = fromIndex; i > fixedToIndex; i--) {
      array[i] = array[i - 1];
    }
  }

  array[fixedToIndex] = movedElement;
}

export const calculateGeometricProgressionSum = (level: number, multiplier: number, base: number): number =>
  (multiplier * (Math.pow(base, level + 1) - 1)) / (base - 1);

export const reverseGeometricProgressionSum = (points: number, multiplier: number, base: number): number =>
  Math.floor(Math.log(1 + (points * (base - 1)) / multiplier) / Math.log(base));

export function removeElementsFromArray<T>(array: T[], fromIndex: number, count: number): void {
  if (fromIndex + count >= array.length) {
    array.length = fromIndex;
    return;
  }

  let index = fromIndex;

  while (index + count < array.length) {
    array[index] = array[index + count];
    index++;
  }

  array.length -= count;
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function calculateLevelProgressPercentage(
  basePoints: number,
  currentPoints: number,
  nextLevelPoints: number,
): number {
  const currentDistance = currentPoints - basePoints;
  const nextLevelDistance = nextLevelPoints - basePoints;

  return clamp((currentDistance / nextLevelDistance) * 100, 0, 100);
}

export function typeConfigEntries<T>(data: Record<string, any>): Record<string, T> {
  return Object.fromEntries(Object.entries(data).filter(([key]) => key !== SCHEMA_PROPERTY));
}
