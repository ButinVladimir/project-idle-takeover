import { msg } from '@lit/localize';
import {
  GameStateAlert,
  ProgramAlert,
  CloneAlert,
  SidejobAlert,
  GameAlertGroup,
  GameAlert,
  ContractAlert,
  PrimaryActivityAlert,
} from '@shared/index';

export const GAME_ALERT_GROUP_NAMES: Record<GameAlertGroup, () => string> = {
  [GameAlertGroup.gameState]: () => msg('Game state alerts'),
  [GameAlertGroup.programs]: () => msg('Programs alerts'),
  [GameAlertGroup.clones]: () => msg('Clones alerts'),
  [GameAlertGroup.sidejobs]: () => msg('Sidejobs alerts'),
  [GameAlertGroup.contracts]: () => msg('Contracts alerts'),
  [GameAlertGroup.primaryActivity]: () => msg('Primary activities alerts'),
};

export const GAME_ALERT_NAMES: Record<GameAlert, () => string> = {
  [GameStateAlert.saveImport]: () => msg('Import savefile'),
  [GameStateAlert.saveDelete]: () => msg('Delete save data'),
  [GameStateAlert.clearMessages]: () => msg('Clear log messages'),
  [GameStateAlert.fastForward]: () => msg('Spend accumulated time'),
  [GameStateAlert.unassignHotkeys]: () => msg('Unassign hotkeys'),
  [GameStateAlert.restoreDefaultHotkeys]: () => msg('Restore default hotkeys'),
  [GameStateAlert.restoreDefaultSettings]: () => msg('Restore default settings'),
  [GameStateAlert.joinFaction]: () => msg('Join a faction'),
  [ProgramAlert.purchaseProgramOverwrite]: () => msg('Purchase an already owned program'),
  [ProgramAlert.processReplace]: () => msg('Replace a process'),
  [ProgramAlert.processDelete]: () => msg('Delete a process'),
  [ProgramAlert.deleteAllProcesses]: () => msg('Delete all process'),
  [CloneAlert.cloneDelete]: () => msg('Delete a clone'),
  [CloneAlert.deleteAllClones]: () => msg('Delete all clones'),
  [SidejobAlert.sidejobCancel]: () => msg('Cancel an assigned sidejob'),
  [SidejobAlert.cancelAllSidejobs]: () => msg('Cancel all sidejobs'),
  [SidejobAlert.replaceSidejob]: () => msg('Replace an assigned sidejob'),
  [ContractAlert.contractAssignmentRemove]: () => msg('Remove a contract assignments'),
  [ContractAlert.removeAllContractAssignments]: () => msg('Remove all contract assignments'),
  [ContractAlert.replaceContractAssignment]: () => msg('Replace a contract assignments'),
  [PrimaryActivityAlert.cancelPrimaryActivity]: () => msg('Cancel a primary activity'),
  [PrimaryActivityAlert.cancelAllPrimaryActivities]: () => msg('Cancel all primary activities'),
};
