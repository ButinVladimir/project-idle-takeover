import { html } from 'lit';
import { msg, str } from '@lit/localize';
import {
  MultiplierProgramName,
  AutobuyerProgramName,
  OtherProgramName,
  ProgramName,
} from '@state/mainframe-state/states/progam-factory/types';

export const PROGRAM_TEXTS: Record<ProgramName, { title: () => string; overview: () => string }> = {
  [OtherProgramName.shareServer]: {
    title: () => msg('Mainframe share server'),
    overview: () =>
      msg(`Program to share your mainframe capabilities with city network.
Passively generates money and development points.`),
  },
  [MultiplierProgramName.codeGenerator]: {
    title: () => msg('Code generator'),
    overview: () =>
      msg(`Program to develop other programs.
Generates code base points and improves mainframe programs cost divisor.`),
  },
  [MultiplierProgramName.circuitDesigner]: {
    title: () => msg('Circuit designer'),
    overview: () =>
      msg(`Program to develop circuit designs.
Generates computational base points and improves mainframe hardware cost divisor.`),
  },
  [MultiplierProgramName.dealMaker]: {
    title: () => msg('Deal maker'),
    overview: () =>
      msg(`Program to assist with making deals.
Generates rewards points and improves all rewards.`),
  },
  [MultiplierProgramName.informationCollector]: {
    title: () => msg('Information collector'),
    overview: () =>
      msg(`Program to collect all sorts of information.
Generates connectivity points, unlocks sidejobs and improves chances to receive new contracts.`),
  },
  [AutobuyerProgramName.mainframeHardwareAutobuyer]: {
    title: () => msg('Mainframe hardware autobuyer'),
    overview: () => msg('Program to automatically buy mainframe hardware upgrades.'),
  },
  [AutobuyerProgramName.mainframeProgramsAutobuyer]: {
    title: () => msg('Mainframe programs autobuyer'),
    overview: () => msg('Program to automatically buy mainframe programs.'),
  },
  [AutobuyerProgramName.cloneLevelAutoupgrader]: {
    title: () => msg('Clone level autoupgrader'),
    overview: () => msg('Program to automatically upgrade levels of clones.'),
  },
  [OtherProgramName.predictiveComputator]: {
    title: () => msg('Predictive computator'),
    overview: () => msg('Program to speed up completion of currently running processes.'),
  },
  [OtherProgramName.peerReviewer]: {
    title: () => msg('Peer reviewer'),
    overview: () => msg('Program to review clone experience before sharing it. Increases shared experience.'),
  },
};

export const PROGRAM_DESCRIPTION_TEXTS = {
  effects: () => msg('Effects'),
  requirementsProcess: (threads: string) => msg(str`Requirements for ${threads} threads`),
  requirementsDiff: (threads: string, threadsDiffEl: any) =>
    msg(html`Requirements for ${threads} (${threadsDiffEl}) threads`),
  requirementsAutoscalable: () => msg('Requirements for autoscalable program'),
  requirementsSingle: () => msg('Requirements for single thread'),
  ram: () => msg('RAM'),
  cores: () => msg('Cores'),
  upToValue: (value: any) => msg(html`Up to ${value}`),
  upToDiff: (value: any, diff: any) => msg(html`Up to ${value} (${diff})`),
  allAvailable: (value: any) => msg(str`${value} + All available`),
  completionTime: () => msg('Completion time'),
  instant: () => msg('Instant'),
  never: () => msg('Never'),
  minMaxInterval: (minValue: string, maxValue: string) => msg(str`${minValue} \u2014 ${maxValue}`),
  minMaxIntervalDiff: (minValue: string, maxValue: string, minValueDiff: any, maxValueDiff: any) =>
    msg(html`${minValue} — ${maxValue} (${minValueDiff} — ${maxValueDiff})`),
  parameterCompletionValues: (value: any, minAvgValue: any, maxAvgValue: any) =>
    msg(html`${value} per completion (${minAvgValue} — ${maxAvgValue} per second)`),
  parameterCompletionDiffs: (
    value: any,
    diff: any,
    minAvgValue: any,
    minAvgDiff: any,
    maxAvgValue: any,
    maxAvgDiff: any,
  ) =>
    msg(
      html`${value} (${diff}) per completion (${minAvgValue} — ${maxAvgValue} per second) (${minAvgDiff} —
      ${maxAvgDiff})`,
    ),
  actionCompletionDiffs: (value: any, minAvgValue: any, minAvgDiff: any, maxAvgValue: any, maxAvgDiff: any) =>
    msg(html`${value} per completion (${minAvgValue} — ${maxAvgValue} per second) (${minAvgDiff} — ${maxAvgDiff})`),
  processCompletionValues: (value: any, avgValue: any) => msg(html`${value} per completion (${avgValue} per second)`),
};
