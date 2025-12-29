import { injectable } from 'inversify';
import { IThreatSerializedState, IThreatState } from '../interfaces';

@injectable()
export class ThreatState implements IThreatState {
  private _notoriety: number;
  private _level: number;

  constructor() {
    this._notoriety = 0;
    this._level = 0;
  }

  get notoriety() {
    return this._notoriety;
  }

  get level() {
    return this._level;
  }

  async startNewState(): Promise<void> {
    this._level = 0;
    this._notoriety = 0;
  }

  async deserialize(serializedState: IThreatSerializedState): Promise<void> {
    this._notoriety = serializedState.notoriery;
    this._level = serializedState.level;
  }

  serialize(): IThreatSerializedState {
    return {
      notoriery: this._notoriety,
      level: this._level,
    };
  }
}
