import {
  _decorator,
  Component,
  Node,
  input as engineInput,
  Input as EngineInput,
  EventKeyboard,
} from "cc";
import { GameInput } from "./gameInput";
import { InputKeywordEventType } from "./playerController";
const { ccclass, property } = _decorator;

@ccclass("uiController")
export class UIController extends Component {
  private _gameInput: GameInput;
  private _faq: Node;
  start() {
    this._gameInput = new GameInput();
    this._faq = this.node.getChildByName("FAQ");
    this.applyKeywordGameInput();
  }

  update(deltaTime: number) {
    this.showFAQ();
  }

  private applyKeywordGameInput(): void {
    engineInput.on(EngineInput.EventType.KEY_DOWN, (event: EventKeyboard) =>
      this._gameInput.getButton(event, InputKeywordEventType.DOWN)
    );
    engineInput.on(EngineInput.EventType.KEY_UP, (event: EventKeyboard) =>
      this._gameInput.getButton(event, InputKeywordEventType.UP)
    );
  }

  private showFAQ() {
    if (!GameInput.getFAQInput()) return;
    if (this._faq.active === false) {
      this._faq.active = true;
    } else {
      this._faq.active = false;
    }
  }
}
