export class TogglePrimaryActivityFilterEvent extends Event {
  static readonly type = 'toggle-primary-activity-filter';

  public filterEnabled: boolean;

  constructor(filterEnabled: boolean) {
    super(TogglePrimaryActivityFilterEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.filterEnabled = filterEnabled;
  }
}
