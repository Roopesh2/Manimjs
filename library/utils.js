const {
	ceil,
	floor,
	round
} = Math,
	CENTRE = [0, 0],
	LARGE = {
		"width": round(2560 / window.devicePixelRatio),
		"height": round(1440 / window.devicePixelRatio),
	}
	
	BIG = {
		"width": round(1920 / window.devicePixelRatio),
		"height": round(1080 / window.devicePixelRatio),
	}
	
	MEDIUM = {
		"width": round(1280 / window.devicePixelRatio),
		"height": round(720 / window.devicePixelRatio),
	}
	
	SMALL = {
		"width": round(854 / window.devicePixelRatio),
		"height": round(480 / window.devicePixelRatio),
	}
	FULL_SCREEN = {
		"width": "100%",
		"height": "100%"
	}

function map(n, start1, stop1, start2, stop2) {
	return newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

function random (start, end) {
	if (end == undefined) {
		end = start;
		start = 0;
	}
	return Math.random() * (end - start) + start;
}
function randomInt(start, end) {
	return Math.round(random(start, end));
}

function svgToImage (svgElem) {
	var svgString = new XMLSerializer().serializeToString(svgElem);
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);
	img.src = url;
	return img;
}

async function texToImg (tex) {
	var str = "https://latex.codecogs.com/svg.latex?"+tex;
	var request = await fetch(str);
	return request;
}

const latexToImg = function (formula) {
  return new Promise((resolve, reject) => {
    let wrapper = MathJax.tex2svg(`${formula}`, {em: 10, ex: 5,display: true})
    let output = { svg: "", img: "" }
    let mjOut = wrapper.getElementsByTagName("svg")[0]
    // mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    output.svg = mjOut.outerHTML
    var image = new Image()
    image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(output.svg)));
    image.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0);
      output.img = canvas.toDataURL('image/png');
      resolve(output.img)
    }
    image.onerror = function() {
      reject()
    }
  })
}

function line(ctx, x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, -y1)
	ctx.lineTo(x2, -y2)

}
function arrow (ctx, x1, y1, x2, y2, size) {
	var angle = Math.atan2((y2 - y1) , (x2 - x1));
	var hyp = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

	ctx.save();
	ctx.translate(x1, y1);
	ctx.rotate(angle);

	// line
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(hyp - size, 0);
	ctx.stroke();

	// triangle
	ctx.fillStyle = 'blue';
	ctx.beginPath();
	ctx.lineTo(hyp - size, size);
	ctx.lineTo(hyp, 0);
	ctx.lineTo(hyp - size, -size);
	ctx.fill();

	ctx.restore();
}
function pointer (ctx, x1, y1, angle, size = 10,fill = WHITE, stroke) {
	ctx.beginPath();
	ctx.save();
	ctx.translate(x1, y1);
	ctx.fillStyle = fill;
	var add = (1.0/3.0) * (2 * Math.PI);
	ctx.moveTo(
		size * Math.cos(angle),
		size * Math.sin(angle)
	);
	angle += add;
	ctx.lineTo(
		size * Math.cos(angle),
		size * Math.sin(angle)
	);
	angle += add;
	x = size *Math.cos(angle);
	y = size *Math.sin(angle);
	ctx.lineTo(x, y);
	ctx.fill();
	if (stroke) ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

function getCanvas () {
	var canvas = document.createElement("canvas");
	var styles = getComputedStyle(Manimation.container);
	canvas.style.width = parseInt(styles.width)   + "px";
	canvas.style.height = parseInt(styles.height) + "px";
	canvas.width = parseInt(styles.width) * (window.devicePixelRatio || 1);
	canvas.height = parseInt(styles.height) * (window.devicePixelRatio || 1);
	return canvas;
}
function initCanvas (th) {
	var ctx = th.canvas.getContext("2d");
	Manimation.container.appendChild(th.canvas);
	ctx.beginPath();
	var scaleX = Manimation.globalScaleRatio[0];
	var scaleY = Manimation.globalScaleRatio[1];
	ctx.imageSmoothingEnabled = false
	// shift to centre / specified location
	var x_min = Manimation.x_min || th.x_min,
		y_min = Manimation.y_min || th.y_min,
		x_max = Manimation.x_max || th.x_max,
		y_max = Manimation.y_max || th.y_max,
		x_scaling = th.x_scaling || th.x_tick_frequency || 1,
		y_scaling = th.y_scaling || th.y_tick_frequency || 1,
		w = parseInt(ctx.canvas.width)  / scaleX,
		h = parseInt(ctx.canvas.height) / scaleY;
	ctx.scale(scaleX, scaleY)
	if (th.origin) {
		ctx.translate(
			(th.origin[0] + w / 2) * x_scaling,
			(-th.origin[1] + h / 2) * y_scaling
		)
	}else {
		ctx.translate(
			(-x_min) * x_scaling,
			(h + y_min) * y_scaling
		);
	}
	// draws background
	ctx.beginPath();
	ctx.fillStyle = th.background_color;
	if (ctx.fillStyle == "transparent") {
		ctx.clearRect(
			-(Math.abs(x_min) + x_max),
			-y_min,
			(Math.abs(x_min) + x_max) * 2,
			y_max * 2
		);
	} else {
		ctx.fillRect(
			-w,
			-h,
			w * 2,
			h * 2
		);
	}

	return ctx;
}

function range(a, b, dx = 1) {
	var arr = []
	for (var i = a; i <= b * Math.sign(dx); i+= dx) {
		arr.push(i);
	}
	return arr;
}

function hex_to_rgba (color) {
	color = (color||"#000000").replace("#","");
	var r = "0",
		g = "0",
		b = "0",
		a = "0";
	if(color.length === 3){
		r = color[0] + color[0];
		g = color[1] + color[1];
		b = color[2] + color[2];
	}else if(color.length === 4){
		r = color[0] + color[0];
		g = color[1] + color[1];
		b = color[2] + color[2];
		a = color[3] + color[3];
	}else if(color.length === 6){
		r = color[0] + color[1];
		g = color[2] + color[3];
		b = color[4] + color[5];
	}else if(color.length === 8){
		r = color[0] + color[1];
		g = color[2] + color[3];
		b = color[4] + color[5];
		a = color[6] + color[7];
	}
	return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), parseInt(a, 16)];
}
function color_gradient(colors, len = 10) {
	var blend = 1.0,
		gradient = [],
		colors = colors instanceof Array ? colors : [colors],
		total = len,
		totalcolors = colors.length;
	for (var i = 0; i < totalcolors; i++) {
		colors.push(hex_to_rgba(colors[i]));
	}
	var k = 0;
	for(var j = 0; j < total; j++){
		var len = (interval[j - 1] * total * (1 + 1 / (totalcolors - 1)));
		for (var i = 1.0; i >= 0.0; i-=1.0/len) {
			var color = [];
			color[0] = parseInt(parseInt(colors[k][0]) * i + (1 - i) * parseInt(colors[k][0]));
			color[1] = parseInt(parseInt(colors[k][1]) * i + (1 - i) * parseInt(colors[k][1]));
			color[2] = parseInt(parseInt(colors[k][2]) * i + (1 - i) * parseInt(colors[k][2]));
			color[3] = parseInt(parseInt(colors[k][3]) * i + (1 - i) * parseInt(colors[k][3]));
			gradient.push(toColorString(color));
		}
		if(total % totalcolors === 0) k++;
		blend = 1.0;
	}
	return gradient;
}

function getDefined (V1, Vdefault = ""){
	if (V1 == undefined) {
		return Vdefault;
	} else {
		return V1;
	}
}