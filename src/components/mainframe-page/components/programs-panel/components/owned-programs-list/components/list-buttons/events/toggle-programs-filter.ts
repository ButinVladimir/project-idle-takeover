export class ToggleProgramsFilterEvent extends Event {
  static readonly type = 'toggle-programs-filter';

  public filterEnabled: boolean;

  constructor(filterEnabled: boolean) {
    super(ToggleProgramsFilterEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.filterEnabled = filterEnabled;
  }
}
