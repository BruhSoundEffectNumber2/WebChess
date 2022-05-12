export class UIManager {
  static manager: UIManager | undefined = undefined;
  private _ui: HTMLElement;
  private _currentClass: string | null = null;

  private constructor() {
    // Store the element for later to avoid calls to the DOM
    const ui = document.getElementById('ui');

    if (ui == null) {
      throw new Error('UI element is null');
    }

    this._ui = ui;
  }

  sceneActivated(name: string): void {
    if (this._currentClass != null) {
      throw new Error(
        'A scene has been activated when the old scene is still up.',
      );
    }

    this._currentClass = name;
    this.ui.classList.add(this._currentClass);
  }

  sceneDeactivated(): void {
    if (this._currentClass == null) {
      throw new Error(
        'Trying to deactivate a scene UI when one has not been created yet.',
      );
    }

    this.ui.classList.remove(this._currentClass);
    this.ui.innerHTML = '';
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
