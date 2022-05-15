import {Resources} from '../resources';

export interface DecisionCallback<T1, T2 = void> {
  (param1: T1): T2;
}

export class UIManager {
  static manager: UIManager | undefined = undefined;
  private _ui: HTMLElement;
  private _currentClasses: string[];

  private constructor() {
    this._currentClasses = [];

    // Store the element for later to avoid calls to the DOM
    const ui = document.getElementById('ui');

    if (ui == null) {
      throw new Error('UI element is null');
    }

    this._ui = ui;
  }

  sceneActivated(name: string): void {
    if (this._currentClasses[this._currentClasses.indexOf(name)] != null) {
      throw new Error('Trying to create a duplicate class on UI element.');
    }

    this._currentClasses.push(name);
    this.ui.classList.add(name);
  }

  sceneDeactivated(name: string): void {
    if (this._currentClasses[this._currentClasses.indexOf(name)] == null) {
      throw new Error(
        'Trying to remove a class that does not exist from UI element.',
      );
    }

    this.ui.classList.remove(name);
    this.ui.innerHTML = '';
  }

  playButtonClickAudio(): void {
    Resources.buttonPress.play(0.1);
  }

  errorPopup(headerText: string, bodyText: string) {
    const base = document.createElement('div');
    base.classList.add('popup');

    const header = document.createElement('p');
    header.classList.add('error--header');

    const body = document.createElement('p');
    body.classList.add('body');

    const acknowledgement = document.createElement('button');
    acknowledgement.classList.add('error--option');

    this._ui.appendChild(base);
    base.appendChild(header);
    base.appendChild(body);
    base.appendChild(acknowledgement);

    header.textContent = headerText;
    body.textContent = bodyText;
    acknowledgement.textContent = 'Ok';

    acknowledgement.onclick = (e) => {
      e.preventDefault();

      this.playButtonClickAudio();
      base.remove();
      header.remove();
      body.remove();
      acknowledgement.remove();
    };
  }

  alertPopup(headerText: string, bodyText: string) {
    const base = document.createElement('div');
    base.classList.add('popup');

    const header = document.createElement('p');
    header.classList.add('header');

    const body = document.createElement('p');
    body.classList.add('body');

    const acknowledgement = document.createElement('button');
    acknowledgement.classList.add('error--option');

    this._ui.appendChild(base);
    base.appendChild(header);
    base.appendChild(body);
    base.appendChild(acknowledgement);

    header.textContent = headerText;
    body.textContent = bodyText;
    acknowledgement.textContent = 'Ok';

    acknowledgement.onclick = (e) => {
      e.preventDefault();

      this.playButtonClickAudio();
      base.remove();
      header.remove();
      body.remove();
      acknowledgement.remove();
    };
  }

  decisionPopup(
    headerText: string,
    bodyText: string,
    option1Text: string,
    option1CB: DecisionCallback<MouseEvent>,
    option2Text: string,
    option2CB: DecisionCallback<MouseEvent>,
  ) {
    const base = document.createElement('div');
    base.classList.add('popup');

    const header = document.createElement('p');
    header.classList.add('header');

    const body = document.createElement('p');
    body.classList.add('body');

    const option1 = document.createElement('button');
    option1.classList.add('option');

    const option2 = document.createElement('button');
    option2.classList.add('option');

    this._ui.appendChild(base);
    base.appendChild(header);
    base.appendChild(body);
    base.appendChild(option1);
    base.appendChild(option2);

    header.textContent = headerText;
    body.textContent = bodyText;
    option1.textContent = option1Text;
    option2.textContent = option2Text;

    option1.onclick = (e) => {
      e.preventDefault();

      this.playButtonClickAudio();
      option1CB(e);
      base.remove();
      header.remove();
      body.remove();
      option1.remove();
      option2.remove();
    };

    option2.onclick = (e) => {
      e.preventDefault();

      Resources.buttonPress.play(0.1);
      option2CB(e);
      base.remove();
      header.remove();
      body.remove();
      option1.remove();
      option2.remove();
    };
  }

  static get(): UIManager {
    if (this.manager == undefined) {
      this.manager = new UIManager();
    }

    return this.manager;
  }

  get ui(): HTMLElement {
    return this._ui;
  }
}
