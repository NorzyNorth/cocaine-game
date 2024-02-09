import { _decorator, Button, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ActivateUI')
export class ActivateUI extends Component {
	@property({ visible: true })
	target: Node;

	protected start(): void {
		if (this.target) {
			const button = this.node.getComponent(Button);
			if (button) {
				this.node.on(Button.EventType.CLICK, () => {
					this.target.active = true;
				}, this);
			}
		}
	}
}


