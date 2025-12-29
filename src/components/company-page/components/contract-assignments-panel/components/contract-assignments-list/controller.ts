import { BaseController, Hotkey } from '@shared/index';
import { IContractAssignment } from '@state/automation-state';

export class ContractAssignmentsListController extends BaseController {
  checkCanStartAll(): boolean {
    return this.automationState.contracts
      .listContractAssignments()
      .some(
        (contractAssignment) =>
          contractAssignment.enabled &&
          this.automationState.contracts.starter.checkContractAssignment(contractAssignment),
      );
  }

  getStartHotkey(): string | undefined {
    return this.settingsState.hotkeys.getKeyByHotkey(Hotkey.addContractAssignments);
  }

  startAllContractAssignments(): boolean {
    return this.automationState.contracts.starter.startAllAssignments();
  }

  listContractAssignments(): IContractAssignment[] {
    return this.automationState.contracts.listContractAssignments();
  }

  removeAllContractAssignments(): void {
    this.automationState.contracts.removeAllContractAssignments();
  }

  moveContractAssignment(id: string, position: number) {
    this.automationState.contracts.moveContractAssignment(id, position);
    this.host.requestUpdate();
  }

  toggleAllContractAssignments(enabled: boolean) {
    this.automationState.contracts.toggleAllContractAssignments(enabled);
  }
}
