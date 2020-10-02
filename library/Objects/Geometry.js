class TipableMobject extends Mobject {
	constructor (cfg = {}) {
		super(cfg);
		this.tips = [];
	}
	
	addTip (cfg = {}) {
		this.tips.push({
			pos: cfg.pos || ORIGIN,
			angle: cfg.angle || 0,
			fill: cfg.fill || WHITE,
			stroke: cfg.stroke || NONE_C,
			size: getDefined(cfg.size, 0.2),
			atStart : cfg.atStart		
		});
		return this;
	}
	
	drawTips () {
		var ctx = this.ctx;
		for (var tip of this.tips) {
			pointer(ctx,
				tip.pos[0], -tip.pos[1],
				tip.angle,
				tip.size,
				tip.fill,
				tip.stroke
			);
		}
	}

	popTip () {
		return this.tips.pop()
	}

	hasEndTip () {
		return this.getEndTip() != undefined;
	}
	
	hasStartTip () {
		return this.getStartTip() != undefined;
	}

	getStartTip () {
		for (var tip of this.tips) {
			if (tip.atStart) return tip;
		}
	}

	getEndTip () {
		for (var tip of this.tips) {
			if (!tip.atStart) return tip;
		}
	}

	hasTip () {
		return this.tips.length > 0;
	}
}
class Polygon extends Mobject {
	constructor (cfg = {}) {
		cfg.cornerRadius = getDefined(cfg.cornerRadius, 0);
		super(cfg);
	}
	
	add (init = true) {
		var ctx = this.ctx,
			points = this.getVertices(),
			radius = this.cornerRadius;
		ctx.beginPath();
		this.setDrawStyles();
		if (radius < 10e-6 && radius > -10e-6){
			ctx.moveTo(points[0][0], -points[0][1]);
			for (var p of points) {
				ctx.lineTo(p[0], -p[1]);
			}
			ctx.lineTo(points[0][0], -points[0][1]);
		} else {
			// thanks to this answer: https://stackoverflow.com/a/28070887
			// the following is a modified version
			//compute the middle of the first line as start-stop-point:
			var deltaY = (points[1][1] - points[0][1]),
			deltaX = (points[1][0] - points[0][0]),
			// xPerY = deltaY / deltaX,
			startX = points[0][0] + deltaX / 2,
			startY = points[0][1] + deltaY / 2,
			x1, y1, x2, y2;

			//walk around using arcTo:
			ctx.moveTo(startX, -startY);
			x2 = points[1][0];
			y2 = points[1][1];
			for (var i = 2; i < points.length; i++) {
				x1 = x2;
				y1 = y2;
				x2 = points[i][0];
				y2 = points[i][1];
				ctx.arcTo(x1, -y1, x2, -y2, radius);
			}

			//finally, close the path:
			ctx.arcTo(x2, -y2, points[0][0], -points[0][1], radius);
			ctx.arcTo(points[0][0], -points[0][1], startX, -startY, radius);
			ctx.lineTo(startX, -startY);
		}
		ctx.fill();
		ctx.stroke();
	}
}
class Rectangle extends Polygon {
	constructor(cfg = {}) {
		cfg.width = getDefined(cfg.width, 2);
		cfg.height = getDefined(cfg.height, 1);
		super(cfg);
	}

	getVertices () {
		return [
			[
				this.position[0] - this.width / 2,
				this.position[1] + this.height / 2
			],
			[
				this.position[0] + this.width / 2,
				this.position[1] + this.height / 2
			],
			[
				this.position[0] + this.width / 2,
				this.position[1] - this.height / 2
			],
			[
				this.position[0] - this.width / 2,
				this.position[1] - this.height / 2
			],
		];
	}
}
class Square extends Rectangle {
	constructor (cfg = {}) {
		cfg.width = cfg.height = getDefined(cfg.length, 1);
		super(cfg);
	}
}
class Line extends TipableMobject {
	constructor (cfg = {}) {
		super(cfg);
		this.updateConfig({
			"start" : [0, 1],
			"end"   : [1, 1],
		}, cfg);
	}

	getVertices () {
		return [this.start, this.end];
	}

	add (init = true) {
		var ctx = this.ctx
		ctx.beginPath();
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth   = this.strokeWidth;
		ctx.setLineDash(this.lineDash);
		ctx.moveTo(this.start[0], -this.start[1]);
		ctx.lineTo(this.end[0], -this.end[1]);
		ctx.stroke();
		if (this.tips.length > 0) this.drawTips();
	}
	
