export enum ProcessValidationResult {
  programNotOwned = 'programNotOwned',
  threadsInvalid = 'threadsInvalid',
  valid = 'valid',
}

export enum ProcessesBatchValidationResult {
  programsNotOwned = 'programsNotOwned',
  threadsInvalid = 'threadsInvalid',
  multipleScalableProcesses = 'multipleScalableProcesses',
  notEnoughRam = 'notEnoughRam',
  valid = 'valid',
}
