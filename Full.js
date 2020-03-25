//Main ;Mavis Function
(function () {
	var Mavis = function(container_tag){
		this.config = {
			container:container_tag,
			
		}
		this.container = container_tag;
		this.layers = [];
		this.elementCount = {
			text:0,
			line:0,
			circle:0
		}
		var w = Math.ceil(document.documentElement.getBoundingClientRect().width);
		var h = Math.ceil(document.documentElement.getBoundingClientRect().height);
		var cvs = document.createElement("canvas");
		this.container.appendChild(cvs);
		this.layers.push(
			{
				tag:cvs,
				name:"main",
				width:w,
				height:h,
				scale:75,
				graph:{
					type:"PI",
				},
				styles:{
					background:"#000",
					textColor:"#fff",
					fontSize:"30px",
					fontFamily:"noto-sans"
				},
				translate:{
					x:w/2,
					y:h/2
				},
				type:"canvas"
			}
		)
		this.updateLayer = function(i){
			var layer = this.layers[i];
			var ctx = layer.tag.getContext("2d");
			ctx.clearRect(-layer.width,-layer.height,layer.width*2,layer.height*2)
		}
		this.setupLayer = function(i){
			// debugger;
			var layer = this.layers[i];
			this.layers[i].tag.style.backgroundColor = layer.styles.background;
			this.layers[i].tag.style.color = layer.styles.textColor;
			this.layers[i].tag.style.fontSize = layer.styles.fontSize;
			this.layers[i].tag.style.fontFamily = layer.styles.fontFamily;
			this.layers[i].tag.style.width = layer.width+"px";
			this.layers[i].tag.style.height = layer.height+"px";
			if(layer.type === "canvas"){
				this.layers[i].tag.width = layer.width;
				this.layers[i].tag.height = layer.height;
				var ctx = layer.tag.getContext("2d");
				var dpr = window.devicePixelRatio || 1;
				ctx.translate(layer.translate.x,layer.translate.y)
				ctx.scale(dpr,dpr);
			}
			if(layer.graph){
				var scx = layer.scale.x || layer.scale;
				var scy = layer.scale.y || layer.scale;
				drawPlain({
					canvas:ctx,
					type:layer.graph.type,
					scaleX:scx,
					scaleY:scy,
					font:undefined,
					width:layer.width,
					height:layer.height,
				});
			}
		}
		this.createLayer = function(props){
			this.layers.push(props);
			var main = this.layers[0];
			var l = this.layers.length-1;
			if(this.layers[l].translate === undefined || this.layers[l].translate === null){
				this.layers[l].translate = main.translate;
			}
		}
		this.getLayer = function (name) {
			for (var i = 0; i < this.layers.length; i++) {
				if(this.layers[i].name === name){
					return this.layers[i];
					break;
				}
			}
		}
	}
	window.Mavis = Mavis;
})();

