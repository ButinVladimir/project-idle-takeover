export class ToggleContractsFilterEvent extends Event {
  static readonly type = 'toggle-contracts-filter';

  public filterEnabled: boolean;

  constructor(filterEnabled: boolean) {
    super(ToggleContractsFilterEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.filterEnabled = filterEnabled;
  }
}
