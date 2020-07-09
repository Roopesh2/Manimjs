class Square {
	x;
	y;
	w;
	h;
	v1;
	v2;
	v3;
	v4;
	constructor (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.v1 = {x : x, y: y};
		this.v2 = {x : x + w, y: y};
		this.v3 = {x : x + w, y: y + h};
		this.v4 = {x : x, y: y + h};
		this.renderingContext = document.createElement("canvas");
		Mavis.container.appendChild(this.renderingContext);
		this.renderingContext.id = Math.round(Math.random() * 1000000000).toString(16);
	}

	shiftTo (x, y) {
		this.x = x;
		this.y = y;
	}

	shiftBy (x, y) {
		this.x += x;
		this.y += y;
	}
	creationMethod (time) { // time in 0-1
		var xy = [];
		if (time >= 0 && 1/4 >= time) {
			xy[0] = map(time, 0, 1/4, this.v1.x, this.v2.x);
			xy[1] = map(time, 0, 1/4, this.v1.y, this.v2.y);
		} else if (time >= 1/4 && 1/2 >= time) {
			xy[0] = map(time, 1/4, 1/2, this.v2.x, this.v3.x);
			xy[1] = map(time, 1/4, 1/2, this.v2.y, this.v3.y);
		} else if (time >= 1/2 && 3/4 >= time) {
			xy[0] = map(time, 1/2, 3/4, this.v3.x, this.v4.x);
			xy[1] = map(time, 1/2, 3/4, this.v3.y, this.v4.y);
		} else if (time >= 3/4 && 1 >= time) {
			xy[0] = map(time, 3/4, 1, this.v4.x, this.v1.x);
			xy[1] = map(time, 3/4, 1, this.v4.y, this.v1.y);
		}
		return xy;
	}
}
