import { msg } from '@lit/localize';
import { ItemTypeFilter } from './types';

export const ITEM_TYPE_FILTER_VALUES = Object.values(ItemTypeFilter);

export const ITEM_TYPE_FILTER_TITLES: Record<ItemTypeFilter, () => string> = {
  all: () => msg('All available items'),
  design: () => msg('Designs only'),
  loaned: () => msg('Loaned only'),
};
