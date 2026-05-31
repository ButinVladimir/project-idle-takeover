import { IPrimaryActivityFilterState } from '../../../interfaces';

export class PrimaryActivityFilterStateChangedEvent extends Event {
  static readonly type = 'primary-activity-filter-state-changed';

  public state: IPrimaryActivityFilterState;

  constructor(state: IPrimaryActivityFilterState) {
    super(PrimaryActivityFilterStateChangedEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.state = state;
  }
}
