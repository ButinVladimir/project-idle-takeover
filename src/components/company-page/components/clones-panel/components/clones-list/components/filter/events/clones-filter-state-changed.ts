import { IClonesFilterState } from '../../../interfaces';

export class ClonesFilterStateChangedEvent extends Event {
  static readonly type = 'clones-filter-state-changed';

  public state: IClonesFilterState;

  constructor(state: IClonesFilterState) {
    super(ClonesFilterStateChangedEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.state = state;
  }
}
