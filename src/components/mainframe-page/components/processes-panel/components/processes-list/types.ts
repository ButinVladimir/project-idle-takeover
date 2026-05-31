import { IProcess } from '@state/mainframe-state';

export type ProcessesList = IProcess[];

export enum CoreFilterValue {
  fullyAssigned = 'fullyAssigned',
  partiallyAssigned = 'partiallyAssigned',
  notAssigned = 'notAssigned',
}
