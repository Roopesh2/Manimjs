class NumberLine {
	constructor(config = {}){
		var strt = floor(Manimation.x_min);
		var end = ceil(Manimation.x_max);
		this.orientation        = getDefined(config.orientation, "horizontal");
		if (this.orientation == "vertical") {
			strt = floor(Manimation.y_min);
			end = ceil(Manimation.y_max);
		}
		this.start                = getDefined(config.start, strt);
		this.end                  = getDefined(config.end, end);
		this.origin               = getDefined(config.origin, Manimation.origin);
		this.exclude_zero         = getDefined(config.exclude_zero, false);
		this.include_tip          = getDefined(config.include_tip, true);
		this.background_color     = config.background_color || "transparent";
		this.axis_color           = config.axis_color || GREY;
		this.axis_width           = config.axis_width || 0.06;
		this.tick_width           = config.tick_width || 0.25;
		this.tick_frequency       = config.tick_frequency || 1;
		this.labeled_nums         = config.labeled_nums || null;
		this.labeled_nums_color   = config.labeled_nums_color || WHITE;
		this.canvas               = getCanvas();
		this.exclude_tick_at_zero = getDefined(config.exclude_tick_at_zero, false);
		this.rounding = getDefined(config.rounding, 0);
	}

	add (init = true) {
		var ctx;
		if (init) {
			initCanvas(this);
		}
		ctx = this.canvas.getContext("2d");
		var x_product = 1, y_product = 0;
		if (this.orientation == "vertical") {
			x_product = 0;
			y_product = 1;
		}

		ctx.strokeStyle = this.axis_color;
		ctx.lineWidth = this.axis_width;
		
		// drawing axis
		line(ctx,
			this.start * x_product, this.start * y_product,
			this.end * x_product, this.end * y_product
		);
		ctx.stroke();
		
		var start = floor(this.start);
		var end = floor(this.end);
		var padding = 0;
		if (this.include_tip) {
			start++;
			end--;
		}
		//drawing ticks
		for (var path = start; path <= end; path++) {
			if (path == 0 && this.exclude_tick_at_zero) continue;
			if (this.orientation == "horizontal"){
				line (ctx, 
					path, -this.tick_width / 2,
					path, +this.tick_width / 2,
				);
			} else {
				line (ctx, 
					-this.tick_width / 2, path,
					+this.tick_width / 2, path
				);
			}
			ctx.stroke();
		}

		// labels
		if ((this.labeled_nums || [])[0] != undefined){
			var padding = 0;
			if (this.include_tip) {
				padding++;
			}
			var scaleX = Manimation.globalScaleRatio[0];
			var scaleY = Manimation.globalScaleRatio[1];
			ctx.save();
			ctx.scale(1/scaleX, 1/scaleY)
			ctx.fillStyle = this.labeled_nums_color;
			ctx.font = "22px serif";
			var tf = this.tick_frequency;
			for (var path = start; path <= end; path += tf) {
				var index = path - start + padding;
				if (path == 0 && this.exclude_zero) continue;
				var num = (this.labeled_nums[index] == undefined ? "" : this.labeled_nums[index]).toFixed(this.rounding);
				var width = ctx.measureText(num).width;
				console.log(num);
				ctx.fillText(num, path * scaleX - width / 2, 32);
			}
			ctx.restore();
		}

		// tip
		if (this.include_tip) {
			// start tip
			var sx = this.start - this.tick_width / 4;
			var sy = this.end + this.tick_width / 4;
			pointer(ctx,
				sx * x_product, sx * y_product,
				Math.PI + Math.PI / 2 * y_product,
				this.tick_width / 1.5,
				GREY
				);
				
			// end tip
			pointer(ctx,
				sy * x_product, sy * y_product,
				Math.PI / 2 * y_product,
				this.tick_width / 1.5,
				GREY
			);
		}
	}
}

