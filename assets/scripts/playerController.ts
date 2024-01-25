import {
  _decorator,
  Component,
  Vec3,
  input as engineInput,
  Input as EngineInput,
  CharacterController,
  physics,
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
  private _movement: Vec3;
  private _characterController: CharacterController;
  private _velocityY: number = 0.0;
  private _isOnGround: boolean = false;

  @property
  public _movementSpeed: number = 7;

  @property
  public _gravity: number = 9.81;


  public _jumpPower: number = 5 ;

  protected start(): void {
    this._gameInput = new GameInput();
    this._characterController = this.node.getComponent(CharacterController);
    this.applyGameInput();
  }

  protected update(dt: number): void {
    this.checkGround();
    this.applyGravity(dt);
    console.log(this._isOnGround);
    console.log(this._velocityY);
    console.log(this._jumpPower);
    this.move(dt);
    this.jump();
    // console.log(this._velocity);
  }

  private applyGameInput(): void {
    engineInput.on(EngineInput.EventType.KEY_DOWN, (event) =>
      this._gameInput.getButton(event, _InputEventType.DOWN)
    );
    engineInput.on(EngineInput.EventType.KEY_UP, (event) =>
      this._gameInput.getButton(event, _InputEventType.UP)
    );
  }

  private move(dt: number) {
    let movementDistance = this._movementSpeed * dt;
    this._movementDirection = this._gameInput.getInputDirection();
    this._movement = new Vec3(
      this._movementDirection.x * movementDistance,
      this._movementDirection.y = this._velocityY * dt,
      this._movementDirection.z * movementDistance
    );
    this._characterController.move(this._movement);
  }

  private applyGravity(dt: number) {
    if (this._velocityY >= -200 && !this._isOnGround) {
      this._velocityY += -this._gravity * dt;
    }
  }

  private checkGround(): boolean {
    this._isOnGround = this._characterController.isGrounded;
    return this._isOnGround
  }

  private jump() {
    if (this._gameInput.getJumpInput() && this._isOnGround) {
      this._velocityY = this._jumpPower;
    }
  }
}
