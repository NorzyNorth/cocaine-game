import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
  /**
   * Главный UI, экран.
   * UI может быть скрыт, но работа других подсистем, как управление, зависит этого флага,
   * когда игрок смотрить на основной экран.
   */
  ready = false;

  protected start(): void {
    this.ready = true;
  }

  openWidget() {
    this.node.active = true;
    this.ready = true;
  }

  closeWidget() {
    this.node.active = false;
    this.ready = false;
  }
}


