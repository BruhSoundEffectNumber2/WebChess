import {Scene} from 'excalibur';

export class MainMenu extends Scene {
  override onActivate() {
    const startButton = document.createElement('button');

    startButton.className = 'button button-start';

    startButton.onclick = (e) => {
      e.preventDefault();
    };
  }
}
