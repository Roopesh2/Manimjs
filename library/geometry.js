(function(){
	class TwoDObject {
		constructor (config = {}) {
			this.background_color  = config.background_color || "transparent",
			this.stroke = config.stroke == undefined ? true : config.stroke,
			this.fill = config.fill == undefined ? true : config.fill,
			this.fill_color = config.fill_color || YELLOW_C,
			this.stroke_color = config.stroke_color || YELLOW_C,
			this.stroke_width = config.stroke_width || 0.04;
			this.origin = config.origin || Manimation.origin;
			this.xPos = [];
			this.yPos = [];
			this.canvas = getCanvas();
		}

		digestConfig () {
			for (var i = 0; i < this.positions.length; i += 2) { // x-pos
				this.xPos.push(this.positions[i]);
				this.yPos.push(this.positions[i + 1]);
			}
		}

		remove () {
			Manimation.container.removeChild(this.canvas);
		}

		shiftBy (x, y) {
			for (var i = 0; i < this.positions.length; i += 2) {
				this.positions[i] += x;//x-axis
				this.positions[i + 1] += y;//y-axis
			}
		}

		shiftTo (x, y) {
			if (this.xPos[0] === undefined) {
				this.digestConfig();
			}
			var xMin = Math.min(...this.xPos);
			var yMin = Math.min(...this.yPos);
			var xComp = x - xMin;
			var yComp = y - yMin;

			for (var i = 0; i < this.positions.length; i += 2) {
				this.positions[i] += xComp;//x-axis
				this.positions[i + 1] += yComp;//y-axis
			}
		}

		scale (x, y) {
			y = y == undefined ? x : y;
			for (var i = 0; i < this.positions.length; i += 2) {
				this.positions[i] * x;//x-axis
				this.positions[i + 1] * y;//y-axis
			}
		}

	}


	class Rectangle extends TwoDObject {
		constructor(config = {}, graph = {}) {
			super(config);
			this.width = config.width || 1;
			this.height = config.height || 1;
			this.positions = [config.x || 0, config.y || 0];
			this.boundedRect = this.positions.concat(
				config.x + this.width,
				config.y + this.height
			);
		}
		add () {
			var ctx = initCanvas(this);

			// draws Rectangle
			var width = this.width;
			var height = this.height;
			var x = this.positions[0];
			var y = -this.positions[1];
			ctx.beginPath();
			ctx.rect(
				x, y,
				width, height
			);
			if (this.stroke){
				ctx.strokeStyle = this.stroke_color;
				ctx.lineWidth = this.stroke_width;
				ctx.stroke();
			}
			if (this.fill){
				ctx.fillStyle = this.fill_color;
				ctx.fill();
			}
		}
	}

	class Line extends TwoDObject {
		constructor (config = {}, graph = {}) {
			super(config);
			
			config.x1 = config.x1 || 0;
			config.y1 = config.y1 || 0;
			config.x2 = config.x2 || 1;
			config.y2 = config.y2 || 1;
			this.positions = [
				config.x1, config.y1, // x1, y1
				config.x2, config.y2  // x2, y2
			];
			this.boundedRect = [
				Math.min(config.x1, config.x2), Math.min(config.y1, config.y2),
				Math.max(config.x1, config.x2), Math.max(config.y1, config.y2)
			];
		}
		add () {
			var ctx = initCanvas(this);
			line(ctx,
				this.positions[0], this.positions[1],
				this.positions[2], this.positions[3]
			)
			if (this.stroke){
				ctx.strokeStyle = this.stroke_color;
				ctx.lineWidth = this.stroke_width;
				ctx.stroke();
			}

		}
	}

	class Arrow extends Line {
		head_size = 0.2
		constructor (config = {}) {
			super(config);
			this.auto_scale_head = getDefined(config.auto_scale_head, false);
			this.x1 = getDefined(config.x1, 0);
			this.y1 = getDefined(config.y1, 0);
			this.x2 = getDefined(config.x2, 1);
			this.y2 = getDefined(config.y2, 1);
			if (this.auto_scale_head) {
				this.head_size = dist(this.x1, this.y1, this.x2, this.y2) * 1 / 8;
			}
			this.head_size = getDefined(config.head_size, this.head_size);
		}

		add (init = true) {
			if (init) initCanvas(this);
			var ctx = this.canvas.getContext("2d");
			ctx.fillStyle = this.fill_color;
			ctx.strokeStyle = this.stroke_color;
			ctx.lineWidth = this.stroke_width;
			line(ctx, this.x1, this.y1, this.x2 - this.head_size / 2 * sin(this.getAngle()), this.y2 - this.head_size / 2 * cos(this.getAngle()));
			ctx.stroke();
			// debugger
			pointer (ctx, this.x2, -this.y2,
				this.getAngle() + PI / 2,
				this.head_size,
				this.fill_color
			);
		}

		getAngle() {
			return atan2((this.x1 - this.x2) , (this.y1 - this.y2));
		}
	}
	window.Rectangle = Rectangle;
	window.Line = Line;
	window.Arrow = Arrow;
})();
