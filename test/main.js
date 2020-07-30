var container = document.querySelector(".container");
Manimation.setContainer(container);
Manimation.setSize({
	width: SMALL.width * 1.1,
	height: SMALL.height * 1.1
});
Manimation.setRatio([16 / 1.2, 9 / 1.2]);
var left  = -floor(16 / 1.2 / 2);
var right  = floor(16 / 1.2 / 2);
var topp    = floor(9 / 1.2 / 2);
var bottom = -floor(9 / 1.2 / 2);
var g = new Graph({
	include_tip: true,
	x_min : left,
	y_min : bottom,
	x_max : right,
	y_max : topp,
	x_labeled_nums: range(left, right),
	y_labeled_nums: range(bottom, topp)
});
// g = new NumberLine({
// 	orientation: "vertical",
// 			start: bottom,
// 			end: topp,
// 			// include_tip: true,
// 			// exclude_zero: true,
// 			// labeled_nums: this.y_labeled_nums,
// 			// labeled_nums_color: this.y_labeled_nums_color,
// 			axis_width: 0.02,
// 			exclude_tick_at_zero: true
// })
// debugger
g.add();