// Geometry Functions
(function() {
	var Rectangle = function(w,h){
		this.w = w;
		this.h = h;
		this.x = 0;
		this.y = 0;
		this.defaultCtx = undefined;
		this._styles = {
			fillStyle:"#ffff00",
			strokeStyle:"#fff",
			lineWidth:1
		};
		
		this.draw = function(args){
			var mode = args.mode || "fill"
			var layer = args.layer || this.defaultCtx;
			var ctx = layer.tag.getContext('2d');
			var scx = layer.scale.x || layer.scale;
			var scy = layer.scale.y || layer.scale;
			var styles = args.styles || this._styles;
			ctx.beginPath();
			ctx.fillStyle = this._styles.fillStyle;
			ctx.strokeStyle = this._styles.strokeStyle;
			ctx.lineWidth = this._styles.lineWidth;
			ctx.rect(this.x*scx,this.y*scy,this.w*scx,-this.h*scy);
			if(mode === "fill" || mode === undefined) ctx.fill();
			if(mode === "stroke") ctx.stroke();
			if(mode === "both"){ctx.fill();ctx.stroke();}
			ctx.closePath();
		}
		
		//sets default context
		this.drawContext = function(layer){
			if(layer === undefined){
				return this.defaultCtx;
			}else{
				this.defaultCtx = layer;
			}
		}
		
		this.style = function(args){
			if(args === undefined){
				return this._style;
			}else{
				this._style = Object.assign(this._style,args);
			}
		}
	}
	
	var Vector = function(){
		this.x = arguments[0];
		this.y = -arguments[1];
		this.origin = {x:0,y:0};
		this.drawStyle = {
			strokeCol:"#ffff00",
			strokeCol:"#ffff00",
			lineWidth:2,
			headSize:8
		};
		this.angle = function(a) {
			if(a === undefined){
				return Math.atan2(this.y, this.x);
			}else{
				var length = this.length();
				this.x = Math.cos(a) * length;
				this.y = Math.sin(a) * length;
			}
		};
		this.length = function(l){
			if(l === undefined){
				return Math.sqrt(this.x * this.x + this.y * this.y);
			}else{
				var angle = this.angle();
				this.x = Math.cos(angle) * l;
				this.y = Math.sin(angle) * l;
			}
		};
		this.add = function(v2) {
			return new Vector(this.x + v2.x(), this.y + v2.y());
		};

		this.subtract = function(v2) {
			return new Vector(this.x - v2.x(), this.y - v2.y());
		};

		this.multiply = function(v) {
			return new Vector(this.x * v, this.y * v);
		};

		this.divide = function(v) {
			return new Vector(this.x / v, this.y / v);
		};

		this.addTo = function(v2) {
			this.x += v2.x();
			this.y += v2.y();
		};

		this.subtractFrom = function(v2) {
			this.x -= v2.x();
			this.y -= v2.y();
		};

		this.multiplyBy = function(v) {
			this.x *= v;
			this.y *= v;
		};

		this.divideBy = function(v) {
			this.x /= v;
			this.y /= v;
		};
		this.draw = function(layer){
			var x1 = this.origin.x;
			var y1 = this.origin.y;
			var x2 = this.x;
			var y2 = this.y;
			var ctx = layer.tag.getContext("2d");
			//source: https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
			var angle = Math.atan2((y2 - y1) , (x2 - x1));
			var hyp = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
			var size = this.drawStyle.headSize;
			ctx.save();
			ctx.translate(x1, y1);
			ctx.rotate(angle);
			// line
			ctx.beginPath();
			ctx.strokeStyle = this.drawStyle.strokeCol;
			ctx.lineWidth = this.drawStyle.lineWidth;
			ctx.moveTo(0, 0);
			ctx.lineTo(hyp - size, 0);
			ctx.stroke();
			// triangle
			ctx.beginPath();
			ctx.fillStyle = this.drawStyle.fillCol;
			ctx.lineTo(hyp - size, size);
			ctx.lineTo(hyp, 0);
			ctx.lineTo(hyp - size, -size);
			ctx.fill();
			ctx.restore();
		};
	}
	
	var Triangle = function(points){
		this.x1 = points.x1;
		this.y1 = -points.y1;
		this.x2 = points.x2;
		this.y2 = -points.y2;
		this.x3 = points.x3;
		this.y3 = -points.y3;
		this.defaultCtx = undefined;
		this._styles = {
			fillStyle:"#ffff00",
			strokeStyle:"#fff",
			lineWidth:1
		};
		
		this.draw = function(args){
			args = args||{};
			// debugger;
			var layer = args.layer || this.defaultCtx;
			var ctx = layer.tag.getContext("2d")
			var styles = args.styles || this._styles;
			var scx = layer.scale.x || layer.scale;
			var scy = layer.scale.y || layer.scale;
			var mode = args.mode || "fill"
			ctx.beginPath();
			ctx.strokeStyle = styles.strokeStyle;
			ctx.fillStyle = styles.fillStyle;
			ctx.lineWidth = styles.lineWidth;
			ctx.moveTo(this.x1*scx, this.y1*scy);
			ctx.lineTo(this.x2*scx, this.y2*scy);
			ctx.lineTo(this.x3*scx, this.y3*scy);
			ctx.lineTo(this.x1*scx, this.y1*scy);
			if(mode === "fill") ctx.fill();
			if(mode === "stroke") ctx.stroke();
			if(mode === "both"){ctx.fill();ctx.stroke();}
			ctx.closePath();
		}
		
		this.drawContext = function(layer){
			if(layer === undefined){
				return this.defaultCtx;
			}else{
				this.defaultCtx = layer;
			}
		}
		
		this.style = function(args){
			if(args === undefined){
				return this._style;
			}else{
				this._style = Object.assign(this._style,args);
			}
		}
	}
	var exportList = [
		["Vector",Vector],
		["Rectangle",Rectangle],
		["Triangle",Triangle]
	];
	function exprotItems(functionList){
		for (var i = 0; i < functionList.length; i++) {
			window[functionList[i][0]] = functionList[i][1];
		}
	}
	exprotItems(exportList)
})(window);

