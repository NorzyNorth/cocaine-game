import {
  _decorator,
  Component,
  Vec3,
  input as engineInput,
  Input as EngineInput,
  CharacterController,
  physics,
  EventMouse,
  EventKeyboard,
  Node,
  math,
  quat,
  Quat,
} from "cc";
import { GameInput } from "./gameInput";
const { ccclass, property } = _decorator;

export enum InputKeywordEventType {
  DOWN = "down",
  UP = "up",
}
export enum InputMouseEventType {
  DOWN = "down",
  UP = "up",
  MOVE = "move",
}
@ccclass("playerController")
export class PlayerController extends Component {
  private _movementDirection: Vec3;
  private _gameInput: GameInput;
  private _movement: Vec3;
  private _characterController: CharacterController;
  private _velocityY: number = 0.0;
  private _isOnGround: boolean = false;
  private camera: Node;
  @property
  public _movementSpeed: number = 7;

  @property
  public _gravity: number = 9.81;

  public _jumpPower: number = 5;

  protected start(): void {
    this.camera = this.node.getChildByName(`Cameranode`);
    this._gameInput = new GameInput();
    this._characterController = this.node.getComponent(CharacterController);
    this.applyGameInput();
  }

  protected update(dt: number): void {
    this.checkGround();
    this.applyGravity(dt);
    // console.log(this._isOnGround);
    // console.log(this._velocityY);
    // console.log(this._jumpPower);
    this.move(dt);
    this.jump();
    // console.log(this._velocity);
  }

  private cameraRotate(event: EventMouse) {
    const nowCameraRotate = new Vec3();
    const gey = Quat.toEuler(nowCameraRotate, this.camera.getRotation());
    const mouseMovement = {
      x: event.movementX,
      y: event.movementY,
    };
    // console.log(nowCameraRotate);
    if (nowCameraRotate.z > 40 && mouseMovement.y * -1 > 0) {
      mouseMovement.y = 0;
    }
    if (nowCameraRotate.z < -50 && mouseMovement.y * -1 < 0) {
      mouseMovement.y = 0;
    }
    // console.log(mouseMovement)]
    // console.log(cameraDirection);
    let sensitivity = 0.5;
    const cameraDirection = new Vec3(
      0,
      mouseMovement.x * -1 * sensitivity,
      mouseMovement.y * -1 * sensitivity
    );
    let currentRotation = this.camera.eulerAngles;
    currentRotation.add(cameraDirection);
    this.camera.setRotationFromEuler(currentRotation);
  }

  private applyGameInput(): void {
    this.applyKeywordGameInput();
    this.applyMouseGameInput();
  }
  private applyKeywordGameInput(): void {
    engineInput.on(EngineInput.EventType.KEY_DOWN, (event: EventKeyboard) =>
      this._gameInput.getButton(event, InputKeywordEventType.DOWN)
    );
    engineInput.on(EngineInput.EventType.KEY_UP, (event: EventKeyboard) =>
      this._gameInput.getButton(event, InputKeywordEventType.UP)
    );
  }

  private applyMouseGameInput() {
    engineInput.on(EngineInput.EventType.MOUSE_MOVE, (event: EventMouse) => {
      this.cameraRotate(event);
    });
    engineInput.on(EngineInput.EventType.MOUSE_DOWN, (event: EventMouse) => {
      this._gameInput.getMouse(event, InputMouseEventType.DOWN);
    });
    engineInput.on(EngineInput.EventType.MOUSE_UP, (event: EventMouse) => {
      this._gameInput.getMouse(event, InputMouseEventType.UP);
    });
  }
  private _hui = 0
  private move(dt: number) {
    let movementDistance = this._movementSpeed * dt;
    this._movementDirection = this._gameInput.getInputDirection();
    this._movement = new Vec3(
      this._movementDirection.x * movementDistance,
      (this._movementDirection.y = this._velocityY * dt),
      this._movementDirection.z * movementDistance
    );
    if (this._movement.x != 0 || this._movement.z != 0) {
      // console.log(`${this._movement.x} ${this._movement.z}`)
      const nowCameraRotate = new Vec3();
      Quat.toEuler(nowCameraRotate, this.camera.getRotation());
      // console.log(gey)
      const gey2 = new Vec3(0,nowCameraRotate.y - 90,0)

      this.node.setRotationFromEuler(gey2);
      const vCamera = new Vec3()
      const vPlayer = new Vec3()
      Quat.toEuler(vCamera, this.camera.getRotation());
      Quat.toEuler(vPlayer, this.node.getRotation());
      console.log(`${vCamera} ${vPlayer}`)

    }
    this._characterController.move(this._movement);
    this.node.setRotationFromEuler(new Vec3(0, this._hui++,0));
  }

  private applyGravity(dt: number) {
    if (this._velocityY >= -200 && !this._isOnGround) {
      this._velocityY += -this._gravity * dt;
    }
  }

  private checkGround(): boolean {
    this._isOnGround = this._characterController.isGrounded;
    return this._isOnGround;
  }

  private jump() {
    if (this._gameInput.getJumpInput() && this._isOnGround) {
      this._velocityY = this._jumpPower;
    }
  }
}
