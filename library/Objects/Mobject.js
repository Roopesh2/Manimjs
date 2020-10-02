class Mobject{
	CONFIG = {
		"background" : "transparent",
		"fill"       : NONE_C,
		"stroke"     : WHITE,
		"strokeWidth": DEFAULT_STROKE_WIDTH,
		"position"   : [0, 0],
		"canvas"     : getCanvas(),
		"tracePath"  : false,
		"lineDash"   : [0, 0],
		"vertices"   : []
	}
	constructor (cfg = {}) {
		this.updateConfig(cfg);
		this.__ic__();
		this.ctx = this.canvas.getContext("2d");
	}
	
	copy () {
		var inst = this;
		    inst.canvas = getCanvas();
		return inst;
	}

	deepcopy () {
		return this;
	}

	remove () {
		if (Manim.container.hasChild(this.canvas)) Manim.container.removeChild(this.canvas);
		return this;
	}
	
	shift (pos) {
		this.position[0] += pos[0];
		this.position[1] += pos[1];
		for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i][0] += pos[0];
			this.vertices[i][1] += pos[1];
		}
		return this;
	}
	
	shift (pos) {
		var xDiff = pos[0] - this.position[0],
			yDiff = pos[1] - this.position[1];
		for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i][0] += xDiff;
			this.vertices[i][1] += yDiff;
		}
		this.position = [x, y];
		return this;
	}
	
	scale (x = 1, y = x) {
		for (var i = 0; i < this.vertices.length; i++) {
			this.vertices[i][0] *= x;
			this.vertices[i][1] *= y;
		}
		return this;
	}
	rotate (th = 0, axis) {
		axis = axis || this.position;
		for (var i = 0; i < this.vertices.length; i++) {
			var x = this.vertices[i][0] - axis[0],
				y = this.vertices[i][1] - axis[1];
			this.vertices[i][0] = x * cos(th) - y * sin(th) + axis[0];
			this.vertices[i][1] = x * sin(th) + y * cos(th) + axis[1];
		}
		return this;
	}
		
	getMedian () {
		var md = [0, 0];
		for (var corner of this.vertices) {
			md[0] += corner[0];
			md[1] += corner[1];
		}
		md[0] /= this.vertices.length;
		md[1] /= this.vertices.length;
		return md;
	}

	update () {
		if (!this.tracePath) this.clear();
		this.add(false);
		return this;
	}

	clear () {
		this.canvas.getContext("2d").clearRect(
			-FRAME_WIDTH - Manim.origin[0],
			-FRAME_HEIGHT - Manim.origin[1],
			FRAME_WIDTH * 2,
			FRAME_HEIGHT * 2
		);
		return this;
	}

	tracePath (bool = true) {
		this.tracePath = bool;
	}

	__ic__(init) {
		if (init == true || !(this.canvas in Array.from(Manim.container.children))) {
			initCanvas(this);
		}
	}

	setDrawStyles () {
		var ctx = this.canvas.getContext("2d");
		ctx.fillStyle = this.fill;
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth = this.strokeWidth;
		ctx.setLineDash(this.lineDash);
	}
	updateConfig (cfg = {}, obj) {
		if (obj !== undefined && obj instanceof Object) {
			cfg = deepAssign(cfg, obj);
		}
		this.CONFIG = deepAssign(this.CONFIG, cfg);
		attachConfigTo(this);
	}
	
	getVertices () {
		return this.vertices;
	}
}