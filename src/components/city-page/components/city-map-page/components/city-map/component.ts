import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { localized } from '@lit/localize';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { BaseComponent } from '@shared/index';
import { DistrictUnlockState } from '@state/city-state';
import { CityMapController } from './controller';
import { BOTTOM_GAP, DESKTOP_MAP_WIDTH_RATIO } from './constants';
import { CityMapClickEvent } from './events';
import cityMapStyles from './styles';

@localized()
@customElement('ca-city-map')
export class CityMap extends BaseComponent {
  static styles = cityMapStyles;

  protected hasMobileRender = true;

  private _controller: CityMapController;

  @state()
  private _size = 0;

  @state()
  private _selectedDistrictIndex?: number;

  private _contentRef = createRef<HTMLDivElement>();

  constructor() {
    super();

    this._controller = new CityMapController(this);
  }

  protected renderMobile() {
    return html`
      <sl-resize-observer @sl-resize=${this.handleResize}>
        <div class="host-content mobile">${this.renderContent()}</div>
      </sl-resize-observer>
    `;
  }

  protected renderDesktop() {
    return html`
      <sl-resize-observer @sl-resize=${this.handleResize}>
        <div class="host-content desktop">${this.renderContent()}</div>
      </sl-resize-observer>
    `;
  }

  private renderContent = () => {
    let unlocked = false;

    if (this._selectedDistrictIndex !== undefined) {
      const district = this._controller.getDistrict(this._selectedDistrictIndex);

      unlocked = district.state !== DistrictUnlockState.locked;
    }

    const contentClasses = classMap({
      content: true,
      unlocked,
    });

    return html`
      <div
        ${ref(this._contentRef)}
        class=${contentClasses}
        @mousemove=${this.handleMouseMove}
        @mouseleave=${this.handleMouseLeave}
        @click=${this.handleMapClick}
      >
        ${map(range(this._controller.districtsCount), this.renderBackgroundDistrict)}
        ${map(range(this._controller.districtsCount), this.renderSelectedDistrict)}
      </div>
      <ca-city-map-district-description district=${ifDefined(this._selectedDistrictIndex)}>
      </ca-city-map-district-description>
    `;
  };

  private renderBackgroundDistrict = (districtNum: number) => {
    const district = this._controller.getDistrict(districtNum);

    return html`<ca-city-map-district
      class="visible"
      run-id=${this._controller.runId}
      district-num=${districtNum}
      district-state=${district.state}
      ?selected=${false}
      size=${this._size}
      theme=${this._controller.theme}
    ></ca-city-map-district>`;
  };

  private renderSelectedDistrict = (districtNum: number) => {
    const classes = classMap({
      visible: districtNum === this._selectedDistrictIndex,
    });

    const district = this._controller.getDistrict(districtNum);

    return html`<ca-city-map-district
      class=${classes}
      run-id=${this._controller.runId}
      district-num=${districtNum}
      district-state=${district.state}
      ?selected=${true}
      size=${this._size}
      theme=${this._controller.theme}
    ></ca-city-map-district>`;
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (this._contentRef.value) {
      const contentBoundingRect = this._contentRef.value.getBoundingClientRect();

      const offsetX = event.clientX - contentBoundingRect.x;
      const x = Math.round((offsetX / this._size) * (this._controller.mapWidth - 1));

      const offsetY = event.clientY - contentBoundingRect.y;
      const y = Math.round((offsetY / this._size) * (this._controller.mapHeight - 1));

      if (x >= 0 && y >= 0 && x < this._controller.mapWidth && y < this._controller.mapHeight) {
        this._selectedDistrictIndex = this._controller.layout[x][y];
      } else {
        this._selectedDistrictIndex = undefined;
      }
    }
  };

  private handleMouseLeave = () => {
    this._selectedDistrictIndex = undefined;
  };

  private handleResize = (event: { detail: { entries: ResizeObserverEntry[] } }) => {
    const containerBoundingClientRect = this.getBoundingClientRect();
    let width = event.detail.entries[0].contentRect.width;

    if (this.layoutContext !== 'mobile') {
      width *= DESKTOP_MAP_WIDTH_RATIO;
    }

    const height = window.innerHeight - containerBoundingClientRect.y - BOTTOM_GAP;
    this._size = Math.min(width, height);

    if (this._contentRef.value) {
      this._contentRef.value.style.width = `${this._size}px`;
      this._contentRef.value.style.height = `${this._size}px`;
    }
  };

  private handleMapClick = () => {
    if (this._selectedDistrictIndex !== undefined) {
      const district = this._controller.getDistrict(this._selectedDistrictIndex);

      if (district.state !== DistrictUnlockState.locked) {
        this.dispatchEvent(new CityMapClickEvent(this._selectedDistrictIndex));
      }
    }
  };
}
