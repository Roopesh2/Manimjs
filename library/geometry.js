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
			ctx.beginPath();
			line(
				ctx, this.positions[0], this.positions[1],
				this.positions[2], this.positions[3]
			)
			if (this.stroke){
				ctx.strokeStyle = this.stroke_color;
				ctx.lineWidth = this.stroke_width;
				ctx.stroke();
			}

		}
	}
	window.Rectangle = Rectangle;
	window.Line = Line;
})();
