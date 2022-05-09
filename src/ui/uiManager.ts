export class UIManager {
  static manager: UIManager | undefined = undefined;
  private _ui: HTMLElement;

  private constructor() {
    // Store the element for later to avoid calls to the DOM
    const ui = document.getElementById('ui');

    if (ui == null) {
      throw new Error('UI element is null');
    }

    this._ui = ui;
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
