import {Scene} from 'excalibur';
import { Network } from '../state/network';
import { UIManager } from '../ui/uiManager';

export class MainMenu extends Scene {
  override onActivate() {
    UIManager.get().sceneActivated('mainMenu');

    const startButton = document.createElement('button');

    startButton.className = 'button--start';
    startButton.textContent = 'Find Match';

    startButton.onclick = (e) => {
      e.preventDefault();

      Network.get().startMatchmaking();
      startButton.textContent = 'Finding Match';
      startButton.disabled = true;
    };

    UIManager.get().ui.appendChild(startButton);
  }

  override onDeactivate(): void {
    UIManager.get().sceneDeactivated();
  }
}
