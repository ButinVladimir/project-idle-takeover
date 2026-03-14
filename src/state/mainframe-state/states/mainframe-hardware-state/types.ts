export type MainframeHardwareParameterType = 'performance' | 'cores' | 'ram';

export enum MainframeHardwareValidationResult {
  hardwareLocked = 'hardwareLocked',
  increaseInvalid = 'increaseInvalid',
  higherDevelopmentLevelRequired = 'higherDevelopmentLevelRequired',
  notEnoughMoney = 'notEnoughMoney',
  valid = 'valid',
}