	addTip (cfg = {}) {
		if (cfg.atStart) {
			super.addTip({
				pos    : this.start,
				atStart: true,
				angle  : this.getSlope() + Math.PI,
				fill   : cfg.fill,
				stroke : cfg.stroke,
				size   : getDefined(cfg.size, DEFAULT_TIP_SIZE)
			});
		} else {
			super.addTip({
				pos    : this.end,
				atStart: false,
				angle  : this.getSlope(),
				fill   : cfg.fill,
				stroke : cfg.stroke,
				size   : getDefined(cfg.size, DEFAULT_TIP_SIZE)
			});
		}
		return this;
	}

	getSlope() {
		return Math.atan2(
			this.end[1] - this.start[1],
			this.end[0] - this.start[0],
		);
	}

	setStart (point) {
		var p = [0 ,0];
		if (point instanceof Array) {
			p = point;
		} else if (point instanceof Arc) {
			p = point.getCenter();
		}
		this.start = p;
		return this;
	}
	
	setEnd (point) {
		var p = [0 ,0];
		if (point instanceof Array) {
			p = point;
		} else if (point instanceof Arc) {
			p = point.getCenter();
		}
		this.end = p;
		return this;
	}

	scale (x = 1, y = x) {
		super.scale(x, y);
		var oldTip = this.tips;
		if (this.hasTips) {

		}
		return this;
	}
}
class Arrow extends Line {
	constructor (cfg = {}) {
		super(cfg);
		this.updateConfig({
			"size"          : DEFAULT_TIP_SIZE,
			"arrowFill"     : WHITE,
			"arrowStroke"   : NONE_C,
			"scaleHeadToLen": true,
			"maxHeadSize"   : MAX_HEAD_SIZE
		}, cfg);
		this.scaleHead();
		this.addTip({
			size  : this.size,
			fill  : this.arrowFill,
			stroke: this.arrowStroke
		});
	}
	scaleHead() {
		if (this.scaleHeadToLen) {
			var d = dist([
				this.end[0] - this.start[0],
				this.end[1] - this.start[1],
			]);
			this.size = Math.min(d ** 0.5 / 5,  this.maxHeadSize);
			return this;
		}
	}
}
class DoubleArrow extends Arrow {
	constructor (cfg = {}) {
		super(cfg);
		this.addTip({
			atStart: true,
			size   : this.size,
			fill   : this.arrowFill,
			stroke : this.arrowStroke
		});
	}
}
class Arc extends TipableMobject {
	constructor (cfg = {}) {
		if (typeof cfg.radius == "number") cfg.rx = cfg.ry = cfg.radius;
		super(deepAssign({
			"startAngle": 0,
			"angle"     : -Math.PI / 2,
			"strokeWidth": 0.04,
			"rx": 1,
			"ry": 1
		}, cfg));
		if (this.angle < 0) {
			this.CONFIG.startAngle = this.angle + this.startAngle;
		}
		this.updateConfig();
	}
	
	add () {
		var ctx = this.ctx;
		ctx.beginPath();
		this.setDrawStyles();
		ctx.ellipse(
			this.position[0], -this.position[1],
			this.rx, this.ry,
			this.startAngle, 0, -this.angle
		);
		ctx.fill();
		ctx.stroke();
		this.drawTips();
	}

	rotate (angle = 0) {
		this.startAngle += angle;
		this.angle += angle;
		return this;
	}

	scale (x, y = x) {
		this.rx *= x;
		this.ry *= y;
		return this;
	}

	shift (p) {
		this.position = p;
		return this;
	}
}
class Ellipse extends Arc {
	constructor (cfg = {}) {
		super(cfg);
		this.updateConfig({
			"rx"      : 1.5,
			"ry"      : 1,
			"angle": TAU,
		}, cfg)
	}
}
class Circle extends Arc {
	constructor (cfg = {}) {
		cfg.angle = TAU;
		super(cfg);
	}
}

