import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SettingsUI')
export class SettingsUI extends Component {
	@property({ visible: true })
	postProcess: number;

	openWidget() {
		this.node.active = true;
	}

	closeWidget() {
		this.node.active = false;
	}
}


