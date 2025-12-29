export class AssignClonesEvent extends Event {
  static readonly type = 'assign-clones';

  constructor() {
    super(AssignClonesEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}
