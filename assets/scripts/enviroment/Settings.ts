import { _decorator, Component, director, math, screen, game } from 'cc';
const { ccclass, property } = _decorator;

const cb = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight - 50; // 50 для режима разработки

  screen.windowSize = new math.Size(windowWidth, windowHeight);
  console.log(windowWidth, windowHeight);

  // render size 100%
  // director.root.resize(windowWidth * 0.75, windowHeight * 0.75);
};
const startCb = () => {
  console.log('game.onStart');
}
game.onStart = startCb;

game.onPostBaseInitDelegate.add(() => {
  console.log('game.onPostBaseInitDelegate');
})
game.onPostInfrastructureInitDelegate.add(() => {
  console.log('game.onPostInfrastructureInitDelegate');
})
game.onPostProjectInitDelegate.add(() => {
  // 1
  console.log('game.onPostProjectInitDelegate');
  cb();
})
game.onPostSubsystemInitDelegate.add(() => {
  console.log('game.onPostSubsystemInitDelegate');
})
game.onPreBaseInitDelegate.add(() => {
  console.log('game.onPreBaseInitDelegate');
})
game.onPreInfrastructureInitDelegate.add(() => {
  console.log('game.onPreInfrastructureInitDelegate');
})
game.onPreProjectInitDelegate.add(() => {
  console.log('game.onPreProjectInitDelegate');
})
game.onPreSubsystemInitDelegate.add(() => {
  console.log('game.onPreSubsystemInitDelegate');
})

@ccclass('Settings')
export class Settings extends Component {
  private _windowWidth: number;
  private _windowHeight: number;

  protected start() {
    console.log('Component.start');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight - 50; // 50 для режима разработки

    this._windowWidth = windowWidth;
    this._windowHeight = windowHeight;

    // canvas size
    // подгоняет размеры холста под размер страницы
    // screen.windowSize = new math.Size(windowWidth, windowHeight);

    // // render size 100%
    // director.root.resize(windowWidth, windowHeight);
  }

  protected onLoad(): void {
    // 2
    // game.onStart = cb;
    console.log('Component.onLoad');

    game.onPostBaseInitDelegate.add(() => {
      console.log('game.onPostBaseInitDelegate');
    })
    game.onPostInfrastructureInitDelegate.add(() => {
      console.log('game.onPostInfrastructureInitDelegate');
    })
    game.onPostProjectInitDelegate.add(() => {
      console.log('game.onPostProjectInitDelegate');
    })
    game.onPostSubsystemInitDelegate.add(() => {
      console.log('game.onPostSubsystemInitDelegate');
    })
    game.onPreBaseInitDelegate.add(() => {
      console.log('game.onPreBaseInitDelegate');
    })
    game.onPreInfrastructureInitDelegate.add(() => {
      console.log('game.onPreInfrastructureInitDelegate');
    })
    game.onPreProjectInitDelegate.add(() => {
      console.log('game.onPreProjectInitDelegate');
    })
    game.onPreSubsystemInitDelegate.add(() => {
      console.log('game.onPreSubsystemInitDelegate');
    })
  }
  protected onEnable(): void {
    console.log('Component.onEnable');
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
