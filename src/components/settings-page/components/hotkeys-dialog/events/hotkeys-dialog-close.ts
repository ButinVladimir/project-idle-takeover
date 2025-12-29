export class HotkeysDialogCloseEvent extends Event {
  static readonly type = 'hotkeys-dialog-close';

  constructor() {
    super(HotkeysDialogCloseEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}
