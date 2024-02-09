import { _decorator, Component, Node, postProcess, Toggle } from 'cc';
const { ccclass, property } = _decorator;

const { Bloom, HBAO } = postProcess;

@ccclass('SettingsUI')
export class SettingsUI extends Component {
	@property({ visible: true, type: Node })
	postPropcces: Node;

	@property({ visible: true, type: Node })
	bloomCheckbox: Node;

	@property({ visible: true, type: Node })
	hbaoCheckbox: Node;

	protected start(): void {
		if (this.postPropcces) {
			const bloom = this.postPropcces.getComponent(Bloom);
			const toggle = this.bloomCheckbox.getComponent(Toggle);
			if (bloom) {
				toggle.isChecked = bloom.enabled;
			} else {
				toggle.node.active = false;
			}

			const hbao = this.postPropcces.getComponent(HBAO);
			const toggle2 = this.hbaoCheckbox.getComponent(Toggle);
			if (hbao) {
				toggle2.isChecked = hbao.enabled;
			} else {
				toggle2.node.active = false;
			}
		}
	}

	openWidget() {
		this.node.active = true;
	}

	closeWidget() {
		this.node.active = false;
	}

	turnBloom() {
		if (this.postPropcces && this.bloomCheckbox) {
			const bloom = this.postPropcces.getComponent(Bloom);
			const toggle = this.bloomCheckbox.getComponent(Toggle);
			bloom.enabled = !toggle.isChecked;
		}
	}

	turnHBAO() {
		if (this.postPropcces && this.hbaoCheckbox) {
			const bloom = this.postPropcces.getComponent(HBAO);
			const toggle = this.hbaoCheckbox.getComponent(Toggle);
			bloom.enabled = !toggle.isChecked;
		}
	}
}


