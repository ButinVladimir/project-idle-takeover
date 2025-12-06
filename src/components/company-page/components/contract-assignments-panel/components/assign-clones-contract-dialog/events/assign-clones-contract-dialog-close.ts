export class AssignClonesContractDialogCloseEvent extends Event {
  static readonly type = 'assign-clones-contract-dialog-close';

  constructor() {
    super(AssignClonesContractDialogCloseEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}
