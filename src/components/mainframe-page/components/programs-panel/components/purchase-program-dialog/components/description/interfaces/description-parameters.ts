import { IProgram } from '@state/mainframe-state';
import { IFormatter } from '@shared/index';

export interface IDescriptionParameters {
  formatter: IFormatter;
  cores: number;
  ram: number;
  program: IProgram;
  ownedProgram?: IProgram;
}
