import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
  openWidget() {
    this.node.active = true;
  }

  closeWidget() {
    this.node.active = false;
  }
}


