var container = document.querySelector(".container");
Manim.setContainer(container);
Manim.setSize(EXTRA_SMALL);
var xMin = -FRAME_WIDTH / 2,
	xMax = FRAME_WIDTH / 2,
	yMin = -FRAME_HEIGHT / 2,
	yMax = FRAME_HEIGHT / 2;

var yAxis = new Line({
	start : [0, yMin],
	end : [0, yMax],
});

var xAxis = new Line({
	start : [xMin, 0],
	end : [xMax, 0],
});

Manim.add(xAxis, yAxis);

var left = new Elbow({
	angle: Math.PI / 4 + Math.PI,
	stroke: BLUE_E,
	strokeWidth: 0.06,
	position : [2, 0]
});
var right = new Elbow({
	angle: Math.PI / 4,
	stroke: BLUE_E,
	strokeWidth: 0.06,
	position : [-2, 0]
});
tot = 0;
var t = window.performance.now();
left.add();
right.add();
tot += window.performance.now() - t;
console.log(tot / 2);
