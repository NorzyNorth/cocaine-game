import {
  EventKeyboard,
  input as engineInput,
  Input as EngineInput,
  Vec3,
} from "cc";

enum _InputType {
  MOVEMENT = "movement",
  FLY = "fly",
}

export class GameInput {
  private _inputMap;
  private _axis = { x: 0, y: 0, z: 0 };
  private _inputDirection: Vec3;
  private _inputType: _InputType = _InputType.MOVEMENT;
  constructor(type?: _InputType) {
    type ? (this._inputType = type) : null;
    this._inputMap = new Set();
  }
  getButton(event: EventKeyboard, type) {
    if (type === "down") this.onKeyDown(event);
    if (type === "up") this.onKeyUp(event);
  }
  onKeyDown(event: EventKeyboard) {
    this._inputMap.add(event.keyCode);
  }
  onKeyUp(event: EventKeyboard) {
    this._inputMap.delete(event.keyCode);
  }

  getInputDirection() {
    if (this._inputMap.has(87) && !this._inputMap.has(83)) {
      this._axis.x = 1;
    } else if (this._inputMap.has(83) && !this._inputMap.has(87)) {
      this._axis.x = -1;
    } else {
      this._axis.x = 0;
    }
    if (this._inputMap.has(68) && !this._inputMap.has(65)) {
      this._axis.z = 1;
    } else if (this._inputMap.has(65) && !this._inputMap.has(68)) {
      this._axis.z = -1;
    } else {
      this._axis.z = 0;
    }
    this._inputDirection = new Vec3(this._axis.x, this._axis.y, this._axis.z);
    this._inputDirection.normalize();

    return this._inputDirection;
  }
}
