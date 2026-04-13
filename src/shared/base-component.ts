import { LitElement, PropertyValues } from 'lit';
import { consume } from '@lit/context';
import { IStateUIConnector } from '@state/state-ui-connector';
import { container } from '@state/container';
import { TYPES } from '@state/types';
import { type Layout } from './types';
import { layoutContext } from './contexts';

export abstract class BaseComponent extends LitElement {
  public readonly hasPartialUpdate: boolean = false;

  @consume({ context: layoutContext, subscribe: true })
  protected layoutContext?: Layout;

  protected hasMobileRender = false;
  protected hasTabletRender = false;

  private _stateUIConnector: IStateUIConnector = container.get<IStateUIConnector>(TYPES.StateUIConnector);

  updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (this.hasPartialUpdate && this.isConnected) {
      this.handlePartialUpdate();
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this._stateUIConnector.connectComponent(this);
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this._stateUIConnector.disconnectComponent(this);
  }

  performUpdate() {
    if (this.isConnected) {
      this._stateUIConnector.startRendering(this);
    }

    this.updateContext();

    super.performUpdate();

    if (this.isConnected) {
      this._stateUIConnector.stopRendering();
    }
  }

  render() {
    if (this.layoutContext === 'mobile' && this.hasMobileRender) {
      return this.renderMobile();
    }

    if (this.layoutContext === 'tablet' && this.hasTabletRender) {
      return this.renderTablet();
    }

    return this.renderDesktop();
  }

  protected renderMobile(): any {}

  protected renderTablet(): any {}

  protected renderDesktop(): any {}

  protected updateContext(): void {}

  handlePartialUpdate = () => {};
}
