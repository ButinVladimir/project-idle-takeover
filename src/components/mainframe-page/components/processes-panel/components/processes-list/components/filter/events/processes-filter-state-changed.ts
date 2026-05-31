import { IProcessesFilterState } from '../../../interfaces';

export class ProcessesFilterStateChangedEvent extends Event {
  static readonly type = 'processes-filter-state-changed';

  public state: IProcessesFilterState;

  constructor(state: IProcessesFilterState) {
    super(ProcessesFilterStateChangedEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.state = state;
  }
}
