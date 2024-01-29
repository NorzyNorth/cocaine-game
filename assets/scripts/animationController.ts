import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("animationController")
export class AnimationController extends Component {
  @property
  public _isWalking: boolean = true;

  start() {}

  update(deltaTime: number) {}

  useRun() {}

  useIdle() {}

  useWalk() {}
}