class Graph{
	/**
	 * Create a graph
	 * @param {Object} [config={}] configuration of graph
	 */
	constructor (config = {}) {
		this.x_min                = getDefined(config.x_min, ceil(Manimation.x_min));
		this.x_max                = getDefined(config.x_max, floor(Manimation.x_max));
		this.y_min                = getDefined(config.y_min, ceil(Manimation.y_min));
		this.y_max                = getDefined(config.y_max, floor(Manimation.y_max));
		this.x_tick_frequency     = getDefined(config.x_tick_frequency, 1);
		this.y_tick_frequency     = getDefined(config.y_tick_frequency, 1);
		this.x_labeled_nums_color = getDefined(config.x_labeled_nums_color, WHITE);
		this.y_labeled_nums_color = getDefined(config.y_labeled_nums_color, WHITE);
		this.y_axis_label         = getDefined(config.y_axis_label, "y");
		this.x_axis_label         = getDefined(config.x_axis_label, "x");
		this.axis_color           = getDefined(config.axis_color, GREY);
		this.grid_color           = getDefined(config.grid_color, BLUE_E);
		this.sub_grid_color       = getDefined(config.sub_grid_color, DARK_GRAY + "aa");
		this.axis_label_num_color = getDefined(config.axis_label_num_color, WHITE),
		this.x_tick_line          = getDefined(config.x_tick_line, true);
		this.y_tick_line          = getDefined(config.y_tick_line, true);
		this.x_labeled_nums       = getDefined(config.x_labeled_nums, null);
		this.y_labeled_nums       = getDefined(config.y_labeled_nums, null);
		this.axis_width           = getDefined(config.axis_width, 0.06);
		this.grid_line_width      = getDefined(config.grid_line_width, 0.02);
		this.sub_grid_line_width  = getDefined(config.sub_grid_line_width, 0.01);
		this.origin               = getDefined(config.origin, Manimation.origin);
		this.exclude_zero         = getDefined(config.exclude_zero, true);
		this.include_tip          = getDefined(config.include_tip, false);
		this.include_grid         = getDefined(config.include_grid, false);
		this.include_sub_grid     = getDefined(config.include_sub_grid, false);
		this.tick_width           = getDefined(config.tick_width, 0.2);
		this.x_rounding           = getDefined(config.x_rounding, 0);
		this.y_rounding           = getDefined(config.y_rounding, 0);
		this.background_color     = getDefined(config.background_color, BLACK),
		this.canvas               = getCanvas();
		this.x_axis = new NumberLine({
			start: this.x_min,
			end: this.x_max,
			axis_color: this.axis_color,
			include_tip: this.include_tip,
			exclude_zero: this.exclude_zero,
			rounding: this.x_rounding,
			origin: this.origin,
			tick_frequency: this.x_tick_frequency,
			labeled_nums: this.x_labeled_nums,
			labeled_nums_color: this.x_labeled_nums_color,
			axis_width: this.axis_width,
			exclude_tick_at_zero: true
		});
		this.y_axis = new NumberLine({
			orientation: "vertical",
			start: this.y_min,
			end: this.y_max,
			axis_color: this.axis_color,
			include_tip: this.include_tip,
			exclude_zero: this.exclude_zero,
			rounding: this.y_rounding,
			origin: this.origin,
			tick_frequency: this.y_tick_frequency,
			labeled_nums: this.y_labeled_nums,
			labeled_nums_color: this.y_labeled_nums_color,
			axis_width: this.axis_width,
			exclude_tick_at_zero: true
		});
		
		this.x_axis.canvas = this.canvas;
		this.y_axis.canvas = this.canvas;
	}
	
