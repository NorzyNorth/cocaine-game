import { _decorator, Component, director, math, screen } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Settings')
export class Settings extends Component {
  private _windowWidth: number;
  private _windowHeight: number;

  protected start() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight - 50; // 50 для режима разработки

    this._windowWidth = windowWidth;
    this._windowHeight = windowHeight;

    // canvas size
    // подгоняет размеры холста под размер страницы
    screen.windowSize = new math.Size(windowWidth, windowHeight);

    // render size 100%
    director.root.resize(windowWidth, windowHeight);
  }

  get windowWidth() { return this._windowWidth }
  get windowHeight() { return this._windowHeight }

  /**
   * от 0.01 до 1.
   * Меняет размер canvas, но будут проблемы с UI. Пока движок не поддерживает 
   * полностью изменение разрешения, например изменение DPI и соотношение сторон.
   */
  set renderImageQuality(percent: number) {
    if (percent > 1) percent = 1;
    if (percent < 0.01) percent = 0.01;

    director.root.resize(this._windowWidth * percent, this._windowHeight * percent);
  }
}


