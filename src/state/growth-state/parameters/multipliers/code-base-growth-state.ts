import { injectable } from 'inversify';
import { MultiplierProgramName, ProgramName, CodeGeneratorProgram, IProcess } from '@state/mainframe-state';
import { IPrimaryActivity, ISidejobActivity } from '@state/activity-state';
import { DistrictTypeRewardParameter } from '@shared/index';
import { BaseMultiplierGrowthState } from './base-multiplier-growth-state';

@injectable()
export class CodeBaseGrowthState extends BaseMultiplierGrowthState {
  getProgramName(): ProgramName {
    return MultiplierProgramName.codeGenerator;
  }

  getGrowthByProgram(process: IProcess): number {
    const program = process.program as CodeGeneratorProgram;

    return program.calculateDelta(process.threads) / process.calculateCompletionTime();
  }

  getGrowthBySidejobActivity(sidejobActivity: ISidejobActivity): number {
    return sidejobActivity.getParameterGrowth(DistrictTypeRewardParameter.codeBase);
  }

  getGrowthByPrimaryActivity(primaryActivity: IPrimaryActivity): number {
    return primaryActivity.getParameterGrowth(DistrictTypeRewardParameter.codeBase);
  }
}
