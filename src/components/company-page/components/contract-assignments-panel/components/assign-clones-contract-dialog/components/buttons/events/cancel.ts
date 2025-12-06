export class CancelEvent extends Event {
  static readonly type = 'cancel';

  constructor() {
    super(CancelEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}
