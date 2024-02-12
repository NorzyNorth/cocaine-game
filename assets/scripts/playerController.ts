import {
  _decorator,
  Component,
  Vec3,
  input as engineInput,
  Input as EngineInput,
  CharacterController,
  EventMouse,
  EventKeyboard,
  Node,
  math,
  Quat,
  Prefab,
  resources,
  instantiate,
  director,
} from "cc";
import { GameInput, _InputType } from "./gameInput";
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
export enum _PlayerStateType {
  BASE = "base",
  FLY = "fly",
}
@ccclass("playerController")
export class PlayerController extends Component {
  private _movementDirection: Vec3 = new Vec3(0, 0, 0);
  private _hoverDirection: Vec3 = new Vec3(0, 0, 0);
  private _viewDirection: Vec3 = new Vec3(0, 0, 0);
  private _gameInput: GameInput;
  private _movement: Vec3;
  private _playerState: _PlayerStateType = _PlayerStateType.BASE;
  private _characterController: CharacterController;
  private _velocityY: number = 0.0;
  private _isOnGround: boolean = false;
  private _camera: Node;
  @property
  public _walkSpeed: number = 7;
  public _runSpeed: number = 10;
  public _flySpeed: number = 10;
  public _movementSpeed: number = this._walkSpeed;

  @property
  public _gravity: number = 9.81;

  public _jumpPower: number = 5;

  protected start(): void {
    this._gameInput = new GameInput();
    this._camera = this.node.getChildByName("CameraNode");
    this._characterController = this.node.getComponent(CharacterController);
    this.applyGameInput();
  }

  protected update(deltaTime: number): void {
    this.checkGround();
    // console.log(this._playerState);
    switch (this._playerState) {
      case _PlayerStateType.BASE:
        this.applyBasicController(deltaTime);
        break;
      case _PlayerStateType.FLY:
        this.applyFlyController(deltaTime);
        break;
    }
    // console.log(this._isOnGround);
    // console.log(this._velocityY);
    // console.log(this._jumpPower);
    // console.log(this._movementSpeed);
  }

  private applyFlyController(deltaTime: number) {
    this.switchFlyMode();
    this.rotateBeforeMove();
    this.fly(deltaTime);

  }

  private applyBasicController(deltaTime: number) {
    this.applyGravity(deltaTime);
    this.switchFlyMode();
    this.rotateBeforeMove();
    this.walk(deltaTime);
    this.run(deltaTime);
    this.jump();
    this.createObject();
  }

  private cameraRotate(event: EventMouse) {
    const nowCameraRotate = new Vec3();
    Quat.toEuler(nowCameraRotate, this._camera.getRotation());
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
    let currentRotation = this._camera.eulerAngles;
    currentRotation.add(cameraDirection);
    this._camera.setRotationFromEuler(currentRotation);
    this._viewDirection = currentRotation;
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

  private rotateBeforeMove() {
    // console.log(GameInput.getMovementInput());
    if (GameInput.getMovementInput()) {
      this.node.rotate(
        new Quat(0, this._camera.rotation.y, 0, this._camera.rotation.w)
      );
      this._camera.setRotationFromEuler(0, 0, this._viewDirection.z);
    }
  }

  private walk(deltaTime: number) {
    let movementDistance = this._movementSpeed * deltaTime;
    // console.log(movementDistance);
    this._movementDirection = this._gameInput.getInputDirection();
    this._movement = new Vec3(
      this._movementDirection.x * movementDistance,
      (this._movementDirection.y = this._velocityY * deltaTime),
      this._movementDirection.z * movementDistance
    );
    // console.log(this._movement);
    Vec3.transformQuat(this._movement, this._movement, this.node.rotation);
    this._characterController.move(this._movement);
  }

  private fly(deltaTime: number) {
    let movementDistance = this._flySpeed * deltaTime;
    // console.log(movementDistance);
    this._movementDirection = this._gameInput.getInputDirection();
    this._hoverDirection = this._gameInput.getHoverInputDirection();
    this._movement = new Vec3(
      this._movementDirection.x * movementDistance,
      this._hoverDirection.y * movementDistance,
      this._movementDirection.z * movementDistance
    );
    Vec3.transformQuat(this._movement, this._movement, this.node.rotation);
    this._characterController.move(this._movement);
    // console.log(this._movement);
  }

  private applyGravity(deltaTime: number) {
    if (this._velocityY >= -200 && !this._isOnGround) {
      this._velocityY += -this._gravity * deltaTime;
    }
  }

  private checkGround(): boolean {
    this._isOnGround = this._characterController.isGrounded;
    return this._isOnGround;
  }

  private run(deltaTime: number) {
    if (GameInput.getRunInput() && this._isOnGround) {
      this._movementSpeed = this._runSpeed;
    } else if (!this._isOnGround) {
      this._movementSpeed = math.lerp(
        this._movementSpeed,
        this._walkSpeed,
        0.7 * deltaTime
      );
    } else if (!GameInput.getRunInput() && this._isOnGround) {
      this._movementSpeed = this._walkSpeed;
    }
    // console.log(this._movementSpeed);
  }

  private jump() {
    if (GameInput.getJumpInput() && this._isOnGround) {
      this._velocityY = this._jumpPower;
    }
  }

  private switchFlyMode() {
    if (!GameInput.getSwitchToFlyInput()) return;
    this._playerState =
      this._playerState == _PlayerStateType.BASE
        ? _PlayerStateType.FLY
        : _PlayerStateType.BASE;
    this._velocityY = 0;
  }

  private createObject() {
    if (!GameInput.getJumpInput()) return
    resources.load("player-blue/player-blue", Prefab, (err, prefab) => {
      const newObject = instantiate(prefab);
      director.getScene().addChild(newObject);
    })
  }
}
