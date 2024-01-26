import {
  EventKeyboard,
  input as engineInput,
  Input as EngineInput,
  Vec3,
  EventMouse,
  game,
} from "cc";

export enum _InputType {
  MOVEMENT = "movement",
  FLY = "fly",
}
import { InputKeywordEventType, InputMouseEventType } from "./playerController";
export class GameInput {
  private _inputKeywordMap;
  private _inputMouseMap;
  private _mouseDirection = {
    x:0,
    y:0
  }
  private _axis = { x: 0, y: 0, z: 0 };
  private _inputDirection: Vec3;
  private _inputType: _InputType = _InputType.MOVEMENT;
  constructor(type?: _InputType) {
    type ? (this._inputType = type) : null;
    this._inputKeywordMap = new Set();
    this._inputMouseMap = new Set();
  }
  getButton(event: EventKeyboard, type: InputKeywordEventType) {
    if (type === "down") this.onKeyDown(event);
    if (type === "up") this.onKeyUp(event);
  }
  onKeyDown(event: EventKeyboard) {
    this._inputKeywordMap.add(event.keyCode);
  }
  onKeyUp(event: EventKeyboard) {
    this._inputKeywordMap.delete(event.keyCode);
  }

  // 0 - lkm
  // 2 - pkm
  // 1 - koleco
  getMouse(event: EventMouse, type: InputMouseEventType) {
    if (type === "up") this.onMouseUp(event);
    if (type === "down") this.onMouseDown(event);
    if (type === "move") this.onMouseMove(event);
    // console.log(this._inputMouseMap);
  }
  onMouseDown(event: EventMouse) {
    this._inputMouseMap.add(event.getButton());
    console.log(event)
    game.canvas.requestPointerLock();
  }
  onMouseUp(event: EventMouse) {
    this._inputMouseMap.delete(event.getButton());
  }
  onMouseMove(event: EventMouse) {
    // console.log(`locationX => ${event.getLocationX()}`);
    // console.log(`locationY => ${event.getLocationY()}`);
    this._mouseDirection.x = event.movementX
    this._mouseDirection.y = event.movementY
    console.log(`${event.movementX}  ${event.movementY}`)
  }
  getMouseDirection() {
    return {
      x: this._mouseDirection.x,
      y: this._mouseDirection.y
    }
  }
  getInputDirection(): Vec3 {
    if (this._inputKeywordMap.has(87) && !this._inputKeywordMap.has(83)) {
      this._axis.x = 1;
    } else if (
      this._inputKeywordMap.has(83) &&
      !this._inputKeywordMap.has(87)
    ) {
      this._axis.x = -1;
    } else {
      this._axis.x = 0;
    }
    if (this._inputKeywordMap.has(68) && !this._inputKeywordMap.has(65)) {
      this._axis.z = 1;
    } else if (
      this._inputKeywordMap.has(65) &&
      !this._inputKeywordMap.has(68)
    ) {
      this._axis.z = -1;
    } else {
      this._axis.z = 0;
    }
    this._inputDirection = new Vec3(this._axis.x, this._axis.y, this._axis.z);
    this._inputDirection.normalize();

    return this._inputDirection;
  }

  getJumpInput(): boolean {
    return this._inputKeywordMap.has(32);
  }

  getCancelInput(): boolean {
    return this._inputKeywordMap.has(27);
  }
}