	/**
	 * Adds graph to Manimation container
	 * @param {boolean} [init=true] intialize canvas or not initialisation scales 
	 *                              canvas to Manimation.globalScaleRatio
	 */
	add (init = true) {
		//initialise canvas
		if (init){
			initCanvas(this);
		}
		this.x_axis.add(false);
		this.y_axis.add(false);
		var ctx = this.canvas.getContext("2d"),
			x_min = this.x_min,
			x_max = this.x_max,
			y_min = this.y_min,
			y_max = this.y_max,
			xtf   = this.x_tick_frequency,
			ytf   = this.y_tick_frequency;

		
		// grids
		if (this.include_grid) {
			ctx.beginPath();
			ctx.strokeStyle = this.grid_color;
			ctx.lineWidth   = this.grid_line_width;

			//x grid line
			for (var start = x_min; start <= x_max; start += xtf) {
				line(ctx,
					start, y_max,
					start, y_min
				);
				ctx.stroke();
			}
			
			//y grid line
			for (var start = y_min; start <= y_max; start += ytf) {
				line(ctx,
					x_min, start,
					x_max, start
				);
				ctx.stroke();
			}
			ctx.closePath();
		}

		// sub grid
		if (this.include_sub_grid) {
			ctx.beginPath();
			ctx.strokeStyle = this.sub_grid_color;
			ctx.lineWidth = this.sub_grid_width_line_width;
			var x_begin = x_min + xtf / 2;
			var x_end = x_max - xtf / 2;
			var y_begin = y_min + ytf / 2;
			var y_end = y_max - ytf / 2;
			for (var start = x_begin; start <= x_end; start += xtf) {
				line(ctx,
					start, y_max,
					start, y_min
				);
				ctx.stroke();
			}

			for (var start = y_begin; start <= y_end; start += ytf) {
				line(ctx,
					x_min, start,
					x_max, start
				);
				ctx.stroke();
			}
			ctx.closePath();
		}

		// x_ tick lines
		// if (this.x_tick_line) {
		// 	ctx.beginPath();
		// 	ctx.strokeStyle = this.axis_color;
		// 	ctx.lineWidth = this.axis_width;
		// 	ctx.fillStyle = "#fff"
		// 	var p_start = this.include_tip ? x_min + 1 : x_min;
		// 	var p_end   = this.include_tip ? x_max - 1 : x_max;
		// 	var center = this.y_tick_line ? xtf : 0;
		// 	for (var path = center; path <= p_end; path += xtf) {
		// 		line(ctx,
		// 			path, -this.tick_width / 2,
		// 			path, this.tick_width / 2
		// 		);
		// 		ctx.stroke();
		// 	}

		// 	for (var path = -center; path >= p_start; path -= xtf) {
		// 		line(ctx,
		// 			path, -this.tick_width / 2,
		// 			path, this.tick_width / 2
		// 		);
		// 		ctx.stroke();
		// 	}
		// }
		
		// if (this.y_tick_line) {
		// 	var p_start = this.include_tip ? y_min + 1 : y_min;
		// 	var p_end = this.include_tip ? y_max - 1 : y_max;
		// 	for (var path = ytf; path <= p_end; path += ytf) {
		// 		line(ctx,
		// 			-this.tick_width / 2, path,
		// 			this.tick_width / 2, path
		// 		);
		// 		ctx.stroke();
		// 	}
		// 	for (var path = -ytf; path >= p_start; path -= ytf) {
		// 		line(ctx,
		// 			-this.tick_width / 2, path,
		// 			this.tick_width / 2, path
		// 		);
		// 		ctx.stroke();
		// 	}
		// 	ctx.closePath();
		// }

		// // lables numbers x

		// if ((this.x_labeled_nums || [])[0] != undefined){
		// 	var p_start = Math.floor(this.include_tip ? x_min + 1 : x_min);
		// 	var p_end = Math.floor((this.include_tip || this.x_axis_label != "") ? x_max - 1 : x_max);
		// 	var scaleX = Manimation.globalScaleRatio[0];
		// 	var scaleY = Manimation.globalScaleRatio[1];
		// 	ctx.save();
		// 	ctx.scale(1/scaleX, 1/scaleY)
		// 	ctx.fillStyle = this.x_labeled_nums_color;
		// 	ctx.font = "22px serif";
		// 	for (var path = p_start; path <= p_end; path += xtf) {
		// 		var index = path -p_start;
		// 		var num = (this.x_labeled_nums[index] == undefined ? "" : this.x_labeled_nums[index]).toFixed(this.x_rounding);
		// 		var width = ctx.measureText(num).width;
		// 		if (path == 0){
		// 			p_end++
		// 			if (!this.exclude_zero) {
		// 				ctx.fillText(num, 5, 22)
		// 			}
		// 		} else {
		// 			console.log(num);
		// 			if (path != 0) {
		// 				ctx.fillText(num, path * scaleX - width / 2, 32)
		// 			}
		// 		}
		// 	}
		// 	ctx.restore();
		// }

		// if ((this.y_labeled_nums || [])[0] != undefined){
		// 	var p_start = this.include_tip ? y_min + 1 : y_min;
		// 	var p_end = (this.include_tip || this.y_axis_label != "") ? y_max - 1 : y_max;
		// 	var padding = 0;
		// 	var scaleX = Manimation.globalScaleRatio[0];
		// 	var scaleY = Manimation.globalScaleRatio[1];
		// 	ctx.save();
		// 	ctx.scale(1/scaleX, 1/scaleY)
		// 	ctx.fillStyle = this.y_labeled_nums_color;
		// 	ctx.font = "22px serif";
		// 	for (var path = p_start; path <= p_end; path += ytf) {
		// 		var index = path + -p_start;
		// 		var num = (this.y_labeled_nums[index] == undefined ? "" : this.y_labeled_nums[index]).toFixed(this.y_rounding);
		// 		var width = ctx.measureText(num).width;
		// 		if (path == 0){
		// 			p_end++
		// 			if (!this.exclude_zero && this.x_labeled_nums[0] == undefined) {
		// 				ctx.fillText(num, 5, 22)
		// 			}
		// 		}
		// 		if (path != 0) {
		// 			ctx.fillText(num, -width - this.tick_width * scaleX, -path * scaleY + 5)
		// 		}
		// 	}
		// 	ctx.restore();
		// }

		// //axis
		// ctx.beginPath();
		// ctx.strokeStyle = this.axis_color;
		// ctx.lineWidth = this.axis_width;
		// line(ctx,
		// 	0, y_max,
		// 	0, y_min
		// );

		// ctx.stroke();
		// line(ctx,
		// 	x_min, 0,
		// 	x_max, 0
		// );

		// ctx.stroke();
		// ctx.closePath();



		// //tip
		// if (this.include_tip) {

		// 	// top tip
		// 	pointer(ctx,
		// 		0, -y_max - this.tick_width / 3, // (x, y)
		// 		-Math.PI / 2, // rotation
		// 		this.tick_width / 1.5, // width
		// 		GREY // color
		// 	);

		// 	// bottom tip
		// 	pointer(ctx,
		// 		0, -y_min + this.tick_width / 3,
		// 		Math.PI / 2,
		// 		this.tick_width / 1.5,
		// 		GREY
		// 	);

		// 	// left tip
		// 	pointer(ctx,
		// 		x_min - this.tick_width / 3, 0,
		// 		Math.PI,
		// 		this.tick_width / 1.5,
		// 		GREY
		// 	);

		// 	// right tip
		// 	pointer(ctx,
		// 		x_max + this.tick_width / 3, 0,
		// 		0,
		// 		this.tick_width / 1.5,
		// 		GREY
		// 	);
		// }
		window.ctx = ctx;
		if (this.x_axis_label != "") {
			// ctx.font = ctx.font = "italic normal 35px serif";
			// var text_height = parseInt(40 / 1.5);
			// ctx.fillStyle = WHITE;
			// ctx.fillText(this.x_axis_label, text_height, -y_max)
			// ctx.fillText(this.y_axis_label, x_max, text_height * 1.5)
			var img = new Image();
			texToImg("log(x^3)").then(response => response.text())
			.then(function(xml) {
				var svg = xml;
				window.svg = svg;
				var div = document.createElement("div");
				div.innerHTML = svg;
				var svgNode = div.getElementsByTagName("svg")[0];
				// debugger
				var g = svgNode.getElementsByTagName("defs")[0];
				g.setAttribute("fill","#fff");
				g.setAttribute("transform","scale(2)");

				var src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgNode.outerHTML)));
				img.src = src;
				img.setAttribute("SameSite", "none")
				img.setAttribute('crossOrigin', '');
				ctx.drawImage(img, -100, -200);
				window.img = img;
			});
			// var c = document.createElement("canvas").getContext("2d");
			// c.drawImage(img, 0, 0);
			// var dat = c.getImageData(0, 0, 100, 100)
		}
	}
}