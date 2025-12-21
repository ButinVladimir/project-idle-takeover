export enum MultiplierProgramName {
  codeGenerator = 'codeGenerator',
  circuitDesigner = 'circuitDesigner',
  dealMaker = 'dealMaker',
  informationCollector = 'informationCollector',
}

export enum AutomationProgram {
  mainframeHardwareAutobuyer = 'mainframeHardwareAutobuyer',
  mainframeProgramsAutobuyer = 'mainframeProgramsAutobuyer',
  cloneLevelAutoupgrader = 'cloneLevelAutoupgrader',
  contractAutostarter = 'contractAutostarter',
}

export enum OtherProgramName {
  shareServer = 'shareServer',
  predictiveComputator = 'predictiveComputator',
  peerReviewer = 'peerReviewer',
}

export type ProgramName = MultiplierProgramName | AutomationProgram | OtherProgramName;
