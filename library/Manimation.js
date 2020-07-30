class manimation {
	constructor(){
		this.container = document.body;
		this.classList = [];
		this.globalScaleRatio = [100, 100];
		this.origin = [0, 0];
		this.__init__();
	}
	__init__() {
		var style = getComputedStyle(this.container);
		var totalX = parseInt(style.width) / this.globalScaleRatio[0];
		var totalY = parseInt(style.height) / this.globalScaleRatio[1];
		this.x_min = -totalX / 2;
		this.x_max = totalX / 2;
		this.y_min = -totalY / 2;
		this.y_max = totalY / 2;
	}
	setContainer(container) {
		this.container = container instanceof HTMLElement ? container : this.container || document.documentElement.body;
		this.__init__();
	}
	setSize (size = SMALL) {
		if (/^\d*(\.)?\d*$/.test(String(size["width"]))) {
			size["width"] += "px";
		}
		if (/^\d*(\.)?\d*$/.test(String(size["height"]))) {
			size["height"] += "px";
		}
		// debugger
		this.container.style.width = size["width"];
		this.container.style.height = size["height"];
	}

	setRatio (ratio = [14, 9]) {
		var style = getComputedStyle(this.container);
		var totalX = parseInt(style.width);
		var totalY = parseInt(style.height);
		this.globalScaleRatio = [
			totalX / ratio[0] * window.devicePixelRatio,
			totalY / ratio[1] * window.devicePixelRatio
		]
		this.__init__();
	}
};


var Manimation = new manimation()
