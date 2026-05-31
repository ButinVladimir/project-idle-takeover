export class ToggleProcessesFilterEvent extends Event {
  static readonly type = 'toggle-processes-filter';

  public filterEnabled: boolean;

  constructor(filterEnabled: boolean) {
    super(ToggleProcessesFilterEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.filterEnabled = filterEnabled;
  }
}