//Graphing Functions
(function () {
	var drawPlain = function() {
		var mode = arguments[0].type,
			scaleX = arguments[0].scaleX,
			scaleY = arguments[0].scaleY,
			fnt = arguments[0].font,
			ctx = arguments[0].canvas,
			width = arguments[0].width,
			height = arguments[0].height;
		ctx.fillStyle = "#fff";
		var columns = Math.ceil(width/scaleX);
		var rows = Math.ceil(height/scaleY);
		var d = Math.min(scaleX,scaleY);
			ctx.font = fnt||"13px noto-sans";
		// 	for (var i = -columns; i < columns; i++) {
		// 		var k = "";
		// 		var x = i*scaleX;
		// 		var y = -height/2;
		// 		ctx.beginPath();
		// 		ctx.lineWidth = 1
		// 		ctx.strokeStyle = "#1ddfff";
		// 		ctx.moveTo(x,y);
		// 		ctx.lineTo(x,y+height);
		// 		ctx.stroke();
		// 		ctx.closePath();
				
		// 		ctx.beginPath();
		// 		ctx.lineWidth = 0.3;
		// 		ctx.strokeStyle = "#1ddfff";
		// 		ctx.moveTo(x+d/2,-height);
		// 		ctx.lineTo(x+d/2,height);
		// 		ctx.stroke();
		// 		ctx.closePath();
		// 		x = -width;
		// 		y = i*scaleY;
		// 		ctx.beginPath()
		// 		ctx.lineWidth = 1
		// 		ctx.strokeStyle = "#1ddfff";
		// 		ctx.moveTo(x,y);
		// 		ctx.lineTo(x+width*2,y);
		// 		ctx.stroke();
		// 		ctx.closePath();
				
		// 		ctx.beginPath();
		// 		ctx.lineWidth = 0.3;
		// 		ctx.strokeStyle = "#1ddfff";
		// 		ctx.moveTo(-width,y+d/2);
		// 		ctx.lineTo(width,y+d/2);
		// 		ctx.stroke();
		// 		ctx.closePath();
		// 		if(i === 0){
		// 			continue;
		// 		}
		// 		k = i
		// 		if(i>0)	k = "";
		// 		if(i<0) k = "-";
		// 		ctx.fillText(k+"π",i*scaleX+3,13);
		// 		k = -i
		// 		if(i === -1){k = ""}
		// 		if(i === 1){k = "-"}
		// 		ctx.fillText(k+"π",3,i*scaleY+13);
		// }
		if(mode === "num"){
			ctx.font = fnt||"13px noto-sans";
			var dx = width/scaleX;
			var dy = height/scaleY;
			var d = Math.min(scaleX,scaleY);
			for (var i = -columns; i < columns; i++) {
				var x = i*d;
				var y = 0;
				ctx.beginPath();
				ctx.lineWidth = 1
				ctx.strokeStyle = "#1ddfff";
				ctx.moveTo(x,-height);
				ctx.lineTo(x,height);
				if(i !==0) ctx.fillText(i,x+3,y+12);
				ctx.stroke();
				ctx.closePath();
				
				ctx.beginPath();
				ctx.lineWidth = 0.3;
				ctx.strokeStyle = "#1ddfff";
				ctx.moveTo(x+d/2,-height);
				ctx.lineTo(x+d/2,height);
				ctx.stroke();
				ctx.closePath();
				
				x = 0;
				y = i*d;
				txt = i/(scaleY/d);
				ctx.beginPath();
				ctx.lineWidth = 1
				ctx.strokeStyle = "#1ddfff";
				ctx.moveTo(-width,y);
				ctx.lineTo(width,y);
				if(i!==0) ctx.fillText(-txt,x+3,y+12);
				ctx.stroke()
				ctx.closePath();
				
				ctx.beginPath();
				ctx.lineWidth = 0.3;
				ctx.strokeStyle = "#1ddfff";
				ctx.moveTo(-width,y+d/2);
				ctx.lineTo(width,y+d/2);
				ctx.stroke();
				ctx.closePath();
			}
		}else if(mode === "complex"){
			ctx.font = fnt||"13px noto-sans";
			var d = Math.min(scaleX,scaleY);
			for (var i = -columns; i < columns; i++) {
				var x = i*d;
				var y = 0;
				ctx.beginPath();
				ctx.lineWidth = 1
				ctx.strokeStyle = "#1ddfff";
				ctx.moveTo(x,-height);
				ctx.lineTo(x,height);
				if(i !== 0){
					ctx.fillText(i,x+5,y+13);
				}
				ctx.stroke();
				ctx.closePath();
				
				ctx.beginPath();
				ctx.lineWidth = 0.3;
				ctx.strokeStyle = "#1ddfff";
				ctx.moveTo(x+d/2,-height);
				ctx.lineTo(x+d/2,height);
				ctx.stroke();
				ctx.closePath();
				
				x = 0;
				y = i*d;
				txt = i/(scaleY/d);
				ctx.beginPath();
				ctx.lineWidth = 1
				ctx.strokeStyle = "#1ddfff";
				ctx.moveTo(-width,y);
				ctx.lineTo(width,y);
				ctx.stroke()
				if(i !== 0){
					ctx.fillText(-txt+"i",x+5,y+13);
				}
				ctx.closePath();
				
				ctx.beginPath();
				ctx.lineWidth = 0.3;
				ctx.strokeStyle = "#1ddfff";
				ctx.moveTo(-width,y+d/2);
				ctx.lineTo(width,y+d/2);
				ctx.stroke();
				ctx.closePath();
			}	
		}
		ctx.beginPath();
		ctx.lineWidth = 1.6;
		ctx.strokeStyle = "#fff";
		ctx.moveTo(0,-height/2);
		ctx.lineTo(0,height);
		ctx.moveTo(-width/2,0);
		ctx.lineTo(width/2,0);
		ctx.stroke();
	};
	var exportList = [
		["drawPlain",drawPlain]
	];
	function exprotItems(functionList){
		for (var i = 0; i < functionList.length; i++) {
			window[functionList[i][0]] = functionList[i][1];
		}
	}
	exprotItems(exportList)
})();