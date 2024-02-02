import {
  EventKeyboard,
  input as engineInput,
  Input as EngineInput,
  Vec3,
  EventMouse,
  game,
} from "cc";
import { InputKeywordEventType, InputMouseEventType } from "./playerController";

export enum _InputType {
  MOVEMENT = "movement",
  FLY = "fly",
}

export class GameInput {
  private static _inputKeywordMap;
  private _inputMouseMap;
  private _mouseDirection = {
    x: 0,
    y: 0,
  };
  private _axis = { x: 0, y: 0, z: 0 };
  private _inputDirection: Vec3;
  private _inputType: _InputType = _InputType.MOVEMENT;
  constructor(type?: _InputType) {
    type ? (this._inputType = type) : null;
    GameInput._inputKeywordMap = new Set();
    this._inputMouseMap = new Set();
  }
  getButton(event: EventKeyboard, type: InputKeywordEventType) {
    if (type === InputKeywordEventType.DOWN) this.onKeyDown(event);
    if (type === InputKeywordEventType.UP) this.onKeyUp(event);
  }
  onKeyDown(event: EventKeyboard) {
    GameInput._inputKeywordMap.add(event.keyCode);
  }
  onKeyUp(event: EventKeyboard) {
    GameInput._inputKeywordMap.delete(event.keyCode);
  }

  // 0 - lkm
  // 2 - pkm
  // 1 - koleco
  getMouse(event: EventMouse, type: InputMouseEventType) {
    if (type === InputMouseEventType.UP) this.onMouseUp(event);
    if (type === InputMouseEventType.DOWN) this.onMouseDown(event);
    if (type === InputMouseEventType.MOVE) this.onMouseMove(event);
    // console.log(this._inputMouseMap);
  }
  onMouseDown(event: EventMouse) {
    this._inputMouseMap.add(event.getButton());
    // console.log(event)
    game.canvas.requestPointerLock();
  }
  onMouseUp(event: EventMouse) {
    this._inputMouseMap.delete(event.getButton());
  }
  onMouseMove(event: EventMouse) {
    // console.log(`locationX => ${event.getLocationX()}`);
    // console.log(`locationY => ${event.getLocationY()}`);
    this._mouseDirection.x = event.movementX;
    this._mouseDirection.y = event.movementY;
    // console.log(`${event.movementX}  ${event.movementY}`)
  }
  getMouseDirection() {
    return {
      x: this._mouseDirection.x,
      y: this._mouseDirection.y,
    };
  }
  getInputDirection(): Vec3 {
    if (GameInput._inputKeywordMap.has(87) && !GameInput._inputKeywordMap.has(83)) {
      this._axis.x = 1;
    } else if (
      GameInput._inputKeywordMap.has(83) &&
      !GameInput._inputKeywordMap.has(87)
    ) {
      this._axis.x = -1;
    } else {
      this._axis.x = 0;
    }
    if (GameInput._inputKeywordMap.has(68) && !GameInput._inputKeywordMap.has(65)) {
      this._axis.z = 1;
    } else if (
      GameInput._inputKeywordMap.has(65) &&
      !GameInput._inputKeywordMap.has(68)
    ) {
      this._axis.z = -1;
    } else {
      this._axis.z = 0;
    }
    this._inputDirection = new Vec3(this._axis.x, this._axis.y, this._axis.z);
    this._inputDirection.normalize();

    return this._inputDirection;
  }

  static getMovementInput(): boolean {
    if (
      this._inputKeywordMap.has(87) ||
      this._inputKeywordMap.has(83) ||
      this._inputKeywordMap.has(65) ||
      this._inputKeywordMap.has(68)
    ) {
      return true;
    }
    return false;
  }

  static getJumpInput(): boolean {
    return GameInput._inputKeywordMap.has(32);
  }

  static getCancelInput(): boolean {
    return GameInput._inputKeywordMap.has(27);
  }

  static getRunInput(): boolean {
    return GameInput._inputKeywordMap.has(16);
  }

  static getSwitchToFlyInput(): boolean {
    return GameInput._inputKeywordMap.has(86);
  }
}
