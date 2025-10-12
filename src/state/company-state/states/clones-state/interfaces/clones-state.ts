import { ISerializeable } from '@shared/interfaces';
import { ICompanyClonesSerializedState } from './clones-serialized-state';
import { IClone } from '../../clone-factory/interfaces/clone';
import { IPurchaseCloneArgs } from './purchase-clone-args';
import { ICompanyClonesLevelUpgrader } from './clones-level-upgrader';

export interface ICompanyClonesState extends ISerializeable<ICompanyClonesSerializedState> {
  levelUpgrader: ICompanyClonesLevelUpgrader;
  listClones(): IClone[];
  getCloneById(id: string): IClone | undefined;
  calculateCloneCost(template: string, tier: number, level: number): number;
  calculateCloneLevelFromMoney(template: string, tier: number, money: number): number;
  calculateCloneSynchronization(template: string, tier: number): number;
  purchaseClone(args: IPurchaseCloneArgs): boolean;
  toggleAllClonesAutoupgrade(active: boolean): void;
  deleteClone(id: string): void;
  deleteAllClones(): void;
  recalculateClones(): void;
  moveClone(id: string, newPosition: number): void;
  generateCloneName(): string;
}
