import { injectable } from 'inversify';
import { MultiplierProgramName, ProgramName, CircuitDesignerProgram, IProcess } from '@state/mainframe-state';
import { ISidejob } from '@state/activity-state';
import { DistrictTypeRewardParameter } from '@shared/index';
import { BaseMultiplierGrowthState } from './base-multiplier-growth-state';

@injectable()
export class ComputationalBaseGrowthState extends BaseMultiplierGrowthState {
  getProgramName(): ProgramName {
    return MultiplierProgramName.circuitDesigner;
  }

  getGrowthByProgram(process: IProcess): number {
    const program = process.program as CircuitDesignerProgram;

    return program.calculateDelta(process.threads) / process.calculateCompletionTime();
  }

  getGrowthBySidejob(sidejob: ISidejob): number {
    return sidejob.calculateParameterDelta(DistrictTypeRewardParameter.computationalBase, 1);
  }
}
