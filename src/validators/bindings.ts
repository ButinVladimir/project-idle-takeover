import { ValidatorFacade } from './validator-facade';
import {
  ProgramValidator,
  NameValidator,
  ThemeValidator,
  CloneTemplateValidator,
  SidejobValidator,
  DistrictTypeValidator,
} from './implementations';
import {
  ProgramValidatorFacade,
  NameValidatorFacade,
  ThemeValidatorFacade,
  CloneTemplateValidatorFacade,
  SidejobValidatorFacade,
  DistrictTypeValidatorFacade,
} from './facades';
import {
  INameValidator,
  IProgramValidator,
  IValidatorFacade,
  IThemeValidator,
  ICloneTemplateValidator,
  ISidejobValidator,
  IDistrictTypeValidator,
} from './interfaces';
import { validatorContainer } from './container';
import { VALIDATOR_TYPES } from './types';

validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.ValidatorFacade)
  .to(ValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.ProgramValidatorFacade)
  .to(ProgramValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IProgramValidator>(VALIDATOR_TYPES.ProgramValidator)
  .to(ProgramValidator)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.NameValidatorFacade)
  .to(NameValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<INameValidator>(VALIDATOR_TYPES.NameValidator)
  .to(NameValidator)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.ThemeValidatorFacade)
  .to(ThemeValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IThemeValidator>(VALIDATOR_TYPES.ThemeValidator)
  .to(ThemeValidator)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.CloneTemplateValidatorFacade)
  .to(CloneTemplateValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<ICloneTemplateValidator>(VALIDATOR_TYPES.CloneTemplateValidator)
  .to(CloneTemplateValidator)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.SidejobValidatorFacade)
  .to(SidejobValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<ISidejobValidator>(VALIDATOR_TYPES.SidejobValidator)
  .to(SidejobValidator)
  .inSingletonScope()
  .whenTargetIsDefault();

  validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.DistrictTypeValidatorFacade)
  .to(DistrictTypeValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IDistrictTypeValidator>(VALIDATOR_TYPES.DistrictTypeValidator)
  .to(DistrictTypeValidator)
  .inSingletonScope()
  .whenTargetIsDefault();
