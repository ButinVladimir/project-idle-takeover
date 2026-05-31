import { IContractsFilterState } from '../../../interfaces';

export class ContractsFilterStateChangedEvent extends Event {
  static readonly type = 'contracts-filter-state-changed';

  public state: IContractsFilterState;

  constructor(state: IContractsFilterState) {
    super(ContractsFilterStateChangedEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.state = state;
  }
}
