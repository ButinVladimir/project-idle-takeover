export class RestoreValuesEvent extends Event {
  static readonly type = 'restore-values';

  constructor() {
    super(RestoreValuesEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}
