var container = document.querySelector(".container");
Manimation.setContainer(container);
Manimation.setSize({
	width: SMALL.width * 1.1,
	height: SMALL.height * 1.1
});
Manimation.setRatio([16 / 1.5, 9 / 1.5]);
// Manimation.origin = [-3,-1]
var left   = -floor(16 / 1.2 / 2);
var right  = floor(16 / 1.2 / 2);
var topp   = floor(9 / 1.2 / 2);
var bottom = -floor(9 / 1.2 / 2);
var g = new Graph({
	x_min : left * 3,
	y_min : bottom * 3,
	x_max : right * 3,
	y_max : topp * 3,
	include_grid: 1,
	grid_color: GREY + "55",
});
var r = PI / 3;
g.rotate(r);
g.add();
for (var i = PI / (10 * 1); i <= PI * 2; i+= PI / (10 * 1)) {
	var lines = new Arrow({
		x2: cos(i),
		y2: sin(i),
		stroke_width: 0.02,
		auto_scale_head: true
	});
	lines.add();
}