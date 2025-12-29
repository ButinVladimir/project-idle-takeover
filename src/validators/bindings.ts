import { MainValidatorFacade } from './main-validator-facade';
import {
  ProgramValidator,
  NameValidator,
  ThemeValidator,
  CloneTemplateValidator,
  SidejobValidator,
  DistrictTypeValidator,
  StoryEventsValidator,
  ScenariosValidator,
  FactionValidator,
  ConstantsValidator,
  ContractValidator,
} from './implementations';
import {
  CloneTemplateValidatorFacade,
  SidejobValidatorFacade,
  DistrictTypeValidatorFacade,
  FactionValidatorFacade,
  ConstantsValidatorFacade,
  ProgramValidatorFacade,
  NameValidatorFacade,
  ThemeValidatorFacade,
  StoryEventsValidatorFacade,
  ScenariosValidatorFacade,
  ContractValidatorFacade,
} from './facades';
import {
  IValidatorFacade,
  IMainValidatorFacade,
  ICloneTemplateValidator,
  ISidejobValidator,
  IDistrictTypeValidator,
  IFactionValidator,
  IConstantsValidator,
  IProgramValidator,
  INameValidator,
  IThemeValidator,
  IStoryEventsValidator,
  IScenariosValidator,
  IContractValidator,
} from './interfaces';
import { validatorContainer } from './container';
import { VALIDATOR_TYPES } from './types';

validatorContainer
  .bind<IMainValidatorFacade>(VALIDATOR_TYPES.MainValidatorFacade)
  .to(MainValidatorFacade)
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
  .bind<IValidatorFacade>(VALIDATOR_TYPES.ContractValidatorFacade)
  .to(ContractValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IContractValidator>(VALIDATOR_TYPES.ContractValidator)
  .to(ContractValidator)
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

validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.FactionValidatorFacade)
  .to(FactionValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IFactionValidator>(VALIDATOR_TYPES.FactionValidator)
  .to(FactionValidator)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.ConstantsValidatorFacade)
  .to(ConstantsValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IConstantsValidator>(VALIDATOR_TYPES.ConstantsValidator)
  .to(ConstantsValidator)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.StoryEventsValidatorFacade)
  .to(StoryEventsValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IStoryEventsValidator>(VALIDATOR_TYPES.StoryEventsValidator)
  .to(StoryEventsValidator)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IValidatorFacade>(VALIDATOR_TYPES.ScenariosValidatorFacade)
  .to(ScenariosValidatorFacade)
  .inSingletonScope()
  .whenTargetIsDefault();

validatorContainer
  .bind<IScenariosValidator>(VALIDATOR_TYPES.ScenariosValidator)
  .to(ScenariosValidator)
  .inSingletonScope()
  .whenTargetIsDefault();
