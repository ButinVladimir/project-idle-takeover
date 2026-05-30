import { CURRENT_VERSION } from '@shared/constants';
import { GameVersion } from '@shared/types';
import { IMigration, IMigrator, ISerializedState } from './interfaces';
import { ResetStateMigration, BumpVersionMigration } from './migrations';

export class Migrator implements IMigrator {
  private _hasMigrated = false;

  get hasMigrated() {
    return this._hasMigrated;
  }

  migrate(parsedSaveData: any): ISerializedState | undefined {
    let migratedSaveData: any = parsedSaveData;

    while (migratedSaveData && migratedSaveData.gameVersion !== CURRENT_VERSION) {
      this._hasMigrated = true;

      const migration = this.getMigration(migratedSaveData.gameVersion);

      migratedSaveData = migration.migrate(migratedSaveData);
    }

    return migratedSaveData as ISerializedState | undefined;
  }

  private getMigration(version: GameVersion): IMigration {
    switch (version) {
      case GameVersion['0.3.0']:
        return new BumpVersionMigration(GameVersion['0.3.1']);
      case GameVersion['0.2.0']:
        return new BumpVersionMigration(GameVersion['0.2.1']);
      case GameVersion['0.1.2']:
        return new BumpVersionMigration(GameVersion['0.1.3']);
      default:
        return new ResetStateMigration();
    }
  }
}
