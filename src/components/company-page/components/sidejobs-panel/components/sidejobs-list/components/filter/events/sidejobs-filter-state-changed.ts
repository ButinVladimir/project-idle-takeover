import { ISidejobsFilterState } from '../../../interfaces';

export class SidejobsFilterStateChangedEvent extends Event {
  static readonly type = 'sidejobs-filter-state-changed';

  public state: ISidejobsFilterState;

  constructor(state: ISidejobsFilterState) {
    super(SidejobsFilterStateChangedEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.state = state;
  }
}
