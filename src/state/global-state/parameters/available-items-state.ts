import { injectable, inject } from 'inversify';
import { TYPES } from '@state/types';
import { ProgramName } from '@state/mainframe-state/states/progam-factory/types';
import { CloneTemplateName } from '@state/company-state/states/clone-factory/types';
import { IAvailableItemsSerializedState } from '../interfaces/serialized-states/available-items-serialized-state';
import { IAvailableItemsState } from '../interfaces/parameters/available-items-state';
import type { IAvailableCategoryItemsState } from '../interfaces/parameters/available-category-items-state';

@injectable()
export class AvailableItemsState implements IAvailableItemsState {
  @inject(TYPES.AvailableProgramsState)
  private _availableProgramsState!: IAvailableCategoryItemsState<ProgramName>;

  @inject(TYPES.AvailableCloneTemplatesState)
  private _availableCloneTemplatesState!: IAvailableCategoryItemsState<CloneTemplateName>;

  private _recalculationRequested: boolean;

  constructor() {
    this._recalculationRequested = true;
  }

  get programs(): IAvailableCategoryItemsState<ProgramName> {
    return this._availableProgramsState;
  }

  get cloneTemplates(): IAvailableCategoryItemsState<CloneTemplateName> {
    return this._availableCloneTemplatesState;
  }

  requestRecalculation() {
    this._recalculationRequested = true;
  }

  recalculate() {
    if (!this._recalculationRequested) {
      return;
    }

    this._recalculationRequested = false;

    this._availableProgramsState.recalculate();
    this._availableCloneTemplatesState.recalculate();
  }

  async startNewState(): Promise<void> {
    await this._availableProgramsState.startNewState();
    await this._availableCloneTemplatesState.startNewState();
    this.requestRecalculation();
  }

  async deserialize(serializedState: IAvailableItemsSerializedState): Promise<void> {
    await this._availableProgramsState.deserialize(serializedState.programs);
    await this._availableCloneTemplatesState.deserialize(serializedState.cloneTemplates);
    this.requestRecalculation();
  }

  serialize(): IAvailableItemsSerializedState {
    return {
      programs: this._availableProgramsState.serialize(),
      cloneTemplates: this._availableCloneTemplatesState.serialize(),
    };
  }
}
