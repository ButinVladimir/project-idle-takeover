import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { BaseComponent } from '@shared/base-component';
import { EMPTY_IMAGE } from './constants';
import { SortableElementMovedEvent } from './events';
import styles from './styles';

@customElement('ca-sortable-list')
export class SortableList extends BaseComponent {
  static styles = styles;

  @property({
    attribute: 'gap',
    type: Number,
  })
  gap = 0;

  private _listRef = createRef<HTMLDivElement>();

  private _draggedElement?: HTMLElement;

  private _listBoundingRect?: DOMRect;

  private _elementBoundingRect?: DOMRect;

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('dragstart', this.handleDragStart);
    this.addEventListener('dragend', this.handleDragEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('dragstart', this.handleDragStart);
    this.removeEventListener('dragend', this.handleDragEnd);
  }

  protected renderDesktop() {
    return html`
      <div ${ref(this._listRef)} part="list" class="list" @dragover=${this.handleDragOver}>
        <slot @slotchange=${this.handleChildrenUpdate}></slot>
      </div>
    `;
  }

  private handleChildrenUpdate = () => {
    this._listBoundingRect = undefined;
    this._elementBoundingRect = undefined;
  };

  private handleDragStart = (event: DragEvent) => {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setDragImage(EMPTY_IMAGE, 0, 0);

      this._draggedElement = event.target as HTMLElement;
      this._draggedElement.classList.add('dragged');
    }
  };

  private handleDragOver = (event: DragEvent) => {
    if (!this._listBoundingRect && this._listRef.value) {
      this._listBoundingRect = this._listRef.value.getBoundingClientRect();
    }

    if (this._draggedElement) {
      let eventY = event.clientY - this._listBoundingRect!.top;

      if (eventY < 0) {
        eventY = 0;
      }

      if (eventY >= this._listBoundingRect!.height) {
        eventY = this._listBoundingRect!.height - 1;
      }

      if (!this._elementBoundingRect) {
        this._elementBoundingRect = this._draggedElement.getBoundingClientRect();
      }

      const increase = this.calculatePositionIncrease(eventY) - this.calculatePositionDecrease(eventY);

      if (increase !== 0) {
        const id = this._draggedElement.getAttribute('data-drag-id')!;
        const currentPosition = this.calculateCurrentPosition();

        const newPosition = currentPosition + increase;

        this.dispatchEvent(new SortableElementMovedEvent(id, newPosition));

        this._elementBoundingRect = undefined;
      }
    }
  };

  private calculatePositionDecrease(eventY: number): number {
    if (!this._draggedElement || !this._listBoundingRect || !this._elementBoundingRect) {
      return 0;
    }

    const elementTop = this._elementBoundingRect.top - this._listBoundingRect.top;
    const elementBottom = this._elementBoundingRect.bottom - this._listBoundingRect.top + this.gap;

    if (eventY >= elementTop) {
      return 0;
    }

    let positionDecrease = 0;
    let coordinateDecrease = 0;

    let element: Element | null = this._draggedElement.previousElementSibling;

    while (element && eventY < elementTop - coordinateDecrease) {
      positionDecrease++;
      coordinateDecrease += element.getBoundingClientRect().height + this.gap;
      element = element.previousElementSibling;
    }

    if (eventY > elementBottom - coordinateDecrease) {
      positionDecrease--;
    }

    return positionDecrease;
  }

  private calculatePositionIncrease(eventY: number): number {
    if (!this._draggedElement || !this._listBoundingRect || !this._elementBoundingRect) {
      return 0;
    }

    const elementTop = this._elementBoundingRect.top - this._listBoundingRect.top;
    const elementBottom = this._elementBoundingRect.bottom - this._listBoundingRect.top + this.gap;

    if (eventY <= elementBottom) {
      return 0;
    }

    let positionIncrease = 0;
    let coordinateIncrease = 0;

    let element: Element | null = this._draggedElement.nextElementSibling;

    while (element && eventY > elementBottom + coordinateIncrease) {
      positionIncrease++;
      coordinateIncrease += element.getBoundingClientRect().height + this.gap;
      element = element.nextElementSibling;
    }

    if (eventY < elementTop + coordinateIncrease) {
      positionIncrease--;
    }

    return positionIncrease;
  }

  private calculateCurrentPosition(): number {
    if (!this._draggedElement) {
      return 0;
    }

    let position = 0;
    let element: Element | null = this._draggedElement.previousElementSibling;

    while (element) {
      position++;
      element = element.previousElementSibling;
    }

    return position;
  }

  private handleDragEnd = () => {
    if (this._draggedElement) {
      this._draggedElement.classList.remove('dragged');
    }

    this._draggedElement = undefined;
    this._listBoundingRect = undefined;
    this._elementBoundingRect = undefined;
  };
}
