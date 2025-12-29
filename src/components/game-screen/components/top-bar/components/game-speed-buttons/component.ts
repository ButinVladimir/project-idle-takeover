import { html, TemplateResult } from 'lit';
import { localized, msg } from '@lit/localize';
import { customElement } from 'lit/decorators.js';
import { GameSpeed } from '@state/global-state';
import { ConfirmationAlertOpenEvent } from '@components/game-screen/components/confirmation-alert/events';
import { BaseComponent, GameStateAlert } from '@shared/index';
import { COMMON_TEXTS } from '@texts/index';
import { GameSpeedButtonsController } from './controller';
import { GameSpeedButtonProps } from './interfaces';
import { GAME_SPEED_TEXTS } from './constants';
import styles from './styles';

@localized()
@customElement('ca-game-speed-buttons')
export class GameSpeedButtons extends BaseComponent {
  static styles = styles;

  private _controller: GameSpeedButtonsController;

  constructor() {
    super();

    this._controller = new GameSpeedButtonsController(this);
  }

  protected renderDesktop() {
    const gameSpeed = this._controller.gameSpeed;

    return html`
      ${this.renderButton({
        gameSpeed: GameSpeed.paused,
        icon: gameSpeed === GameSpeed.paused ? 'pause-fill' : 'pause',
      })}
      ${this.renderButton({
        gameSpeed: GameSpeed.normal,
        icon: gameSpeed === GameSpeed.normal ? 'play-fill' : 'play',
      })}
      ${this.renderButton({
        gameSpeed: GameSpeed.fast,
        icon: gameSpeed === GameSpeed.fast ? 'fast-forward-fill' : 'fast-forward',
      })}
      <sl-tooltip>
        <span slot="content"> ${msg('Spend all accumulated time')} </span>

        <sl-icon-button
          name="skip-end"
          label=${msg('Spend all accumulated time')}
          @click=${this.handleOpenFastForwardDialog}
        >
        </sl-icon-button>
      </sl-tooltip>
    `;
  }

  private renderButton = (props: GameSpeedButtonProps): TemplateResult => {
    const { gameSpeed, icon } = props;

    return html`
      <sl-tooltip>
        <div class="tooltip-content" slot="content">
          <p>${GAME_SPEED_TEXTS[gameSpeed]()}</p>
          <p>${COMMON_TEXTS.hotkey(this._controller.getGameSpeedHotkey(gameSpeed))}</p>
        </div>

        <sl-icon-button
          name=${icon}
          label=${GAME_SPEED_TEXTS[gameSpeed]()}
          @click=${this.handleChangeGameSpeed(gameSpeed)}
        >
        </sl-icon-button>
      </sl-tooltip>
    `;
  };

  private handleChangeGameSpeed = (gameSpeed: GameSpeed) => () => {
    this._controller.changeGameSpeed(gameSpeed);
  };

  private handleOpenFastForwardDialog = () => {
    this.dispatchEvent(
      new ConfirmationAlertOpenEvent(
        GameStateAlert.fastForward,
        msg('Are you sure want to spend accumulated time?'),
        this.handleFastForward,
      ),
    );
  };

  private handleFastForward = () => {
    this._controller.fastForward();
  };
}
