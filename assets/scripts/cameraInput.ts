import { EventKeyboard, Vec3, EventMouse } from "cc";
import { InputKeywordEventType, InputMouseEventType } from "./cameraController";

export enum _InputType {
  MOVEMENT = "movement",
  FLY = "fly",
}

export enum _ScrollDirectionType {
  FORWARD = "forward",
  BACKWARD = "backward",
}

export class CameraInput {
  private _inputKeywordMap;
  private _inputType: _InputType = _InputType.MOVEMENT;
  constructor(type?: _InputType) {
    type ? (this._inputType = type) : null;
    this._inputKeywordMap = new Set();
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

  getMouse(event: EventMouse, type: InputMouseEventType) {

  }
}
