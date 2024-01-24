import {
  _decorator,
  Component,
  Vec3,
  input as engineInput,
  Input as EngineInput,
  CharacterController,
} from "cc";
import { GameInput } from "./gameInput";
const { ccclass, property } = _decorator;

enum _InputEventType {
  DOWN = "down",
  UP = "up",
}

@ccclass("playerController")
export class PlayerController extends Component {
  private _movementDirection: Vec3;
  private _gameInput: GameInput;
  private _velocity: Vec3;
  private _characterController: CharacterController;
  private _velocityY: number = 0.0;

  @property
  private _movementSpeed: number = 7;

  @property
  private _gravity: number = 9.81;

  @property
  private _jumpPower: number = 10;

  protected start(): void {
    this._gameInput = new GameInput();
    this._characterController = this.node.getComponent(CharacterController);
    this.applyGameInput();
  }

  protected update(dt: number): void {
    this.applyGravity(dt);
    // console.log(this._velocityY);
    this.move(dt);
    console.log(this._velocity);
  }

  private applyGameInput(): void {
    engineInput.on(EngineInput.EventType.KEY_DOWN, (event) =>
      this._gameInput.getButton(event, _InputEventType.DOWN)
    );
    engineInput.on(EngineInput.EventType.KEY_UP, (event) =>
      this._gameInput.getButton(event, _InputEventType.UP)
    );
  }

  private move(dt) {
    let movementDistance = this._movementSpeed * dt;
    this._movementDirection = this._gameInput.getInputDirection();
    this._velocity = new Vec3(
      this._movementDirection.x * movementDistance,
      this._velocityY,
      this._movementDirection.z * movementDistance
    );
    this._characterController.move(this._velocity);
  }

  private applyGravity(dt: number) {
    if (this._velocityY >= -200) {
      this._velocityY += -this._gravity * dt;
    }
  }
}
