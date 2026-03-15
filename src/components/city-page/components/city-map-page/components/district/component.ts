import { html, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { localized } from '@lit/localize';
import { BaseComponent, Theme } from '@shared/index';
import { DistrictUnlockState } from '@state/city-state';
import { IDistrictRendererResult } from '@workers/district-renderer/interfaces';
import { CityMapHighlightedDistrictController } from './controller';
import { CELL_SIZE } from '../../constants';
import cityMapPageDistrictStyles from './styles';

@localized()
@customElement('ca-city-map-district')
export class CityMapDistrict extends BaseComponent {
  static styles = cityMapPageDistrictStyles;

  private static _districtRendererWorker: Worker;

  @property({
    attribute: 'run-id',
    type: String,
  })
  public runId!: string;

  @property({
    attribute: 'district-num',
    type: Number,
  })
  public districtNum!: number;

  @property({
    attribute: 'district-state',
    type: Number,
  })
  public districtState!: DistrictUnlockState;

  @property({
    attribute: 'selected',
    type: Boolean,
  })
  public selected = false;

  @property({
    attribute: 'theme',
    type: String,
  })
  public theme!: Theme;

  @property({
    attribute: 'size',
    type: Number,
  })
  public size = 1;

  private _controller: CityMapHighlightedDistrictController;

  private _canvasRef = createRef<HTMLCanvasElement>();

  private _districtBlob?: Blob;

  constructor() {
    super();

    this._controller = new CityMapHighlightedDistrictController(this);

    this.createWorker();
  }

  connectedCallback() {
    super.connectedCallback();

    this.renderCanvas();
  }

  protected renderDesktop() {
    return html` <canvas ${ref(this._canvasRef)} width=${this.size} height=${this.size}></canvas> `;
  }

  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (
      _changedProperties.has('runId') ||
      _changedProperties.has('districtNum') ||
      _changedProperties.has('districtState') ||
      _changedProperties.has('selected') ||
      _changedProperties.has('theme')
    ) {
      this.fullRenderCanvas();
    } else if (_changedProperties.has('size')) {
      this.renderCanvas();
    }
  }

  private fullRenderCanvas = () => {
    const fullWidth = (CELL_SIZE + 1) * this._controller.mapWidth + 1;
    const fullHeight = (CELL_SIZE + 1) * this._controller.mapHeight + 1;
    const offscreenCanvas = new OffscreenCanvas(fullWidth, fullHeight);

    CityMapDistrict._districtRendererWorker.addEventListener('message', this.handleWorkerResponse);
    CityMapDistrict._districtRendererWorker.postMessage(
      {
        canvas: offscreenCanvas,
        mapWidth: this._controller.mapWidth,
        mapHeight: this._controller.mapHeight,
        layout: this._controller.layout,
        theme: this.theme,
        districtNum: this.districtNum,
        districtUnlockState: this.districtState,
        selected: this.selected,
      },
      [offscreenCanvas],
    );
  };

  private renderCanvas = () => {
    if (!this._canvasRef.value) {
      return;
    }

    const context = this._canvasRef.value.getContext('2d');
    if (!context) {
      throw new Error('Canvas context is not supported');
    }

    if (!this._districtBlob) {
      return;
    }

    const fullWidth = (CELL_SIZE + 1) * this._controller.mapWidth + 1;
    const fullHeight = (CELL_SIZE + 1) * this._controller.mapHeight + 1;

    createImageBitmap(this._districtBlob).then((bitmap) => {
      context.clearRect(0, 0, this.size, this.size);
      context.drawImage(bitmap, 0, 0, fullWidth, fullHeight, 0, 0, this.size, this.size);
      bitmap.close();
    });
  };

  private createWorker() {
    if (!CityMapDistrict._districtRendererWorker) {
      const worker = new Worker(new URL('@workers/district-renderer/index.js', import.meta.url), { type: 'module' });

      worker.addEventListener('error', (e) => {
        console.error(e);
      });

      worker.addEventListener('messageerror', (e) => {
        console.error(e);
      });

      CityMapDistrict._districtRendererWorker = worker;
    }
  }

  private handleWorkerResponse = (e: MessageEvent<IDistrictRendererResult>) => {
    const { blob, districtNum, selected } = e.data;

    if (districtNum === this.districtNum && selected === this.selected) {
      this._districtBlob = blob;

      this.renderCanvas();
    }
  };
}
