//---------------------------Canvas----------------------------

function getCanvas() {
	var canvas = document.createElement("canvas");
	var styles = getComputedStyle(Manim.container);
	canvas.style.width = parseInt(styles.width) + "px";
	canvas.style.height = parseInt(styles.height) + "px";
	canvas.width = parseInt(styles.width) * (window.devicePixelRatio || 1);
	canvas.height = parseInt(styles.height) * (window.devicePixelRatio || 1);
	return canvas;
}

function getSVGCanvas() {
	var canvas = document.createElement("svg");
	var styles = getComputedStyle(Manim.container);
	canvas.style.width = styles.width;
	canvas.style.height = styles.height;
	return canvas;
}

function initSVGCanvas() {

}

function initCanvas(th) {
	var ctx = th.canvas.getContext("2d");
	Manim.container.appendChild(th.canvas);
	th.canvas.style.position = "absolute";
	var cs = getComputedStyle(Manim.container);
	var scaleX = parseFloat(cs.width) * window.devicePixelRatio / FRAME_WIDTH,
		scaleY = parseFloat(cs.height) * window.devicePixelRatio / FRAME_HEIGHT;
	ctx.scale(scaleX, scaleY);
	ctx.translate(
		FRAME_WIDTH / 2,
		FRAME_HEIGHT / 2
	);
	// draws background
	if (th.background == NONE_C) {
		ctx.clearRect(
			-FRAME_WIDTH / 2,
			-FRAME_HEIGHT / 2,
			FRAME_WIDTH,
			FRAME_HEIGHT
		);
	} else {
		ctx.beginPath();
		ctx.fillStyle = th.background;
		ctx.fillRect(
			-FRAME_WIDTH / 2,
			-FRAME_HEIGHT / 2,
			FRAME_WIDTH,
			FRAME_HEIGHT
		);
	}
}

// ------------------------ useful functions----------------------------
function line(ctx, x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, -y1);
	ctx.lineTo(x2, -y2);
}

