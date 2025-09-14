import { DistrictUnlockState } from '@state/city-state/types';
import { Theme } from '@shared/types';

export interface IDistrictRendererArgs {
  canvas: OffscreenCanvas;
  mapWidth: number;
  mapHeight: number;
  layout: number[][];
  theme: Theme;
  districtNum: number;
  districtUnlockState: DistrictUnlockState;
  selected: boolean;
}
