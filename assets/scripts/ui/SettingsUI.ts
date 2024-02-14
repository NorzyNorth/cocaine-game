import { _decorator, Component, director, math, Node, postProcess, screen, Toggle } from 'cc';
import { Settings } from '../enviroment/Settings';
const { ccclass, property } = _decorator;

const { Bloom, HBAO } = postProcess;

@ccclass('SettingsUI')
export class SettingsUI extends Component {
	@property({ visible: true, type: Node })
	postPropcces: Node;

	@property({ visible: true, type: Settings })
	envSettings: Settings;

	@property({ visible: true, type: Node })
	bloomCheckbox: Node;

	@property({ visible: true, type: Node })
	hbaoCheckbox: Node;

	protected start(): void {
		// post process
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

	changeRenderImage(data: any) {
		if (data && this.envSettings) {
			this.envSettings.renderImageQuality = 0.75;// data._progress;
		}
	}

	changeRenderImage100() { this.envSettings.renderImageQuality = 1; }
	changeRenderImage75() { this.envSettings.renderImageQuality = 0.75; }
	changeRenderImage50() { this.envSettings.renderImageQuality = 0.5; }

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


