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
			// debugger
		}
		ctx.beginPath();
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
				// debugger
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
			ctx.font = "22px sans";
			var tf = this.tick_frequency;
			for (var path = start; path <= end; path += tf) {
				var index = path - start + padding;
				if (path == 0 && this.exclude_zero) continue;
				var num = (this.labeled_nums[index] == undefined ? 0 : this.labeled_nums[index]).toFixed(this.rounding);
				var width = ctx.measureText(num).width;
				console.log(num);
				ctx.fillText(num,
					(path * scaleX - width / 2) * x_product + (-width - this.tick_width / 1.5 * scaleX)*  y_product,
					-(path * scaleX - 8) * y_product + 32 * x_product
				);
			}
			ctx.restore();
		}

		// tip
		if (this.include_tip) {
			// start tip
			var sx = this.start - this.tick_width / 4;
			var sy = this.end + this.tick_width / 4;
			pointer(ctx,
				sx * x_product, -sx * y_product,
				Math.PI - Math.PI / 2 * y_product,
				this.tick_width / 1.5,
				GREY
				);
				
			// end tip
			pointer(ctx,
				sy * x_product, -sy * y_product,
				-Math.PI / 2 * y_product,
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
	totalRotation = 0;
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
		var ctx = this.canvas.getContext("2d"),
		x_min = this.x_min,
		x_max = this.x_max,
		y_min = this.y_min,
		y_max = this.y_max,
		xtf   = this.x_tick_frequency,
		ytf   = this.y_tick_frequency;
		ctx.rotate(this.totalRotation)
		
		
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
			ctx.lineWidth = this.sub_grid_line_width;
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
		this.x_axis.add(false);
		this.y_axis.add(false);
	}

	rotate(ang = 0) {
		this.totalRotation += ang;
	}

	remove() {
		if (Manimation.container.hasChildNodes(this.canvas)) {
			Manimation.container.removeChild(this.canvas);
		}
	}
}