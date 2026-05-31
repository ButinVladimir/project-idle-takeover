import { BaseController, Hotkey } from '@shared/index';

export class CompanyContractsPanelController extends BaseController {
  getAddContractAssignmentsHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.addContractAssignments);
  }
}
