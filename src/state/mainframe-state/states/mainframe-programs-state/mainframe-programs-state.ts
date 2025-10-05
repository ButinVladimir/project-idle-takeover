import { inject, injectable } from 'inversify';
import { msg, str } from '@lit/localize';
import { decorators } from '@state/container';
import programs from '@configs/programs.json';
import { type IStateUIConnector } from '@state/state-ui-connector';
import { type IGlobalState } from '@state/global-state';
import { type IMessageLogState } from '@state/message-log-state';
import { type IMainframeState } from '@state/mainframe-state/interfaces/mainframe-state';
import { type IScenarioState } from '@state/scenario-state';
import { type IUnlockState } from '@state/unlock-state';
import { TYPES } from '@state/types';
import {
  type IFormatter,
  Feature,
  ProgramsEvent,
  PurchaseType,
  calculateTierPower,
  reverseTierPower,
  moveElementInArray,
} from '@shared/index';
import { PROGRAM_TEXTS } from '@texts/index';
import {
  IMainframeProgramsState,
  IMainframeProgramsSerializedState,
  type IMainframeProgramsUpgrader,
} from './interfaces';
import { ProgramName, IMakeProgramParameters, IProgram } from '../progam-factory';

const { lazyInject } = decorators;

@injectable()
export class MainframeProgramsState implements IMainframeProgramsState {
  @lazyInject(TYPES.MainframeState)
  private _mainframeState!: IMainframeState;

  @lazyInject(TYPES.StateUIConnector)
  private _stateUiConnector!: IStateUIConnector;

  @lazyInject(TYPES.GlobalState)
  private _globalState!: IGlobalState;

  @lazyInject(TYPES.ScenarioState)
  private _scenarioState!: IScenarioState;

  @lazyInject(TYPES.UnlockState)
  private _unlockState!: IUnlockState;

  @lazyInject(TYPES.MessageLogState)
  private _messageLogState!: IMessageLogState;

  @lazyInject(TYPES.Formatter)
  private _formatter!: IFormatter;

  @inject(TYPES.MainframeProgramsUpgrader)
  private _upgrader!: IMainframeProgramsUpgrader;

  private _programsList: IProgram[];
  private _ownedPrograms: Map<ProgramName, IProgram>;

  constructor() {
    this._programsList = [];
    this._ownedPrograms = new Map();

    this._stateUiConnector.registerEventEmitter(this, ['_programsList']);
  }

  get upgrader() {
    return this._upgrader;
  }

  calculateProgramCost(name: ProgramName, tier: number, level: number): number {
    const programData = programs[name];

    return calculateTierPower(level, tier, programData.cost) / this._globalState.multipliers.codeBase.totalMultiplier;
  }

  calculateLevelFromMoney(name: ProgramName, tier: number, money: number): number {
    const programData = programs[name];

    const availableMoney = money * this._globalState.multipliers.codeBase.totalMultiplier;

    return Math.min(reverseTierPower(availableMoney, tier, programData.cost), this._globalState.development.level);
  }

  purchaseProgram(name: ProgramName, tier: number, level: number): boolean {
    if (!this._unlockState.features.isFeatureUnlocked(Feature.mainframePrograms)) {
      return false;
    }

    if (!this._unlockState.items.programs.isItemAvailable(name, tier, level)) {
      return false;
    }

    const cost = this.calculateProgramCost(name, tier, level);

    const bought = this._globalState.money.purchase(
      cost,
      PurchaseType.mainframePrograms,
      this.handlePurchaseProgram(name, tier, level),
    );

    return bought;
  }

  listOwnedPrograms(): IProgram[] {
    return this._programsList;
  }

  getOwnedProgramByName(name: ProgramName): IProgram | undefined {
    return this._ownedPrograms.get(name);
  }

  toggleProgramsAutoUpgrade(active: boolean) {
    for (const program of this._ownedPrograms.values()) {
      program.autoUpgradeEnabled = active;
    }
  }

  moveProgram(programName: ProgramName, newPosition: number) {
    const oldPosition = this._programsList.findIndex((program) => program.name === programName);

    if (oldPosition === -1) {
      return;
    }

    moveElementInArray(this._programsList, oldPosition, newPosition);
  }

  async startNewState(): Promise<void> {
    this.clearState();

    for (const programName of this._scenarioState.currentValues.mainframeSoftware.startingPrograms) {
      this.addProgram(programName, 0, 0);
    }
  }

  async deserialize(serializedState: IMainframeProgramsSerializedState): Promise<void> {
    this.clearState();

    serializedState.ownedPrograms.forEach((programParameters) => {
      const program = this._mainframeState.programFactory.makeProgram(programParameters);
      this._ownedPrograms.set(programParameters.name, program);
      this._programsList.push(program);
    });
  }

  serialize(): IMainframeProgramsSerializedState {
    return {
      ownedPrograms: this._programsList.map(this.serializeProgram),
    };
  }

  private serializeProgram = (program: IProgram): IMakeProgramParameters => {
    return program.serialize();
  };

  private addProgram(name: ProgramName, tier: number, level: number): void {
    const existingProgram = this._ownedPrograms.get(name);

    if (existingProgram) {
      existingProgram.upgrade(tier, level);
    } else {
      const newProgram = this._mainframeState.programFactory.makeProgram({
        name,
        tier: tier,
        level,
        autoUpgradeEnabled: true,
      });

      this._ownedPrograms.set(newProgram.name, newProgram);
      this._programsList.push(newProgram);

      for (const feature of newProgram.unlockFeatures) {
        this._unlockState.features.unlockFeature(feature);
      }
    }
  }

  private handlePurchaseProgram = (name: ProgramName, tier: number, level: number) => () => {
    this.addProgram(name, tier, level);

    const programTitle = PROGRAM_TEXTS[name].title();
    const formattedLevel = this._formatter.formatLevel(level);
    const formattedTier = this._formatter.formatTier(tier);
    this._messageLogState.postMessage(
      ProgramsEvent.programPurchased,
      msg(str`Program "${programTitle}" with tier ${formattedTier} and level ${formattedLevel} has been purchased`),
    );
  };

  private clearState() {
    for (const ownedProgram of this._programsList) {
      ownedProgram.removeAllEventListeners();
    }

    this._ownedPrograms.clear();
    this._programsList.length = 0;
  }
}