function pointer(ctx, x1, y1, angle, size = DEFAULT_TIP_SIZE, fill = WHITE, stroke = NONE_C, ld = []) {
	ctx.beginPath();
	ctx.save();
	angle *= -1;
	ctx.fillStyle = fill;
	ctx.strokeStyle = stroke;
	ctx.setLineDash(ld);
	ctx.moveTo(
		size * Math.cos(angle) + x1,
		size * Math.sin(angle) + y1
	);
	var i = 2;
	while (i > 0) {
		angle += (1.0 / 3.0) * TAU;
		ctx.lineTo(
			size * Math.cos(angle) + x1,
			size * Math.sin(angle) + y1
		);
		i--;
	}
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

//----------------------------------------------------------------------------------

//------------------------------Objects-functions-----------------------------------

/**
 * Returns the defined value
 * @param {*} value
 * @param {*} [defaultValue=""]
 * @return {*} value if it is defined else defaultValue
 */
function getDefined(value, defaultValue = "") {
	if (value == undefined) {
		return defaultValue;
	} else {
		return value;
	}
}

function deepAssign(old, _new) {
	for (var key of Object.keys(old)) {
		if (_new[key] != undefined || _new[key] != null) {
			if (Object.prototype.toString.call(_new[key]) === '[object Object]') {
				old[key] = deepAssign(old[key], _new[key]);
			} else {
				old[key] = _new[key];
			}
		}
	}

	for (var key of Object.keys(_new)) {
		if (old[key] === undefined || old[key] === null)
			old[key] = _new[key];
	}
	return old;
}

function attachConfigTo(_class) {
	for (var key of Object.keys(_class.CONFIG)) {
		_class[key] = _class.CONFIG[key];
	}
}

function deepAssignAndAttachAttributes(toAssign, old, _new) {
	var da = deepAssign(old, _new);
	attachConfigTo(toAssign, da);
}

//----------------------------------------------------------------------------------

//--------------------------------------Math-functions------------------------------

function dist(p1, p2) {
	if (typeof p1 == "number") {
		p1 = [p1];
	}
	p2 = p2 || new Array(p1.length).fill(0);
	var r = 0;
	for (var i = 0; i < p1.length; i++) {
		r += (p1[i] - p2[i]) ** 2
	}
	return Math.sqrt(r);
}

function map(n, start1, stop1, start2, stop2) {
	return newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

function random(start = 1, end) {
	if (end == undefined) {
		end = start;
		start = 0;
	}
	return Math.random() * (end - start) + start;
}

function randInt(start, end) {
	return Math.round(Math.random(start, end));
}

function interpolate(alpha, start = 0, end = 1) {
	var res;
	if (start instanceof Array) {
		res = [];
		for (var i = 0; i < start.length; i++) {
			var a = start[i];
			var b = end[i];
			res.push((1 - alpha) * a + alpha * b);
		}
		return res;
	} else {
		return (1 - alpha) * start + alpha * end;
	}
}

/**
 * rotate a vector by a given angle
 * @param {[Number]} vector array representing the vector
 * @param {number} angle
 * @return {array} rotated vector
 */
function rotateVector(vector, angle) {
	vector[0] *= cos(angle);
	vector[1] *= sin(angle);
	return vector;
}

/**
 * Return array of numbers from a to b with difference dx
 * @param {number} a
 * @param {number} b
 * @param {number} [dx=1]
 * @return {array} array of numbers
 * TODO: 
 * -Add suppor for negative values for dx
 */
function range(a, b, dx = 1) {
	var arr = [];
	for (; a <= b; a += dx) {
		arr.push(a);
	}
	return arr;
}

/**
 * Returns vertices of regular polygon of a given length rotated at an given angle
 * positioned at a given point
 * @param {number} [sides=3] number of sides
 * @param {array} [position=[0, 0]] position of polygon
 * @param {number} [sideLength=1] length of a side
 * @param {number} [angle=0] angle of rotation
 * @return {array} array of vertices of regular polygon
 */
function compassDirections(sides = 3, position = [0, 0], sideLength = 1, angle = 0) {
	var outerAngle = TAU / sides;
	var vertices = [];
	for (var s = 0; s < sides; s++) {
		var v = rotateVector([sideLength, sideLength], s * outerAngle + angle);
		vertices.push([
			position[0] + v[0],
			position[1] + v[1]
		]);
	}
	return vertices;
}

function sigmoid(x) {
	return 1.0 / (1 + Math.exp(-x));
}

function limit(x, mi = 0, ma = 1) {
	return Math.min(Math.max(x, mi), ma);
}

function midPoint(p1, p2) {
	if (p1 instanceof Array && p2 instanceof Array) {
		return [
			(p1[0] + p2[0]) / 2,
			(p1[1] + p2[1]) / 2
		]
	}

	return ORIGIN;
}

function getNorm(vec) {
	return (vec[0] ** 2 + vec[1] ** 2) ** 0.5;
}

//----------------------------------------------------------------------------------

//---------------------------rate-functions-----------------------------------------

function linear(t) {
	return t;
}

function smooth(t, inflection = 10.0) {
	var error = sigmoid(-inflection / 2);
	return limit(
		(sigmoid(inflection * (t - 0.5)) - error) / (1 - 2 * error),
		0, 1,
	);
}

function rushInto(t, inflection = 10.0) {
	return 2 * smooth(t / 2.0, inflection);
}

function rushFrom(t, inflection = 10.0) {
	return 2 * smooth(t / 2.0 + 0.5, inflection) - 1;
}

function slowInto(t) {
	return Math.sqrt(1 - (1 - t) * (1 - t));
}

function doubleSmooth(t) {
	if (t < 0.5)
		return 0.5 * smooth(2 * t);
	else
		return 0.5 * (1 + smooth(2 * t - 1));
}

function thereAndBack(t, inflection = 10.0) {
	var newT = t < 0.5 ? 2 * t : 2 * (1 - t);
	return smooth(newT, inflection);
}

function thereAndBackWithPause(t, pauseRatio = 1.0 / 3) {
	var a = 1.0 / pauseRatio
	if (t < 0.5 - pauseRatio / 2)
		return smooth(a * t);
	else if (t < 0.5 + pauseRatio / 2)
		return 1;
	else
		return smooth(a - a * t);
}

function runningStart(t, pullFactor = -0.5) {
	return bezier([0, 0, pullFactor, pullFactor, 1, 1, 1])(t);
}

function notQuiteThere(func = smooth, proportion = 0.7) {
	function result(t) {
		return proportion * func(t);
	}
	return result;
}

function wiggle(t, wiggles = 2) {
	return thereAndBack(t) * sin(wiggles * PI * t);
}

function squishRateFunc(func, a = 0.4, b = 0.6) {
	function result(t) {
		if (a == b) {
			return a;
		}

		if (t < a) {
			return func(0);
		} else if (t > b) {
			return func(1);
		} else {
			return func((t - a) / (b - a));
		}
	}
	return result;
}

function lingering(t) {
	return squishRateFunc(function (t) { return t }, 0, 0.8)(t);
}

function exponentialDecay(t, halfLife = 0.1) {
	return 1 - exp(-t / halfLife);
}

//----------------------------------------------------------------------------------

//-------------------------------others---------------------------------------------
// python assert function implementation
function assert(bool) {
	if (!bool) {
		throw new Error("Assertion Error");
	}
}

//----------------------------------------------------------------------------------