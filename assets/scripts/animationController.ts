import { _decorator, animation, Component, math } from "cc";
import { GameInput } from "./gameInput";
const { ccclass, property } = _decorator;

@ccclass("animationController")
export class AnimeController extends Component {
  @property
  public _animationController: animation.AnimationController;
  public _gameInput: GameInput;
  public _variables;
  public _isOnGround = true;

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
    this.useRun(deltaTime);
  }

  useIdle() {
    if (!GameInput.getMovementInput()) {
      this._animationController.setValue("walking", false);
    }
  }

  useWalk() {
    if (GameInput.getMovementInput()) {
      this._animationController.setValue("walking", true);
    }
  }

  useRun(deltaTime: number) {
    let runningThreshold = this._animationController.getValue("running");
    if (GameInput.getRunInput()) {
      this._animationController.setValue(
        "running",
        math.lerp(Number(runningThreshold), 1, 3 * deltaTime)
      );
      if (Number(runningThreshold) > 0.9) {
        this._animationController.setValue("running", 1);
      }
    } else {
      this._animationController.setValue(
        "running",
        math.lerp(Number(runningThreshold), 0, 5 * deltaTime)
      );
      if (Number(runningThreshold) < 0.1) {
        this._animationController.setValue("running", 0);
      }
    }
  }
}
