import {
  _decorator,
  Component,
  EventKeyboard,
  macro,
  Node,
  systemEvent,
  SystemEventType,
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
  private _movementSpeed: number = 1;
  private _gravity: number = 9.81;
  private _jumpPower: number = 10;
  private _gameInput: GameInput;
  private _velocity: Vec3;
  private _characterController: CharacterController;
  private _

  protected start(): void {
    this._gameInput = new GameInput();
    this._characterController = this.node.getComponent(CharacterController);
    this.applyGameInput();
  }

  protected update(dt: number): void {
    this.move();
  }

  private applyGameInput(): void {
    engineInput.on(EngineInput.EventType.KEY_DOWN, (event) =>
      this._gameInput.getButton(event, _InputEventType.DOWN)
    );
    engineInput.on(EngineInput.EventType.KEY_UP, (event) =>
      this._gameInput.getButton(event, _InputEventType.UP)
    );
  }

  private move() {
    this._movementDirection = this._gameInput.getInputDirection();
    this._velocity = new Vec3(
      this._movementDirection.x * this._movementSpeed,
      this._movementDirection.y * this._movementSpeed,
      this._movementDirection.z * this._movementSpeed
    );
    this._characterController.move(this._velocity);
  }
}
