import { html, nothing } from 'lit';
import { localized } from '@lit/localize';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BaseComponent, MULTIPLE_SELECT_SEPARATOR } from '@shared/index';
import styles from './styles';

@localized()
@customElement('ca-assign-clones-contract-dialog-batch-description')
export class AssignClonesContractDialogBatchDescription extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'contract-names',
    type: String,
  })
  contractNames!: string;

  @property({
    attribute: 'district-indexes',
    type: String,
  })
  districtIndexes!: string;

  @property({
    attribute: 'clone-ids',
    type: String,
  })
  cloneIds!: string;

  protected renderDesktop() {
    if (!this.contractNames || !this.districtIndexes) {
      return nothing;
    }

    const contractNames = this.contractNames.split(MULTIPLE_SELECT_SEPARATOR);
    const districtIndexes = this.districtIndexes
      .split(MULTIPLE_SELECT_SEPARATOR)
      .map((districtIndex) => parseInt(districtIndex));

    const contractTuples: { contractName: string; districtIndex: number }[] = [];

    for (const contractName of contractNames) {
      for (const districtIndex of districtIndexes) {
        contractTuples.push({
          contractName,
          districtIndex,
        });
      }
    }

    return html`
      ${repeat(
        contractTuples,
        ({ contractName, districtIndex }) => `${contractName}-${districtIndex}`,
        ({ contractName, districtIndex }) =>
          html`<ca-assign-clones-contract-dialog-batch-item
            contract-name=${contractName}
            district-index=${districtIndex}
            clone-ids=${this.cloneIds}
          ></ca-assign-clones-contract-dialog-batch-item>`,
      )}
    `;
  }
}
