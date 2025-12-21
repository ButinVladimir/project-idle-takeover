import { injectable } from 'inversify';
import { MultiplierProgramName, ProgramName, CircuitDesignerProgram, IProcess } from '@state/mainframe-state';
import { IPrimaryActivity, ISidejobActivity } from '@state/activity-state';
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

  getGrowthBySidejobActivity(sidejobActivity: ISidejobActivity): number {
    return sidejobActivity.getParameterGrowth(DistrictTypeRewardParameter.computationalBase);
  }

  getGrowthByPrimaryActivity(primaryActivity: IPrimaryActivity): number {
    return primaryActivity.getParameterGrowth(DistrictTypeRewardParameter.computationalBase);
  }
}
