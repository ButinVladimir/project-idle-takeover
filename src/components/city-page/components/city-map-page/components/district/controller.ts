import { BaseController } from '@shared/base-controller';

export class CityMapHighlightedDistrictController extends BaseController {
  get layout() {
    return this.cityState.getLayout();
  }

  get mapWidth() {
    return this.scenarioState.currentValues.map.width;
  }

  get mapHeight() {
    return this.scenarioState.currentValues.map.height;
  }

  get theme() {
    return this.settingsState.theme;
  }
}
