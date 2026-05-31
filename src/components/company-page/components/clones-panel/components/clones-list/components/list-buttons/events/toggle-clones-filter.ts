export class ToggleClonesFilterEvent extends Event {
  static readonly type = 'toggle-clones-filter';

  public filterEnabled: boolean;

  constructor(filterEnabled: boolean) {
    super(ToggleClonesFilterEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.filterEnabled = filterEnabled;
  }
}