class Dot extends Arc {
	constructor (cfg = {}) {
		super(deepAssign({
			"angle" : TAU,
			"radius": DEFAULT_DOT_RADIUS,
			"fill"  : WHITE,
			"stroke": NONE_C,
		}, cfg));
	}
}
class SmallDot extends Dot {
	constructor (cfg = {}) {
		cfg.radius = getDefined(cfg.radius, DEFAULT_SMALL_DOT_RADIUS);
		super(cfg);
	}
}
class Annulus extends Mobject {
	constructor (cfg = {}) {
		super(cfg);
		this.updateConfig({
			"startAngle" : 0,
			"angle"      : TAU,
			"innerRadius": 1,
			"outerRadius": 2,
			"stroke"     : WHITE
		}, cfg);
		if (this.angle >= 0) {
			this.CONFIG.endAngle = this.startAngle + this.angle;
		} else {
			this.CONFIG.endAngle = this.startAngle;
			this.CONFIG.startAngle = this.angle + this.startAngle;
		}
		this.updateConfig();
	}

	add (init = true) {
		var ctx = this.__ic__(init);
		ctx.beginPath();
		this.setDrawStyles();
		var lw = (this.outerRadius - this.innerRadius);
		ctx.lineWidth = lw;
		ctx.arc(
			this.position[0], -this.position[1],
			this.outerRadius - lw / 2,
			this.startAngle, this.endAngle
		);
		ctx.stroke();
	}
}
class Sector extends Mobject {
	constructor (cfg) {
		super(cfg);
		this.updateConfig({
			"angle"     : -Math.PI / 2,
			"startAngle": 0,
			"radius"    : 1,
			"stroke"    : NONE_C,
			"fill"      : WHITE
		}, cfg);
		if (this.angle >= 0) {
			this.CONFIG.endAngle = this.startAngle + this.angle;
		} else {
			this.CONFIG.endAngle = this.startAngle;
			this.CONFIG.startAngle = this.angle + this.startAngle;
		}
		this.updateConfig();
	}

	add (init) {
		var ctx = this.__ic__(init);
		ctx.beginPath();
		this.setDrawStyles();
		ctx.moveTo(this.position[0], -this.position[1]);
		ctx.arc(
			this.position[0], -this.position[1],
			this.radius,
			this.startAngle, this.endAngle
		);
		ctx.stroke();
		ctx.fill();
	}
}
class AnnularSector extends Annulus {
	constructor (cfg = {}) {
		super(cfg);
		this.updateConfig({
			"startAngle": -Math.PI / 2,
			"endAngle": 0
		}, cfg);
	}
}
class ArcBetweenPoints extends Arc {

	/**
	 * Creates an Arc passing through two points and with angle or radius
	 * @param {Array} [cfg.start=[1, 1]] first point
	 * @param {Array} [cfg.end=[0, 1]] second point
	 * @param {Integer} [cfg.angle=PI / 2] angle between points
	 * @param {Integer} [cfg.radius] radius from points to centre of arc.
	 *                                  If not specified, it will be calculated by given angle (cfg.angle)
	 */
	constructor (cfg = {}) {
		super(cfg);
		this.start = getDefined(cfg.start, [1, 1]);
		this.end = getDefined(cfg.end, [0, 1]);
		this.angle = getDefined(cfg.angle, Math.PI / 2);

		if (isNaN(cfg.radius)) {
			// calculate radius by angle and points
			var midLen = dist(this.start, this.end) / 2;
			this.radius = midLen / Math.sin(this.angle / 2);
		} else {
			// calculate angle by radius and points
			var radius = cfg.radius;
			var sign = 2;
			if (radius < 0) {
                sign *= -1;
				radius *= -1;
			}
            var halfdist = this.dist(this.start, this.end) / 2;
            if (radius < halfdist) {
				throw Error("ArcBetweenPoints called with a radius smaller than half of the distance between the points.");
			}
            var arc_height = radius - Math.sqrt(radius ** 2 - halfdist ** 2)
			this.angle = Math.acos((radius - arc_height) / radius) * sign;
			this.radius = radius
		}
		this.origin = this.getOrigin();
		this.startAngle = -Math.atan2(
			this.start[1] - this.origin[1],
			this.start[0] - this.origin[0],
		);

		// if radius is negative make it positive!
		if (this.radius < 0) {
			this.radius *= -1;
		}

		// if angle is extremly small radius become infinity and ctx.arc will not execute
		// to avoid this, we set minimum angle to 0.0001rad
		this.angle = Math.max(0.0001, this.angle);
		this.endAngle = this.startAngle + this.angle;

		// if angle is less the arc should flip
		// this is done by swapping endAngle and startAngle
		if(this.angle < 0) {
			var a = this.startAngle;
			this.startAngle = this.endAngle;
			this.endAngle = a;
		}
	}

