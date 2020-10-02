class manim {
	constructor () {
		this.CONFIG = {
			"container" : document.body,
			"origin" : ORIGIN,
			"background" : BLACK,
		}
		attachConfigTo(this);
		this.__init__();
	}
	__init__() {
		this.container.style.width = FRAME_WIDTH * SMALL.width;
		this.container.style.height = FRAME_HEIGHT * SMALL.height;
	}
	setContainer(container) {
		assert (container instanceof HTMLElement);
		this.container = container;
		this.container.style.backgroundColor = this.background;
		this.__init__();
	}
	setSize (size = SMALL) {
		this.container.style.width = size["width"] + "px";
		this.container.style.height = size["height"] + "px";
	}

	add () {
		for (var object of arguments) {
			object.add();
		}
	}
};


const Manim = new manim()