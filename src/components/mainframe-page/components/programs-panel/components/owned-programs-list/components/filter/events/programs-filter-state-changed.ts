import { IProgramsFilterState } from '../../../interfaces';

export class ProgramsFilterStateChangedEvent extends Event {
  static readonly type = 'programs-filter-state-changed';

  public state: IProgramsFilterState;

  constructor(state: IProgramsFilterState) {
    super(ProgramsFilterStateChangedEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.state = state;
  }
}
