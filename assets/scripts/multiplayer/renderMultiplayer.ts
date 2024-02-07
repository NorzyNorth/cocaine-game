import { _decorator, Component, Node, Prefab, instantiate, assetManager } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('renderMultiplayer')
export class renderMultiplayer extends Component {
    @property({ type: Prefab })
    modelPrefab: Prefab = null;

    executeCode() {
        if (!this.modelPrefab) {
            this.loadPrefabFromURL('https://example.com/path/to/prefab.prefab')
                .then((prefab: Prefab) => {
                    this.modelPrefab = prefab;
                    this.createModel();
                })
                .catch((error: Error) => {
                    console.error('Failed to load prefab:', error);
                });
        } else {
            this.createModel();
        }
    }

    loadPrefabFromURL(url: string): Promise<Prefab> {
        return new Promise((resolve, reject) => {
            assetManager.loadAny({ url }, (err, prefab) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(prefab as Prefab);
                }
            });
        });
    }

    createModel() {
        const emptyNode = new Node('EmptyNode');
        this.node.addChild(emptyNode);

        if (this.modelPrefab) {
            const modelNode = instantiate(this.modelPrefab);
            emptyNode.addChild(modelNode);
        } else {
            console.error('Model prefab is not assigned.');
        }
    }
}


