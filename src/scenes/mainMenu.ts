import {Scene} from 'excalibur';

export class MainMenu extends Scene {
  onActivate() {
    const startButton = document.createElement('button');

    startButton.className = 'button button-start';

    startButton.onclick = (e) => {
      e.preventDefault();
    };
  }
}
