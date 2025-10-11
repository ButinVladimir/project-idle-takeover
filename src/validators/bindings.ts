import { ValidatorFacade } from './validator-facade';
import { ProgramValidator, NameValidator, ThemeValidator } from './implementations';
import { ProgramValidatorFacade, NameValidatorFacade, ThemeValidatorFacade } from './facades';
import { INameValidator, IProgramValidator, IValidatorFacade, IThemeValidator } from './interfaces';
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
