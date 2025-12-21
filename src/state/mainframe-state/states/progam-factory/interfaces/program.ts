import { ProgramName } from '../types';
import { IMakeProgramParameters } from './make-program-parameters';

export interface IProgram {
  name: ProgramName;
  level: number;
  tier: number;
  completionPoints: number;
  isAutoscalable: boolean;
  ram: number;
  cores: number;
  autoUpgradeEnabled: boolean;
  upgrade(tier: number, level: number): void;
  removeAllEventListeners(): void;
  perform(threads: number, usedRam: number): void;
  calculateCompletionDelta(threads: number, usedCores: number, passedTime: number): number;
  calculateCompletionTime(threads: number, usedCores: number): number;
  calculateCompletionMinTime(threads: number): number;
  calculateCompletionMaxTime(threads: number): number;
  serialize(): IMakeProgramParameters;
}
