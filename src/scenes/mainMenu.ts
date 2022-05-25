import {Scene} from 'excalibur';
import {Network} from '../state/network';
import {UIManager} from '../ui/uiManager';

export class MainMenu extends Scene {
  private _startButton: HTMLButtonElement | undefined;

  override onActivate() {
    UIManager.get().sceneActivated('mainMenu');

    this._startButton = document.createElement('button');

    this._startButton.className = 'button--start';
    this._startButton.textContent = 'Find Match';

    this._startButton.onclick = (e) => {
      e.preventDefault();

      UIManager.get().playButtonClickAudio();
      Network.get().connect();
      Network.get().startMatchmaking();
      this._startButton!.textContent = 'Finding Match';
      this._startButton!.disabled = true;
    };

    UIManager.get().ui.appendChild(this._startButton);
  }

  reset() {
    this._startButton!.textContent = 'Find Match';
    this._startButton!.disabled = false;
  }

  override onDeactivate(): void {
    UIManager.get().sceneDeactivated('mainMenu');
  }
}
