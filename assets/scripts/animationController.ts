import { _decorator, animation, Component } from "cc";
import { GameInput } from "./gameInput";
const { ccclass, property } = _decorator;

@ccclass("animationController")
export class AnimeController extends Component {
  @property
  public _animationController: animation.AnimationController;
  public _gameInput: GameInput;
  public _variables;

  start() {
    this._gameInput = new GameInput();
    this._animationController = this.node.getComponent(
      animation.AnimationController
    );
    this._variables = this._animationController.getVariables();
  }

  update(deltaTime: number) {
    this.useIdle();
    this.useWalk();
  }

  useIdle() {
    if (!GameInput.getMovementInput()) {
      this._animationController.setValue("walking", false);
    }
  }

  useWalk() {
    console.log(`anime -> ${GameInput.getMovementInput()}`)
    if (GameInput.getMovementInput()) {
      this._animationController.setValue("walking", true);
    }
  }

  useRun() {}
}
