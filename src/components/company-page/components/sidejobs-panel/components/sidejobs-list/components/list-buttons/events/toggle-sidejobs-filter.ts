export class ToggleSidejobsFilterEvent extends Event {
  static readonly type = 'toggle-sidejobs-filter';

  public filterEnabled: boolean;

  constructor(filterEnabled: boolean) {
    super(ToggleSidejobsFilterEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.filterEnabled = filterEnabled;
  }
}
