import { injectable } from 'inversify';
import { MultiplierProgramName, ProgramName, CodeGeneratorProgram, IProcess } from '@state/mainframe-state';
import { ISidejob } from '@state/activity-state';
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

  getGrowthBySidejob(sidejob: ISidejob): number {
    return sidejob.calculateParameterDelta(DistrictTypeRewardParameter.codeBase, 1);
  }
}
