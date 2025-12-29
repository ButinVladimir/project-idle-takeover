import { IClone } from '@state/clones-state';
import { CloneListItemDialog } from '../type';

export class OpenCloneListItemDialogEvent extends Event {
  static readonly type = 'open-clone-list-item-dialog';

  public readonly dialog: CloneListItemDialog;
  public readonly clone: IClone;

  constructor(dialog: CloneListItemDialog, clone: IClone) {
    super(OpenCloneListItemDialogEvent.type, {
      bubbles: true,
      composed: true,
    });

    this.dialog = dialog;
    this.clone = clone;
  }
}
