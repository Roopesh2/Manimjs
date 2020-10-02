class TextMobject {
    CONFIG = {
        text    : "",
        fill    : WHITE,
        stroke  : NONE_C,
        position: [0, 0],
        canvas: getSVGCanvas()
    };
    constructor (cfg = {}) {
        this.updateConfig(cfg);
    }

    add () {

    }

    updateConfig (cfg = {}, obj) {
		if (obj !== undefined && obj instanceof Object) {
			cfg = deepAssign(cfg, obj);
		}
		this.CONFIG = deepAssign(this.CONFIG, cfg);
		attachConfigTo(this);
	}
}