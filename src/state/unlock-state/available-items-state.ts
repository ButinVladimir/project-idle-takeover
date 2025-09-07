import { injectable, inject } from 'inversify';
import { TYPES } from '@state/types';
import { ProgramName } from '@state/mainframe-state';
import { CloneTemplateName } from '@state/company-state';
import { IAvailableItemsSerializedState, IAvailableItemsState, type IAvailableCategoryItemsState } from './interfaces';

@injectable()
export class AvailableItemsState implements IAvailableItemsState {
  @inject(TYPES.AvailableProgramsState)
  private _availableProgramsState!: IAvailableCategoryItemsState<ProgramName>;

  @inject(TYPES.AvailableCloneTemplatesState)
  private _availableCloneTemplatesState!: IAvailableCategoryItemsState<CloneTemplateName>;

  get programs(): IAvailableCategoryItemsState<ProgramName> {
    return this._availableProgramsState;
  }

  get cloneTemplates(): IAvailableCategoryItemsState<CloneTemplateName> {
    return this._availableCloneTemplatesState;
  }

  recalculate() {
    this._availableProgramsState.recalculate();
    this._availableCloneTemplatesState.recalculate();
  }

  async startNewState(): Promise<void> {
    await this._availableProgramsState.startNewState();
    await this._availableCloneTemplatesState.startNewState();
  }

  async deserialize(serializedState: IAvailableItemsSerializedState): Promise<void> {
    await this._availableProgramsState.deserialize(serializedState.programs);
    await this._availableCloneTemplatesState.deserialize(serializedState.cloneTemplates);
  }

  serialize(): IAvailableItemsSerializedState {
    return {
      programs: this._availableProgramsState.serialize(),
      cloneTemplates: this._availableCloneTemplatesState.serialize(),
    };
  }
}