	scale (x, y=x) {
		this.start[0] *= x;
		this.end[0]   *= x;
		this.start[1] *= y;
		this.end[1]   *= y;
		this.radius   = this.getRadius();
	}

	shift (p) {
		this.origin = p;
		this.start[0] = this.origin[0] * Math.cos(this.startAngle);
		this.end  [0] = this.origin[0] * Math.cos(this.endAngle);
		this.start[1] = this.origin[1] * Math.sin(this.startAngle);
		this.end  [1] = this.origin[1] * Math.sin(this.endAngle);
	}

	getCenter () {
		return [
			(this.start[0] + this.end[0]) / 2,
			(this.start[1] + this.end[1]) / 2
		];
	}

	getOrigin () {
		var d = dist(this.start, this.end);
		var h = Math.sqrt(this.radius**2 - (d**2) / 4);
		var eps = this.angle > Math.PI ? 1: -1;
		var midP = this.getCenter();
		var norm = [
			(this.start[0] - this.end[0]) / d,
			(this.start[1] - this.end[1]) / d,
		];
		return [
			midP[0] - eps * h * norm[0],
			midP[1] + eps * h * norm[1],
		];
	}
}

class DashedLine extends Line {
	constructor (cfg = {}) {
		cfg.lineDash = getDefined(cfg.lineDash, [0.2, 0.2]);
		super(cfg);
	}
}
class Elbow extends TipableMobject {
	constructor (cfg = {}) {
		super(cfg);
		this.updateConfig({
			"strokeWidth": 0.04,
			"width"      : 1,
			"height"     : 1,
			"angle"      : 0,
		}, cfg);
	}

	add () {
		var ctx = this.ctx;
		ctx.beginPath();
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth = this.strokeWidth;
		ctx.moveTo(
			this.height * Math.sin(this.angle) + this.position[0],
			-this.height * Math.cos(this.angle) - this.position[1]
		);
		ctx.lineTo(this.position[0], -this.position[1]);
		ctx.lineTo(
			this.width * Math.cos(this.angle) + this.position[0],
			this.width * Math.sin(this.angle) - this.position[1],
		);
		ctx.stroke();
		this.drawTips();
	}

	addTip (cfg = {}) {
		    cfg.fill   = cfg.fill || WHITE;
		    cfg.stroke = cfg.stroke || NONE_C;
		    cfg.size   = getDefined(cfg.size, 0.2);
		if (cfg.atStart) {
			super.addTip({
				pos   : [
					this.height * Math.sin(this.angle) + this.position[0],
					this.height * Math.cos(this.angle) + this.position[1]
				],
				angle : Math.PI/2 - this.angle,
				fill  : cfg.fill,
				stroke: cfg.stroke,
				size  : cfg.size
			})
		} else {
			super.addTip({
				pos   : [
					this.width * Math.cos(this.angle) + this.position[0],
					-this.width * Math.sin(this.angle) + this.position[1],
				],
				angle : -this.angle,
				fill  : cfg.fill,
				stroke: cfg.stroke,
				size  : cfg.size
			})
		}
	}
}
class RegularPolygon extends Polygon {
	constructor (cfg = {}) {
		super(cfg);
		this.sides      = cfg.sides;
		this.sideLength = cfg.sideLength;
		this.angle      = getDefined(cfg.angle, Math.PI / this.sides / 2);
		this.CONFIG = deepAssign(
			this.CONFIG, {
				sides      : 3,
				sideLength : 0.5,
				vertices   : compassDirections(this.sides, this.origin, this.sideLength, this.angle)
			}
		);
	}
}
class RoundedRectangle extends Rectangle {
	constructor (cfg = {}) {
		cfg.cornerRadius = getDefined(cfg.cornerRadius, 0.3);
		super(cfg);
	}
}
class Triangle extends RegularPolygon {
	constructor (cfg = {}) {
		cfg.sides = 3;
		super(cfg)
	}
}
class ArrowTip extends Triangle {
	constructor (cfg = {}) {
		cfg.sideLength = getDefined(cfg.length, 0.35);
		cfg.angle = getDefined(cfg.angle, 0)
		super(cfg);
	}
}